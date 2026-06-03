import express from 'express';
import auth from '../middleware/auth.js';
import { saveData } from '../utils/dbHelper.js';

const router = express.Router();

// Mock Category Schema for MongoDB if connected
import mongoose from 'mongoose';
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});
let Category;
try {
  Category = mongoose.model('Category');
} catch (e) {
  Category = mongoose.model('Category', CategorySchema);
}

// @route   GET /api/categories
// @desc    Get all categories
router.get('/', async (req, res) => {
  if (global.isMockDB) {
    return res.json(global.categoriesMemory);
  }

  try {
    const cats = await Category.find();
    res.json(cats.map(c => c.name));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/categories
// @desc    Add a new category (Admin or "Others" freelancer trigger)
router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ msg: 'Category name is required' });
  }

  if (global.isMockDB) {
    const exists = global.categoriesMemory.some(c => c.toLowerCase() === name.toLowerCase());
    if (exists) {
      return res.status(400).json({ msg: 'Category already exists' });
    }
    global.categoriesMemory.push(name);
    saveData('categories.json', global.categoriesMemory);
    return res.json({ name });
  }

  try {
    let cat = await Category.findOne({ name });
    if (cat) {
      return res.status(400).json({ msg: 'Category already exists' });
    }
    cat = new Category({ name });
    await cat.save();
    res.json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/categories/:name
// @desc    Delete a category (Admin only)
router.delete('/:name', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Authorization denied' });
  }

  const { name } = req.params;

  if (global.isMockDB) {
    global.categoriesMemory = global.categoriesMemory.filter(c => c !== name);
    saveData('categories.json', global.categoriesMemory);
    return res.json({ msg: 'Category deleted' });
  }

  try {
    await Category.findOneAndDelete({ name });
    res.json({ msg: 'Category deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
