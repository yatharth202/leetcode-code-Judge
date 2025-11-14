
import express from "express";
import Submission from "../models/Submission.js";
import { verifyToken } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    
    const submissions = await Submission.find({ userId }).sort({ date: -1 }).lean();

    if (!submissions.length) {
      return res.json({
        totalSolved: 0,
        totalSubmissions: 0,
        passedSubmissions: 0,
        accuracy: 0,
        difficultyCounts: { easy: 0, medium: 0, hard: 0 },
        recent: [],
      });
    }

   
    const solvedSet = new Set();
    for (const s of submissions) {
      if (s.passedAll) {
        const key = s.problemId ? String(s.problemId) : "title:" + s.problemTitle;
        solvedSet.add(key);
      }
    }
    const totalSolved = solvedSet.size;

   
    const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
    const counted = new Set();
    for (const s of submissions) {
      if (!s.passedAll) continue;
      const key = s.problemId ? String(s.problemId) : "title:" + s.problemTitle;
      if (counted.has(key)) continue;
      counted.add(key);

      const d = (s.difficulty || "unknown").toLowerCase();
      if (difficultyCounts[d] !== undefined) difficultyCounts[d]++;
    }

   
    const totalSubmissions = submissions.length;
    const passedSubmissions = submissions.filter((s) => s.passedAll).length;
    const accuracy = totalSubmissions === 0
      ? 0
      : Math.round((passedSubmissions / totalSubmissions) * 100);

   
    const recent = submissions.slice(0, 10).map((s) => ({
      problemId: s.problemId || null,
      problemTitle: s.problemTitle,
      difficulty: s.difficulty || "unknown",
      language: s.language,
      passedAll: s.passedAll,
      passedCases: s.passedCases,
      totalCases: s.totalCases,
      date: s.date,
    }));

 
    res.json({
      totalSolved,
      totalSubmissions,
      passedSubmissions,
      accuracy,
      difficultyCounts,
      recent,
    });

  } catch (err) {
    console.error("statsRoutes error:", err);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

export default router;
