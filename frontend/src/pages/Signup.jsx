import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  // State management for form data
  const [formData, setFormData] = useState({
    role: 'freelancer',
    name: '',
    email: '',
    password: '',
    phone: '',
    organization: '',
    clientType: 'individual',
    freelancerType: 'student',
    preferredSkills: []
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        if (response.ok) {
          const data = await response.json();
          // Filter out "Others" from signup preferences checklist
          setCategories(data.filter(c => c !== 'Others'));
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleCheckboxChange = (skillName) => {
    const skills = [...formData.preferredSkills];
    if (skills.includes(skillName)) {
      setFormData({
        ...formData,
        preferredSkills: skills.filter(s => s !== skillName)
      });
    } else {
      setFormData({
        ...formData,
        preferredSkills: [...skills, skillName]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role,
      formData.organization,
      formData.clientType,
      formData.phone,
      formData.preferredSkills,
      formData.freelancerType
    );

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.msg);
    }
  };

  return (
    <div className="page-transition" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={7}>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Join Sweet<span style={{ color: '#ff5252' }}>o</span></h2>
                  <p className="text-muted">Create an account to hire or offer services</p>
                </div>

                {/* Role Selection Buttons */}
                <div className="d-flex justify-content-center mb-4">
                  <ButtonGroup className="w-100 shadow-sm">
                    <Button 
                      variant={formData.role === 'freelancer' ? 'dark' : 'outline-dark'}
                      onClick={() => handleRoleChange('freelancer')}
                      className="py-2 fw-semibold"
                    >
                      I am a Freelancer / Student
                    </Button>
                    <Button 
                      variant={formData.role === 'client' ? 'dark' : 'outline-dark'}
                      onClick={() => handleRoleChange('client')}
                      className="py-2 fw-semibold"
                    >
                      I am a Hiring Client
                    </Button>
                  </ButtonGroup>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Full Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Enter your name" 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="py-2 shadow-none"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Phone / WhatsApp Number</Form.Label>
                        <Form.Control 
                          type="tel" 
                          placeholder="10-digit number" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="py-2 shadow-none"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      {formData.role === 'freelancer' && formData.freelancerType === 'student' 
                        ? 'College Email Address' 
                        : 'Email Address'}
                    </Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder={formData.role === 'freelancer' && formData.freelancerType === 'student' 
                        ? "username@college.edu" 
                        : "name@example.com"} 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="py-2 shadow-none"
                    />
                    {formData.role === 'freelancer' && formData.freelancerType === 'student' && (
                      <Form.Text className="text-muted">
                        We use your college email domain to verify student status.
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="Create a strong password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="py-2 shadow-none"
                    />
                  </Form.Group>

                  {/* FREELANCER SPECIFIC FIELDS */}
                  {formData.role === 'freelancer' && (
                    <Card className="bg-light border-0 rounded-3 p-4 mb-4">
                      <h6 className="fw-bold mb-3 text-dark">Freelancer Verification Details</h6>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Freelancer Category Type</Form.Label>
                        <Form.Select 
                          name="freelancerType"
                          value={formData.freelancerType}
                          onChange={handleInputChange}
                        >
                          <option value="student">🎓 Current College Student (Verified Badging)</option>
                          <option value="professional">💼 External Freelance Professional</option>
                        </Form.Select>
                      </Form.Group>
                      {formData.freelancerType === 'student' && (
                        <Form.Text className="text-muted d-block bg-white p-2 rounded border mt-2">
                          💡 <strong>Important Note</strong>: Admins will review your account to verify your college email address. Once approved, a <strong>Verified Student Badge</strong> (🎓) will appear on your profile.
                        </Form.Text>
                      )}
                    </Card>
                  )}

                  {/* CLIENT SPECIFIC FIELDS */}
                  {formData.role === 'client' && (
                    <Card className="bg-light border-0 rounded-3 p-4 mb-4">
                      <h6 className="fw-bold mb-3 text-dark">Client Classification Details</h6>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Client Type</Form.Label>
                            <Form.Select 
                              name="clientType"
                              value={formData.clientType}
                              onChange={handleInputChange}
                            >
                              <option value="individual">👤 Individual / Personal</option>
                              <option value="student_club">🎪 Student Club / Organisation</option>
                              <option value="university_dept">🏫 College Faculty / Department</option>
                              <option value="local_business">🏢 Local Business / Cafe / Shop</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Organisation / Club Name</Form.Label>
                            <Form.Control 
                              type="text" 
                              placeholder="e.g., E-Cell, Cafe Coffee, etc." 
                              name="organization"
                              value={formData.organization}
                              onChange={handleInputChange}
                              className="py-2 shadow-none"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      {categories.length > 0 && (
                        <Form.Group className="mt-2">
                          <Form.Label className="fw-semibold d-block">Looking to Hire Services In:</Form.Label>
                          <Row>
                            {categories.map((cat, idx) => (
                              <Col sm={6} key={idx}>
                                <Form.Check 
                                  type="checkbox"
                                  id={`checkbox-${idx}`}
                                  label={cat}
                                  checked={formData.preferredSkills.includes(cat)}
                                  onChange={() => handleCheckboxChange(cat)}
                                  className="mb-2"
                                />
                              </Col>
                            ))}
                          </Row>
                        </Form.Group>
                      )}
                    </Card>
                  )}

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 py-2.5 fw-bold text-white border-0 shadow"
                    style={{ backgroundColor: '#ff5252' }}
                  >
                    Register Account
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted">
                    Already have an account? <Link to="/login" className="text-decoration-none fw-bold" style={{ color: '#0f172a' }}>Log in</Link>
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

export default Signup;