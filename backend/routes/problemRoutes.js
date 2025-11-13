// backend/routes/problemRoutes.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Problem from "../models/Problem.js";

const router = express.Router();

/* ============================================================
   🧠 SEED Problems (auto-update if already exists)
   - All test cases use a consistent shape: { input: "...", output: "..." }
   - Call: GET /api/problems/seed
============================================================ */
router.get("/seed", async (req, res) => {
  try {
    const problems = [
      // 1 Two Sum
      {
        title: "Two Sum",
        description: "Find two numbers that add up to the target.",
        difficulty: "Easy",
        exampleInput: "[2,7,11,15], target = 9",
        exampleOutput: "[0,1]",
        starterCode: `
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "[2,7,11,15], target=9", output: "[0,1]" },
          { input: "[3,2,4], target=6", output: "[1,2]" },
          { input: "[1,5,3,7,9], target=10", output: "[2,3]" },
          { input: "[0,4,3,0], target=0", output: "[0,3]" },
          { input: "[1,-2,3,-4,-5], target=-6", output: "[1,3]" },
          { input: "[1,2,4,3,4,5], target=6", output: "[1,2]" },
          { input: "[5,25,75], target=100", output: "[1,2]" },
          { input: "[9,8,7,6,5], target=11", output: "[3,4]" },
          { input: "[10,20,10,40,50,60,70], target=50", output: "[0,3]" },
          { input: "[4,4], target=8", output: "[0,1]" }
        ],
      },

      // 2 Reverse Number
      {
        title: "Reverse Number",
        description:
          "Given an integer n, reverse its digits and return the reversed number. If n is negative, keep the sign.",
        difficulty: "Medium",
        exampleInput: "123",
        exampleOutput: "321",
        starterCode: `
class Solution {
public:
    int reverseNumber(int n) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "123", output: "321" },
          { input: "400", output: "4" },
          { input: "-123", output: "-321" },
          { input: "0", output: "0" },
          { input: "1000", output: "1" },
          { input: "9876", output: "6789" },
          { input: "-9876", output: "-6789" },
          { input: "111", output: "111" },
          { input: "120", output: "21" },
          { input: "900090", output: "90009" }
        ],
      },

      // 3 Valid Parentheses
      {
        title: "Valid Parentheses",
        description: "Check if a string of parentheses is valid.",
        difficulty: "Easy",
        exampleInput: "\"()[]{}\"",
        exampleOutput: "true",
        starterCode: `
class Solution {
public:
    bool isValid(string s) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "\"()[]{}\"", output: "true" },
          { input: "\"(]\"", output: "false" },
          { input: "\"([{}])\"", output: "true" },
          { input: "\"((\"", output: "false" },
          { input: "\"()\"", output: "true" },
          { input: "\"{[()]}\",", output: "true" },
          { input: "\"([)]\"", output: "false" },
          { input: "\"\"", output: "true" },
          { input: "\"[\"", output: "false" },
          { input: "\"]\"", output: "false" }
        ],
      },

      // 4 Palindrome Number
      {
        title: "Palindrome Number",
        description:
          "Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.",
        difficulty: "Easy",
        exampleInput: "121",
        exampleOutput: "true",
        starterCode: `
class Solution {
public:
    bool isPalindrome(int x) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "121", output: "true" },
          { input: "-121", output: "false" },
          { input: "10", output: "false" },
          { input: "0", output: "true" },
          { input: "1221", output: "true" },
          { input: "12321", output: "true" },
          { input: "1001", output: "true" },
          { input: "100", output: "false" },
          { input: "99", output: "true" },
          { input: "123456", output: "false" }
        ],
      },

      // 5 Fibonacci Number
      {
        title: "Fibonacci Number",
        description:
          "Return the nth Fibonacci number. F(0)=0, F(1)=1, and F(n)=F(n−1)+F(n−2) for n>1.",
        difficulty: "Easy",
        exampleInput: "5",
        exampleOutput: "5",
        starterCode: `
class Solution {
public:
    int fib(int n) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "0", output: "0" },
          { input: "1", output: "1" },
          { input: "2", output: "1" },
          { input: "3", output: "2" },
          { input: "5", output: "5" },
          { input: "7", output: "13" },
          { input: "10", output: "55" },
          { input: "12", output: "144" },
          { input: "15", output: "610" },
          { input: "20", output: "6765" }
        ],
      },

      // 6 Factorial of N
      {
        title: "Factorial of N",
        description:
          "Find the factorial of a given number n. Factorial of n (n!) = n × (n−1) × ... × 1.",
        difficulty: "Easy",
        exampleInput: "5",
        exampleOutput: "120",
        starterCode: `
class Solution {
public:
    long long factorial(int n) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "0", output: "1" },
          { input: "1", output: "1" },
          { input: "2", output: "2" },
          { input: "3", output: "6" },
          { input: "4", output: "24" },
          { input: "5", output: "120" },
          { input: "6", output: "720" },
          { input: "7", output: "5040" },
          { input: "8", output: "40320" },
          { input: "10", output: "3628800" }
        ],
      },

      // 7 Check Prime
      {
        title: "Check Prime",
        description:
          "Determine whether a number n is a prime number. Return true if it is prime, false otherwise.",
        difficulty: "Easy",
        exampleInput: "7",
        exampleOutput: "true",
        starterCode: `
class Solution {
public:
    bool isPrime(int n) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "2", output: "true" },
          { input: "3", output: "true" },
          { input: "4", output: "false" },
          { input: "5", output: "true" },
          { input: "10", output: "false" },
          { input: "11", output: "true" },
          { input: "13", output: "true" },
          { input: "15", output: "false" },
          { input: "19", output: "true" },
          { input: "21", output: "false" }
        ],
      },

      // 8 Power of Two
      {
        title: "Power of Two",
        description:
          "Determine whether a given number n is a power of two. Return true if it is, false otherwise.",
        difficulty: "Easy",
        exampleInput: "8",
        exampleOutput: "true",
        starterCode: `
class Solution {
public:
    bool isPowerOfTwo(int n) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "1", output: "true" },
          { input: "2", output: "true" },
          { input: "3", output: "false" },
          { input: "4", output: "true" },
          { input: "5", output: "false" },
          { input: "8", output: "true" },
          { input: "16", output: "true" },
          { input: "18", output: "false" },
          { input: "32", output: "true" },
          { input: "64", output: "true" }
        ],
      },

      // 9 Sum of Digits
      {
        title: "Sum of Digits",
        description: "Find the sum of digits of a given integer n.",
        difficulty: "Easy",
        exampleInput: "1234",
        exampleOutput: "10",
        starterCode: `
class Solution {
public:
    int sumOfDigits(int n) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "0", output: "0" },
          { input: "5", output: "5" },
          { input: "10", output: "1" },
          { input: "99", output: "18" },
          { input: "1234", output: "10" },
          { input: "5678", output: "26" },
          { input: "1001", output: "2" },
          { input: "9999", output: "36" },
          { input: "12345", output: "15" },
          { input: "808", output: "16" }
        ],
      },

      // 10 Count Vowels
      {
        title: "Count Vowels",
        description: "Count the number of vowels (a, e, i, o, u) in a given string.",
        difficulty: "Easy",
        exampleInput: "\"hello world\"",
        exampleOutput: "3",
        starterCode: `
class Solution {
public:
    int countVowels(string s) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "\"hello\"", output: "2" },
          { input: "\"world\"", output: "1" },
          { input: "\"aeiou\"", output: "5" },
          { input: "\"bcdfg\"", output: "0" },
          { input: "\"Apples\"", output: "2" },
          { input: "\"Programming\"", output: "3" },
          { input: "\"Queue\"", output: "4" },
          { input: "\"xyz\"", output: "0" },
          { input: "\"Education\"", output: "5" },
          { input: "\"AI and Data Science\"", output: "7" }
        ],
      },

      // 11 Maximum Element in Array
      {
        title: "Maximum Element in Array",
        description: "Find the maximum element in a given array of integers.",
        difficulty: "Easy",
        exampleInput: "[1, 3, 7, 0, 5]",
        exampleOutput: "7",
        starterCode: `
class Solution {
public:
    int maxElement(vector<int>& nums) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "[1,2,3,4,5]", output: "5" },
          { input: "[5,4,3,2,1]", output: "5" },
          { input: "[-1,-2,-3,-4]", output: "-1" },
          { input: "[100,200,300]", output: "300" },
          { input: "[0]", output: "0" },
          { input: "[10,10,10]", output: "10" },
          { input: "[1,3,7,0,5]", output: "7" },
          { input: "[999,888,777]", output: "999" },
          { input: "[4,5,6,7,8,9]", output: "9" },
          { input: "[1000,-100,50]", output: "1000" }
        ],
      },

      // 12 GCD of Two Numbers
      {
        title: "GCD of Two Numbers",
        description: "Find the greatest common divisor (GCD) of two numbers.",
        difficulty: "Easy",
        exampleInput: "54,24",
        exampleOutput: "6",
        starterCode: `
class Solution {
public:
    int gcd(int a, int b) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "54,24", output: "6" },
          { input: "12,8", output: "4" },
          { input: "100,80", output: "20" },
          { input: "81,27", output: "27" },
          { input: "17,13", output: "1" },
          { input: "25,5", output: "5" },
          { input: "0,10", output: "10" },
          { input: "48,18", output: "6" },
          { input: "56,98", output: "14" },
          { input: "270,192", output: "6" }
        ],
      },

      // 13 Armstrong Number
      {
        title: "Armstrong Number",
        description: "Check whether a number n is an Armstrong number.",
        difficulty: "Medium",
        exampleInput: "153",
        exampleOutput: "true",
        starterCode: `
class Solution {
public:
    bool isArmstrong(int n) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "0", output: "true" },
          { input: "1", output: "true" },
          { input: "153", output: "true" },
          { input: "370", output: "true" },
          { input: "371", output: "true" },
          { input: "407", output: "true" },
          { input: "123", output: "false" },
          { input: "9474", output: "true" },
          { input: "9475", output: "false" },
          { input: "1634", output: "true" }
        ],
      },

      // 14 Count Digits in a Number
      {
        title: "Count Digits in a Number",
        description: "Count the total number of digits in a given integer n.",
        difficulty: "Easy",
        exampleInput: "12345",
        exampleOutput: "5",
        starterCode: `
class Solution {
public:
    int countDigits(int n) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "0", output: "1" },
          { input: "5", output: "1" },
          { input: "10", output: "2" },
          { input: "99", output: "2" },
          { input: "1000", output: "4" },
          { input: "12345", output: "5" },
          { input: "-1234", output: "4" },
          { input: "100000", output: "6" },
          { input: "999999", output: "6" },
          { input: "1000000", output: "7" }
        ],
      },

      // 15 Leap Year Checker
      {
        title: "Leap Year Checker",
        description: "Determine whether a given year is a leap year.",
        difficulty: "Easy",
        exampleInput: "2000",
        exampleOutput: "true",
        starterCode: `
class Solution {
public:
    bool isLeapYear(int year) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "2000", output: "true" },
          { input: "1900", output: "false" },
          { input: "2020", output: "true" },
          { input: "2021", output: "false" },
          { input: "2016", output: "true" },
          { input: "2018", output: "false" },
          { input: "2400", output: "true" },
          { input: "2100", output: "false" },
          { input: "1600", output: "true" },
          { input: "1800", output: "false" }
        ],
      },

      // 16 Even or Odd
      {
        title: "Even or Odd",
        description: "Determine whether a number is even or odd.",
        difficulty: "Easy",
        exampleInput: "7",
        exampleOutput: "odd",
        starterCode: `
class Solution {
public:
    string evenOrOdd(int n) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "0", output: "even" },
          { input: "1", output: "odd" },
          { input: "2", output: "even" },
          { input: "3", output: "odd" },
          { input: "10", output: "even" },
          { input: "99", output: "odd" },
          { input: "100", output: "even" },
          { input: "-3", output: "odd" },
          { input: "-8", output: "even" },
          { input: "15", output: "odd" }
        ],
      },

      // 17 Sum of Array Elements
      {
        title: "Sum of Array Elements",
        description: "Find the sum of all elements in an integer array.",
        difficulty: "Easy",
        exampleInput: "[1,2,3,4,5]",
        exampleOutput: "15",
        starterCode: `
class Solution {
public:
    long long sumArray(vector<int>& nums) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "[1,2,3,4,5]", output: "15" },
          { input: "[10,20,30]", output: "60" },
          { input: "[0,0,0]", output: "0" },
          { input: "[1]", output: "1" },
          { input: "[-1,1]", output: "0" },
          { input: "[5,5,5,5]", output: "20" },
          { input: "[-5,-10,-15]", output: "-30" },
          { input: "[100,200,300]", output: "600" },
          { input: "[7,14,21]", output: "42" },
          { input: "[2,4,6,8,10]", output: "30" }
        ],
      },

      // 18 Count Words in String
      {
        title: "Count Words in String",
        description: "Count the total number of words in a given string.",
        difficulty: "Easy",
        exampleInput: "\"Hello world\"",
        exampleOutput: "2",
        starterCode: `
class Solution {
public:
    int countWords(string s) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "\"Hello world\"", output: "2" },
          { input: "\"One two three\"", output: "3" },
          { input: "\"AI\"", output: "1" },
          { input: "\"AI and Data Science\"", output: "4" },
          { input: "\"\"", output: "0" },
          { input: "\"   space test   \"", output: "2" },
          { input: "\"multiple   spaces  test\"", output: "3" },
          { input: "\"Count me in\"", output: "3" },
          { input: "\"word\"", output: "1" },
          { input: "\"This is a test case\"", output: "5" }
        ],
      },

      // 19 Reverse String
      {
        title: "Reverse String",
        description: "Reverse a given string input.",
        difficulty: "Easy",
        exampleInput: "\"hello\"",
        exampleOutput: "\"olleh\"",
        starterCode: `
class Solution {
public:
    string reverseString(string s) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "\"hello\"", output: "\"olleh\"" },
          { input: "\"abc\"", output: "\"cba\"" },
          { input: "\"a\"", output: "\"a\"" },
          { input: "\"racecar\"", output: "\"racecar\"" },
          { input: "\"AI\"", output: "\"IA\"" },
          { input: "\"world\"", output: "\"dlrow\"" },
          { input: "\"openai\"", output: "\"ianepo\"" },
          { input: "\"data\"", output: "\"atad\"" },
          { input: "\"science\"", output: "\"ecneics\"" },
          { input: "\"12345\"", output: "\"54321\"" }
        ],
      },

      // 20 Palindrome String
      {
        title: "Palindrome String",
        description: "Check whether a string is a palindrome.",
        difficulty: "Easy",
        exampleInput: "\"madam\"",
        exampleOutput: "true",
        starterCode: `
class Solution {
public:
    bool isPalindrome(string s) {
        // Write your code here
    }
};
        `,
        testCases: [
          { input: "\"madam\"", output: "true" },
          { input: "\"racecar\"", output: "true" },
          { input: "\"hello\"", output: "false" },
          { input: "\"a\"", output: "true" },
          { input: "\"abba\"", output: "true" },
          { input: "\"abca\"", output: "false" },
          { input: "\"Madam\"", output: "false" },
          { input: "\"noon\"", output: "true" },
          { input: "\"palindrome\"", output: "false" },
          { input: "\"level\"", output: "true" }
        ],
      }
    ];

    // Upsert each problem by title — this will add new or update existing
    for (const problem of problems) {
      await Problem.findOneAndUpdate(
        { title: problem.title },
        { $set: problem },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    return res.json({ message: "✅ Problems seeded/updated successfully", count: problems.length });
  } catch (err) {
    console.error("❌ Error seeding problems:", err);
    return res.status(500).json({ message: "Error seeding problems", error: err.message });
  }
});

/* ============================================================
   📚 Get all problems (with optional difficulty filter)
============================================================ */
router.get("/", verifyToken, async (req, res) => {

  try {
    const { difficulty } = req.query;
    let query = {};
    if (difficulty) query.difficulty = new RegExp(`^${difficulty}$`, "i"); // case-insensitive
    const problems = await Problem.find(query).sort({ difficulty: 1, title: 1 });
    res.json(problems);
  } catch (error) {
    console.error("❌ Error fetching problems:", error);
    res.status(500).json({ message: "Error fetching problems" });
  }
});

/* ============================================================
   🔍 Get problem by ID
============================================================ */
router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.json(problem);
  } catch (error) {
    console.error("❌ Error fetching problem by ID:", error);
    res.status(500).json({ message: "Error fetching problem" });
  }
});

export default router;
