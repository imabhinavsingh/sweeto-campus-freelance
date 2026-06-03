import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Services = () => {
  // Dummy services data
  const services = [
    { title: "Web Development", icon: "💻", desc: "Custom websites and portfolios." },
    { title: "Campus Photography", icon: "📸", desc: "Events and portrait shoots." },
    { title: "Video Editing", icon: "🎬", desc: "Reels and YouTube videos." },
    { title: "Graphic Design", icon: "🎨", desc: "Posters and logo design." }
  ];

  return (
    // Services section ID
    <section id="services" className="py-5">
      <Container>
        {/* Section header */}
        <div className="text-center mb-5">
          <h2 className="fw-bolder display-6">Our <span style={{ color: '#ff5252' }}>Services</span></h2>
          <p className="text-muted fs-5">What our campus talent offers.</p>
        </div>
        
        {/* Services grid */}
        <Row className="g-4">
          {services.map((item, index) => (
            <Col lg={3} md={6} key={index}>
              <Card className="h-100 shadow-sm border-0 text-center p-4 rounded-4">
                <Card.Body>
                  <div className="display-4 mb-3">{item.icon}</div>
                  <Card.Title className="fw-bold">{item.title}</Card.Title>
                  <Card.Text className="text-muted">{item.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Services;