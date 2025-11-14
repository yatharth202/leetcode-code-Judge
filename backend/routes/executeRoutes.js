

import express from "express";
import axios from "axios";
import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
import { verifyToken } from "../middleware/authMiddleware.js";



const router = express.Router();


const PISTON_URL = "https://emkc.org/api/v2/piston/execute";


const langVersions = {
  cpp: { language: "cpp", version: "10.2.0" },
  java: { language: "java", version: "15.0.2" },
  python: { language: "python", version: "3.10.0" },
  javascript: { language: "javascript", version: "18.15.0" },
};


function wrapCode(language, code, inputData = "", problemTitle = "") {
 
  const isSubmit = inputData === "" || inputData === undefined || inputData === null;

  if (language !== "cpp") return code;
  const title = (problemTitle || "").toLowerCase();

  
// Two Sum
if (title.includes("two sum")) {
    let nums = "{2,7,11,15}";
    let target = 9;

    try {
        const numsMatch = inputData.match(/\[(.*?)\]/);
        const targetMatch = inputData.match(/target\s*=?\s*(-?\d+)/);
        if (numsMatch) nums = `{${numsMatch[1]}}`;
        if (targetMatch) target = targetMatch[1];
    } catch {}

    return `
#include <bits/stdc++.h>
using namespace std;

${code}

int main() {
    Solution obj;
    vector<int> nums = ${nums};
    int target = ${target};
    vector<int> result = obj.twoSum(nums, target);

    if (!result.empty())
        cout << "[" << result[0] << "," << result[1] << "]";
    else
        cout << "[]";

    return 0;
}`;
}





if (title.toLowerCase().includes("reverse number")) {
  let n = 0;
  try {
    const match = inputData.match(/-?\d+/);
    if (match) n = parseInt(match[0]);
  } catch {}

  return `
#include <bits/stdc++.h>
using namespace std;

${code}

int main() {
    Solution obj;
    int n = ${n};
    cout << obj.reverseNumber(n);
    return 0;
}`;
}


  //  Valid Parentheses
if (title.includes("valid parentheses")) {
  let s = "()";
  try {
    const match = inputData.match(/"([^"]+)"|'([^']+)'/);
    if (match) s = match[1] || match[2];
  } catch {}
  const escaped = s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    string s = "${escaped}";
    cout << (obj.isValid(s) ? "true" : "false");
    return 0;
}`;
}

// Palindrome Number
if (title.includes("palindrome number")) {
  let n = 0;
  try { n = parseInt(inputData.trim()); } catch {}
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    int n = ${n};
    cout << (obj.isPalindrome(n) ? "true" : "false");
    return 0;
}`;
}

// Fibonacci Number
if (title.includes("fibonacci number")) {
  let n = 0;
  try { n = parseInt(inputData.trim()); } catch {}
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    int n = ${n};
    cout << obj.fib(n);
    return 0;
}`;
}

// Factorial of N
if (title.includes("factorial")) {
  let n = 0;
  try { n = parseInt(inputData.trim()); } catch {}
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    int n = ${n};
    cout << obj.factorial(n);
    return 0;
}`;
}

// Check Prime
if (title.includes("check prime")) {
  let n = 0;
  try { n = parseInt(inputData.trim()); } catch {}
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    int n = ${n};
    cout << (obj.isPrime(n) ? "true" : "false");
    return 0;
}`;
}

// Power of Two
if (title.includes("power of two")) {
  let n = 0;
  try { n = parseInt(inputData.trim()); } catch {}
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    int n = ${n};
    cout << (obj.isPowerOfTwo(n) ? "true" : "false");
    return 0;
}`;
}

// Sum of Digits
if (title.includes("sum of digits")) {
  let n = 0;
  try { n = parseInt(inputData.trim()); } catch {}
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    int n = ${n};
    cout << obj.sumOfDigits(n);
    return 0;
}`;
}

// Count Vowels
if (title.includes("count vowels")) {
  let s = inputData.trim();


  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  const escaped = s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');


  return `
#include <bits/stdc++.h>
using namespace std;

${code}

int main() {
    Solution obj;
    string s = "${escaped}";
    cout << obj.countVowels(s) << flush; // << flush avoids newline issues
    return 0;
}`;
}


// Maximum Element in Array
if (title.includes("maximum element in array")) {
  let nums = "{1,2,3}";
  try {
    const match = inputData.match(/\[(.*?)\]/);
    if (match) nums = `{${match[1]}}`;
  } catch {}
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    vector<int> nums = ${nums};
    cout << obj.maxElement(nums);
    return 0;
}`;
}

//  GCD of Two Numbers
if (title.includes("gcd of two numbers")) {
  let a = 0, b = 0;
  try {
    const nums = inputData.split(",").map(x => parseInt(x.trim()));
    a = nums[0]; b = nums[1];
  } catch {}
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    int a = ${a}, b = ${b};
    cout << obj.gcd(a, b);
    return 0;
}`;
}

// Armstrong Number
if (title.includes("armstrong number")) {
  let n = 0;
  try { n = parseInt(inputData.trim()); } catch {}
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    int n = ${n};
    cout << (obj.isArmstrong(n) ? "true" : "false");
    return 0;
}`;
}

// Count Digits in a Number
if (title.includes("count digits in a number")) {
  let n = 0;
  try { n = parseInt(inputData.trim()); } catch {}
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    cout << obj.countDigits(${n});
    return 0;
}`;
}

//  Leap Year Checker
if (title.includes("leap year checker")) {
  let year = 0;
  try { year = parseInt(inputData.trim()); } catch {}
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    int year = ${year};
    cout << (obj.isLeapYear(year) ? "true" : "false");
    return 0;
}`;
}

// Even or Odd
if (title.includes("even or odd")) {
  let n = 0;
  try { n = parseInt(inputData.trim()); } catch {}
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    cout << obj.evenOrOdd(${n});
    return 0;
}`;
}

// Sum of Array Elements
if (title.includes("sum of array elements")) {
  let nums = "{1,2,3}";
  try {
    const match = inputData.match(/\[(.*?)\]/);
    if (match) nums = `{${match[1]}}`;
  } catch {}
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    vector<int> nums = ${nums};
    cout << obj.sumArray(nums);
    return 0;
}`;
}

// Count Words in String
if (title.includes("count words in string")) {
  let s = "";
  try {
    const match = inputData.match(/"([^"]+)"|'([^']+)'/);
    if (match) s = match[1] || match[2];
  } catch {}
  const escaped = s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    string s = "${escaped}";
    cout << obj.countWords(s);
    return 0;
}`;
}

// Reverse String
if (title.includes("reverse string")) {
  let s = "";
  try {
    const match = inputData.match(/"([^"]+)"|'([^']+)'/);
    if (match) s = match[1] || match[2];
  } catch {}
  const escaped = s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    string s = "${escaped}";
    cout << "\\""<<obj.reverseString(s)<<"\\"";
    return 0;
}`;
}

// Palindrome String
if (title.includes("palindrome string")) {
  let s = "";
  try {
    const match = inputData.match(/"([^"]+)"|'([^']+)'/);
    if (match) s = match[1] || match[2];
  } catch {}
  const escaped = s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    string s = "${escaped}";
    cout << (obj.isPalindrome(s) ? "true" : "false");
    return 0;
}`;
}


// Prime Numbers in Range
if (title.includes("prime numbers in range")) {
  let n = 0;
  try { n = parseInt(inputData.trim()); } catch {}

  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    int n = ${n};
    vector<int> primes = obj.primeRange(n);

    for (int i = 0; i < primes.size(); i++) {
        cout << primes[i];
        if (i + 1 < primes.size()) cout << ",";
    }

    return 0;
}`;
}


// Sum of First N Natural Numbers
if (title.includes("sum of first n natural numbers")) {
  let n = 0;
  try { n = parseInt(inputData.trim()); } catch {}
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    cout << obj.sumNatural(${n});
    return 0;
}`;
}




// Factor Count
if (title.includes("factor count")) {
  let n = 0;
  try { n = parseInt(inputData.trim()); } catch {}
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    Solution obj;
    cout << obj.countFactors(${n});
    return 0;
}`;
}


// Longest Substring Without Repeating Characters
if (title.includes("longest substring without repeating characters")) {
  let s = inputData.trim();

  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.substring(1, s.length - 1);
  }

  const escaped = s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  return `
#include <bits/stdc++.h>
using namespace std;

${code}

int main() {
    Solution obj;
    string s = "${escaped}";
    cout << obj.lengthOfLongestSubstring(s);
    return 0;
}`;
}



  // Default
  return `
#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    cout << "Code executed successfully!";
    return 0;
}`;
}

/* 
   removes spaces & newlines
 */
const normalize = (str = "") =>
  str.replace(/\s+/g, "").replace(/\r?\n|\r/g, "").trim();

/* 
   Run Code
*/
router.post("/", verifyToken, async (req, res) => {
  const { language, code, input, problemTitle } = req.body;

  try {
    const lang = langVersions[language];
    if (!lang) return res.status(400).json({ error: "Unsupported language" });

    const finalCode = wrapCode(language, code, input, problemTitle);

    const response = await axios.post(PISTON_URL, {
      language: lang.language,
      version: lang.version,
      files: [{ content: finalCode }],
    });

    const output = response?.data?.run?.output || "No output";
    res.json({ output: output.trim() });
  } catch (error) {
    console.error(" Execution Error:", error.message);
    res.status(500).json({ error: "Error executing code" });
  }
});

/* 
   Submit
 */
router.post("/testcases", verifyToken, async (req, res) => {
  const { language, code, testCases, problemTitle, userId, problemId } = req.body;

  const lang = langVersions[language];
  if (!lang) return res.status(400).json({ error: "Unsupported language" });
  if (!testCases?.length) return res.status(400).json({ error: "No test cases provided" });

  let results = [];
  let passed = 0;

  for (let i = 0; i < testCases.length; i++) {
    const t = testCases[i];
    try {
      const finalCode = wrapCode(language, code, t.input, problemTitle);
      const response = await axios.post(PISTON_URL, {
        language: lang.language,
        version: lang.version,
        files: [{ content: finalCode }],
      });

      const raw = response?.data?.run?.output || "";
      const userOut = normalize(raw);
      const expected = normalize(t.expectedOutput || t.output || t.expected || "");

      const isPassed = userOut === expected;
      if (isPassed) passed++;

results.push({
  caseNumber: i + 1,
  input: t.input,
  expected: t.expectedOutput || t.output || t.expected || "",
  userOutput: raw.trim(),
  passed: isPassed,
});


  
      await new Promise((r) => setTimeout(r, 120));
    } catch (err) {
      console.error("Testcase error:", err.message);
      results.push({
        caseNumber: i + 1,
        input: t.input,
        expected: t.output,
        userOutput: "Error executing test case",
        passed: false,
      });
    }
  }

  /*
     successful submissions to MongoDB
 */
  try {
    if (passed === testCases.length && userId) {
      const prob = problemId ? await Problem.findById(problemId).lean() : null;

      await Submission.create({
        userId,
        problemId: problemId || null,
        problemTitle: prob?.title || problemTitle || "Untitled Problem",
        difficulty: prob?.difficulty || "Unknown",
        language,
        totalCases: testCases.length,
        passedCases: passed,
        passedAll: true,
        code,
      });

    
      console.log(`Submission saved for user: ${userId}, problem: ${problemTitle}`);
    } else {
      console.log(" Submission not saved — not all test cases passed or userId missing");
    }
  } catch (saveErr) {
    console.error(" Failed to save submission:", saveErr.message);
  }

  res.json({ passed, total: testCases.length, results });
});

export default router;
