import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import executeRoutes from "./routes/executeRoutes.js";
import submissionsRoutes from "./routes/submissions.js";
import statsRoutes from "./routes/statsRoutes.js";
import Problem from "./models/Problem.js";


dotenv.config();
const app = express();


app.use(
  cors({
    origin: [
      "https://relaxed-naiad-270eac.netlify.app",
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Preflight support
app.options("*", cors());


app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/stats", statsRoutes);


app.get("/", (req, res) => {
  res.send("CodePractice Backend is running perfectly!");
});


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(" Error: MONGO_URI not defined in .env file");
  process.exit(1);
}

/*
   AutoSeed 
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ProblemRoutes from "./routes/problemRoutes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const problemRoutesFile = path.join(__dirname, "routes", "problemRoutes.js");

async function autoSeedProblems() {
  try {
    const { default: problemRouter } = await import("./routes/problemRoutes.js");
    const seedRoute = problemRouter.stack.find((r) => r.route?.path === "/seed");

    if (!seedRoute) {
      console.warn("No /seed route found in problemRoutes.js");
      return;
    }


    const fakeReq = {}, fakeRes = { json: (m) => console.log("Auto-seed:", m) };
    await seedRoute.route.stack[0].handle(fakeReq, fakeRes);
  } catch (err) {
    console.error("Auto-seed error:", err.message);
  }
}


mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected Successfully");

    // Run auto-seed once on startup
    await autoSeedProblems();

    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });


process.on("SIGINT", () => {
  console.log("\n Server shutting down...");
  mongoose.connection.close(() => {
    console.log(" MongoDB connection closed.");
    process.exit(0);
  });
});
