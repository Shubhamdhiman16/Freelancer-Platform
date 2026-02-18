import express from "express";
import { Freelancer } from "../models/Freelancer.js";
import { authMiddleware } from "../middleware/auth.js"; // middleware to check JWT

const router = express.Router();

// GET all freelancers
router.get("/", async (req, res) => {
  try {
    const freelancers = await Freelancer.find().sort({ createdAt: -1 });
    res.json({ data: freelancers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new freelancer
router.post("/", authMiddleware, async (req, res) => {
  try {
    const freelancerData = {
      ...req.body,
      hourly_rate: req.body.hourlyRate || req.body.hourly_rate,
      status: req.body.status || 'active', // Set to active by default
      total_projects: req.body.total_projects || 0,
    };
    delete freelancerData.hourlyRate; // Remove the wrong key
    const freelancer = new Freelancer(freelancerData);
    await freelancer.save();
    res.status(201).json(freelancer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
