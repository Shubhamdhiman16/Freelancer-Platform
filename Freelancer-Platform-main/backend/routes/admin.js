import express from 'express';
import { User } from '../models/User.js';
import { Freelancer } from '../models/Freelancer.js';
import { Report } from '../models/Report.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:userId/role', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFreelancers = await Freelancer.countDocuments();
    const totalReports = await Report.countDocuments();

    const freelancersByStatus = await Freelancer.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = {};
    freelancersByStatus.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    res.json({
      totalUsers,
      totalFreelancers,
      totalReports,
      freelancersByStatus: statusCounts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
