import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const HowItWorks = () => {
  return (
    // How it works ID
    <section id="how-it-works" className="py-5 bg-light">
      <Container>
        {/* Section header */}
        <div className="text-center mb-5">
          <h2 className="fw-bolder display-6">How It <span style={{ color: '#ff5252' }}>Works</span></h2>
          <p className="text-muted fs-5">Simple steps to get started.</p>
        </div>

        {/* Steps container */}
        <Row className="text-center g-4">
          {/* Step 1 */}
          <Col md={4}>
            <div className="p-4 bg-white rounded-4 shadow-sm h-100">
              <h1 style={{ color: '#ff5252' }} className="fw-bolder mb-3">1</h1>
              <h4 className="fw-bold">Search Talent</h4>
              <p className="text-muted">Find the right student freelancer.</p>
            </div>
          </Col>
          
          {/* Step 2 */}
          <Col md={4}>
            <div className="p-4 bg-white rounded-4 shadow-sm h-100">
              <h1 style={{ color: '#ff5252' }} className="fw-bolder mb-3">2</h1>
              <h4 className="fw-bold">Discuss Project</h4>
              <p className="text-muted">Chat and finalize the details.</p>
            </div>
          </Col>
          
          {/* Step 3 */}
          <Col md={4}>
            <div className="p-4 bg-white rounded-4 shadow-sm h-100">
              <h1 style={{ color: '#ff5252' }} className="fw-bolder mb-3">3</h1>
              <h4 className="fw-bold">Get Work Done</h4>
              <p className="text-muted">Receive high-quality work securely.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HowItWorks;