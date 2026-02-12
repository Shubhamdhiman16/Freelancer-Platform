import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  type: {
    type: String,
    enum: ['freelancers', 'earnings', 'activity', 'performance'],
    required: true,
  },
  data: mongoose.Schema.Types.Mixed,
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Report = mongoose.model('Report', reportSchema);
