const express = require("express");
const router = express.Router();
const Freelancer = require("../models/Freelancer");

// GET all freelancers
router.get("/", async (req, res) => {
    const freelancers = await Freelancer.find();
    res.json(freelancers);
});

module.exports = router;
