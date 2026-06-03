import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const About = () => {
  return (
    // About section ID
    <section id="about" className="py-5">
      <Container>
        <Row className="align-items-center">
          {/* About image side */}
          <Col lg={6} className="mb-4 mb-lg-0">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
              alt="About Sweeto" 
              className="img-fluid rounded-4 shadow"
            />
          </Col>
          
          {/* About text side */}
          <Col lg={6} className="ps-lg-5">
            <h2 className="fw-bolder display-6 mb-4">About <span style={{ color: '#ff5252' }}>Sweeto</span></h2>
            <p className="text-muted fs-5 mb-4">
              We are a hyper-local campus marketplace designed to bridge the gap between talented university students and local businesses. 
            </p>
            <p className="text-muted fs-5">
              Our mission is to empower student freelancers to build their portfolios while helping the local community thrive.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;