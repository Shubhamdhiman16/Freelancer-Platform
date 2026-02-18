import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddFreelancer = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
    hourlyRate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    // Get token from localStorage (saved after login)
    const token = localStorage.getItem("authToken");

    const response = await fetch("http://localhost:5001/api/freelancers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ include token here
      },
      body: JSON.stringify({
        ...formData,
        hourlyRate: Number(formData.hourlyRate),
        skills: formData.skills.split(",").map((skill) => skill.trim()),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to add freelancer");
    }

    alert("Freelancer added successfully!");
    navigate("/dashboard");
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Freelancer
        </h2>

        {error && (
          <div className="bg-red-500 text-white p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          />

          <input
            type="number"
            name="hourlyRate"
            placeholder="Hourly Rate"
            value={formData.hourlyRate}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold"
          >
            {loading ? "Adding..." : "Add Freelancer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFreelancer;
