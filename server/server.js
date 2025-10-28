import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Cache recent questions for 2 minutes
const answerCache = new Map();

const GEMINI_KEYS = [
  process.env.GEMINI_KEY_1,
  process.env.GEMINI_KEY_2,
  process.env.GEMINI_KEY_3,
  process.env.GEMINI_KEY_4,
];
let keyIndex = 0;
function getNextKey() {
  const key = GEMINI_KEYS[keyIndex];
  keyIndex = (keyIndex + 1) % GEMINI_KEYS.length;
  return key;
}

async function getGeminiAnswer(question) {
  const apiKey = getNextKey();
  const response = await fetch("https://api.gemini.com/answer", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  return data.answer || "No answer available.";
}

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "No question provided" });

    const cached = answerCache.get(question);
    if (cached && Date.now() - cached.timestamp < 2 * 60 * 1000) {
      return res.json({ answer: cached.answer });
    }

    const answer = await getGeminiAnswer(question);

    answerCache.set(question, { answer, timestamp: Date.now() });
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Error fetching answer." });
  }
});

// Optional root route for browser check
app.get("/", (req, res) => {
  res.send("AnswerForMe backend is running! Use POST /ask to get answers.");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
