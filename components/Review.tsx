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
            <h2>Verified reviews, directly from Google</h2>
            <p>
              Reviews shown here come from the business&apos;s Google listing,
              so visitors can see current customer feedback.
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
          <div className="reviews-unconfigured">
            <i className="bi bi-google" aria-hidden="true" />
            <div>
              <h3>Google review connection is ready for setup</h3>
              <p className="mb-0">
                Add the business&apos;s Google Place ID and Places API key to
                display the live rating and real reviews here.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}