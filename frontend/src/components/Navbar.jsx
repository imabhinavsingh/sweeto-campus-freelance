import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const MyNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isClient = user && user.role === 'client';
  const isAdmin = user && user.role === 'admin';

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to={(user && !isAdmin) ? '/dashboard' : '/'} className="fw-bold fs-3">
          Sweet<span style={{ color: '#ff5252' }}>o</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto fw-semibold text-secondary align-items-center">
            {(!user || isAdmin) && (
              <>
                <Nav.Link href="/#services" className="mx-2">Services</Nav.Link>
                <Nav.Link href="/#packages" className="mx-2">Packages</Nav.Link>
                <Nav.Link href="/#how-it-works" className="mx-2">How it Works</Nav.Link>
                <Nav.Link as={Link} to="/explore" className="mx-2 fw-bold text-dark">Explore Gigs</Nav.Link>
              </>
            )}
            {isClient && (
              <Nav.Link as={Link} to="/explore" className="mx-2 fw-bold text-dark">Explore Gigs</Nav.Link>
            )}
            {user && (
              <Nav.Link as={Link} to="/dashboard" className="mx-2 fw-bold text-dark">Dashboard</Nav.Link>
            )}
          </Nav>
          
          <Nav className="ms-3 align-items-center">
            {user ? (
              <>
                <span className="me-3 fw-bold text-dark">Hi, {user.name}</span>
                <Button 
                  onClick={handleLogout} 
                  variant="outline-dark" 
                  className="fw-bold"
                  size="sm"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-dark" 
                  className="me-2 fw-bold"
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/signup" 
                  style={{ backgroundColor: '#ff5252', borderColor: '#ff5252' }} 
                  className="text-white fw-bold"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;