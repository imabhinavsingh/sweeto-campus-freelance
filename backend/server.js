import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import authRoutes from './routes/auth.js';
import gigRoutes from './routes/gigs.js';
import orderRoutes from './routes/orders.js';
import categoryRoutes from './routes/categories.js';
import adminRoutes from './routes/admin.js';
import walletRoutes from './routes/wallet.js';
import messageRoutes from './routes/messages.js';
import reviewRoutes from './routes/reviews.js';

import { loadData, saveData } from './utils/dbHelper.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Sweeto Campus Freelance API is running...');
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sweeto';

// Global memory stores for JSON database fallbacks
global.isMockDB = false;
global.usersMemory = [];
global.ordersMemory = [];
global.categoriesMemory = [];
global.transactionsMemory = [];
global.messagesMemory = [];
global.reviewsMemory = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seededFlagPath = path.join(__dirname, 'data', '.seeded');

// Helper to preseed initial JSON files on boot
const preseedMockDatabase = () => {
  // Load existing or initialize
  global.usersMemory = loadData('users.json', []);
  global.ordersMemory = loadData('orders.json', []);
  global.categoriesMemory = loadData('categories.json', [
    'Web Development',
    'Campus Photography',
    'Video Editing',
    'Graphic Design',
    'Writing',
    'Others'
  ]);
  global.transactionsMemory = loadData('transactions.json', []);
  global.messagesMemory = loadData('messages.json', []);
  global.reviewsMemory = loadData('reviews.json', []);

  // Pre-seed admin user if not present
  const adminExists = global.usersMemory.some(u => u.email === 'admin@sweeto.edu');
  if (!adminExists) {
    const salt = bcrypt.genSaltSync(10);
    const adminPasswordHash = bcrypt.hashSync('admin123', salt);
    const adminUser = {
      id: 'admin_root',
      _id: 'admin_root',
      name: 'Platform Admin',
      email: 'admin@sweeto.edu',
      password: adminPasswordHash,
      role: 'admin',
      walletBalance: 0,
      phone: '9998887770',
      createdAt: new Date()
    };
    global.usersMemory.push(adminUser);
    saveData('users.json', global.usersMemory);
  }

  // Pre-seed some default freelancer accounts ONLY if database has never been seeded
  if (!fs.existsSync(seededFlagPath)) {
    const defaultFreelancers = [
      { id: "1", _id: "1", name: "Rahul Sharma", email: "rahul@college.edu", role: "freelancer", walletBalance: 0, title: "Web Developer", price: "₹2000", rating: 4.8, bio: "Hi! I am a 3rd year B.Tech student specializing in building responsive React and Node.js web applications. I love helping local businesses set up their landing pages.", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=500&auto=format&fit=crop&q=60", skills: ["React", "Node.js", "MongoDB", "Express", "Bootstrap"], portfolio: ["College Club Web App", "Portfolio Site", "E-commerce Front-end"], freelancerType: "student", isVerifiedStudent: true, ratingsCount: 1, ratingsSum: 5, category: "Web Development" },
      { id: "2", _id: "2", name: "Priya Singh", email: "priya@college.edu", role: "freelancer", walletBalance: 0, title: "Event Photographer", price: "₹1500", rating: 4.9, bio: "Professional student photographer with 2+ years of experience shooting college cultural fests, sports events, and individual student portrait sessions.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60", skills: ["Lightroom", "Portrait photography", "Event Shoots", "Photoshop"], portfolio: ["Annual Fest Shoot 2025", "Graduation Portfolios", "Campus Cafe Promo Photos"], freelancerType: "student", isVerifiedStudent: false, ratingsCount: 0, ratingsSum: 0, category: "Campus Photography" },
      { id: "3", _id: "3", name: "Amit Kumar", email: "amit@college.edu", role: "freelancer", walletBalance: 0, title: "Video Editor", price: "₹1200", rating: 4.7, bio: "Self-taught video editor focusing on high-energy cinematic reels, promotional video edits, and YouTube vlogs. Fast turnaround time and revisions included.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60", skills: ["Premiere Pro", "After Effects", "Color Grading", "Reels Editing"], portfolio: ["Music Video Teaser", "Sports Meet Aftermovie", "Sponsorship Pitch Video"], freelancerType: "professional", isVerifiedStudent: false, ratingsCount: 0, ratingsSum: 0, category: "Video Editing" }
    ];

    defaultFreelancers.forEach(f => {
      if (!global.usersMemory.some(u => u.email === f.email)) {
        global.usersMemory.push(f);
      }
    });

    saveData('users.json', global.usersMemory);

    try {
      fs.writeFileSync(seededFlagPath, 'seeded', 'utf-8');
    } catch (err) {
      console.error('Failed to write .seeded file:', err);
    }
  }
};

// Always preseed the mock databases so files are populated for fallback use
preseedMockDatabase();

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.warn('Database connection failed (ECONNREFUSED). Falling back to In-Memory JSON file database storage.', err.message);
    global.isMockDB = true;
    app.listen(PORT, () => {
      console.log(`Server is running in JSON-file MOCK mode on port ${PORT}`);
    });
  });

// Force nodemon restart to reload fresh empty databases from disk
