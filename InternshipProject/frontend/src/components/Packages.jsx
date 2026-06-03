import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Packages = () => {
  return (
    <section id="packages" className="py-5 bg-light">
      <Container className="py-5">
        
        <div className="text-center mb-5">
          <h2 className="fw-bolder display-6">Simple <span style={{ color: '#ff5252' }}>Pricing</span> Packages</h2>
          <p className="text-muted fs-5">Choose the best plan for your campus event or local business.</p>
        </div>

        <Row className="g-4 justify-content-center">
          
          {/* Basic Package card */}
          <Col lg={4} md={6}>
            <Card className="h-100 shadow-sm border-0 rounded-4 text-center p-4">
              <Card.Body>
                <h4 className="fw-bold mb-3">Basic Gig</h4>
                <h2 className="fw-bolder mb-4">₹499<span className="fs-6 text-muted fw-normal">/task</span></h2>
                
                <ListGroup variant="flush" className="mb-4 text-start">
                  <ListGroup.Item className="border-0 bg-transparent">✅ 1 Day Delivery</ListGroup.Item>
                  <ListGroup.Item className="border-0 bg-transparent">✅ Basic Revisions</ListGroup.Item>
                  <ListGroup.Item className="border-0 bg-transparent text-muted">❌ Source Files</ListGroup.Item>
                  <ListGroup.Item className="border-0 bg-transparent text-muted">❌ Priority Support</ListGroup.Item>
                </ListGroup>
                
                <Button as={Link} to="/explore?package=Basic" variant="outline-dark" className="w-100 fw-bold rounded-pill py-2">
                  Select Basic
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Standard Package card */}
          <Col lg={4} md={6}>
            <Card className="h-100 shadow-lg border-0 rounded-4 text-center p-4 position-relative" style={{ borderTop: '5px solid #ff5252' }}>
              
              <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill" style={{ backgroundColor: '#ff5252', fontSize: '0.8rem' }}>
                Most Popular
              </span>
              
              <Card.Body>
                <h4 className="fw-bold mb-3">Standard Pro</h4>
                <h2 className="fw-bolder mb-4">₹999<span className="fs-6 text-muted fw-normal">/task</span></h2>
                
                <ListGroup variant="flush" className="mb-4 text-start">
                  <ListGroup.Item className="border-0 bg-transparent">✅ 3 Days Delivery</ListGroup.Item>
                  <ListGroup.Item className="border-0 bg-transparent">✅ Unlimited Revisions</ListGroup.Item>
                  <ListGroup.Item className="border-0 bg-transparent">✅ Source Files</ListGroup.Item>
                  <ListGroup.Item className="border-0 bg-transparent text-muted">❌ Priority Support</ListGroup.Item>
                </ListGroup>
                
                <Button as={Link} to="/explore?package=Standard" style={{ backgroundColor: '#ff5252', borderColor: '#ff5252' }} className="w-100 fw-bold text-white rounded-pill py-2">
                  Select Standard
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Premium Package card */}
          <Col lg={4} md={6}>
            <Card className="h-100 shadow-sm border-0 rounded-4 text-center p-4">
              <Card.Body>
                <h4 className="fw-bold mb-3">Premium Ultimate</h4>
                <h2 className="fw-bolder mb-4">₹1999<span className="fs-6 text-muted fw-normal">/task</span></h2>
                
                <ListGroup variant="flush" className="mb-4 text-start">
                  <ListGroup.Item className="border-0 bg-transparent">✅ 5 Days Delivery</ListGroup.Item>
                  <ListGroup.Item className="border-0 bg-transparent">✅ Unlimited Revisions</ListGroup.Item>
                  <ListGroup.Item className="border-0 bg-transparent">✅ Source Files</ListGroup.Item>
                  <ListGroup.Item className="border-0 bg-transparent">✅ Priority 24/7 Support</ListGroup.Item>
                </ListGroup>
                
                <Button as={Link} to="/explore?package=Premium" variant="dark" className="w-100 fw-bold rounded-pill py-2">
                  Select Premium
                </Button>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </section>
  );
};

export default Packages;