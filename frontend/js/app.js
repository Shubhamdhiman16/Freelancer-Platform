const API_URL = "http://localhost:5000/api";

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert("Login failed");
    }
  });
}

function loadFreelancers() {
  const token = localStorage.getItem("token");

  fetch(`${API_URL}/freelancer`, {
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("list");
    list.innerHTML = "";
    data.forEach(f => {
      const li = document.createElement("li");
      li.textContent = f.name + " - " + f.skill;
      list.appendChild(li);
    });
  });
}

