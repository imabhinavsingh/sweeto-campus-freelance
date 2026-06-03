import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

const Freelancers = () => {
  const freelancerList = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Full Stack Developer',
      rating: '4.9 (120 reviews)',
      rate: '₹400/hr',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Rahul Verma',
      role: 'UI/UX Designer',
      rating: '4.8 (95 reviews)',
      rate: '₹500/hr',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Anita Desai',
      role: 'SEO Specialist',
      rating: '5.0 (50 reviews)',
      rate: '₹300/hr',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop'
    },
    {
      id: 4,
      name: 'Vikram Singh',
      role: 'Product Photographer',
      rating: '4.7 (210 reviews)',
      rate: '₹200/hr',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
    }
  ];

  return (
    <div className="py-5" style={{ backgroundColor: '#f8f9fa' }} id="freelancers">
      <Container className="py-5">
        <h2 className="display-5 fw-bold mb-5 text-center">
          Top Rated <span style={{ color: '#ff5252' }}>Freelancers</span>
        </h2>
        <Row>
          {freelancerList.map((freelancer) => (
            <Col lg={3} md={6} sm={12} className="mb-4" key={freelancer.id}>
              <Card className="h-100 shadow-sm border-0 text-center py-4 hover-shadow">
                <div className="d-flex justify-content-center mb-3">
                  <img
                    src={freelancer.image}
                    alt={freelancer.name}
                    className="rounded-circle"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                </div>
                <Card.Body>
                  <Card.Title className="fw-bold mb-1">{freelancer.name}</Card.Title>
                  <Card.Text className="text-muted mb-2">{freelancer.role}</Card.Text>
                  <div className="mb-3">
                    <span className="text-warning fw-bold me-1">★</span>
                    <span className="text-muted small">{freelancer.rating}</span>
                  </div>
                  <Badge bg="dark" className="p-2 fs-6">{freelancer.rate}</Badge>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Freelancers;