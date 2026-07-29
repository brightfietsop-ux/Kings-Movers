"use client";

import { FormEvent, useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

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

export function QuoteForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());

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
      setStatus("success");
      setMessage(
        "Your quote request was sent. Kings Movers will contact you soon.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to send your request. Please call us instead.",
      );
    }
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
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
          {message && (
            <div
              className={`form-alert ${status === "success" ? "success" : "error"}`}
              role="status"
            >
              <i
                className={`bi ${status === "success" ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"}`}
                aria-hidden="true"
              />
              {message}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
