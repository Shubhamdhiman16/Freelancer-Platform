import express from 'express';
import { Setting } from '../models/Setting.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find().sort({ key: 1 });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:key', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const setting = await Setting.findOneAndUpdate(
      { key: req.params.key },
      {
        ...req.body,
        updated_by: req.user.userId,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:key', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const setting = await Setting.findOneAndDelete({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json({ message: 'Setting deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
