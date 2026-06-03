import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['freelancer', 'client', 'admin'],
    required: true,
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  phone: {
    type: String,
    default: '',
  },
  
  // Client specific fields
  organization: {
    type: String,
    default: '',
  },
  clientType: {
    type: String,
    default: '', // 'local_business', 'student_club', 'university_dept', 'individual'
  },
  preferredSkills: {
    type: [String],
    default: [],
  },

  // Freelancer specific fields
  title: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: '',
  },
  freelancerType: {
    type: String,
    default: 'student', // 'student', 'professional'
  },
  isVerifiedStudent: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  price: {
    type: String,
    default: '₹500',
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  ratingsCount: {
    type: Number,
    default: 0,
  },
  ratingsSum: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  },
  portfolio: {
    type: [String],
    default: [],
  }
}, {
  timestamps: true,
});

export default mongoose.model('User', UserSchema);
