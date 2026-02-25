import React from 'react';
import { Navbar, Container, Nav, Button, Form, Row, Col } from 'react-bootstrap';
import Services from './components/Services';
import Freelancers from './components/Freelancers';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import Packages from './components/Packages';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Navbar bg="white" expand="lg" className="shadow-sm py-3" fixed="top">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold fs-3">
            Sweet<span style={{ color: '#ff5252' }}>o</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto fw-semibold text-secondary">
              <Nav.Link href="#services" className="mx-2">Services</Nav.Link>
              <Nav.Link href="#packages" className="mx-2">Packages</Nav.Link>
              <Nav.Link href="#how-it-works" className="mx-2">How it Works</Nav.Link>
              <Nav.Link href="#about" className="mx-2">About Us</Nav.Link>
            </Nav>
            <Nav className="ms-3">
              <Button variant="outline-dark" className="me-2 fw-bold">Login</Button>
              <Button style={{ backgroundColor: '#ff5252', borderColor: '#ff5252' }} className="text-white fw-bold">Post a Gig</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="d-flex align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '80px' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={7} className="mb-5 mb-lg-0">
              <h1 className="display-3 fw-bolder mb-4">
                Hire Top <span style={{ color: '#ff5252' }}>Student Talent</span> from Your Campus
              </h1>
              <p className="lead text-muted mb-5 fs-4">
                Connect with verified college photographers, developers, and designers for your local business or club events at affordable rates.
              </p>

              <Form className="d-flex p-2 bg-white rounded shadow-sm">
                <Form.Control
                  type="search"
                  placeholder="Try 'Fest Photography' or 'Cafe Website'"
                  className="me-2 border-0 shadow-none fs-5"
                />
                <Button style={{ backgroundColor: '#ff5252', borderColor: '#ff5252' }} size="lg" className="px-4 text-white fw-bold">
                  Search
                </Button>
              </Form>

              <div className="mt-4">
                <span className="text-muted fw-bold me-2">Trending:</span>
                <span className="badge bg-light text-dark border me-2 p-2">Event Poster</span>
                <span className="badge bg-light text-dark border me-2 p-2">Club Website</span>
                <span className="badge bg-light text-dark border me-2 p-2">Reel Editing</span>
              </div>
            </Col>
            <Col lg={5}>
               <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" alt="Students collaborating" className="img-fluid rounded-4 shadow-lg" />
            </Col>
          </Row>
        </Container>
      </div>

      <Services />
      <Packages />
      <Freelancers />
      <HowItWorks />
      <About />
      <Footer />
      
    </div>
  );
}

export default App;