// backend/models/Problem.js
import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Problem title is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Problem description is required"],
    },
    difficulty: {
      type: String,
      required: [true, "Difficulty level is required"],
      enum: ["Easy", "Medium", "Hard"], // ✅ prevents typos
    },
    exampleInput: {
      type: String,
      default: "",
    },
    exampleOutput: {
      type: String,
      default: "",
    },
    testCases: [
      {
        input: {
          type: String,
          required: true,
        },
        output: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Problem", problemSchema);
