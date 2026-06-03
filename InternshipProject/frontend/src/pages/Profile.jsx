import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Hiring Form State
  const [showModal, setShowModal] = useState(false);
  const [packageTitle, setPackageTitle] = useState('Standard Pro');
  const [price, setPrice] = useState('₹999');
  const [details, setDetails] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [orderError, setOrderError] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Mock fallbacks
  const mockProfiles = {
    "1": { name: "Rahul Sharma", title: "Web Developer", price: "₹2000", rating: 4.8, ratingsCount: 1, ratingsSum: 5, bio: "Hi! I am a 3rd year B.Tech student specializing in building responsive React and Node.js web applications. I love helping local businesses set up their landing pages.", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=500&auto=format&fit=crop&q=60", skills: ["React", "Node.js", "MongoDB", "Express", "Bootstrap"], portfolio: ["College Club Web App", "Portfolio Site", "E-commerce Front-end"], freelancerType: "student", isVerifiedStudent: true },
    "2": { name: "Priya Singh", title: "Event Photographer", price: "₹1500", rating: 4.9, ratingsCount: 0, ratingsSum: 0, bio: "Professional student photographer with 2+ years of experience shooting college cultural fests, sports events, and individual student portrait sessions.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60", skills: ["Lightroom", "Portrait photography", "Event Shoots", "Photoshop"], portfolio: ["Annual Fest Shoot 2025", "Graduation Portfolios", "Campus Cafe Promo Photos"], freelancerType: "student", isVerifiedStudent: false },
    "3": { name: "Amit Kumar", title: "Video Editor", price: "₹1200", rating: 4.7, ratingsCount: 0, ratingsSum: 0, bio: "Self-taught video editor focusing on high-energy cinematic reels, promotional video edits, and YouTube vlogs. Fast turnaround time and revisions included.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60", skills: ["Premiere Pro", "After Effects", "Color Grading", "Reels Editing"], portfolio: ["Music Video Teaser", "Sports Meet Aftermovie", "Sponsorship Pitch Video"], freelancerType: "professional", isVerifiedStudent: false },
    "4": { name: "Neha Gupta", title: "Logo Designer", price: "₹800", rating: 4.6, ratingsCount: 0, ratingsSum: 0, bio: "Design student with a knack for sleek brand identities. I create vector logos, campus event posters, and digital graphics using Adobe Illustrator.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60", skills: ["Illustrator", "Branding", "Vector Art", "Logo Design"], portfolio: ["Design Fest Logo", "Entrepreneurship Cell Poster", "NGO Identity Branding"], freelancerType: "student", isVerifiedStudent: false },
    "5": { name: "Vikas Patel", title: "Social Media Manager", price: "₹1000", rating: 4.5, ratingsCount: 0, ratingsSum: 0, bio: "Helping campus clubs grow their Instagram and LinkedIn presence. I design graphics, draft captions, and research hashtags to optimize engagement rates.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60", skills: ["Social Media", "Canva", "Copywriting", "Hashtag Analytics"], portfolio: ["Tech Fest Reach Expansion", "TEDx Campus Account growth", "Placement Cell LinkedIn Campaign"], freelancerType: "student", isVerifiedStudent: false },
    "6": { name: "Anjali Verma", title: "Content Writer", price: "₹500", rating: 4.9, ratingsCount: 0, ratingsSum: 0, bio: "English Literature honors student providing high-quality blog writing, website copywriting, and proofreading services. Let me find the perfect voice for your project.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60", skills: ["Copywriting", "SEO", "Proofreading", "Creative Writing"], portfolio: ["Cafe Website copy", "Departmental Newsletter articles", "Tech Startup Blog post"], freelancerType: "student", isVerifiedStudent: false }
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/gigs/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProfile({
            name: data.name,
            title: data.title || 'Campus Freelancer',
            price: data.price || '₹500',
            rating: data.rating || 5.0,
            ratingsCount: data.ratingsCount || 0,
            bio: data.bio || 'I am a student looking for freelance opportunities on campus.',
            avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            skills: data.skills || [],
            portfolio: data.portfolio || [],
            freelancerType: data.freelancerType || 'student',
            isVerifiedStudent: data.isVerifiedStudent || false
          });
        } else {
          if (mockProfiles[id]) {
            setProfile(mockProfiles[id]);
          } else {
            setError('Freelancer not found');
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (mockProfiles[id]) {
          setProfile(mockProfiles[id]);
        } else {
          setError('Freelancer not found');
        }
      } finally {
        setLoading(false);
      }
    };

    const getReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/freelancer/${id}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (err) {
        console.error('Error loading reviews:', err);
      }
    };

    getProfile();
    getReviews();
  }, [id]);

  useEffect(() => {
    if (!loading && profile) {
      const params = new URLSearchParams(window.location.search);
      const pkg = params.get('package');
      const basePrice = parseInt(profile.price.replace(/[^\d]/g, ''), 10) || 500;
      
      if (pkg) {
        if (pkg === 'Basic') {
          setPackageTitle('Basic Gig');
          setPrice(`₹${basePrice}`);
        } else if (pkg === 'Standard') {
          setPackageTitle('Standard Pro');
          setPrice(`₹${Math.round(basePrice * 1.8)}`);
        } else if (pkg === 'Premium') {
          setPackageTitle('Premium Ultimate');
          setPrice(`₹${Math.round(basePrice * 3.0)}`);
        }
        
        // Auto-open modal if client is logged in
        if (token && user && user.role === 'client') {
          setShowModal(true);
        }
      } else {
        // Set default based on base price
        setPackageTitle('Standard Pro');
        setPrice(`₹${Math.round(basePrice * 1.8)}`);
      }
    }
  }, [loading, profile, token, user]);

  const handleHireClick = () => {
    if (!token) {
      alert('Please log in to hire a freelancer.');
      navigate('/login');
      return;
    }
    if (user.role !== 'client') {
      alert('Only client accounts can hire freelancers.');
      return;
    }
    setShowModal(true);
  };

  const handlePackageChange = (e) => {
    const pkg = e.target.value;
    setPackageTitle(pkg);
    const basePrice = parseInt(profile.price.replace(/[^\d]/g, ''), 10) || 500;
    if (pkg === 'Basic Gig') setPrice(`₹${basePrice}`);
    else if (pkg === 'Standard Pro') setPrice(`₹${Math.round(basePrice * 1.8)}`);
    else if (pkg === 'Premium Ultimate') setPrice(`₹${Math.round(basePrice * 3.0)}`);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderError('');
    setOrderSuccess('');
    setSubmittingOrder(true);

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          freelancerId: id,
          packageTitle,
          price,
          details
        })
      });

      const data = await response.json();

      if (response.ok) {
        setOrderSuccess('Booking request sent successfully! Funds have been placed in Escrow.');
        setDetails('');
        setTimeout(() => {
          setShowModal(false);
          navigate('/dashboard');
        }, 2000);
      } else {
        setOrderError(data.msg || 'Failed to submit order');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setOrderError('Connection error. Is the server running?');
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <h4 className="text-muted">Loading profile...</h4>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-5" style={{ minHeight: '100vh', paddingTop: '120px' }}>
        <h3 className="text-danger">{error || 'Profile not found'}</h3>
        <Link to="/explore" className="btn btn-outline-dark mt-3">Back to Explore</Link>
      </div>
    );
  }

  // Verification Tag Renderer
  const renderVerificationBadge = () => {
    if (profile.freelancerType === 'student') {
      if (profile.isVerifiedStudent) {
        return <Badge bg="success" className="d-inline-flex align-items-center px-3 py-2 rounded-pill fs-6 fw-bold text-white shadow-sm mb-3">🎓 Verified Student Freelancer</Badge>;
      }
      return <Badge bg="warning" text="dark" className="d-inline-flex align-items-center px-3 py-2 rounded-pill fs-6 fw-bold shadow-sm mb-3">🎓 Student Freelancer (Unverified)</Badge>;
    }
    return <Badge bg="primary" className="d-inline-flex align-items-center px-3 py-2 rounded-pill fs-6 fw-bold text-white shadow-sm mb-3">💼 External Pro Freelancer</Badge>;
  };

  return (
    <div className="page-transition" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
      <Container>
        <Link to="/explore" className="text-decoration-none text-secondary mb-4 d-inline-block">
          &larr; Back to Explore
        </Link>

        <Row>
          {/* Left sidebar */}
          <Col md={4} className="mb-4">
            <Card className="shadow-sm border-0 rounded-4 text-center p-4">
              <div className="mb-3">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="rounded-circle img-fluid shadow-sm"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
              <h3 className="fw-bold">{profile.name}</h3>
              <p className="text-muted mb-2">{profile.title}</p>

              {renderVerificationBadge()}
              
              <div className="mb-4">
                <Badge bg="warning" text="dark" className="fs-6 px-3 py-2 rounded-pill">
                  ⭐ {profile.rating} ({profile.ratingsCount} reviews)
                </Badge>
              </div>

              {user?.id !== id && (
                <Button 
                  onClick={handleHireClick}
                  style={{ backgroundColor: '#ff5252', borderColor: '#ff5252' }} 
                  className="w-100 fw-bold text-white py-2 shadow-sm"
                >
                  Hire Me
                </Button>
              )}
            </Card>
          </Col>

          {/* Right content */}
          <Col md={8}>
            <Card className="shadow-sm border-0 rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-3 text-dark">About Me</h4>
              <p className="text-muted fs-5 leading-relaxed">
                {profile.bio}
              </p>
            </Card>

            <Card className="shadow-sm border-0 rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-3 text-dark">Skills</h4>
              <div className="d-flex flex-wrap gap-2">
                {profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <Badge key={index} bg="secondary" className="px-3 py-2 rounded-pill fs-6 fw-normal">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted">No skills listed yet</span>
                )}
              </div>
            </Card>

            <Card className="shadow-sm border-0 rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-3 text-dark">Featured Portfolio</h4>
              <Row className="g-3">
                {profile.portfolio.length > 0 ? (
                  profile.portfolio.map((project, idx) => (
                    <Col sm={6} key={idx}>
                      <div className="bg-white rounded-3 p-4 text-center border shadow-sm">
                        <span className="fs-4 d-block mb-2">📁</span>
                        <h6 className="fw-bold mb-0 text-dark">{project}</h6>
                      </div>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <div className="bg-light rounded-3 p-4 text-center border text-muted">
                      No portfolio items added yet.
                    </div>
                  </Col>
                )}
              </Row>
            </Card>

            {/* Client Reviews Section */}
            <Card className="shadow-sm border-0 rounded-4 p-4">
              <h4 className="fw-bold mb-4 text-dark">Client Reviews</h4>
              {reviews.length === 0 ? (
                <p className="text-muted mb-0">No client reviews submitted yet.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="border-bottom pb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold text-dark">{rev.clientName}</span>
                        <span className="text-warning fw-bold">⭐ {rev.rating} / 5</span>
                      </div>
                      <p className="text-muted small mb-1">{rev.comment || 'No comment left.'}</p>
                      <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Hire {profile.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderError && (
            <Alert variant="danger" className="d-flex flex-column gap-2 align-items-start">
              <span>{orderError}</span>
              {orderError.includes('balance') && (
                <Button 
                  size="sm" 
                  variant="outline-danger" 
                  onClick={() => {
                    setShowModal(false);
                    navigate('/dashboard');
                  }}
                >
                  Go to Wallet Dashboard & Add Credits
                </Button>
              )}
            </Alert>
          )}
          {orderSuccess && <Alert variant="success">{orderSuccess}</Alert>}

          <Form onSubmit={handleOrderSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Select Service Plan</Form.Label>
              <Form.Select value={packageTitle} onChange={handlePackageChange}>
                <option value="Basic Gig">Basic Gig (₹{profile ? (parseInt(profile.price.replace(/[^\d]/g, ''), 10) || 500) : 500})</option>
                <option value="Standard Pro">Standard Pro (₹{profile ? Math.round((parseInt(profile.price.replace(/[^\d]/g, ''), 10) || 500) * 1.8) : 900})</option>
                <option value="Premium Ultimate">Premium Ultimate (₹{profile ? Math.round((parseInt(profile.price.replace(/[^\d]/g, ''), 10) || 500) * 3.0) : 1500})</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Gig Base Price</Form.Label>
              <Form.Control type="text" value={`${price} Credits`} disabled className="bg-light fw-bold" />
            </Form.Group>

            <div className="p-3 bg-light rounded-3 mb-4">
              <div className="d-flex justify-content-between mb-1 text-secondary small">
                <span>Service Price:</span>
                <span>{parseInt(price.replace(/[^\d]/g, ''), 10) || 0} Credits</span>
              </div>
              <div className="d-flex justify-content-between mb-1 text-secondary small">
                <span>Platform Fee (1%):</span>
                <span>{Math.round((parseInt(price.replace(/[^\d]/g, ''), 10) || 0) * 0.01) || 1} Credits</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between fw-bold text-dark">
                <span>Total Payment:</span>
                <span>{(parseInt(price.replace(/[^\d]/g, ''), 10) || 0) + (Math.round((parseInt(price.replace(/[^\d]/g, ''), 10) || 0) * 0.01) || 1)} Credits</span>
              </div>
            </div>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Task/Project details</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                placeholder="E.g., Please design a logo for our startup club..." 
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </Form.Group>

            <Button 
              type="submit" 
              className="w-100 py-2 fw-bold text-white border-0 shadow-sm"
              style={{ backgroundColor: '#ff5252' }}
              disabled={submittingOrder}
            >
              {submittingOrder ? 'Submitting...' : 'Confirm Hire & Lock Escrow'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;