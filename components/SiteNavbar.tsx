"use client";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { company } from "@/lib/company";

export function SiteNavbar() {
  return (
    <>
      <div className="topbar">
        <div className="container d-flex justify-content-between align-items-center gap-3">
          <span>
            <i className="bi bi-geo-alt-fill me-2" aria-hidden="true" />
            Serving {company.serviceArea}
          </span>
          <a href={company.phoneHref}>
            <i className="bi bi-telephone-fill me-2" aria-hidden="true" />
            {company.phoneDisplay}
          </a>
        </div>
      </div>

      <Navbar expand="lg" sticky="top" className="site-nav">
        <Container>
          <Navbar.Brand href="#home" className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">
              <i className="bi bi-truck-front-fill" />
            </span>
            <span>
              <strong>KINGS MOVERS</strong>
              <small>Moving & Junk Removal</small>
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navigation" />
          <Navbar.Collapse id="main-navigation">
            <Nav className="ms-auto align-items-lg-center">
              <Nav.Link href="#services">Services</Nav.Link>
              <Nav.Link href="#about">Why Kings</Nav.Link>
              <Nav.Link href="#gallery">Gallery</Nav.Link>
              <Nav.Link href="#reviews">Reviews</Nav.Link>
              <Nav.Link href="#quote" className="nav-quote">
                Get a Free Quote
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}