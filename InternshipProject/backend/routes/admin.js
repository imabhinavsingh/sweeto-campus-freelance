import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { saveData } from '../utils/dbHelper.js';

const router = express.Router();

// Admin verification middleware helper
const adminCheck = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Administrator privileges required.' });
  }
  next();
};

// @route   GET /api/admin/stats
// @desc    Get dashboard analytics (Total users, category types, escrow payouts)
router.get('/stats', [auth, adminCheck], async (req, res) => {
  if (global.isMockDB) {
    const totalUsers = global.usersMemory.length;
    const freelancers = global.usersMemory.filter(u => u.role === 'freelancer').length;
    const clients = global.usersMemory.filter(u => u.role === 'client').length;
    const totalOrders = global.ordersMemory.length;
    const categoriesCount = global.categoriesMemory.length;

    const salesVolume = global.ordersMemory
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => {
        const amt = parseInt(o.price.replace(/[^\d]/g, ''), 10) || 0;
        return sum + amt;
      }, 0);

    const platformRevenue = global.ordersMemory.reduce((sum, o) => {
      const amt = parseInt(o.price.replace(/[^\d]/g, ''), 10) || 0;
      return sum + (Math.round(amt * 0.01) || 1);
    }, 0);

    return res.json({
      totalUsers,
      freelancers,
      clients,
      totalOrders,
      salesVolume,
      platformRevenue,
      categoriesCount
    });
  }

  try {
    const totalUsers = await User.countDocuments();
    const freelancers = await User.countDocuments({ role: 'freelancer' });
    const clients = await User.countDocuments({ role: 'client' });
    const totalOrders = await Order.countDocuments();
    
    // Sum completed order amounts
    const completedOrders = await Order.find({ status: 'completed' });
    const salesVolume = completedOrders.reduce((sum, o) => {
      const amt = parseInt(o.price.replace(/[^\d]/g, ''), 10) || 0;
      return sum + amt;
    }, 0);

    const allOrders = await Order.find();
    const platformRevenue = allOrders.reduce((sum, o) => {
      const amt = parseInt(o.price.replace(/[^\d]/g, ''), 10) || 0;
      return sum + (Math.round(amt * 0.01) || 1);
    }, 0);

    // Categories model import
    const Category = mongoose.model('Category');
    const categoriesCount = await Category.countDocuments();

    res.json({
      totalUsers,
      freelancers,
      clients,
      totalOrders,
      salesVolume,
      platformRevenue,
      categoriesCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/users
// @desc    Fetch all users registry (Client & Freelancers list)
router.get('/users', [auth, adminCheck], async (req, res) => {
  if (global.isMockDB) {
    const usersList = global.usersMemory.map(({ password, ...rest }) => rest);
    return res.json(usersList);
  }

  try {
    const usersList = await User.find().select('-password');
    res.json(usersList);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/users/:id/verify
// @desc    Verify/unverify student status for a freelancer
router.put('/users/:id/verify', [auth, adminCheck], async (req, res) => {
  const { id } = req.params;
  const { verify } = req.body;
  const shouldVerify = verify !== undefined ? verify : true;

  if (global.isMockDB) {
    const index = global.usersMemory.findIndex(u => u.id === id || u._id === id);
    if (index === -1) return res.status(404).json({ msg: 'User not found' });
    
    global.usersMemory[index].isVerifiedStudent = shouldVerify;
    saveData('users.json', global.usersMemory);
    
    const { password, ...rest } = global.usersMemory[index];
    return res.json(rest);
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.isVerifiedStudent = shouldVerify;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete/deactivate a user account
router.delete('/users/:id', [auth, adminCheck], async (req, res) => {
  const { id } = req.params;

  if (global.isMockDB) {
    global.usersMemory = global.usersMemory.filter(u => u.id !== id && u._id !== id);
    saveData('users.json', global.usersMemory);
    return res.json({ msg: 'User successfully deactivated' });
  }

  try {
    await User.findByIdAndDelete(id);
    res.json({ msg: 'User successfully deactivated' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/orders
// @desc    Fetch all orders registry in the system
router.get('/orders', [auth, adminCheck], async (req, res) => {
  if (global.isMockDB) {
    return res.json(global.ordersMemory);
  }

  try {
    const ordersList = await Order.find()
      .populate('clientId', 'name email')
      .populate('freelancerId', 'name email title avatar')
      .sort({ createdAt: -1 });
    res.json(ordersList);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/users/:id/balance
// @desc    Admin adjusts a user's wallet balance manually
router.put('/users/:id/balance', [auth, adminCheck], async (req, res) => {
  const { id } = req.params;
  const { balance } = req.body;
  const newBalance = parseFloat(balance);

  if (isNaN(newBalance) || newBalance < 0) {
    return res.status(400).json({ msg: 'Valid positive balance amount is required' });
  }

  if (global.isMockDB) {
    const index = global.usersMemory.findIndex(u => u.id === id || u._id === id);
    if (index === -1) return res.status(404).json({ msg: 'User not found' });
    
    const user = global.usersMemory[index];
    const oldBalance = user.walletBalance !== undefined ? user.walletBalance : 0;
    const diff = newBalance - oldBalance;

    user.walletBalance = newBalance;
    global.usersMemory[index] = user;
    saveData('users.json', global.usersMemory);

    if (diff !== 0) {
      // Log transaction adjustment
      const tx = {
        _id: Math.random().toString(),
        userId: user.id,
        amount: Math.abs(diff),
        type: diff > 0 ? 'deposit' : 'escrow_release',
        details: `Admin Balance Adjustment: ${diff > 0 ? '+' : '-'}${Math.abs(diff)} Credits`,
        createdAt: new Date()
      };
      global.transactionsMemory.push(tx);
      saveData('transactions.json', global.transactionsMemory);
    }

    const { password, ...rest } = user;
    return res.json(rest);
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const oldBalance = user.walletBalance || 0;
    const diff = newBalance - oldBalance;

    user.walletBalance = newBalance;
    await user.save();

    if (diff !== 0) {
      const mongoose = (await import('mongoose')).default;
      const Transaction = mongoose.model('Transaction');
      const tx = new Transaction({
        userId: user._id,
        amount: Math.abs(diff),
        type: diff > 0 ? 'deposit' : 'escrow_release',
        details: `Admin Balance Adjustment: ${diff > 0 ? '+' : '-'}${Math.abs(diff)} Credits`
      });
      await tx.save();
    }

    const { password, ...rest } = user.toObject();
    res.json(rest);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
