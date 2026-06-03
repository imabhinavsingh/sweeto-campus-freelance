import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import { saveData } from '../utils/dbHelper.js';

const router = express.Router();

// Mock Transaction schema for MongoDB
import mongoose from 'mongoose';
const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  type: { type: String, enum: ['deposit', 'hire_escrow', 'escrow_release', 'escrow_refund'] },
  details: String,
  createdAt: { type: Date, default: Date.now }
});
let Transaction;
try {
  Transaction = mongoose.model('Transaction');
} catch (e) {
  Transaction = mongoose.model('Transaction', TransactionSchema);
}

// @route   GET /api/wallet
// @desc    Get user wallet details and transaction history
router.get('/', auth, async (req, res) => {
  if (global.isMockDB) {
    const user = global.usersMemory.find(u => u.id === req.user.id || u._id === req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    const userTransactions = global.transactionsMemory
      .filter(t => t.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
    return res.json({
      balance: user.walletBalance !== undefined ? user.walletBalance : 0,
      transactions: userTransactions
    });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const txs = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({
      balance: user.walletBalance || 0,
      transactions: txs
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/wallet/deposit
// @desc    Add mock funds to wallet
router.post('/deposit', auth, async (req, res) => {
  const { amount } = req.body;
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ msg: 'Valid deposit amount is required' });
  }

  if (global.isMockDB) {
    const index = global.usersMemory.findIndex(u => u.id === req.user.id || u._id === req.user.id);
    if (index === -1) return res.status(404).json({ msg: 'User not found' });

    const user = global.usersMemory[index];
    const oldBalance = user.walletBalance !== undefined ? user.walletBalance : 0;
    user.walletBalance = oldBalance + numAmount;
    global.usersMemory[index] = user;

    // Create transaction log
    const tx = {
      _id: Math.random().toString(),
      userId: req.user.id,
      amount: numAmount,
      type: 'deposit',
      details: 'Sweeto Credits Deposited',
      createdAt: new Date()
    };
    global.transactionsMemory.push(tx);

    saveData('users.json', global.usersMemory);
    saveData('transactions.json', global.transactionsMemory);

    return res.json({ balance: user.walletBalance, msg: 'Deposit successful!' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.walletBalance = (user.walletBalance || 0) + numAmount;
    await user.save();

    const tx = new Transaction({
      userId: req.user.id,
      amount: numAmount,
      type: 'deposit',
      details: 'Sweeto Credits Deposited'
    });
    await tx.save();

    res.json({ balance: user.walletBalance, msg: 'Deposit successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
export { Transaction };
