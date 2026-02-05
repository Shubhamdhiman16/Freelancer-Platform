const mongoose = require("mongoose");

const freelancerSchema = new mongoose.Schema({
    name: String,
    skill: String,
    price: Number
});

module.exports = mongoose.model("Freelancer", freelancerSchema);
