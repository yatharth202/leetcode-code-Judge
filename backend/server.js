// backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// ✅ Import route files
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import executeRoutes from "./routes/executeRoutes.js";
import submissionsRoutes from "./routes/submissions.js";
import statsRoutes from "./routes/statsRoutes.js";

// ✅ Import Problem model (needed for seeding)
import Problem from "./models/Problem.js";

// ✅ Initialize environment & app
dotenv.config();
const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/stats", statsRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 CodePractice Backend is running perfectly!");
});

// ✅ MongoDB Connection Setup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Error: MONGO_URI not defined in .env file");
  process.exit(1);
}

/* ============================================================
   🧠 Auto-Seed Problems on Server Startup
   (runs once every time backend starts)
============================================================ */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ProblemRoutes from "./routes/problemRoutes.js";

// Dynamically import the seeding logic from routes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const problemRoutesFile = path.join(__dirname, "routes", "problemRoutes.js");

async function autoSeedProblems() {
  try {
    // Instead of hitting API manually, we’ll just call Mongo updates
    const { default: problemRouter } = await import("./routes/problemRoutes.js");
    const seedRoute = problemRouter.stack.find((r) => r.route?.path === "/seed");

    if (!seedRoute) {
      console.warn("⚠️ No /seed route found in problemRoutes.js");
      return;
    }

    // If route exists, just manually trigger seeding
    const fakeReq = {}, fakeRes = { json: (m) => console.log("✅ Auto-seed:", m) };
    await seedRoute.route.stack[0].handle(fakeReq, fakeRes);
  } catch (err) {
    console.error("❌ Auto-seed error:", err.message);
  }
}

/* ============================================================
   🚀 Connect to MongoDB & Start Server
============================================================ */
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully");

    // Run auto-seed once on startup
    await autoSeedProblems();

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

/* ============================================================
   🛑 Graceful Shutdown
============================================================ */
process.on("SIGINT", () => {
  console.log("\n🛑 Server shutting down...");
  mongoose.connection.close(() => {
    console.log("✅ MongoDB connection closed.");
    process.exit(0);
  });
});
