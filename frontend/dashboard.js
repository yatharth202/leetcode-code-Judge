// dashboard.js — fetches user stats from backend and displays personal dashboard
const backendURL = "http://localhost:5000/api"; // change to deployed backend URL

document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");

  if (!userId || !userEmail) {
    alert("Please login first!");
    window.location.href = "index.html";
    return;
  }

  // Attach logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });

  // Load user stats
  loadDashboard(userId);
});

async function loadDashboard(userId) {
  try {
    const token = localStorage.getItem("authToken");

    const res = await fetch(`${backendURL}/stats/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`  // 🔐 Add JWT
      }
    });

    const data = await res.json();

    document.getElementById("totalSolved").textContent = data.totalSolved || 0;
    document.getElementById("accuracy").textContent = data.accuracy
      ? `${data.accuracy}%`
      : "0%";
    document.getElementById("easyCount").textContent =
      data.difficultyCounts?.easy || 0;
    document.getElementById("mediumCount").textContent =
      data.difficultyCounts?.medium || 0;
    document.getElementById("hardCount").textContent =
      data.difficultyCounts?.hard || 0;

    const recentDiv = document.getElementById("recentSubs");
    recentDiv.innerHTML = "";

    if (!data.recent || data.recent.length === 0) {
      recentDiv.innerHTML = "<p>No recent submissions yet.</p>";
      return;
    }

    data.recent.forEach((s) => {
      const div = document.createElement("div");
      div.className = `submissionCard ${s.passedAll ? "passed" : "failed"}`;
      div.innerHTML = `
        <div><strong>${s.problemTitle}</strong> (${s.difficulty})</div>
        <div>${s.passedAll ? "✅ Passed" : "❌ Failed"} — ${s.language}</div>
        <div><small>${new Date(s.date).toLocaleString()}</small></div>
      `;
      recentDiv.appendChild(div);
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    document.getElementById("statsWrapper").innerHTML =
      "<p>Failed to load stats. Try again later.</p>";
  }
}

