import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Badge, Button, Alert } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Explore = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(queryParams.get('query') || '');
  const [selectedPkg, setSelectedPkg] = useState(queryParams.get('package') || '');

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state with URL search params when they change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('query') || '');
    setSelectedPkg(params.get('package') || '');
  }, [location.search]);

  // Fallback mock data if DB is empty
  const mockGigs = [
    { id: "1", name: "Rahul Sharma", skill: "Web Developer", category: "Web Development", skills: ["React", "Node.js", "MongoDB", "Express", "Bootstrap"], price: "₹2000", rating: "4.8", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=500&auto=format&fit=crop&q=60" },
    { id: "2", name: "Priya Singh", skill: "Event Photographer", category: "Campus Photography", skills: ["Lightroom", "Portrait photography", "Event Shoots", "Photoshop"], price: "₹1500", rating: "4.9", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60" },
    { id: "3", name: "Amit Kumar", skill: "Video Editor", category: "Video Editing", skills: ["Premiere Pro", "After Effects", "Color Grading", "Reels Editing"], price: "₹1200", rating: "4.7", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60" },
    { id: "4", name: "Neha Gupta", skill: "Logo Designer", category: "Graphic Design", skills: ["Illustrator", "Logo design", "Brand Identity"], price: "₹800", rating: "4.6", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60" },
    { id: "5", name: "Vikas Patel", skill: "Social Media Manager", category: "Writing", skills: ["Social Media", "Canva", "Copywriting", "Hashtag Analytics"], price: "₹1000", rating: "4.5", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60" },
    { id: "6", name: "Anjali Verma", skill: "Content Writer", category: "Writing", skills: ["Content Writing", "SEO", "Editing"], price: "₹500", rating: "4.9", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60" },
  ];

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/gigs');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            // Map backend schema to UI format
            const mapped = data.map(item => ({
              id: item._id || item.id,
              name: item.name,
              skill: item.title || 'Freelancer',
              category: item.category || (item.skills && item.skills.length > 0 ? item.skills[0] : 'general'),
              skills: item.skills || [],
              price: item.price || '₹500',
              rating: item.rating || 5.0,
              img: item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
            }));
            setGigs(mapped);
          } else {
            setGigs(mockGigs);
          }
        } else {
          setGigs(mockGigs);
        }
      } catch (err) {
        console.error('Error fetching gigs:', err);
        setGigs(mockGigs);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  const getPackagePrice = (basePriceStr, pkg) => {
    const basePrice = parseInt(basePriceStr.replace(/[^\d]/g, ''), 10) || 500;
    if (!pkg) return basePriceStr;
    if (pkg.toLowerCase() === 'basic') return `₹${basePrice}`;
    if (pkg.toLowerCase() === 'standard') return `₹${Math.round(basePrice * 1.8)}`;
    if (pkg.toLowerCase() === 'premium') return `₹${Math.round(basePrice * 3.0)}`;
    return basePriceStr;
  };

  // Filter logic
  const filteredGigs = gigs.filter(gig => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      gig.name.toLowerCase().includes(term) ||
      gig.skill.toLowerCase().includes(term) ||
      gig.category.toLowerCase().includes(term) ||
      (gig.skills && gig.skills.some(s => s.toLowerCase().includes(term)));

    if (!matchesSearch) return false;

    if (selectedPkg) {
      const basePrice = parseInt(gig.price.replace(/[^\d]/g, ''), 10) || 500;
      if (selectedPkg.toLowerCase() === 'basic') {
        return basePrice <= 1000;
      } else if (selectedPkg.toLowerCase() === 'standard') {
        return basePrice > 1000 && basePrice <= 2000;
      } else if (selectedPkg.toLowerCase() === 'premium') {
        return basePrice > 2000;
      }
    }
    return true;
  });

  return (
    <div className="page-transition" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
      <Container>
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="fw-bolder display-5">Explore <span style={{ color: '#ff5252' }}>Talent Directory</span></h2>
          <p className="text-muted fs-5">Find the right freelancer for your next event or startup project.</p>
        </div>

        {/* Search bar */}
        <Row className="justify-content-center mb-4">
          <Col md={8}>
            <Form.Control 
              type="search" 
              placeholder="Search by skill or name..." 
              className="py-3 px-4 rounded-pill shadow-sm border-0 fs-5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>

        {/* Selected Package Banner */}
        {selectedPkg && (
          <Row className="justify-content-center mb-4">
            <Col md={8}>
              <Alert variant="info" className="d-flex justify-content-between align-items-center rounded-4 shadow-sm border-0 py-3 mb-0">
                <div>
                  💡 Selected Pricing: <strong>{selectedPkg} package</strong> (Tiers: Basic &le; ₹1000, Standard &le; ₹2000, Premium &gt; ₹2000).
                </div>
                <Button 
                  variant="outline-info" 
                  size="sm" 
                  className="ms-3 text-dark fw-bold border-dark rounded-pill"
                  onClick={() => {
                    if (searchTerm) {
                      navigate(`/explore?query=${encodeURIComponent(searchTerm)}`);
                    } else {
                      navigate('/explore');
                    }
                  }}
                >
                  Clear Filter
                </Button>
              </Alert>
            </Col>
          </Row>
        )}

        {/* Gigs grid */}
        <Row className="g-4">
          {loading ? (
            <div className="text-center py-5">
              <h4 className="text-muted">Loading directory...</h4>
            </div>
          ) : filteredGigs.length > 0 ? (
            filteredGigs.map((gig) => (
              <Col lg={4} md={6} key={gig.id}>
                <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img src={gig.img} alt={gig.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Badge bg="light" text="dark" className="border px-2 py-1">{gig.category.toUpperCase()}</Badge>
                      <span className="text-warning fw-bold">⭐ {gig.rating}</span>
                    </div>
                    <Card.Title className="fw-bold fs-4 mb-1">{gig.skill}</Card.Title>
                    <Card.Text className="text-muted mb-3">by {gig.name}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                      <div>
                        <span className="fw-bolder fs-5 text-dark">{getPackagePrice(gig.price, selectedPkg)}</span>
                        {selectedPkg && (
                          <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                            ({selectedPkg} package price)
                          </span>
                        )}
                      </div>
                      
                      <Button 
                        as={Link} 
                        to={`/profile/${gig.id}${selectedPkg ? '?package=' + encodeURIComponent(selectedPkg) : ''}`} 
                        variant="outline-dark" 
                        size="sm" 
                        className="fw-bold rounded-pill px-3"
                      >
                        View Profile
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <div className="text-center py-5 w-100">
              <h4 className="text-muted">No freelancers found matching "{searchTerm}"</h4>
            </div>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Explore;