import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const About = () => {
  return (
    <div className="py-5 bg-white" id="about">
      <Container className="py-5">
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
              alt="About Sweeto Campus"
              className="img-fluid rounded-4 shadow"
            />
          </Col>
          <Col lg={6} className="ps-lg-5">
            <h6 className="fw-bold text-uppercase mb-2" style={{ color: '#ff5252', letterSpacing: '2px' }}>Our Mission</h6>
            <h2 className="display-6 fw-bold mb-4">Empowering Campus Talent & Local Businesses</h2>
            <p className="lead text-muted mb-4">
              Sweeto is a hyper-local freelance platform built specifically for college students. We help talented students get their first real-world projects from local cafes, startups, and college clubs.
            </p>
            <p className="text-muted mb-4">
              Build your portfolio, earn pocket money, and gain industry experience without fighting the global competition. Local businesses get affordable, fresh talent, and students get the right start.
            </p>
            <Row className="mb-4">
              <Col sm={6} className="mb-3">
                <h3 className="fw-bold" style={{ color: '#ff5252' }}>Zero</h3>
                <p className="text-muted fw-semibold">Platform Commission</p>
              </Col>
              <Col sm={6} className="mb-3">
                <h3 className="fw-bold" style={{ color: '#ff5252' }}>100%</h3>
                <p className="text-muted fw-semibold">Verified Student IDs</p>
              </Col>
            </Row>
            <Button style={{ backgroundColor: '#ff5252', borderColor: '#ff5252' }} size="lg" className="text-white fw-bold px-4">
              Join Your Campus
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;