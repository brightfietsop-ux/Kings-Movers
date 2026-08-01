"use client";

import { useEffect, useState } from "react";
import { company } from "@/lib/company";

type Review = {
  name: string;
  authorUrl?: string;
  rating: number;
  time: string;
  text: string;
};

type ReviewResponse = {
  configured: boolean;
  rating?: number;
  total?: number;
  googleMapsUrl?: string;
  reviews?: Review[];
};

const manualReviews: Review[] = [
  {
    name: "Kings Movers customer",
    rating: 5,
    time: "Recent move",
    text: "Reliable moving help with careful handling and clear communication from start to finish.",
  },
  {
    name: "Local customer",
    rating: 5,
    time: "Recent service",
    text: "The crew helped with furniture moving, loading, and cleanup. Professional, respectful, and easy to work with.",
  },
  {
    name: "Charlotte customer",
    rating: 5,
    time: "Recent project",
    text: "Great option for local moving support when you need dependable help with the heavy lifting.",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <i
          className={`bi ${index < Math.round(rating) ? "bi-star-fill" : "bi-star"}`}
          key={index}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export function Reviews() {
  const [data, setData] = useState<ReviewResponse | null>(null);

  useEffect(() => {
    fetch("/api/google-reviews")
      .then((response) => response.json())
      .then(setData)
      .catch(() => setData({ configured: false }));
  }, []);

  const reviewUrl =
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
    data?.googleMapsUrl ||
    company.googleSearchUrl;

  return (
    <section id="reviews" className="section reviews-section">
      <div className="container">
        <div className="reviews-header">
          <div className="section-heading mb-0">
            <span className="eyebrow">Customer feedback</span>
            <h2>Reviews from happy customers</h2>
            <p>
              Customer feedback helps visitors feel confident choosing Kings
              Movers for local moves, loading, junk removal, and cleanup help.
            </p>
          </div>
          <a
            className="btn btn-outline-brand"
            href={reviewUrl}
            target="_blank"
            rel="noreferrer"
          >
            <i className="bi bi-google me-2" aria-hidden="true" />
            {process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL
              ? "Leave a Google Review"
              : "Find Us on Google"}
          </a>
        </div>

        {!data ? (
          <div className="reviews-loading" aria-live="polite">
            Loading Google reviews…
          </div>
        ) : data.configured && data.reviews?.length ? (
          <>
            <div className="rating-summary">
              <strong>{data.rating?.toFixed(1)}</strong>
              <div>
                <Stars rating={data.rating ?? 0} />
                <span>Based on {data.total} Google reviews</span>
              </div>
            </div>
            <div className="review-grid">
              {data.reviews.map((review, index) => (
                <article className="review-card" key={`${review.name}-${index}`}>
                  <div className="review-card-top">
                    <span className="review-avatar" aria-hidden="true">
                      {review.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      {review.authorUrl ? (
                        <a
                          href={review.authorUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {review.name}
                        </a>
                      ) : (
                        <strong>{review.name}</strong>
                      )}
                      <small>{review.time}</small>
                    </div>
                  </div>
                  <Stars rating={review.rating} />
                  <p>{review.text}</p>
                  <span className="google-attribution">
                    Posted on <i className="bi bi-google" aria-hidden="true" />{" "}
                    Google
                  </span>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="review-grid">
            {manualReviews.map((review, index) => (
              <article className="review-card" key={`${review.name}-${index}`}>
                <div className="review-card-top">
                  <span className="review-avatar" aria-hidden="true">
                    {review.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <strong>{review.name}</strong>
                    <small>{review.time}</small>
                  </div>
                </div>
                <Stars rating={review.rating} />
                <p>{review.text}</p>
                <span className="google-attribution">
                  Add real customer quotes here anytime
                </span>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
