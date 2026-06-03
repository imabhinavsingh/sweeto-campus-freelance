import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FeaturedGigs = () => {
  // Top 3 gigs for home page preview
  const topGigs = [
    { id: 1, name: "Rahul Sharma", skill: "Web Developer", price: "₹2000", rating: "4.8", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=500&auto=format&fit=crop&q=60" },
    { id: 2, name: "Priya Singh", skill: "Event Photographer", price: "₹1500", rating: "4.9", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60" },
    { id: 3, name: "Amit Kumar", skill: "Video Editor", price: "₹1200", rating: "4.7", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60" }
  ];

  return (
    // Featured section wrapper
    <section id="featured-gigs" className="py-5 bg-light">
      <Container>
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="fw-bolder display-6">Featured <span style={{ color: '#ff5252' }}>Talent</span></h2>
          <p className="text-muted fs-5">Some of our top-rated campus freelancers.</p>
        </div>

        {/* 3 Grid Cards */}
        <Row className="g-4 mb-5">
          {topGigs.map((gig) => (
            <Col lg={4} md={6} key={gig.id}>
              <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={gig.img} alt={gig.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-warning fw-bold">⭐ {gig.rating}</span>
                  </div>
                  <Card.Title className="fw-bold fs-4 mb-1">{gig.skill}</Card.Title>
                  <Card.Text className="text-muted mb-3">by {gig.name}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                    <span className="fw-bolder fs-5 text-dark">{gig.price}</span>
                    <Button as={Link} to={`/profile/${gig.id}`} variant="outline-dark" size="sm" className="fw-bold rounded-pill px-3">
                      View Profile
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Link to main explore page */}
        <div className="text-center">
          <Button as={Link} to="/explore" style={{ backgroundColor: '#ff5252', borderColor: '#ff5252' }} className="text-white fw-bold px-5 py-3 rounded-pill fs-5 shadow">
            Explore All Gigs &rarr;
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedGigs;