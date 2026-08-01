"use client";

import { FormEvent, useEffect, useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";
type InitialStatus = "sent" | "error" | undefined;

const quoteFlashStorageKey = "kingsMoversQuoteFlash";

const homeSizes = [
  "Studio",
  "1 bedroom",
  "2 bedrooms",
  "3 bedrooms",
  "4 bedrooms",
  "5+ bedrooms",
  "Office / commercial",
  "Storage unit",
  "Other",
];

function getInitialMessage(initialStatus: InitialStatus) {
  if (initialStatus === "sent") {
    return "Your quote request was sent. Kings Movers will contact you soon.";
  }

  if (initialStatus === "error") {
    return "Your request could not be sent. Please call (202) 308-9917.";
  }

  return "";
}

export function QuoteForm({ initialStatus }: { initialStatus?: InitialStatus }) {
  const initialMessage = getInitialMessage(initialStatus);
  const [status, setStatus] = useState<FormStatus>(
    initialStatus === "sent"
      ? "success"
      : initialStatus === "error"
        ? "error"
        : "idle",
  );
  const [message, setMessage] = useState(initialMessage);
  const [showFlash, setShowFlash] = useState(Boolean(initialMessage));

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const savedMessage = window.sessionStorage.getItem(quoteFlashStorageKey);
    const quoteResult = searchParams.get("quote");

    if (quoteResult === "sent" || quoteResult === "error") {
      setStatus(quoteResult === "sent" ? "success" : "error");
      setMessage(
        savedMessage ||
          (quoteResult === "sent"
            ? "Your quote request was sent. Kings Movers will contact you soon."
            : "Unable to send your request. Please call us instead."),
      );
      setShowFlash(true);
      return;
    }

    if (savedMessage) {
      setStatus("success");
      setMessage(savedMessage);
      setShowFlash(true);
    }
  }, []);

  function dismissFlash() {
    setShowFlash(false);
    window.sessionStorage.removeItem(quoteFlashStorageKey);
  }

  useEffect(() => {
    if (!showFlash) return;

    const timeout = window.setTimeout(() => {
      setShowFlash(false);
    }, 9000);

    return () => window.clearTimeout(timeout);
  }, [showFlash]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    setShowFlash(false);

    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    const scrollPosition = window.scrollY;

    function keepCurrentScrollPosition() {
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollPosition, behavior: "instant" });
      });
    }

    function showResult(
      nextStatus: Exclude<FormStatus, "idle" | "submitting">,
      nextMessage: string,
    ) {
      setStatus(nextStatus);
      setMessage(nextMessage);
      setShowFlash(true);
      window.sessionStorage.setItem(quoteFlashStorageKey, nextMessage);

      const url = new URL(window.location.href);
      url.searchParams.set("quote", nextStatus === "success" ? "sent" : "error");
      window.history.replaceState(
        null,
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
      keepCurrentScrollPosition();
    }

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to send your request.");
      }

      form.reset();
      showResult(
        "success",
        "Your quote request was sent. Kings Movers will contact you soon.",
      );
    } catch (error) {
      showResult(
        "error",
        error instanceof Error
          ? error.message
          : "Unable to send your request. Please call us instead.",
      );
    }
  }

  return (
    <>
      {showFlash && message && (
        <div
          className={`quote-flash ${status === "success" ? "success" : "error"}`}
          role="status"
          aria-live="polite"
        >
          <i
            className={`bi ${status === "success" ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"}`}
            aria-hidden="true"
          />
          <span>{message}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={dismissFlash}
          >
            &times;
          </button>
        </div>
      )}

      <form
        action="/api/quote"
        className="quote-form"
        method="post"
        onSubmit={handleSubmit}
      >
        <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="name">
            Full name
          </label>
          <input
            className="form-control"
            id="name"
            name="name"
            autoComplete="name"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="phone">
            Phone number
          </label>
          <input
            className="form-control"
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="email">
            Email address
          </label>
          <input
            className="form-control"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="movingDate">
            Preferred moving date
          </label>
          <input
            className="form-control"
            id="movingDate"
            name="movingDate"
            type="date"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="serviceType">
            Service needed
          </label>
          <select
            className="form-select"
            id="serviceType"
            name="serviceType"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Choose a service
            </option>
            <option>Local moving</option>
            <option>Long-distance moving</option>
            <option>Loading and unloading</option>
            <option>Junk removal</option>
            <option>Moving and junk removal</option>
            <option>Other</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="pickupSize">
            Pickup home size
          </label>
          <select
            className="form-select"
            id="pickupSize"
            name="pickupSize"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select size
            </option>
            {homeSizes.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="pickupAddress">
            Pickup location
          </label>
          <input
            className="form-control"
            id="pickupAddress"
            name="pickupAddress"
            autoComplete="street-address"
            placeholder="Street, city, state, ZIP"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="dropoffSize">
            Drop-off home size
          </label>
          <select
            className="form-select"
            id="dropoffSize"
            name="dropoffSize"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select size
            </option>
            {homeSizes.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="dropoffAddress">
            Drop-off location
          </label>
          <input
            className="form-control"
            id="dropoffAddress"
            name="dropoffAddress"
            placeholder="Street, city, state, ZIP"
            required
          />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="details">
            Additional details
          </label>
          <textarea
            className="form-control"
            id="details"
            name="details"
            rows={4}
            placeholder="Stairs, elevators, heavy or fragile items, junk volume, or anything else we should know"
          />
        </div>

        <div className="visually-hidden" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="col-12">
          {showFlash && message && status !== "submitting" && (
            <div
              className={`form-alert quote-result ${status === "success" ? "success" : "error"}`}
              role="status"
            >
              <i
                className={`bi ${status === "success" ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"}`}
                aria-hidden="true"
              />
              <span>{message}</span>
            </div>
          )}
          <button
            className="btn btn-brand w-100"
            type="submit"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Sending request…
              </>
            ) : (
              <>
                Request My Free Quote
                <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
              </>
            )}
          </button>
          <p className="form-privacy">
            Your details are sent securely to Kings Movers and are used only to
            respond to this request.
          </p>
        </div>
        </div>
      </form>
    </>
  );
}
