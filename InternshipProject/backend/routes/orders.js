import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { saveData } from '../utils/dbHelper.js';

const router = express.Router();

// Helper to parse numeric values from price string (e.g. "₹999" -> 999)
const parseNumericPrice = (priceStr) => {
  return parseFloat(priceStr.replace(/[^\d.]/g, '')) || 0;
};

// Helper to log transaction to memory
const logTransaction = (userId, amount, type, details) => {
  const tx = {
    _id: Math.random().toString(),
    userId,
    amount,
    type,
    details,
    createdAt: new Date()
  };
  global.transactionsMemory.push(tx);
  saveData('transactions.json', global.transactionsMemory);
  return tx;
};

// @route   POST /api/orders
// @desc    Create a new order (Hire a freelancer, place funds in escrow)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'client') {
    return res.status(403).json({ msg: 'Only clients can hire freelancers' });
  }

  const { freelancerId, packageTitle, price, details } = req.body;
  const numPrice = parseNumericPrice(price);

  if (global.isMockDB) {
    const freelancer = global.usersMemory.find(u => (u.id === freelancerId || u._id === freelancerId) && u.role === 'freelancer');
    if (!freelancer) {
      return res.status(404).json({ msg: 'Freelancer not found' });
    }

    const clientIndex = global.usersMemory.findIndex(u => u.id === req.user.id || u._id === req.user.id);
    if (clientIndex === -1) {
      return res.status(404).json({ msg: 'Client not found' });
    }

    const client = global.usersMemory[clientIndex];
    const clientBalance = client.walletBalance !== undefined ? client.walletBalance : 0;
    const fee = Math.round(numPrice * 0.01) || 1;
    const totalDeducted = numPrice + fee;

    if (clientBalance < totalDeducted) {
      return res.status(400).json({ 
        msg: `Insufficient Sweeto Credits. Price is ${price} + 1% Platform Fee (${fee} Credits), total needed: ${totalDeducted} Credits. Your wallet has ${clientBalance} Credits.` 
      });
    }

    // Deduct client balance (held in escrow + fee)
    client.walletBalance = clientBalance - totalDeducted;
    global.usersMemory[clientIndex] = client;

    // Credit platform fee to administrator
    const adminIndex = global.usersMemory.findIndex(u => u.role === 'admin');
    if (adminIndex !== -1) {
      const adminUser = global.usersMemory[adminIndex];
      adminUser.walletBalance = (adminUser.walletBalance || 0) + fee;
      global.usersMemory[adminIndex] = adminUser;
      
      // Log transaction for admin
      logTransaction(adminUser.id, fee, 'deposit', `Platform Fee collected from booking by ${client.name} (${packageTitle})`);
    }
    saveData('users.json', global.usersMemory);

    // Log transactions for client
    logTransaction(req.user.id, numPrice, 'hire_escrow', `Escrow held for hiring ${freelancer.name} (${packageTitle})`);
    logTransaction(req.user.id, fee, 'hire_escrow', `1% Platform Fee for hiring ${freelancer.name}`);

    const order = {
      _id: Math.random().toString(),
      clientId: { _id: client.id, name: client.name, email: client.email },
      freelancerId: { _id: freelancer.id, name: freelancer.name, email: freelancer.email, title: freelancer.title, avatar: freelancer.avatar },
      packageTitle,
      price,
      details,
      status: 'pending',
      escrowActive: true,
      reviewLeft: false,
      createdAt: new Date()
    };

    global.ordersMemory.push(order);
    saveData('orders.json', global.ordersMemory);

    return res.json(order);
  }

  try {
    const freelancer = await User.findOne({ _id: freelancerId, role: 'freelancer' });
    if (!freelancer) {
      return res.status(404).json({ msg: 'Freelancer not found' });
    }

    const client = await User.findById(req.user.id);
    if (!client) {
      return res.status(404).json({ msg: 'Client not found' });
    }

    const clientBalance = client.walletBalance || 0;
    const fee = Math.round(numPrice * 0.01) || 1;
    const totalDeducted = numPrice + fee;

    if (clientBalance < totalDeducted) {
      return res.status(400).json({ 
        msg: `Insufficient Sweeto Credits. Price is ${price} + 1% Platform Fee (${fee} Credits), total needed: ${totalDeducted} Credits. Your wallet has ${clientBalance} Credits.` 
      });
    }

    // Deduct client wallet
    client.walletBalance = clientBalance - totalDeducted;
    await client.save();

    // Credit platform fee to admin
    const adminUser = await User.findOne({ role: 'admin' });
    const Transaction = mongoose.model('Transaction');
    if (adminUser) {
      adminUser.walletBalance = (adminUser.walletBalance || 0) + fee;
      await adminUser.save();

      const txAdmin = new Transaction({
        userId: adminUser._id,
        amount: fee,
        type: 'deposit',
        details: `Platform Fee collected from booking by ${client.name} (${packageTitle})`
      });
      await txAdmin.save();
    }

    // Log transactions using MongoDB for client
    const txEscrow = new Transaction({
      userId: req.user.id,
      amount: numPrice,
      type: 'hire_escrow',
      details: `Escrow held for hiring ${freelancer.name} (${packageTitle})`
    });
    await txEscrow.save();

    const txFee = new Transaction({
      userId: req.user.id,
      amount: fee,
      type: 'hire_escrow',
      details: `1% Platform Fee for hiring ${freelancer.name}`
    });
    await txFee.save();

    const order = new Order({
      clientId: req.user.id,
      freelancerId,
      packageTitle,
      price,
      details,
      status: 'pending',
      escrowActive: true,
      reviewLeft: false
    });

    await order.save();
    
    const populatedOrder = await Order.findById(order._id)
      .populate('clientId', 'name email')
      .populate('freelancerId', 'name email title avatar');

    res.json(populatedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/orders
// @desc    Get all orders for the current user
router.get('/', auth, async (req, res) => {
  if (global.isMockDB) {
    let orders = [];
    if (req.user.role === 'client') {
      orders = global.ordersMemory.filter(o => 
        (o.clientId._id === req.user.id) || 
        (o.clientId.id === req.user.id)
      );
    } else {
      orders = global.ordersMemory.filter(o => 
        (o.freelancerId._id === req.user.id) || 
        (o.freelancerId.id === req.user.id)
      );
    }
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(orders);
  }

  try {
    let orders;
    if (req.user.role === 'client') {
      orders = await Order.find({ clientId: req.user.id })
        .populate('freelancerId', 'name email title avatar')
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ freelancerId: req.user.id })
        .populate('clientId', 'name email')
        .sort({ createdAt: -1 });
    }
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order status (Accept, Complete, Cancel)
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;

  if (!['accepted', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status update' });
  }

  if (global.isMockDB) {
    const index = global.ordersMemory.findIndex(o => o._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    const order = global.ordersMemory[index];
    const isClient = (order.clientId._id === req.user.id) || (order.clientId.id === req.user.id);
    const isFreelancer = (order.freelancerId._id === req.user.id) || (order.freelancerId.id === req.user.id);

    if (!isClient && !isFreelancer) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    if (status === 'accepted') {
      if (!isFreelancer) return res.status(403).json({ msg: 'Only the freelancer can accept the order' });
      if (order.status !== 'pending') return res.status(400).json({ msg: 'Order is not pending' });
    }

    const numPrice = parseNumericPrice(order.price);

    // Release escrow payout on complete
    if (status === 'completed') {
      if (!isFreelancer) return res.status(403).json({ msg: 'Only the freelancer can complete the order' });
      if (order.status !== 'accepted') return res.status(400).json({ msg: 'Order is not active' });

      // Payout freelancer
      const flId = order.freelancerId._id || order.freelancerId.id;
      const flIndex = global.usersMemory.findIndex(u => u.id === flId || u._id === flId);
      if (flIndex !== -1) {
        const freelancer = global.usersMemory[flIndex];
        const oldBalance = freelancer.walletBalance !== undefined ? freelancer.walletBalance : 5000;
        freelancer.walletBalance = oldBalance + numPrice;
        global.usersMemory[flIndex] = freelancer;
        saveData('users.json', global.usersMemory);

        // Log transaction for freelancer
        logTransaction(flId, numPrice, 'escrow_release', `Earnings received from order completion by ${order.clientId.name}`);
      }
      order.escrowActive = false;
    }

    // Refund client on cancel
    if (status === 'cancelled') {
      if (isClient && order.status !== 'pending') {
        return res.status(400).json({ msg: 'Clients can only cancel pending orders' });
      }
      
      // Return funds to client wallet
      const clId = order.clientId._id || order.clientId.id;
      const clIndex = global.usersMemory.findIndex(u => u.id === clId || u._id === clId);
      if (clIndex !== -1 && order.escrowActive) {
        const client = global.usersMemory[clIndex];
        const oldBalance = client.walletBalance !== undefined ? client.walletBalance : 5000;
        client.walletBalance = oldBalance + numPrice;
        global.usersMemory[clIndex] = client;
        saveData('users.json', global.usersMemory);

        // Log refund transaction
        logTransaction(clId, numPrice, 'escrow_refund', `Refund processed for cancelled order with ${order.freelancerId.name}`);
      }
      order.escrowActive = false;
    }

    order.status = status;
    global.ordersMemory[index] = order;
    saveData('orders.json', global.ordersMemory);
    return res.json(order);
  }

  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    const isClient = order.clientId.toString() === req.user.id;
    const isFreelancer = order.freelancerId.toString() === req.user.id;

    if (!isClient && !isFreelancer) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    if (status === 'accepted') {
      if (!isFreelancer) return res.status(403).json({ msg: 'Only the freelancer can accept' });
      if (order.status !== 'pending') return res.status(400).json({ msg: 'Order is not pending' });
    }

    const numPrice = parseNumericPrice(order.price);

    if (status === 'completed') {
      if (!isFreelancer) return res.status(403).json({ msg: 'Only the freelancer can complete' });
      if (order.status !== 'accepted') return res.status(400).json({ msg: 'Order is not active' });

      // Crediting Freelancer
      const freelancer = await User.findById(order.freelancerId);
      freelancer.walletBalance = (freelancer.walletBalance || 0) + numPrice;
      await freelancer.save();

      const Transaction = mongoose.model('Transaction');
      const tx = new Transaction({
        userId: order.freelancerId,
        amount: numPrice,
        type: 'escrow_release',
        details: 'Earnings released from finished task'
      });
      await tx.save();
      order.escrowActive = false;
    }

    if (status === 'cancelled') {
      if (isClient && order.status !== 'pending') {
        return res.status(400).json({ msg: 'Clients can only cancel pending bookings' });
      }

      if (order.escrowActive) {
        const client = await User.findById(order.clientId);
        client.walletBalance = (client.walletBalance || 0) + numPrice;
        await client.save();

        const Transaction = mongoose.model('Transaction');
        const tx = new Transaction({
          userId: order.clientId,
          amount: numPrice,
          type: 'escrow_refund',
          details: 'Refund credited for cancelled hire booking'
        });
        await tx.save();
      }
      order.escrowActive = false;
    }

    order.status = status;
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('clientId', 'name email')
      .populate('freelancerId', 'name email title avatar');

    res.json(populatedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
