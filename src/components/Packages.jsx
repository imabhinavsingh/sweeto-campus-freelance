import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Packages = () => {
  return (
    <div className="py-5 bg-light" id="packages">
      <Container className="py-5">
        <div className="text-center mb-5">
          <p className="text-muted fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>Pricing</p>
          <h2 className="display-5 fw-bold">
            Choose Your <span style={{ color: '#ff5252' }}>Package</span>
          </h2>
        </div>
        <Row className="align-items-center">
          <Col lg={4} className="mb-4">
            <Card className="text-center border-0 shadow-sm h-100 py-4">
              <Card.Body>
                <h4 className="fw-bold mb-3">Starter Plan</h4>
                <h2 className="display-5 fw-bold mb-4">₹1,500</h2>
                <ul className="list-unstyled text-muted mb-4">
                  <li className="mb-3">✓ Basic Setup</li>
                  <li className="mb-3">✓ 2 Revision Rounds</li>
                  <li className="mb-3">✓ Standard Delivery</li>
                  <li className="mb-3">✓ Email Support</li>
                </ul>
                <Button variant="dark" className="w-75 py-2 fw-bold">Select Package</Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} className="mb-4">
            <Card className="text-center border-0 shadow h-100 py-5 position-relative" style={{ borderTop: '5px solid #ff5252' }}>
              <div className="text-white py-1 position-absolute w-100 top-0 start-0" style={{ backgroundColor: '#ff5252', fontSize: '12px', fontWeight: 'bold' }}>
                MOST POPULAR
              </div>
              <Card.Body className="mt-4">
                <h4 className="fw-bold mb-3">Premium Plan</h4>
                <h2 className="display-5 fw-bold mb-4">₹3,500</h2>
                <ul className="list-unstyled text-muted mb-4">
                  <li className="mb-3">✓ Advanced Setup</li>
                  <li className="mb-3">✓ Unlimited Revisions</li>
                  <li className="mb-3">✓ Priority Delivery</li>
                  <li className="mb-3">✓ 24/7 Support</li>
                  <li className="mb-3">✓ Source Files Included</li>
                </ul>
                <Button style={{ backgroundColor: '#ff5252', borderColor: '#ff5252' }} className="w-75 py-2 fw-bold text-white">Select Package</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} className="mb-4">
            <Card className="text-center border-0 shadow-sm h-100 py-4">
              <Card.Body>
                <h4 className="fw-bold mb-3">Pro Plan</h4>
                <h2 className="display-5 fw-bold mb-4">₹6,500</h2>
                <ul className="list-unstyled text-muted mb-4">
                  <li className="mb-3">✓ Complete Access</li>
                  <li className="mb-3">✓ Multiple Concepts</li>
                  <li className="mb-3">✓ Dedicated Manager</li>
                  <li className="mb-3">✓ Video & Call Support</li>
                </ul>
                <Button variant="dark" className="w-75 py-2 fw-bold">Select Package</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Packages;