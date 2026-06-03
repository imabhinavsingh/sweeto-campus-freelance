import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { saveData } from '../utils/dbHelper.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a user
router.post('/register', async (req, res) => {
  const { name, email, password, role, organization, clientType, phone, preferredSkills, freelancerType } = req.body;

  if (global.isMockDB) {
    let user = global.usersMemory.find(u => u.email === email);
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const randomId = Math.random().toString();
    user = {
      id: randomId,
      _id: randomId,
      name,
      email,
      password: hashedPassword,
      role,
      walletBalance: 0,
      phone: phone || '',
      createdAt: new Date()
    };

    if (role === 'freelancer') {
      user.title = 'New Campus Freelancer';
      user.bio = 'I am looking for freelance opportunities on campus.';
      user.price = '₹500';
      user.rating = 5.0;
      user.ratingsCount = 0;
      user.ratingsSum = 0;
      user.skills = [];
      user.portfolio = [];
      user.avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
      user.freelancerType = freelancerType || 'student';
      user.isVerifiedStudent = false;
    } else if (role === 'client') {
      user.organization = organization || '';
      user.clientType = clientType || 'individual';
      user.preferredSkills = preferredSkills || [];
    }

    global.usersMemory.push(user);
    saveData('users.json', global.usersMemory);

    const payload = {
      id: user.id,
      role: user.role
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'supersecretkeyforsweetocampusfreelanceportal',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      }
    );
    return;
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const newUserFields = {
      name,
      email,
      password,
      role,
      walletBalance: 0,
      phone: phone || ''
    };

    if (role === 'freelancer') {
      newUserFields.title = 'New Campus Freelancer';
      newUserFields.bio = 'I am looking for freelance opportunities on campus.';
      newUserFields.price = '₹500';
      newUserFields.freelancerType = freelancerType || 'student';
      newUserFields.isVerifiedStudent = false;
    } else if (role === 'client') {
      newUserFields.organization = organization || '';
      newUserFields.clientType = clientType || 'individual';
      newUserFields.preferredSkills = preferredSkills || [];
    }

    user = new User(newUserFields);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      id: user.id,
      role: user.role
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'supersecretkeyforsweetocampusfreelanceportal',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (global.isMockDB) {
    let user = global.usersMemory.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    let isMatch = false;
    if (user.password && user.password.startsWith('$2a$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = (password === 'admin123' || password === 'password' || user.password === password); // Permissive logic for presets
    }

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      id: user.id,
      role: user.role
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'supersecretkeyforsweetocampusfreelanceportal',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      }
    );
    return;
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      id: user.id,
      role: user.role
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'supersecretkeyforsweetocampusfreelanceportal',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/auth/me
// @desc    Get logged in user
router.get('/me', auth, async (req, res) => {
  if (global.isMockDB) {
    const user = global.usersMemory.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  }

  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
