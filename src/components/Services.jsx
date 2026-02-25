import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Services = () => {
  const serviceList = [
    {
      id: 1,
      title: 'Web Development',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
      desc: 'Build your dream website with modern tech.'
    },
    {
      id: 2,
      title: 'Product Photography',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop',
      desc: 'High-quality shots for your brand.'
    },
    {
      id: 3,
      title: 'Logo Design',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop',
      desc: 'Professional branding and custom logos.'
    },
    {
      id: 4,
      title: 'SEO Services',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
      desc: 'Rank higher on search engines easily.'
    }
  ];

  return (
    // बस इस नीचे वाली लाइन में id="services" ऐड किया गया है
    <div className="py-5 bg-white" id="services">
      <Container className="py-5">
        <h2 className="display-5 fw-bold mb-5 text-center">
          Explore Popular <span style={{ color: '#ff5252' }}>Services</span>
        </h2>
        <Row>
          {serviceList.map((service) => (
            <Col lg={3} md={6} sm={12} className="mb-4" key={service.id}>
              <Card className="h-100 shadow-sm border-0" style={{ cursor: 'pointer' }}>
                <Card.Img variant="top" src={service.image} style={{ height: '200px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title className="fw-bold">{service.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {service.desc}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Services;