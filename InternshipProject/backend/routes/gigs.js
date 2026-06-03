import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { saveData } from '../utils/dbHelper.js';

const router = express.Router();

// @route   GET /api/gigs
// @desc    Get all freelancers (gigs)
router.get('/', async (req, res) => {
  if (global.isMockDB) {
    const freelancers = global.usersMemory
      .filter(u => u.role === 'freelancer')
      .map(({ password, ...rest }) => rest);
    return res.json(freelancers);
  }

  try {
    const freelancers = await User.find({ role: 'freelancer' }).select('-password');
    res.json(freelancers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/gigs/:id
// @desc    Get freelancer profile by ID
router.get('/:id', async (req, res) => {
  if (global.isMockDB) {
    const freelancer = global.usersMemory.find(u => (u.id === req.params.id || u._id === req.params.id) && u.role === 'freelancer');
    if (!freelancer) {
      return res.status(404).json({ msg: 'Freelancer profile not found' });
    }
    const { password, ...rest } = freelancer;
    return res.json(rest);
  }

  try {
    const freelancer = await User.findOne({ _id: req.params.id, role: 'freelancer' }).select('-password');
    if (!freelancer) {
      return res.status(404).json({ msg: 'Freelancer profile not found' });
    }
    res.json(freelancer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Freelancer profile not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/gigs/profile
// @desc    Update current freelancer's gig profile details
router.put('/profile', auth, async (req, res) => {
  if (req.user.role !== 'freelancer') {
    return res.status(403).json({ msg: 'Only freelancers can update their gig profiles' });
  }

  const { title, bio, skills, price, avatar, portfolio, category } = req.body;

  // Build profile object
  const profileFields = {};
  if (title !== undefined) profileFields.title = title;
  if (bio !== undefined) profileFields.bio = bio;
  if (skills !== undefined) profileFields.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
  if (price !== undefined) profileFields.price = price;
  if (avatar !== undefined) profileFields.avatar = avatar;
  if (portfolio !== undefined) profileFields.portfolio = portfolio;
  if (category !== undefined) profileFields.category = category;

  if (global.isMockDB) {
    const index = global.usersMemory.findIndex(u => u.id === req.user.id || u._id === req.user.id);
    if (index === -1) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const updatedUser = {
      ...global.usersMemory[index],
      ...profileFields
    };
    global.usersMemory[index] = updatedUser;
    saveData('users.json', global.usersMemory);

    const { password, ...rest } = updatedUser;
    return res.json(rest);
  }

  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
