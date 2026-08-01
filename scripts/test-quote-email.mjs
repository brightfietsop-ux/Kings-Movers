const baseUrl = process.env.SITE_URL || "http://localhost:3000";

const response = await fetch(`${baseUrl}/api/quote`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Test Quote Request",
    phone: "(202) 308-9917",
    email: "test@example.com",
    movingDate: "2026-08-15",
    serviceType: "Local moving",
    pickupSize: "2 bedrooms",
    pickupAddress: "123 Test Pickup St, Charlotte, NC 28269",
    dropoffSize: "2 bedrooms",
    dropoffAddress: "456 Test Dropoff St, Charlotte, NC 28269",
    details:
      "This is a test submission from the Kings Movers website setup script.",
    company: "",
  }),
});

const body = await response.json().catch(() => ({}));

if (!response.ok) {
  console.error("Quote email test failed:", body);
  process.exit(1);
}

console.log("Quote email test succeeded:", body);
