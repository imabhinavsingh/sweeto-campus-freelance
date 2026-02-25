import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const HowItWorks = () => {
  return (
    <div className="py-5" style={{ backgroundColor: '#f8f9fa' }} id="how-it-works">
      <Container className="py-5 text-center">
        <h2 className="display-5 fw-bold mb-5">
          How <span style={{ color: '#ff5252' }}>Sweeto</span> Works
        </h2>
        <Row>
          <Col md={4} className="mb-4">
            <div className="p-4 bg-white rounded shadow-sm h-100">
              <h1 style={{ color: '#ff5252' }} className="fw-bolder mb-3">1</h1>
              <h4 className="fw-bold">Create an Account</h4>
              <p className="text-muted">Sign up for free, set up your profile, and start browsing services.</p>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="p-4 bg-white rounded shadow-sm h-100">
              <h1 style={{ color: '#ff5252' }} className="fw-bolder mb-3">2</h1>
              <h4 className="fw-bold">Find a Service</h4>
              <p className="text-muted">Search for the perfect freelancer based on reviews, skills, and price.</p>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="p-4 bg-white rounded shadow-sm h-100">
              <h1 style={{ color: '#ff5252' }} className="fw-bolder mb-3">3</h1>
              <h4 className="fw-bold">Get Work Done</h4>
              <p className="text-muted">Collaborate with your freelancer and securely pay through the platform.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HowItWorks;