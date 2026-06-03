import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import router link

const Footer = () => {
  return (
    // Main footer wrapper
    <footer className="text-light py-5" style={{ backgroundColor: '#0f172a' }}>
      <Container className="pt-4">
        <Row>
          
          {/* Brand info section */}
          <Col lg={4} className="mb-4 mb-lg-0">
            <h4 className="fw-bold mb-3">
              Sweet<span style={{ color: '#ff5252' }}>o</span>
            </h4>
            <p className="text-secondary pe-lg-5">
              Transforming brands through powerful visual storytelling and professional services.
            </p>
            <p className="text-secondary small mt-5">
              © 2026 Sweeto. All rights reserved.
            </p>
          </Col>
          
          {/* Quick links section */}
          <Col lg={2} md={4} className="mb-4 mb-md-0">
            <h6 className="fw-bold mb-4">Quick Links</h6>
            <ul className="list-unstyled">
              {/* Active section links */}
              <li className="mb-2"><a href="/#about" className="text-secondary text-decoration-none">About Us</a></li>
              <li className="mb-2"><a href="/#services" className="text-secondary text-decoration-none">Services</a></li>
              <li className="mb-2"><a href="/#packages" className="text-secondary text-decoration-none">Packages</a></li>
              <li className="mb-2"><a href="/#how-it-works" className="text-secondary text-decoration-none">How it Works</a></li>
            </ul>
          </Col>

          {/* Trending skills section */}
          <Col lg={3} md={4} className="mb-4 mb-md-0">
            <h6 className="fw-bold mb-4">Trending Skills</h6>
            <ul className="list-unstyled">
              {/* Active routing links */}
              <li className="mb-2"><Link to="/explore" className="text-secondary text-decoration-none">Web Development</Link></li>
              <li className="mb-2"><Link to="/explore" className="text-secondary text-decoration-none">Logo Design</Link></li>
              <li className="mb-2"><Link to="/explore" className="text-secondary text-decoration-none">SEO Services</Link></li>
              <li className="mb-2"><Link to="/explore" className="text-secondary text-decoration-none">Product Photography</Link></li>
            </ul>
          </Col>

          {/* Contact info section */}
          <Col lg={3} md={4}>
            <h6 className="fw-bold mb-4">Get In Touch</h6>
            <ul className="list-unstyled text-secondary">
              <li className="mb-3 d-flex align-items-center">
                <span className="me-3" style={{ color: '#ff5252' }}>✉</span>abhinavsingh2.0aks@gmail.com
              </li>
              <li className="mb-3 d-flex align-items-center">
                <span className="me-3" style={{ color: '#ff5252' }}>✆</span> +91 62061 63039
              </li>
              <li className="mb-3 d-flex align-items-start">
                <span className="me-3" style={{ color: '#ff5252' }}>📍</span> Begusarai, Bihar, India
              </li>
            </ul>
          </Col>
          
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;