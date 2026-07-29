import { NextResponse } from "next/server";

type GoogleReview = {
  authorAttribution?: {
    displayName?: string;
    uri?: string;
  };
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: {
    text?: string;
  };
};

type GooglePlace = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: GoogleReview[];
};

export const revalidate = 21600;

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json(
      { configured: false },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "rating,userRatingCount,googleMapsUri,reviews",
        },
        next: { revalidate: 21600 },
      },
    );

    if (!response.ok) {
      throw new Error(`Google Places returned ${response.status}`);
    }

    const place = (await response.json()) as GooglePlace;
    const reviews = (place.reviews ?? [])
      .filter((review) => review.text?.text)
      .map((review) => ({
        name: review.authorAttribution?.displayName ?? "Google reviewer",
        authorUrl: review.authorAttribution?.uri,
        rating: review.rating ?? 0,
        time: review.relativePublishTimeDescription ?? "",
        text: review.text?.text ?? "",
      }));

    return NextResponse.json(
      {
        configured: true,
        rating: place.rating,
        total: place.userRatingCount,
        googleMapsUrl: place.googleMapsUri,
        reviews,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("Unable to load Google reviews:", error);
    return NextResponse.json(
      { configured: false },
      {
        status: 502,
        headers: {
          "Cache-Control": "public, s-maxage=300",
        },
      },
    );
  }
}
