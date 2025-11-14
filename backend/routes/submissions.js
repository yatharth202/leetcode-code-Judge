
import express from "express";
import Submission from "../models/Submission.js";
import {verifyToken} from "../middleware/authMiddleware.js";


const router = express.Router();


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

 
    const existingSubmission = await Submission.findOne({
      userId,
      problemId,
    });

    if (existingSubmission) {
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

    // new submission
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

    res.json({ message: "New submission saved successfully", submission });
  } catch (err) {
    console.error("submissions error:", err);
    res.status(500).json({ error: "Failed to save submission" });
  }
});

/* Fetching all submissions for a specific user */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const submissions = await Submission.find({ userId }).sort({ date: -1 });
    res.json(submissions);
  } catch (err) {
    console.error("fetch submissions error:", err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

export default router;
