import express from 'express';
import auth from '../middleware/auth.js';
import Order from '../models/Order.js';
import { saveData } from '../utils/dbHelper.js';

const router = express.Router();

// Mock Message Schema for MongoDB
import mongoose from 'mongoose';
const MessageSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderName: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});
let Message;
try {
  Message = mongoose.model('Message');
} catch (e) {
  Message = mongoose.model('Message', MessageSchema);
}

// @route   GET /api/messages/:orderId
// @desc    Get discussion messages for an order
router.get('/:orderId', auth, async (req, res) => {
  const { orderId } = req.params;

  if (global.isMockDB) {
    const order = global.ordersMemory.find(o => o._id === orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    const isClient = (order.clientId._id === req.user.id) || (order.clientId.id === req.user.id);
    const isFreelancer = (order.freelancerId._id === req.user.id) || (order.freelancerId.id === req.user.id);

    if (!isClient && !isFreelancer && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to view messages' });
    }

    const chat = global.messagesMemory
      .filter(m => m.orderId === orderId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return res.json(chat);
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    const isClient = order.clientId.toString() === req.user.id;
    const isFreelancer = order.freelancerId.toString() === req.user.id;

    if (!isClient && !isFreelancer && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to view messages' });
    }

    const chat = await Message.find({ orderId }).sort({ createdAt: 1 });
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/messages/:orderId
// @desc    Send a message
router.post('/:orderId', auth, async (req, res) => {
  const { orderId } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ msg: 'Message text is required' });
  }

  if (global.isMockDB) {
    const order = global.ordersMemory.find(o => o._id === orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    const isClient = (order.clientId._id === req.user.id) || (order.clientId.id === req.user.id);
    const isFreelancer = (order.freelancerId._id === req.user.id) || (order.freelancerId.id === req.user.id);

    if (!isClient && !isFreelancer) {
      return res.status(401).json({ msg: 'Not authorized to send messages' });
    }

    const sender = global.usersMemory.find(u => u.id === req.user.id || u._id === req.user.id);

    const newMsg = {
      _id: Math.random().toString(),
      orderId,
      senderId: req.user.id,
      senderName: sender?.name || 'User',
      text,
      createdAt: new Date()
    };

    global.messagesMemory.push(newMsg);
    saveData('messages.json', global.messagesMemory);

    return res.json(newMsg);
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    const isClient = order.clientId.toString() === req.user.id;
    const isFreelancer = order.freelancerId.toString() === req.user.id;

    if (!isClient && !isFreelancer) {
      return res.status(401).json({ msg: 'Not authorized to send messages' });
    }

    const sender = await mongoose.model('User').findById(req.user.id);

    const newMsg = new Message({
      orderId,
      senderId: req.user.id,
      senderName: sender.name,
      text
    });

    await newMsg.save();
    res.json(newMsg);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
