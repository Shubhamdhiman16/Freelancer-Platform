const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
const freelancerRoutes = require("./routes/freelancerRoutes");
app.use("/api/freelancers", freelancerRoutes);

// db
mongoose.connect("mongodb://127.0.0.1:27017/freelancerDB")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.listen(5000, () => {
    console.log("Server running on port 5000 🚀");
});
