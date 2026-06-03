import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Import all components
import Services from '../components/Services';
import Packages from '../components/Packages';     // Packages is back!
import FeaturedGigs from '../components/FeaturedGigs'; 
import HowItWorks from '../components/HowItWorks';
import About from '../components/About';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Redirect logged-in clients and freelancers directly to their dashboards
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    // Main home wrapper
    <div className="page-transition">
      {/* Hero Section */}
      <div id="home" className="d-flex align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '80px' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={7} className="mb-5 mb-lg-0">
              <h1 className="display-3 fw-bolder mb-4">
                Hire Top <span style={{ color: '#ff5252' }}>Student Talent</span> from Your Campus
              </h1>
              <p className="lead text-muted mb-5 fs-4">
                Connect with verified college photographers, developers, and designers for your local business or club events.
              </p>

              {/* Search bar */}
              <Form onSubmit={handleSearchSubmit} className="d-flex p-2 bg-white rounded shadow-sm">
                <Form.Control 
                  type="search" 
                  placeholder="Try 'Fest Photography' or 'Cafe Website'" 
                  className="me-2 border-0 shadow-none fs-5" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" style={{ backgroundColor: '#ff5252', borderColor: '#ff5252' }} size="lg" className="px-4 text-white fw-bold">Search</Button>
              </Form>
            </Col>
            
            {/* Hero image */}
            <Col lg={5}>
               <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" alt="Students" className="img-fluid rounded-4 shadow-lg" />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Render all sections */}
      <Services />
      <Packages />        {/* Add packages here */}
      <FeaturedGigs />    {/* Add featured gigs */}
      <HowItWorks />
      <About />
    </div>
  );
};

export default Home;