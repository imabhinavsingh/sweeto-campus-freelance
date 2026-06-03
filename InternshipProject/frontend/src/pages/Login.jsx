import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // State management for form data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await login(formData.email, formData.password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.msg);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Welcome Back to Sweet<span style={{ color: '#ff5252' }}>o</span></h2>
                  <p className="text-muted">Login to access your campus freelance dashboard</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="fw-semibold">College Email address</Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="Enter your .edu or college email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="py-2"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <div className="d-flex justify-content-between">
                      <Form.Label className="fw-semibold">Password</Form.Label>
                      <a href="#forgot" className="text-decoration-none" style={{ color: '#ff5252', fontSize: '0.9rem' }}>Forgot Password?</a>
                    </div>
                    <Form.Control 
                      type="password" 
                      placeholder="Password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="py-2"
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 py-2 fw-bold text-white border-0"
                    style={{ backgroundColor: '#ff5252' }}
                  >
                    Log In
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted">
                    New to Sweeto? <Link to="/signup" className="text-decoration-none fw-bold" style={{ color: '#0f172a' }}>Create an account</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;