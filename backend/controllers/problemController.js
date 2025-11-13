// backend/controllers/problemController.js
import Problem from "../models/Problem.js";

// ✅ Create initial problems (this can be moved to seeding later)
export const seedProblems = async (req, res) => {
  try {
    const problems = [
      {
        title: "Two Sum",
        description: "Find two numbers that add up to the target.",
        difficulty: "Easy",
        exampleInput: "[2,7,11,15], target = 9",
        exampleOutput: "[0,1]",
        testCases: [
          { input: "[2,7,11,15],9", expectedOutput: "[0,1]" },
          { input: "[3,2,4],6", expectedOutput: "[1,2]" },
          { input: "[1,5,3,7,9],10", expectedOutput: "[2,3]" },
          { input: "[0,4,3,0],0", expectedOutput: "[0,3]" },
          { input: "[1,-2,3,-4,-5],-6", expectedOutput: "[1,4]" },
          { input: "[1,2,4,3,4,5],6", expectedOutput: "[1,3]" },
          { input: "[5,25,75],100", expectedOutput: "[1,2]" },
          { input: "[9,8,7,6,5],11", expectedOutput: "[3,4]" },
          { input: "[10,20,10,40,50,60,70],50", expectedOutput: "[0,3]" },
          { input: "[4,4],8", expectedOutput: "[0,1]" }
        ]
      },

      // ✅ Added: Valid Parentheses problem
      {
        title: "Valid Parentheses",
        description:
          "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed in the correct order.",
        difficulty: "Easy",
        exampleInput: "\"()[]{}\"",
        exampleOutput: "true",
        testCases: [
          { input: "\"()[]{}\"", expectedOutput: "true" },
          { input: "\"()\"", expectedOutput: "true" },
          { input: "\"(]\"", expectedOutput: "false" },
          { input: "\"([)]\"", expectedOutput: "false" },
          { input: "\"{[]}\"", expectedOutput: "true" },
          { input: "\"(((((\"", expectedOutput: "false" },
          { input: "\"\"", expectedOutput: "true" },
          { input: "\"[{()}]\"", expectedOutput: "true" },
          { input: "\"[({)]\"", expectedOutput: "false" },
          { input: "\"(((((())))))\"", expectedOutput: "true" }
        ]
      },
      {
  title: "Reverse Number",
  description:
    "Given an integer n, reverse its digits and return the reversed number. If n is negative, keep the sign.",
  difficulty: "Medium",
  exampleInput: "123",
  exampleOutput: "321",
  testCases: [
    { input: "123", expectedOutput: "321" },
    { input: "-123", expectedOutput: "-321" },
    { input: "400", expectedOutput: "4" },
    { input: "0", expectedOutput: "0" },
    { input: "1000", expectedOutput: "1" },
    { input: "9876", expectedOutput: "6789" },
    { input: "-9876", expectedOutput: "-6789" },
    { input: "111", expectedOutput: "111" },
    { input: "120", expectedOutput: "21" },
    { input: "900090", expectedOutput: "90009" }
  ]
}

    ];

    // Clear old data and insert fresh problems
    await Problem.deleteMany();
    await Problem.insertMany(problems);

    res.status(201).json({ message: "Problems seeded successfully!" });
  } catch (error) {
    console.error("Error seeding problems:", error);
    res.status(500).json({ error: "Failed to seed problems" });
  }
};

// ✅ Get all problems
export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
};

// ✅ Get single problem by ID
export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    res.json(problem);
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({ error: "Failed to fetch problem" });
  }
};
