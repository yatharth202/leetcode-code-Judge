// main.js — Final Version (Stable & Auto Dashboard Refresh)
// Works with backend: authRoutes.js, problemRoutes.js, executeRoutes.js, submissions.js, statsRoutes.js



let appData = {
  currentUser: null,
  currentScreen: "loginScreen",
  problems: [],
  currentProblem: null,
  backendURL: "https://leetcode-code-judge-backend.onrender.com/api",

};

document.addEventListener("DOMContentLoaded", function () {
  setupButtons();
  startApp();
});


function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


/* ============================================================
   🔹 Setup Buttons
============================================================ */
function setupButtons() {
  // Navigation
  document.getElementById("goToSignup").addEventListener("click", (e) => {
    e.preventDefault();
    showScreen("signupScreen");
  });
  document.getElementById("goToLogin").addEventListener("click", (e) => {
    e.preventDefault();
    showScreen("loginScreen");
  });
  document.getElementById("goBack").addEventListener("click", (e) => {
    e.preventDefault();
    showScreen("problemsScreen");
  });

  // Forms
  document.getElementById("loginForm").addEventListener("submit", doLogin);
  document.getElementById("signupForm").addEventListener("submit", doSignup);

  // Code Editor Controls
  document.getElementById("langPicker").addEventListener("change", setDefaultCode);
  document.getElementById("clearCode").addEventListener("click", setDefaultCode);
  document.getElementById("testCode").addEventListener("click", () => runMyCode(false));
  document.getElementById("sendCode").addEventListener("click", () => runMyCode(true));

  // Editor behavior
  const codeBox = document.getElementById("codeBox");
  if (codeBox) {
    codeBox.addEventListener("input", updateLineNumbers);
    codeBox.addEventListener("scroll", syncScroll);
  }

  const dashBack = document.getElementById("dashboardBack");
  if (dashBack) {
    dashBack.addEventListener("click", (e) => {
      e.preventDefault();
      showScreen("problemsScreen");
    });
  }
}

/* ============================================================
   🔹 Screen Navigation
============================================================ */
function showScreen(screenName) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("show"));
  const screen = document.getElementById(screenName);
  if (screen) screen.classList.add("show");
  appData.currentScreen = screenName;

  if (screenName === "problemsScreen") {
    fetchProblems();
    updateUserButtons();
  }
}

/* ============================================================
   🔹 Authentication (Login / Signup)
============================================================ */
async function doLogin(e) {
  e.preventDefault();
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value.trim();

  if (!email || !password) return alert("Please fill in both fields.");

  try {
    const res = await fetch(`${appData.backendURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Login response:", data);

    if (res.ok) {
      // ✅ Save the logged-in user's info
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("authToken", data.token);

      appData.currentUser = { email: data.email, name: data.name };
      alert("Login successful!");
      showScreen("problemsScreen");
    } else {
      alert(data.message || "Invalid credentials.");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Server not responding.");
  }
}

async function doSignup(e) {
  e.preventDefault();
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("newEmail").value.trim();
  const password = document.getElementById("newPassword").value.trim();
  const confirm = document.getElementById("confirmPassword").value.trim();

  if (!name || !email || !password || !confirm)
    return alert("Please fill in all fields.");
  if (password !== confirm) return alert("Passwords do not match.");

  try {
    const res = await fetch(`${appData.backendURL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      alert("Signup successful! Please login.");
      showScreen("loginScreen");
    } else {
      alert(data.message || "Signup failed.");
    }
  } catch (err) {
    console.error("Signup error:", err);
    alert("Server not responding.");
  }
}

/* ============================================================
   🔹 Navbar: Login / Logout / Dashboard
============================================================ */
function updateUserButtons() {
  const userStuff = document.getElementById("userStuff");
  const email = localStorage.getItem("userEmail");

  if (email) {
    userStuff.innerHTML = `
      <span>Hi, ${email.split("@")[0]}</span>
      <button id="dashboardBtn" class="secondBtn">Dashboard</button>
      <button id="logoutBtn" class="secondBtn">Logout</button>
    `;

    document.getElementById("dashboardBtn").addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.clear();
      appData.currentUser = null;
      showScreen("loginScreen");
    });
  } else {
    userStuff.innerHTML = `
      <button id="topLoginBtn" class="secondBtn">Login</button>
      <button id="topSignupBtn" class="mainBtn">Sign Up</button>
    `;
    document.getElementById("topLoginBtn").addEventListener("click", () =>
      showScreen("loginScreen")
    );
    document.getElementById("topSignupBtn").addEventListener("click", () =>
      showScreen("signupScreen")
    );
  }
}

/* ============================================================
   🔹 Problems (Fetch + Display)
============================================================ */
async function fetchProblems() {
  const list = document.getElementById("problemsList");
  if (!list) return;
  list.innerHTML = "<p>Loading problems...</p>";

  try {
    // ✅ ADD AUTHORIZATION HEADER HERE
    const res = await fetch(`${appData.backendURL}/problems`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      list.innerHTML = `<p style="color:red;">Failed to load problems (${res.status})</p>`;
      return;
    }

    if (data.length === 0) {
      list.innerHTML = "<p>No problems available yet.</p>";
      return;
    }

    appData.problems = data;
    list.innerHTML = "";

    data.forEach((p) => {
      const card = document.createElement("div");
      card.className = "problemCard";
      card.innerHTML = `
        <div class="problemHead">
          <h3 class="problemTitle">${p.title}</h3>
          <span class="levelTag ${p.difficulty.toLowerCase()}Tag">${p.difficulty}</span>
        </div>
        <p class="problemDesc">${p.description}</p>
      `;
      card.addEventListener("click", () => openProblem(p));
      list.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading problems:", err);
    list.innerHTML = "<p style='color:red;'>Server error while loading problems.</p>";
  }
}


/* ============================================================
   🔹 Open Problem
============================================================ */
function openProblem(problem) {
  appData.currentProblem = problem;

  document.getElementById("problemName").textContent = problem.title;
  document.getElementById("problemText").innerHTML = `<p>${problem.description}</p>`;

  // ⭐ APPLY DIFFICULTY COLOR ⭐
  const level = document.getElementById("problemLevel");
  level.textContent = problem.difficulty;

  // reset classes
  level.className = "levelTag";

  // add correct tag color
  if (problem.difficulty.toLowerCase() === "easy") {
    level.classList.add("easyTag");
  } else if (problem.difficulty.toLowerCase() === "medium") {
    level.classList.add("mediumTag");
  } else if (problem.difficulty.toLowerCase() === "hard") {
    level.classList.add("hardTag");
  }

  setDefaultCode();
  document.getElementById("resultsContent").innerHTML =
    "<p>Test your code to see results</p>";

  showScreen("codingScreen");
}


/* ============================================================
   🔹 Code Editor
============================================================ */
function setDefaultCode() {
  const language = document.getElementById("langPicker").value;
  const defaults = {
    cpp: "// Write your C++ code here",
    java: "// Write your Java code here",
    javascript: "// Write your JavaScript code here",
    python: "# Write your Python code here",
  };
  document.getElementById("codeBox").value = defaults[language];
  updateLineNumbers();
}

function updateLineNumbers() {
  const codeBox = document.getElementById("codeBox");
  const lineCounter = document.querySelector(".lineCounter");
  const lines = codeBox.value.split("\n").length;
  lineCounter.innerHTML = "";
  for (let i = 1; i <= lines; i++) {
    const div = document.createElement("div");
    div.textContent = i;
    lineCounter.appendChild(div);
  }
}

function syncScroll() {
  document.querySelector(".lineCounter").scrollTop =
    document.getElementById("codeBox").scrollTop;
}

/* ============================================================
   🔹 Run / Submit Code (with Dashboard Auto-Refresh)
============================================================ */
async function runMyCode(isSubmit) {
  const resultTag = document.getElementById("resultTag");
  const resultsContent = document.getElementById("resultsContent");
  const code = document.getElementById("codeBox").value;
  const language = document.getElementById("langPicker").value;
  const problem = appData.currentProblem;

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  if (!problem) return alert("Please select a problem first.");

  resultTag.textContent = isSubmit ? "Testing..." : "Running...";
  resultsContent.innerHTML = `<p>${
    isSubmit ? "Running test cases..." : "Running your code..."
  }</p>`;

  try {
    // 🟦 SUBMIT (Run all testcases)
    if (isSubmit) {
      const res = await fetch(`${appData.backendURL}/execute/testcases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  // 🔐 JWT required
        },
        body: JSON.stringify({
          code,
          language,
          testCases: problem.testCases,
          problemTitle: problem.title,
          difficulty: problem.difficulty,
          userId,
          problemId: problem._id || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        resultTag.textContent = `${data.passed}/${data.total} Passed`;
        showTestResults(data.results);

        // 🟩 Save submission
        await fetch(`${appData.backendURL}/submissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            userId,
            problemId: problem._id,
            problemTitle: problem.title,
            difficulty: problem.difficulty,
            language,
            passedAll: data.passed === data.total,
            passedCases: data.passed,
            totalCases: data.total,
            code,
          }),
        });

        // Refresh dashboard
        if (window.location.href.includes("dashboard.html")) {
          await fetch(`${appData.backendURL}/stats/${userId}`);
          location.reload();
        }
      } else {
        resultTag.textContent = "Error";
        resultsContent.innerHTML = `<p>${data.message || "Execution error."}</p>`;
      }
    }

    // 🟦 RUN (Single example test)
    else {
      const res = await fetch(`${appData.backendURL}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          code,
          language,
          input: problem.exampleInput,
        }),
      });

      const data = await res.json();
      resultsContent.innerHTML = `<pre>${data.output}</pre>`;
    }
  } catch (err) {
    console.error(err);
    resultsContent.innerHTML = "<p>Server error.</p>";
  }
}


/* ============================================================
   🔹 Show Test Results
============================================================ */
function showTestResults(results) {
  const container = document.getElementById("resultsContent");
  container.innerHTML = results
    .map(
      (r) => `
      <div class="resultCard ${r.passed ? "passed" : "failed"}">
        <p><strong>Test ${r.caseNumber}:</strong> ${
          r.passed ? "✅ Passed" : "❌ Failed"
        }</p>
        <p><b>Input:</b> ${r.input}</p>
        <p><b>Expected:</b> ${r.expected}</p>
        <p><b>Output:</b> ${r.userOutput}</p>
      </div>`
    )
    .join("");
}

/* ============================================================
   🔹 App Start
============================================================ */
function startApp() {
  const token = localStorage.getItem("authToken");  
  const email = localStorage.getItem("userEmail");

  if (token && email) {
    // 🔐 User is already logged in (JWT exists)
    appData.currentUser = {
      email: email,
      name: email.split("@")[0],
    };

    showScreen("problemsScreen");  // Go directly to problems page
  } 
  else {
    // ❌ No token → logout state → show login page
    showScreen("loginScreen");
  }

  updateUserButtons();
}
