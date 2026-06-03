import express from 'express';
import auth from '../middleware/auth.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { saveData } from '../utils/dbHelper.js';

const router = express.Router();

// Mock Review Schema for MongoDB
import mongoose from 'mongoose';
const ReviewSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clientName: String,
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: Number, // 1 to 5
  comment: String,
  createdAt: { type: Date, default: Date.now }
});
let Review;
try {
  Review = mongoose.model('Review');
} catch (e) {
  Review = mongoose.model('Review', ReviewSchema);
}

// @route   POST /api/reviews/:orderId
// @desc    Submit rating and review feedback for a completed order
router.post('/:orderId', auth, async (req, res) => {
  const { orderId } = req.params;
  const { rating, comment } = req.body;
  const numRating = parseInt(rating, 10);

  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({ msg: 'Valid rating (1-5) is required' });
  }

  if (global.isMockDB) {
    // 1. Find Order
    const orderIdx = global.ordersMemory.findIndex(o => o._id === orderId);
    if (orderIdx === -1) return res.status(404).json({ msg: 'Order not found' });
    const order = global.ordersMemory[orderIdx];

    const isClient = (order.clientId._id === req.user.id) || (order.clientId.id === req.user.id);
    if (!isClient) return res.status(403).json({ msg: 'Only the hiring client can leave reviews' });
    if (order.status !== 'completed') return res.status(400).json({ msg: 'Cannot review incomplete orders' });
    if (order.reviewLeft) return res.status(400).json({ msg: 'Review already submitted' });

    // 2. Fetch Freelancer and Client
    const freelancerId = order.freelancerId._id || order.freelancerId.id;
    const flIdx = global.usersMemory.findIndex(u => u.id === freelancerId || u._id === freelancerId);
    if (flIdx === -1) return res.status(404).json({ msg: 'Freelancer not found' });
    const client = global.usersMemory.find(u => u.id === req.user.id || u._id === req.user.id);

    // 3. Update Freelancer ratings count
    const freelancer = global.usersMemory[flIdx];
    const rCount = freelancer.ratingsCount || 0;
    const rSum = freelancer.ratingsSum || 0;
    
    freelancer.ratingsCount = rCount + 1;
    freelancer.ratingsSum = rSum + numRating;
    freelancer.rating = parseFloat((freelancer.ratingsSum / freelancer.ratingsCount).toFixed(1));
    
    global.usersMemory[flIdx] = freelancer;

    // 4. Record Review
    if (!global.reviewsMemory) global.reviewsMemory = [];
    const review = {
      _id: Math.random().toString(),
      orderId,
      clientId: req.user.id,
      clientName: client?.name || 'Client',
      freelancerId,
      rating: numRating,
      comment: comment || '',
      createdAt: new Date()
    };
    global.reviewsMemory.push(review);

    // 5. Mark Order as Reviewed
    order.reviewLeft = true;
    global.ordersMemory[orderIdx] = order;

    saveData('users.json', global.usersMemory);
    saveData('orders.json', global.ordersMemory);
    saveData('reviews.json', global.reviewsMemory);

    return res.json({ msg: 'Review submitted successfully!', rating: freelancer.rating });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    const isClient = order.clientId.toString() === req.user.id;
    if (!isClient) return res.status(403).json({ msg: 'Only the hiring client can leave reviews' });
    if (order.status !== 'completed') return res.status(400).json({ msg: 'Cannot review incomplete orders' });
    if (order.reviewLeft) return res.status(400).json({ msg: 'Review already submitted' });

    const freelancer = await User.findById(order.freelancerId);
    if (!freelancer) return res.status(404).json({ msg: 'Freelancer not found' });
    
    const client = await User.findById(req.user.id);

    const newReview = new Review({
      orderId,
      clientId: req.user.id,
      clientName: client.name,
      freelancerId: order.freelancerId,
      rating: numRating,
      comment: comment || ''
    });
    await newReview.save();

    const rCount = freelancer.ratingsCount || 0;
    const rSum = freelancer.ratingsSum || 0;
    
    freelancer.ratingsCount = rCount + 1;
    freelancer.ratingsSum = rSum + numRating;
    freelancer.rating = parseFloat((freelancer.ratingsSum / freelancer.ratingsCount).toFixed(1));
    await freelancer.save();

    order.reviewLeft = true;
    await order.save();

    res.json({ msg: 'Review submitted successfully!', rating: freelancer.rating });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/reviews/freelancer/:id
// @desc    Get all reviews for a freelancer
router.get('/freelancer/:id', async (req, res) => {
  const freelancerId = req.params.id;

  if (global.isMockDB) {
    if (!global.reviewsMemory) global.reviewsMemory = [];
    const list = global.reviewsMemory
      .filter(r => r.freelancerId === freelancerId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(list);
  }

  try {
    const list = await Review.find({ freelancerId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
export { Review };
