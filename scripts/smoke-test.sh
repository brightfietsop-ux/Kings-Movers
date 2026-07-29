#!/usr/bin/env bash
set -euo pipefail

port="${PORT:-3100}"
base_url="http://127.0.0.1:${port}"
log_file="/tmp/kings-movers-smoke-server.log"

npm run start -- -H 127.0.0.1 -p "$port" >"$log_file" 2>&1 &
server_pid=$!

cleanup() {
  kill "$server_pid" 2>/dev/null || true
}
trap cleanup EXIT

for _ in {1..30}; do
  if curl --silent --fail "$base_url" >/dev/null; then
    break
  fi
  sleep 0.25
done

home_status="$(
  curl --silent --output /tmp/kings-movers-home.html \
    --write-out "%{http_code}" "$base_url/"
)"
reviews_response="$(
  curl --silent --write-out $'\n%{http_code}' \
    "$base_url/api/google-reviews"
)"
quote_response="$(
  curl --silent --write-out $'\n%{http_code}' \
    --header "Content-Type: application/json" \
    --data '{
      "name":"Test Customer",
      "phone":"2025550199",
      "email":"test@example.com",
      "movingDate":"2026-08-15",
      "serviceType":"Local moving",
      "pickupSize":"2 bedrooms",
      "pickupAddress":"123 Test St, Charlotte, NC",
      "dropoffSize":"3 bedrooms",
      "dropoffAddress":"456 Sample Ave, Charlotte, NC",
      "details":"Test request",
      "company":""
    }' \
    "$base_url/api/quote"
)"
flyer_status="$(
  curl --silent --output /tmp/kings-movers-flyer.png \
    --write-out "%{http_code}" "$base_url/kings-movers-flyer.png"
)"

grep --quiet "A smoother move starts" /tmp/kings-movers-home.html
grep --quiet '"configured":false' <<<"$reviews_response"
grep --quiet "Online quotes are not connected yet" <<<"$quote_response"

echo "Home: $home_status"
echo "Reviews endpoint: $(tail -n 1 <<<"$reviews_response")"
echo "Quote endpoint without credentials: $(tail -n 1 <<<"$quote_response")"
echo "Flyer asset: $flyer_status"
