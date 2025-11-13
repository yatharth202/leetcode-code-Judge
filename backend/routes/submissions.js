// routes/submissions.js
// Handles saving and retrieving user submissions

import express from "express";
import Submission from "../models/Submission.js";
import { verifyToken } from "../middleware/authMiddleware.js";


const router = express.Router();

/* ============================================================
   🧩 POST /api/submissions
   Save or update a user submission (prevents duplicates)
============================================================ */
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      userId,
      problemId,
      problemTitle,
      difficulty,
      language,
      passedAll,
      passedCases,
      totalCases,
      code,
    } = req.body;

    if (!userId || !problemTitle) {
      return res.status(400).json({ error: "Missing required fields (userId or problemTitle)" });
    }

    // ✅ Check if a submission for this user and problem already exists
    const existingSubmission = await Submission.findOne({
      userId,
      problemId,
    });

    if (existingSubmission) {
      // Update the existing one instead of creating a new record
      existingSubmission.language = language || existingSubmission.language;
      existingSubmission.passedAll = !!passedAll;
      existingSubmission.passedCases = passedCases || existingSubmission.passedCases;
      existingSubmission.totalCases = totalCases || existingSubmission.totalCases;
      existingSubmission.code = code || existingSubmission.code;
      existingSubmission.difficulty = difficulty?.toLowerCase() || existingSubmission.difficulty;
      existingSubmission.date = new Date();

      await existingSubmission.save();

      return res.json({ message: "✅ Submission updated successfully", submission: existingSubmission });
    }

    // 🆕 Otherwise create a new submission
    const submission = new Submission({
      userId,
      problemId: problemId || null,
      problemTitle,
      difficulty: difficulty?.toLowerCase() || "unknown",
      language: language || "cpp",
      passedAll: !!passedAll,
      passedCases: passedCases || 0,
      totalCases: totalCases || 0,
      code: code || "",
      date: new Date(),
    });

    await submission.save();

    res.json({ message: "✅ New submission saved successfully", submission });
  } catch (err) {
    console.error("❌ submissions error:", err);
    res.status(500).json({ error: "Failed to save submission" });
  }
});

/* ============================================================
   🧠 GET /api/submissions/:userId
   Fetch all submissions for a specific user
============================================================ */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const submissions = await Submission.find({ userId }).sort({ date: -1 });
    res.json(submissions);
  } catch (err) {
    console.error("❌ fetch submissions error:", err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

export default router;
