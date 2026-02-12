import mongoose from 'mongoose';

const freelancerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: String,
  skills: [String],
  hourly_rate: Number,
  experience_years: Number,
  bio: String,
  portfolio_url: String,
  availability: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending',
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Freelancer = mongoose.model('Freelancer', freelancerSchema);
