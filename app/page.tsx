import { Gallery } from "@/components/Gallery";
import { QuoteForm } from "@/components/QuoteForm";
import { Reviews } from "@/components/Reviews";
import { SiteNavbar } from "@/components/SiteNavbar";
import { company, services } from "@/lib/company";

const reasons = [
  {
    icon: "bi-clock-history",
    title: "On-time service",
    text: "We respect your schedule and communicate clearly before moving day.",
  },
  {
    icon: "bi-shield-check",
    title: "Careful handling",
    text: "Your furniture and household items are protected throughout the move.",
  },
  {
    icon: "bi-receipt",
    title: "Straightforward quotes",
    text: "Share the details of your move and receive a clear, no-obligation estimate.",
  },
];

export default function Home() {
  return (
    <>
      <SiteNavbar />

      <main>
        <section id="home" className="hero">
          <div className="hero-shape hero-shape-one" aria-hidden="true" />
          <div className="hero-shape hero-shape-two" aria-hidden="true" />
          <div className="container hero-container">
            <div className="row align-items-center g-5">
              <div className="col-lg-7">
                <span className="hero-kicker">
                  <i className="bi bi-geo-alt-fill" aria-hidden="true" />
                  Charlotte, NC & surrounding areas
                </span>
                <h1>
                  A smoother move starts with the{" "}
                  <span>right crew.</span>
                </h1>
                <p className="hero-lead">
                  From furniture and full-home moves to loading, unloading, and
                  junk removal, Kings Movers handles the heavy work so you can
                  focus on what comes next.
                </p>
                <div className="hero-actions">
                  <a className="btn btn-brand btn-lg" href="#quote">
                    Get a Free Quote
                    <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
                  </a>
                  <a className="btn btn-call btn-lg" href={company.phoneHref}>
                    <i className="bi bi-telephone-fill me-2" aria-hidden="true" />
                    {company.phoneDisplay}
                  </a>
                </div>
                <div className="hero-trust">
                  <span>
                    <i className="bi bi-check-circle-fill" aria-hidden="true" />
                    Local & long-distance
                  </span>
                  <span>
                    <i className="bi bi-check-circle-fill" aria-hidden="true" />
                    Free estimates
                  </span>
                  <span>
                    <i className="bi bi-check-circle-fill" aria-hidden="true" />
                    Call or text
                  </span>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="hero-visual">
                  <div className="hero-badge">
                    <i className="bi bi-truck" aria-hidden="true" />
                    <span>
                      <strong>Dependable help</strong>
                      for moves big and small
                    </span>
                  </div>
                  <div className="truck-illustration" aria-hidden="true">
                    <i className="bi bi-truck" />
                  </div>
                  <div className="route-line" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="hero-location">
                    <i className="bi bi-geo-alt-fill" aria-hidden="true" />
                    <span>
                      Based in <strong>{company.location}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-wave" aria-hidden="true" />
        </section>

        <section id="services" className="section services-section">
          <div className="container">
            <div className="section-heading text-center mx-auto">
              <span className="eyebrow">What we do</span>
              <h2>Moving help built around your needs</h2>
              <p>
                Whether it is one heavy item, a full household, or a space that
                needs clearing, our crew is ready to help.
              </p>
            </div>

            <div className="row g-4">
              {services.map((service) => (
                <div className="col-sm-6 col-lg-3" key={service.title}>
                  <article className="service-card">
                    <span className="service-icon" aria-hidden="true">
                      <i className={`bi ${service.icon}`} />
                    </span>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <a href="#quote">
                      Request a quote
                      <i
                        className="bi bi-arrow-up-right ms-2"
                        aria-hidden="true"
                      />
                    </a>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section why-section">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-5">
                <div className="why-visual">
                  <span className="why-number">28269</span>
                  <h2>Local service with a personal touch.</h2>
                  <p>
                    Kings Movers serves Charlotte and nearby communities with
                    practical help, responsive communication, and respect for
                    every customer&apos;s belongings.
                  </p>
                  <a href="#quote" className="text-link">
                    Tell us about your move
                    <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="reason-list">
                  {reasons.map((reason, index) => (
                    <article className="reason-item" key={reason.title}>
                      <span className="reason-index">0{index + 1}</span>
                      <span className="reason-icon" aria-hidden="true">
                        <i className={`bi ${reason.icon}`} />
                      </span>
                      <div>
                        <h3>{reason.title}</h3>
                        <p>{reason.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="process-section">
          <div className="container">
            <div className="section-heading text-center mx-auto">
              <span className="eyebrow eyebrow-light">How it works</span>
              <h2>From quote to moving day in three simple steps</h2>
            </div>
            <div className="process-grid">
              <article>
                <span>01</span>
                <i className="bi bi-chat-square-text" aria-hidden="true" />
                <h3>Share your details</h3>
                <p>
                  Tell us the date, locations, home sizes, and what needs moving.
                </p>
              </article>
              <article>
                <span>02</span>
                <i className="bi bi-clipboard-check" aria-hidden="true" />
                <h3>Receive your quote</h3>
                <p>
                  The owner reviews your request and follows up with an
                  estimate.
                </p>
              </article>
              <article>
                <span>03</span>
                <i className="bi bi-house-check" aria-hidden="true" />
                <h3>Enjoy an easier move</h3>
                <p>
                  Our crew arrives ready to handle the heavy work with care.
                </p>
              </article>
            </div>
          </div>
        </section>

        <Gallery />
        <Reviews />

        <section id="quote" className="section quote-section">
          <div className="container">
            <div className="row g-5 align-items-start">
              <div className="col-lg-5">
                <div className="quote-intro">
                  <span className="eyebrow eyebrow-light">Free estimate</span>
                  <h2>Tell us about your move.</h2>
                  <p>
                    Complete the form and the details will be emailed directly
                    to Kings Movers. You will stay on this website—no Gmail
                    redirect.
                  </p>

                  <div className="quote-contact-list">
                    <a href={company.phoneHref}>
                      <span>
                        <i className="bi bi-telephone-fill" aria-hidden="true" />
                      </span>
                      <div>
                        <small>Call now</small>
                        <strong>{company.phoneDisplay}</strong>
                      </div>
                    </a>
                    <a href={company.smsHref}>
                      <span>
                        <i className="bi bi-chat-dots-fill" aria-hidden="true" />
                      </span>
                      <div>
                        <small>Send a text</small>
                        <strong>{company.phoneDisplay}</strong>
                      </div>
                    </a>
                    <a href={`mailto:${company.email}`}>
                      <span>
                        <i className="bi bi-envelope-fill" aria-hidden="true" />
                      </span>
                      <div>
                        <small>Email</small>
                        <strong>{company.email}</strong>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <QuoteForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="brand-lockup brand-lockup-light">
                <span className="brand-mark" aria-hidden="true">
                  <i className="bi bi-truck-front-fill" />
                </span>
                <span>
                  <strong>KINGS MOVERS</strong>
                  <small>Moving & Junk Removal</small>
                </span>
              </div>
              <p>
                Reliable moving and junk removal services in Charlotte, NC and
                surrounding communities.
              </p>
            </div>
            <div>
              <h3>Explore</h3>
              <a href="#services">Services</a>
              <a href="#about">Why Kings</a>
              <a href="#gallery">Gallery</a>
              <a href="#reviews">Reviews</a>
            </div>
            <div>
              <h3>Contact</h3>
              <a href={company.phoneHref}>{company.phoneDisplay}</a>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <span>{company.location}</span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {company.name}. All rights reserved.
            </span>
            <a href="#home">Back to top ↑</a>
          </div>
        </div>
      </footer>

      <div className="mobile-actions">
        <a href={company.phoneHref}>
          <i className="bi bi-telephone-fill" aria-hidden="true" />
          Call
        </a>
        <a href="#quote">
          <i className="bi bi-calculator-fill" aria-hidden="true" />
          Free quote
        </a>
      </div>
    </>
  );
}
