// backend/models/Submission.js
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    // ✅ Reference to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Reference to Problem (optional fallback if deleted)
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      default: null,
    },

    // ✅ Store title redundantly for easier querying
    problemTitle: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ Difficulty (consistent with Problem model)
difficulty: {
  type: String,
  enum: ["Easy", "Medium", "Hard", "easy", "medium", "hard"], // ✅ Allow both cases
  required: true,
},


    // ✅ Programming language used
    language: {
      type: String,
      required: true,
      enum: ["cpp", "java", "javascript", "python"],
    },

    // ✅ Code-related performance info
    totalCases: {
      type: Number,
      default: 0,
      min: 0,
    },
    passedCases: {
      type: Number,
      default: 0,
      min: 0,
    },
    passedAll: {
      type: Boolean,
      default: false,
    },

    // ✅ Submitted code (can be large text)
    code: {
      type: String,
      default: "",
    },

    // ✅ Date of submission
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);
