import express from 'express';
import { Freelancer } from '../models/Freelancer.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const freelancers = await Freelancer.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ created_at: -1 });

    const count = await Freelancer.countDocuments(query);

    res.json({ data: freelancers, count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
    if (!freelancer) {
      return res.status(404).json({ error: 'Freelancer not found' });
    }
    res.json(freelancer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const freelancer = new Freelancer({
      ...req.body,
      user_id: req.user.userId,
    });
    await freelancer.save();
    res.status(201).json(freelancer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const freelancer = await Freelancer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!freelancer) {
      return res.status(404).json({ error: 'Freelancer not found' });
    }
    res.json(freelancer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const freelancer = await Freelancer.findByIdAndDelete(req.params.id);
    if (!freelancer) {
      return res.status(404).json({ error: 'Freelancer not found' });
    }
    res.json({ message: 'Freelancer deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
