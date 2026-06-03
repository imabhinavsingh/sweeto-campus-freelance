import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Nav, Button, Table, Badge, Form, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, token, loading, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  // Navigation tab states
  // Freelancer: 'orders' | 'profile' | 'wallet'
  // Client: 'orders' | 'wallet'
  // Admin: 'admin-stats' | 'admin-users' | 'admin-categories'
  const [activeTab, setActiveTab] = useState('orders');

  const [orders, setOrders] = useState([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  // Wallet State
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [depositAmount, setDepositAmount] = useState('');
  const [depositing, setDepositing] = useState(false);

  // Chat Board State
  const [chatBooking, setChatBooking] = useState(null); // Selected booking/order for chat
  const [chatMessages, setChatMessages] = useState([]);
  const [newMsgText, setNewMsgText] = useState('');
  const [fetchingChat, setFetchingChat] = useState(false);

  // Review Submitting State
  const [reviewBooking, setReviewBooking] = useState(null); // Selected booking for review
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Freelancer profile settings state
  const [categories, setCategories] = useState([]);
  const [profileData, setProfileData] = useState({
    title: '',
    bio: '',
    skills: '',
    price: '',
    avatar: '',
    portfolio: '',
    category: '',
    customCategory: ''
  });

  // Admin Specific States
  const [adminStats, setAdminStats] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminCats, setAdminCats] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);
  const [adminOrders, setAdminOrders] = useState([]);
  const [fetchingAdminOrders, setFetchingAdminOrders] = useState(false);
  const [editBalanceUser, setEditBalanceUser] = useState(null);
  const [newBalanceValue, setNewBalanceValue] = useState('');
  const [updatingBalance, setUpdatingBalance] = useState(false);

  // Check login
  useEffect(() => {
    if (!loading && !token) {
      navigate('/login');
    }
  }, [loading, token, navigate]);

  // Initial tab and categories loading
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        setActiveTab('admin-stats');
        fetchAdminStats();
        fetchWalletDetails();
      } else {
        setActiveTab('orders');
        fetchWalletDetails();
      }
      fetchCategories();
      fetchOrders();
    }
  }, [user]);

  // Sync profile fields
  useEffect(() => {
    if (user) {
      setProfileData({
        title: user.title || '',
        bio: user.bio || '',
        skills: user.skills ? user.skills.join(', ') : '',
        price: user.price || '₹500',
        avatar: user.avatar || '',
        portfolio: user.portfolio ? user.portfolio.join(', ') : '',
        category: user.category || 'Web Development',
        customCategory: ''
      });
    }
  }, [user]);

  // Fetch functions
  const fetchOrders = async () => {
    if (!token) return;
    setFetchingOrders(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setFetchingOrders(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        setAdminCats(data);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const fetchWalletDetails = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/wallet', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWallet(data);
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
    }
  };

  const fetchAdminStats = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminStats(data);
      }
    } catch (err) {
      console.error('Error loading admin analytics:', err);
    }
  };

  const fetchAdminUsers = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminUsers(data);
      }
    } catch (err) {
      console.error('Error loading admin user logs:', err);
    }
  };

  const fetchAdminOrders = async () => {
    if (!token) return;
    setFetchingAdminOrders(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminOrders(data);
      }
    } catch (err) {
      console.error('Error loading admin sales/orders logs:', err);
    } finally {
      setFetchingAdminOrders(false);
    }
  };

  const handleDownloadInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print/download the bill.');
      return;
    }

    const clientName = order.clientId?.name || 'N/A';
    const clientEmail = order.clientId?.email || 'N/A';
    const freelancerName = order.freelancerId?.name || 'N/A';
    const freelancerEmail = order.freelancerId?.email || 'N/A';
    const freelancerTitle = order.freelancerId?.title || 'Gig Service';
    const priceText = order.price || '0 SC';
    const dateText = new Date(order.createdAt || Date.now()).toLocaleDateString();
    const orderId = order._id || order.id || 'N/A';
    const shortId = orderId.substring(0, 8).toUpperCase();
    const statusText = order.status ? order.status.toUpperCase() : 'PENDING';
    const details = order.details || 'Freelancer services performed on Sweeto platform.';

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${shortId}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; color: #333; background-color: #fff; padding: 30px; }
            .invoice-title { font-size: 28px; font-weight: 800; color: #ff5252; letter-spacing: -0.5px; }
            .invoice-card { border: 1px solid #eaeaea; border-radius: 12px; padding: 40px; background-color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
            .badge-status { background-color: #e3f2fd; color: #0d6efd; font-weight: 600; padding: 6px 12px; border-radius: 30px; font-size: 0.8rem; }
            .badge-status.COMPLETED { background-color: #e8f5e9; color: #2e7d32; }
            .badge-status.PENDING { background-color: #fff3e0; color: #ef6c00; }
            .badge-status.CANCELLED { background-color: #ffebee; color: #c62828; }
            .invoice-table th { background-color: #f8f9fa; color: #495057; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.5px; padding: 12px; }
            .invoice-table td { padding: 16px 12px; vertical-align: middle; border-bottom: 1px solid #f1f1f1; }
            .total-section { border-top: 2px solid #ff5252; padding-top: 15px; margin-top: 15px; }
            .text-muted-invoice { color: #888; font-size: 0.85rem; }
            @media print {
              body { padding: 0; background: none; }
              .invoice-card { border: none; box-shadow: none; padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="container my-4">
            <div class="invoice-card">
              <!-- Top bar: Logo and Status -->
              <div class="d-flex justify-content-between align-items-center mb-5">
                <div>
                  <h1 class="invoice-title mb-1">SWEETO</h1>
                  <span class="text-secondary small">Campus Freelance Ledger Invoice</span>
                </div>
                <div class="text-end">
                  <span class="badge-status ${statusText}">${statusText}</span>
                  <div class="text-muted-invoice mt-2">Invoice: <strong>#SW-${shortId}</strong></div>
                  <div class="text-muted-invoice">Date: ${dateText}</div>
                </div>
              </div>

              <hr class="my-4" style="border-color: #eaeaea;" />

              <!-- Addresses -->
              <div class="row mb-5">
                <div class="col-sm-6 mb-4 mb-sm-0">
                  <h6 class="text-uppercase text-muted-invoice fw-bold mb-2">Billed To (Client)</h6>
                  <h5 class="fw-bold mb-1">${clientName}</h5>
                  <p class="text-secondary mb-0 small">${clientEmail}</p>
                  <p class="text-secondary mb-0 small">University Client Portal</p>
                </div>
                <div class="col-sm-6">
                  <h6 class="text-uppercase text-muted-invoice fw-bold mb-2">Service Provider (Freelancer)</h6>
                  <h5 class="fw-bold mb-1">${freelancerName}</h5>
                  <p class="text-secondary mb-1 small">${freelancerEmail}</p>
                  <span class="badge bg-secondary py-1 px-2 text-white" style="font-size: 0.75rem;">${freelancerTitle}</span>
                </div>
              </div>

              <!-- Order Specifics -->
              <div class="p-3 bg-light rounded-3 mb-4">
                <h6 class="fw-bold mb-2 text-dark" style="font-size: 0.9rem;">Workspace Project Specifications:</h6>
                <p class="mb-0 text-secondary small" style="font-style: italic;">"${details}"</p>
              </div>

              <!-- Invoice items -->
              <table class="table invoice-table w-100 mb-4">
                <thead>
                  <tr>
                    <th>Service & Package Description</th>
                    <th class="text-center" style="width: 10%;">Qty</th>
                    <th class="text-end" style="width: 25%;">Rate</th>
                    <th class="text-end" style="width: 25%;">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div class="fw-bold text-dark">${order.packageTitle || 'Standard Package'}</div>
                      <span class="text-secondary small">Freelancing project code checkout escrow contract</span>
                    </td>
                    <td class="text-center">1</td>
                    <td class="text-end">${priceText}</td>
                    <td class="text-end fw-bold text-dark">${priceText}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Totals -->
              <div class="row justify-content-end">
                <div class="col-md-5 col-sm-7">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-secondary small">Subtotal:</span>
                    <span class="text-dark fw-semibold">${priceText}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-secondary small">Platform Service Charge (0%):</span>
                    <span class="text-success fw-semibold">0 SC</span>
                  </div>
                  <div class="d-flex justify-content-between total-section mb-4">
                    <h5 class="fw-bold text-dark">Total Paid:</h5>
                    <h5 class="fw-bold text-danger">${priceText}</h5>
                  </div>
                </div>
              </div>

              <hr class="my-4" style="border-color: #eaeaea;" />

              <!-- Invoice footer -->
              <div class="text-center text-muted-invoice py-3">
                <p class="mb-1">This transaction invoice has been securely recorded on the Sweeto Credits database.</p>
                <p class="mb-0">For platform billing inquiries, please contact <a href="mailto:support@sweeto.edu" class="text-decoration-none" style="color: #ff5252;">support@sweeto.edu</a>.</p>
              </div>
            </div>
            
            <div class="text-center mt-4 no-print">
              <button class="btn btn-dark fw-bold px-4 py-2 shadow-sm rounded-pill me-2" onclick="window.print()">Print Invoice / Save PDF</button>
              <button class="btn btn-outline-secondary fw-semibold px-4 py-2 rounded-pill" onclick="window.close()">Close Window</button>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const triggerBalanceEditModal = (userToEdit) => {
    setEditBalanceUser(userToEdit);
    setNewBalanceValue(userToEdit.walletBalance || 0);
  };

  const handleUpdateBalanceSubmit = async (e) => {
    e.preventDefault();
    if (!editBalanceUser) return;
    setUpdatingBalance(true);
    setFeedbackMsg({ type: '', text: '' });
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${editBalanceUser._id || editBalanceUser.id}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ balance: newBalanceValue })
      });
      if (response.ok) {
        setFeedbackMsg({ type: 'success', text: `Wallet balance adjusted successfully for ${editBalanceUser.name}!` });
        setEditBalanceUser(null);
        fetchAdminUsers();
      } else {
        const data = await response.json();
        setFeedbackMsg({ type: 'danger', text: data.msg || 'Balance update failed' });
      }
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ type: 'danger', text: 'Server connection issue' });
    } finally {
      setUpdatingBalance(false);
    }
  };

  // Wallet Add Funds
  const handleAddFunds = async (e) => {
    e.preventDefault();
    setDepositing(true);
    setFeedbackMsg({ type: '', text: '' });
    try {
      const response = await fetch('http://localhost:5000/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: depositAmount })
      });
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        data = { msg: text || 'Server error' };
      }

      if (response.ok) {
        setDepositAmount('');
        setFeedbackMsg({ type: 'success', text: 'Sweeto Credits successfully added to wallet!' });
        fetchWalletDetails();
      } else {
        setFeedbackMsg({ type: 'danger', text: data.msg || 'Deposit failed' });
      }
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ type: 'danger', text: 'Connection issue. Is the server running?' });
    } finally {
      setDepositing(false);
    }
  };

  // Discussion Chat panel loaders
  const openChatBoard = async (booking) => {
    setChatBooking(booking);
    setNewMsgText('');
    setFetchingChat(true);
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${booking._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setChatMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingChat(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsgText.trim() || !chatBooking) return;
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${chatBooking._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newMsgText })
      });
      if (response.ok) {
        const data = await response.json();
        setChatMessages([...chatMessages, data]);
        setNewMsgText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Status Action Handlers
  const handleUpdateStatus = async (orderId, newStatus) => {
    setFeedbackMsg({ type: '', text: '' });
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setFeedbackMsg({ type: 'success', text: `Order status updated to ${newStatus} successfully!` });
        fetchOrders();
        fetchWalletDetails();
      } else {
        const data = await response.json();
        setFeedbackMsg({ type: 'danger', text: data.msg || 'Update failed' });
      }
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ type: 'danger', text: 'Server connection issue' });
    }
  };

  // Review flow submitter
  const triggerReviewModal = (booking) => {
    setReviewBooking(booking);
    setReviewComment('');
    setReviewRating(5);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      // 1. Submit review
      const reviewRes = await fetch(`http://localhost:5000/api/reviews/${reviewBooking._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      });

      if (reviewRes.ok) {
        // 2. Change status to completed (releases escrow)
        const orderRes = await fetch(`http://localhost:5000/api/orders/${reviewBooking._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'completed' })
        });

        if (orderRes.ok) {
          setFeedbackMsg({ type: 'success', text: 'Task completed! Review saved and wallet funds released to freelancer.' });
          setReviewBooking(null);
          fetchOrders();
          fetchWalletDetails();
        } else {
          setFeedbackMsg({ type: 'danger', text: 'Review saved, but failed to complete order.' });
        }
      } else {
        const errData = await reviewRes.json();
        setFeedbackMsg({ type: 'danger', text: errData.msg || 'Review submission failed' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Freelancer profile updating
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMsg({ type: '', text: '' });

    let finalCategory = profileData.category;

    // Handle Category write-in fallback "Others"
    if (profileData.category === 'Others' && profileData.customCategory.trim()) {
      try {
        const catRes = await fetch('http://localhost:5000/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name: profileData.customCategory })
        });
        if (catRes.ok) {
          finalCategory = profileData.customCategory.trim();
          fetchCategories();
        }
      } catch (err) {
        console.error('Error creating custom category:', err);
      }
    }

    const formattedData = {
      ...profileData,
      category: finalCategory,
      skills: profileData.skills ? profileData.skills.split(',').map(s => s.trim()) : [],
      portfolio: profileData.portfolio ? profileData.portfolio.split(',').map(p => p.trim()) : []
    };

    const res = await updateProfile(formattedData);
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: 'Gig profile updated successfully!' });
    } else {
      setFeedbackMsg({ type: 'danger', text: res.msg || 'Failed to update profile' });
    }
  };

  // Admin control actions
  const handleApproveStudent = async (userId, shouldVerify = true) => {
    setFeedbackMsg({ type: '', text: '' });
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ verify: shouldVerify })
      });
      if (response.ok) {
        setFeedbackMsg({ 
          type: 'success', 
          text: shouldVerify ? 'Student freelancer verified successfully!' : 'Student freelancer verification removed.' 
        });
        fetchAdminUsers();
      } else {
        const data = await response.json();
        setFeedbackMsg({ type: 'danger', text: data.msg || 'Verification update failed' });
      }
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ type: 'danger', text: 'Server error updating student status' });
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate/delete this user?')) return;
    setFeedbackMsg({ type: '', text: '' });
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setFeedbackMsg({ type: 'success', text: 'User account deactivated.' });
        // Update local state instantly for absolute visual responsiveness
        setAdminUsers(prev => prev.filter(u => (u._id || u.id) !== userId));
        fetchAdminUsers();
        fetchAdminStats();
      } else {
        const data = await response.json();
        setFeedbackMsg({ type: 'danger', text: data.msg || 'Failed to deactivate user' });
      }
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ type: 'danger', text: 'Server error during deactivation' });
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCreatingCat(true);
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCatName })
      });
      if (response.ok) {
        setNewCatName('');
        setFeedbackMsg({ type: 'success', text: 'Category created!' });
        fetchCategories();
        fetchAdminStats();
      } else {
        const d = await response.json();
        setFeedbackMsg({ type: 'danger', text: d.msg || 'Failed to add' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingCat(false);
    }
  };

  const handleDeleteCategory = async (catName) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${catName}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setFeedbackMsg({ type: 'success', text: 'Category deleted!' });
        fetchCategories();
        fetchAdminStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helpers
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge bg="warning" text="dark">Pending Approval</Badge>;
      case 'accepted': return <Badge bg="primary">Active (Escrow Locked)</Badge>;
      case 'completed': return <Badge bg="success">Finished & Paid</Badge>;
      case 'cancelled': return <Badge bg="danger">Cancelled & Refunded</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading || !user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <h4 className="text-muted">Loading dashboard...</h4>
      </div>
    );
  }

  const isFreelancer = user.role === 'freelancer';
  const isAdmin = user.role === 'admin';

  return (
    <div className="page-transition" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold mb-1">Dashboard</h1>
            <p className="text-muted">
              Welcome back, <strong>{user.name}</strong> 
              {isAdmin ? (
                <Badge bg="danger" className="ms-2">Admin Administrator</Badge>
              ) : isFreelancer ? (
                <Badge bg="success" className="ms-2">Freelancer</Badge>
              ) : (
                <Badge bg="info" className="ms-2">Hiring Client</Badge>
              )}
            </p>
          </div>
          {!isFreelancer && !isAdmin && (
            <Button onClick={() => navigate('/explore')} style={{ backgroundColor: '#ff5252', borderColor: '#ff5252' }} className="fw-bold text-white shadow-sm">
              Explore Services
            </Button>
          )}
        </div>

        {feedbackMsg.text && (
          <Alert variant={feedbackMsg.type} onClose={() => setFeedbackMsg({ type: '', text: '' })} dismissible>
            {feedbackMsg.text}
          </Alert>
        )}

        {/* ADMIN DASHBOARD PANELS */}
        {isAdmin && (
          <Row>
            {/* Admin Stats Header */}
            {adminStats && (
              <Row className="g-3 mb-4 ms-0 me-0 px-0">
                <Col lg={4} md={6}>
                  <Card className="border-0 shadow-sm rounded-4 p-4 text-center h-100">
                    <h5 className="text-muted mb-2">Total System Users</h5>
                    <h2 className="fw-bolder text-dark">{adminStats.totalUsers}</h2>
                    <span className="small text-secondary">{adminStats.freelancers} Freelancers | {adminStats.clients} Clients</span>
                  </Card>
                </Col>
                <Col lg={4} md={6}>
                  <Card className="border-0 shadow-sm rounded-4 p-4 text-center h-100">
                    <h5 className="text-muted mb-2">Total Platform Volume</h5>
                    <h2 className="fw-bolder text-success">{adminStats.salesVolume} SC</h2>
                    <span className="small text-secondary">Completed escrows released</span>
                  </Card>
                </Col>
                <Col lg={4} md={6}>
                  <Card className="border-0 shadow-sm rounded-4 p-4 text-center h-100">
                    <h5 className="text-muted mb-2">Platform Fees Collected</h5>
                    <h2 className="fw-bolder text-danger">{adminStats.platformRevenue || 0} SC</h2>
                    <span className="small text-secondary">Flat 1% service fee on all bookings</span>
                  </Card>
                </Col>
                <Col lg={6} md={6}>
                  <Card className="border-0 shadow-sm rounded-4 p-4 text-center h-100">
                    <h5 className="text-muted mb-2">Hiring Orders Placed</h5>
                    <h2 className="fw-bolder text-primary">{adminStats.totalOrders}</h2>
                    <span className="small text-secondary">Total contracts in escrow</span>
                  </Card>
                </Col>
                <Col lg={6} md={6}>
                  <Card className="border-0 shadow-sm rounded-4 p-4 text-center h-100">
                    <h5 className="text-muted mb-2">Active Categories</h5>
                    <h2 className="fw-bolder text-info">{adminStats.categoriesCount}</h2>
                    <span className="small text-secondary">Gig classification groups</span>
                  </Card>
                </Col>
              </Row>
            )}

            <Col lg={3} className="mb-4">
              <Card className="border-0 shadow-sm rounded-4 p-3">
                <Nav variant="pills" className="flex-column gap-2">
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'admin-stats'} 
                      onClick={() => setActiveTab('admin-stats')}
                      className="fw-bold py-2 rounded-3"
                      style={{ cursor: 'pointer', backgroundColor: activeTab === 'admin-stats' ? '#ff5252' : 'transparent', color: activeTab === 'admin-stats' ? 'white' : '#495057' }}
                    >
                      📈 Platform Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'admin-users'} 
                      onClick={() => {
                        setActiveTab('admin-users');
                        fetchAdminUsers();
                      }}
                      className="fw-bold py-2 rounded-3"
                      style={{ cursor: 'pointer', backgroundColor: activeTab === 'admin-users' ? '#ff5252' : 'transparent', color: activeTab === 'admin-users' ? 'white' : '#495057' }}
                    >
                      👥 Manage Users List
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'admin-categories'} 
                      onClick={() => setActiveTab('admin-categories')}
                      className="fw-bold py-2 rounded-3"
                      style={{ cursor: 'pointer', backgroundColor: activeTab === 'admin-categories' ? '#ff5252' : 'transparent', color: activeTab === 'admin-categories' ? 'white' : '#495057' }}
                    >
                      ⚙️ Manage Categories
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'admin-sales'} 
                      onClick={() => {
                        setActiveTab('admin-sales');
                        fetchAdminOrders();
                      }}
                      className="fw-bold py-2 rounded-3"
                      style={{ cursor: 'pointer', backgroundColor: activeTab === 'admin-sales' ? '#ff5252' : 'transparent', color: activeTab === 'admin-sales' ? 'white' : '#495057' }}
                    >
                      🧾 Sales Records
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'wallet'} 
                      onClick={() => {
                        setActiveTab('wallet');
                        fetchWalletDetails();
                      }}
                      className="fw-bold py-2 rounded-3"
                      style={{ cursor: 'pointer', backgroundColor: activeTab === 'wallet' ? '#ff5252' : 'transparent', color: activeTab === 'wallet' ? 'white' : '#495057' }}
                    >
                      🪙 Sweeto Wallet ({wallet.balance} SC)
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card>
            </Col>

            <Col lg={9}>
              {activeTab === 'admin-stats' && (
                <Card className="border-0 shadow-sm rounded-4 p-4">
                  <h4 className="fw-bold mb-3">Admin Console</h4>
                  <p className="text-muted">Use the side tabs to verify freelancer college students, de-activate malicious accounts, or define service taxonomy categories.</p>
                  <div className="bg-light rounded-3 p-4 border text-center mt-3">
                    <span className="fs-1 d-block mb-2">🎓</span>
                    <h5>Sweeto University Academic Evaluation</h5>
                    <p className="text-secondary small mb-0">Project stores all categories, bookings, messages, and wallet accounts directly to your local file system (`users.json`, `orders.json`).</p>
                  </div>
                </Card>
              )}

              {activeTab === 'admin-users' && (
                <Card className="border-0 shadow-sm rounded-4 p-4">
                  <h4 className="fw-bold mb-3">Manage Users List</h4>
                  <div className="table-responsive">
                    <Table borderless className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>User</th>
                          <th>Role</th>
                          <th>Balance</th>
                          <th>Student Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminUsers.map(u => (
                          <tr key={u._id || u.id} className="border-bottom">
                            <td>
                              <div className="fw-bold text-dark">{u.name}</div>
                              <span className="small text-muted">{u.email}</span>
                            </td>
                            <td>
                              <Badge bg={u.role === 'admin' ? 'danger' : u.role === 'freelancer' ? 'success' : 'info'}>
                                {u.role.toUpperCase()}
                              </Badge>
                            </td>
                            <td>
                              {u.walletBalance || 0} SC
                              {u.role !== 'admin' && (
                                <Button 
                                  size="sm" 
                                  variant="link" 
                                  className="text-decoration-none p-0 ms-2"
                                  onClick={() => triggerBalanceEditModal(u)}
                                  style={{ fontSize: '0.85rem' }}
                                >
                                  ✏️ Edit
                                </Button>
                              )}
                            </td>
                            <td>
                              {u.role === 'freelancer' && u.freelancerType === 'student' ? (
                                u.isVerifiedStudent ? (
                                  <div className="d-flex align-items-center gap-2">
                                    <Badge bg="success">Verified Student 🎓</Badge>
                                    <Button size="sm" variant="outline-warning" className="py-0 px-2" style={{ fontSize: '0.75rem' }} onClick={() => handleApproveStudent(u._id || u.id, false)}>
                                      Unverify
                                    </Button>
                                  </div>
                                ) : (
                                  <Button size="sm" variant="warning" onClick={() => handleApproveStudent(u._id || u.id, true)}>
                                    Verify Student Email
                                  </Button>
                                )
                              ) : (
                                <span className="text-muted small">N/A</span>
                              )}
                            </td>
                            <td className="text-end">
                              {u.role !== 'admin' && (
                                <Button size="sm" variant="outline-danger" onClick={() => handleDeactivateUser(u._id || u.id)}>
                                  Deactivate
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card>
              )}

              {activeTab === 'admin-categories' && (
                <Card className="border-0 shadow-sm rounded-4 p-4">
                  <h4 className="fw-bold mb-4">Manage Service Categories</h4>
                  <Form onSubmit={handleAddCategory} className="mb-4 d-flex gap-2">
                    <Form.Control 
                      type="text" 
                      placeholder="Add new category (e.g. Content Writer)" 
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      required
                    />
                    <Button type="submit" variant="dark" disabled={creatingCat}>
                      {creatingCat ? 'Adding...' : 'Add'}
                    </Button>
                  </Form>

                  <h5 className="fw-bold text-dark mb-3">Active Taxonomies</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {adminCats.map((cat, idx) => (
                      <Badge key={idx} bg="light" text="dark" className="border px-3 py-2 fs-6 rounded-pill d-flex align-items-center gap-2">
                        {cat}
                        {cat !== 'Others' && (
                          <span style={{ cursor: 'pointer', color: '#ff5252' }} onClick={() => handleDeleteCategory(cat)}>×</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {activeTab === 'admin-sales' && (
                <Card className="border-0 shadow-sm rounded-4 p-4">
                  <h4 className="fw-bold mb-3">Sales & Bookings Registry</h4>
                  <p className="text-muted small">View all orders placed across the platform, track escrow statuses, and download invoices.</p>
                  {fetchingAdminOrders ? (
                    <p className="text-muted">Loading sales logs...</p>
                  ) : adminOrders.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <h5>No platform sales or bookings recorded yet.</h5>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table borderless className="align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Order ID</th>
                            <th>Client (Buyer)</th>
                            <th>Freelancer (Seller)</th>
                            <th>Package</th>
                            <th>Cost</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminOrders.map(order => (
                            <tr key={order._id || order.id} className="border-bottom">
                              <td>
                                <strong className="text-dark">#{(order._id || order.id).substring(0, 8).toUpperCase()}</strong>
                              </td>
                              <td>
                                <div className="fw-bold">{order.clientId?.name || 'Unknown Client'}</div>
                                <span className="text-muted small d-block">{order.clientId?.email || ''}</span>
                              </td>
                              <td>
                                <div className="fw-bold">{order.freelancerId?.name || 'Unknown Freelancer'}</div>
                                <span className="text-muted small d-block">{order.freelancerId?.email || ''}</span>
                              </td>
                              <td>
                                <Badge bg="dark" className="px-2 py-1">{order.packageTitle}</Badge>
                              </td>
                              <td className="fw-bold text-dark">{order.price}</td>
                              <td>{getStatusBadge(order.status)}</td>
                              <td className="text-secondary small">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="text-end">
                                <Button 
                                  size="sm" 
                                  variant="outline-danger" 
                                  className="fw-bold px-3 py-1 rounded-pill"
                                  onClick={() => handleDownloadInvoice(order)}
                                >
                                  📄 Download Bill
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card>
              )}

              {activeTab === 'wallet' && (
                <Card className="border-0 shadow-sm rounded-4 p-4">
                  <h4 className="fw-bold mb-2">Sweeto Credits Wallet</h4>
                  <p className="text-muted small">Manage your Sweeto Credits balance and track ledger entries.</p>

                  <div className="bg-light p-4 rounded-4 border text-center mb-4">
                    <h5 className="text-secondary mb-1">Available Credits Balance</h5>
                    <h1 className="fw-bolder text-dark">{wallet.balance} Credits</h1>
                  </div>

                  <Row className="g-4 mb-4">
                    <Col md={5}>
                      <Card className="border p-3 rounded-4 bg-white text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '180px' }}>
                        <span className="fs-2 mb-2">📈</span>
                        <h6 className="fw-bold mb-2 text-dark">Admin Revenue Stream</h6>
                        <p className="text-secondary small mb-0 px-2">
                          Administrator deposits are disabled. Platform revenue is generated strictly via the flat 1% booking commission fees.
                        </p>
                      </Card>
                    </Col>
                    <Col md={7}>
                      <Card className="border p-3 rounded-4 bg-white">
                        <h6 className="fw-bold mb-3 text-dark">Transaction Ledger History</h6>
                        {wallet.transactions.length === 0 ? (
                          <span className="text-muted small">No transactions logged.</span>
                        ) : (
                          <div style={{ maxHeight: '180px', overflowY: 'auto' }} className="pe-2">
                            {wallet.transactions.map((tx) => (
                              <div key={tx._id} className="d-flex justify-content-between align-items-start border-bottom py-2">
                                <div>
                                  <div className="fw-bold text-dark small">{tx.details}</div>
                                  <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>{new Date(tx.createdAt).toLocaleString()}</span>
                                </div>
                                <span className={`fw-bold small ${tx.type === 'deposit' || tx.type === 'escrow_release' || tx.type === 'escrow_refund' ? 'text-success' : 'text-danger'}`}>
                                  {tx.type === 'deposit' || tx.type === 'escrow_release' || tx.type === 'escrow_refund' ? '+' : '-'}{tx.amount} Credits
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    </Col>
                  </Row>
                </Card>
              )}
            </Col>
          </Row>
        )}

        {/* FREELANCER / CLIENT DASHBOARD */}
        {!isAdmin && (
          <Row>
            {/* Sidebar menu */}
            <Col lg={3} className="mb-4">
              <Card className="border-0 shadow-sm rounded-4 p-3">
                <Nav variant="pills" className="flex-column gap-2">
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'orders'} 
                      onClick={() => setActiveTab('orders')}
                      className="fw-bold py-2 rounded-3"
                      style={{ cursor: 'pointer', backgroundColor: activeTab === 'orders' ? '#ff5252' : 'transparent', color: activeTab === 'orders' ? 'white' : '#495057' }}
                    >
                      📁 {isFreelancer ? 'Client Bookings' : 'Hired Freelancers'}
                    </Nav.Link>
                  </Nav.Item>
                  {isFreelancer && (
                    <Nav.Item>
                      <Nav.Link 
                        active={activeTab === 'profile'} 
                        onClick={() => setActiveTab('profile')}
                        className="fw-bold py-2 rounded-3"
                        style={{ cursor: 'pointer', backgroundColor: activeTab === 'profile' ? '#ff5252' : 'transparent', color: activeTab === 'profile' ? 'white' : '#495057' }}
                      >
                        ⚙️ Manage Gig Profile
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'wallet'} 
                      onClick={() => {
                        setActiveTab('wallet');
                        fetchWalletDetails();
                      }}
                      className="fw-bold py-2 rounded-3"
                      style={{ cursor: 'pointer', backgroundColor: activeTab === 'wallet' ? '#ff5252' : 'transparent', color: activeTab === 'wallet' ? 'white' : '#495057' }}
                    >
                      🪙 Sweeto Wallet ({wallet.balance} Credits)
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card>
            </Col>

            {/* Dashboard content */}
            <Col lg={9}>
              {activeTab === 'orders' && (
                <Card className="border-0 shadow-sm rounded-4 p-4">
                  <h4 className="fw-bold mb-3">{isFreelancer ? 'Client Bookings' : 'Your Hires'}</h4>
                  {fetchingOrders ? (
                    <p className="text-muted">Loading bookings...</p>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <h5>No active orders yet.</h5>
                      {!isFreelancer && <p>Browse freelancer profiles on explore page to buy services.</p>}
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table borderless className="align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>{isFreelancer ? 'Client' : 'Freelancer'}</th>
                            <th>Package</th>
                            <th>Cost</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(order => (
                            <tr key={order._id} className="border-bottom">
                              <td>
                                <div className="fw-bold">
                                  {isFreelancer ? order.clientId?.name : order.freelancerId?.name}
                                </div>
                                <span className="text-muted small d-block">
                                  {isFreelancer ? order.clientId?.email : order.freelancerId?.email}
                                </span>
                                {isFreelancer && order.clientId?.phone && (
                                  <span className="text-secondary small">📞 {order.clientId.phone}</span>
                                )}
                              </td>
                              <td>
                                <Badge bg="dark" className="px-2 py-1">{order.packageTitle}</Badge>
                              </td>
                              <td className="fw-bold text-dark">{order.price}</td>
                              <td>{getStatusBadge(order.status)}</td>
                              <td className="text-end">
                                <Button size="sm" variant="outline-dark" className="me-2 fw-semibold" onClick={() => openChatBoard(order)}>
                                  💬 Workspace Chat
                                </Button>

                                {/* Freelancer actions */}
                                {isFreelancer && order.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="success" 
                                      className="me-2 fw-semibold"
                                      onClick={() => handleUpdateStatus(order._id, 'accepted')}
                                    >
                                      Accept
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline-danger" 
                                      className="fw-semibold"
                                      onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                                    >
                                      Decline
                                    </Button>
                                  </>
                                )}
                                {isFreelancer && order.status === 'accepted' && (
                                  <Button 
                                    size="sm" 
                                    variant="primary" 
                                    className="fw-semibold"
                                    onClick={() => handleUpdateStatus(order._id, 'completed')}
                                  >
                                    Complete
                                  </Button>
                                )}

                                {/* Client actions */}
                                {!isFreelancer && order.status === 'pending' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline-danger" 
                                    className="fw-semibold"
                                    onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                                  >
                                    Cancel Order
                                  </Button>
                                )}
                                {!isFreelancer && order.status === 'accepted' && (
                                  <Button 
                                    size="sm" 
                                    variant="success" 
                                    className="fw-semibold"
                                    onClick={() => triggerReviewModal(order)}
                                  >
                                    Mark Finished
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card>
              )}

              {activeTab === 'profile' && isFreelancer && (
                <Card className="border-0 shadow-sm rounded-4 p-4">
                  <h4 className="fw-bold mb-4">Manage Gig Profile</h4>
                  <Form onSubmit={handleProfileSubmit}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Gig Title</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="e.g., Logo Designer" 
                            value={profileData.title}
                            onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Pricing Rate</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="e.g., ₹800" 
                            value={profileData.price}
                            onChange={(e) => setProfileData({ ...profileData, price: e.target.value })}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Gig Classification Category</Form.Label>
                          <Form.Select 
                            value={profileData.category} 
                            onChange={(e) => setProfileData({ ...profileData, category: e.target.value, customCategory: '' })}
                          >
                            {categories.map((cat, idx) => (
                              <option key={idx} value={cat}>{cat}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      {profileData.category === 'Others' && (
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-danger">Custom Category Name</Form.Label>
                            <Form.Control 
                              type="text" 
                              placeholder="Write custom service category name..." 
                              value={profileData.customCategory}
                              onChange={(e) => setProfileData({ ...profileData, customCategory: e.target.value })}
                              required
                            />
                          </Form.Group>
                        </Col>
                      )}
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Avatar Image URL</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={profileData.avatar}
                        onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Bio / Description</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={4} 
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Skills (Comma-separated list)</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={profileData.skills}
                        onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Portfolio Projects (Comma-separated list)</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={profileData.portfolio}
                        onChange={(e) => setProfileData({ ...profileData, portfolio: e.target.value })}
                      />
                    </Form.Group>

                    <Button type="submit" style={{ backgroundColor: '#ff5252', borderColor: '#ff5252' }} className="fw-bold text-white px-4 py-2 border-0 shadow-sm">
                      Save Gig Changes
                    </Button>
                  </Form>
                </Card>
              )}

              {activeTab === 'wallet' && (
                <Card className="border-0 shadow-sm rounded-4 p-4">
                  <h4 className="fw-bold mb-2">Sweeto Credits Wallet</h4>
                  <p className="text-muted small">Secure credits transaction dashboard for account checkout and payments.</p>

                  <div className="bg-light p-4 rounded-4 border text-center mb-4">
                    <h5 className="text-secondary mb-1">Available Credits Balance</h5>
                    <h1 className="fw-bolder text-dark">{wallet.balance} Credits</h1>
                  </div>

                  <Row className="g-4 mb-4">
                    <Col md={5}>
                      <Card className="border p-3 rounded-4 bg-white">
                        <h6 className="fw-bold mb-3 text-dark">Add Sweeto Credits</h6>
                        <Form onSubmit={handleAddFunds}>
                          <Form.Group className="mb-3">
                            <Form.Control 
                              type="number" 
                              placeholder="Deposit amount (e.g. 2000)" 
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                              required
                            />
                          </Form.Group>
                          <Button type="submit" variant="dark" className="w-100 fw-bold" disabled={depositing}>
                            {depositing ? 'Processing...' : 'Deposit Sweeto Credits'}
                          </Button>
                        </Form>
                      </Card>
                    </Col>
                    <Col md={7}>
                      <Card className="border p-3 rounded-4 bg-white">
                        <h6 className="fw-bold mb-3 text-dark">Transaction Ledger History</h6>
                        {wallet.transactions.length === 0 ? (
                          <span className="text-muted small">No transactions logged.</span>
                        ) : (
                          <div style={{ maxHeight: '180px', overflowY: 'auto' }} className="pe-2">
                            {wallet.transactions.map((tx) => (
                              <div key={tx._id} className="d-flex justify-content-between align-items-start border-bottom py-2">
                                <div>
                                  <div className="fw-bold text-dark small">{tx.details}</div>
                                  <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>{new Date(tx.createdAt).toLocaleString()}</span>
                                </div>
                                <span className={`fw-bold small ${tx.type === 'deposit' || tx.type === 'escrow_release' || tx.type === 'escrow_refund' ? 'text-success' : 'text-danger'}`}>
                                  {tx.type === 'deposit' || tx.type === 'escrow_release' || tx.type === 'escrow_refund' ? '+' : '-'}{tx.amount} Credits
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    </Col>
                  </Row>
                </Card>
              )}
            </Col>
          </Row>
        )}
      </Container>

      {/* Discussion message board Modal */}
      <Modal show={!!chatBooking} onHide={() => setChatBooking(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            Project Workspace Chat #{chatBooking?._id.substring(0, 8)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="bg-light p-3 border-bottom">
            <span className="small text-secondary fw-semibold">Task description:</span>
            <p className="text-dark mb-0 small">{chatBooking?.details}</p>
          </div>
          
          <div style={{ height: '350px', overflowY: 'auto', backgroundColor: '#f8f9fa' }} className="p-4 d-flex flex-column gap-3">
            {fetchingChat ? (
              <p className="text-muted text-center py-5">Loading conversation logs...</p>
            ) : chatMessages.length === 0 ? (
              <p className="text-muted text-center py-5">Send your first message to begin coordinating details!</p>
            ) : (
              chatMessages.map(msg => (
                <div key={msg._id} className={`d-flex flex-column ${msg.senderId === user.id ? 'align-items-end' : 'align-items-start'}`}>
                  <div className={`p-3 rounded-3 max-w-75 shadow-sm ${msg.senderId === user.id ? 'bg-dark text-white' : 'bg-white text-dark border'}`}>
                    <span className="d-block fw-bold small mb-1" style={{ fontSize: '0.75rem' }}>{msg.senderName}</span>
                    <p className="mb-0 small">{msg.text}</p>
                  </div>
                  <span className="text-secondary small mt-1" style={{ fontSize: '0.7rem' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>

          <Form onSubmit={handleSendMessage} className="d-flex p-3 border-top bg-white">
            <Form.Control 
              type="text" 
              placeholder="Type your project update message..." 
              value={newMsgText}
              onChange={(e) => setNewMsgText(e.target.value)}
              className="me-2"
              required
            />
            <Button type="submit" variant="dark">Send</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Review Modal Dialog */}
      <Modal show={!!reviewBooking} onHide={() => setReviewBooking(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Mark Job Completed & Paid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small">Submitting this form releases the escrow payment of <strong>{reviewBooking?.price}</strong> to the freelancer and posts your public review rating.</p>
          <Form onSubmit={handleReviewSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Rating star score</Form.Label>
              <Form.Select value={reviewRating} onChange={(e) => setReviewRating(e.target.value)}>
                <option value={5}>⭐ ⭐ ⭐ ⭐ ⭐ (5 - Excellent)</option>
                <option value={4}>⭐ ⭐ ⭐ ⭐ (4 - Good)</option>
                <option value={3}>⭐ ⭐ ⭐ (3 - Satisfactory)</option>
                <option value={2}>⭐ ⭐ (2 - Poor)</option>
                <option value={1}>⭐ (1 - Terrible)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Feedback details comment</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Share your experience hiring this freelancer..." 
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
              />
            </Form.Group>

            <Button 
              type="submit" 
              className="w-100 py-2 fw-bold text-white border-0 shadow-sm"
              style={{ backgroundColor: '#ff5252' }}
              disabled={submittingReview}
            >
              {submittingReview ? 'Processing release...' : 'Submit Review & Release Funds'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {/* Edit Balance Modal Dialog */}
      <Modal show={!!editBalanceUser} onHide={() => setEditBalanceUser(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Adjust User Credits Balance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small">Update the Sweeto Credits balance for <strong>{editBalanceUser?.name}</strong> ({editBalanceUser?.email}).</p>
          <Form onSubmit={handleUpdateBalanceSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">New Credit Balance (SC)</Form.Label>
              <Form.Control 
                type="number" 
                min="0"
                placeholder="Enter credits amount..." 
                value={newBalanceValue}
                onChange={(e) => setNewBalanceValue(e.target.value)}
                required
              />
            </Form.Group>

            <Button 
              type="submit" 
              className="w-100 py-2 fw-bold text-white border-0 shadow-sm"
              style={{ backgroundColor: '#ff5252' }}
              disabled={updatingBalance}
            >
              {updatingBalance ? 'Updating...' : 'Save Credits Adjustment'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;
