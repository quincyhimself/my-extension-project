import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Cache map: question → { answer, timestamp }
const answerCache = new Map();

const GEMINI_KEYS = [
  process.env.GEMINI_KEY_1,
  process.env.GEMINI_KEY_2,
  process.env.GEMINI_KEY_3,
  process.env.GEMINI_KEY_4
];
let keyIndex = 0;
function getNextKey() {
  const key = GEMINI_KEYS[keyIndex];
  keyIndex = (keyIndex + 1) % GEMINI_KEYS.length;
  return key;
}

// Replace {modelId} with actual Gemini model (e.g., "gemini-2.5-flash")
const MODEL_ID = "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent`;

async function getGeminiAnswer(question) {
  const apiKey = getNextKey();
  const body = {
    contents: [
      {
        parts: [
          {
            text: "Answer all the questions provided the best you can without explaining. Just give the answer."
          }
        ]
      }
    ]
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  // The response structure may vary; adjust as needed
  const answer = data?.candidates?.[0]?.output?.text || data.text || "No answer returned.";
  return answer;
}

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "No question provided" });
    }

    const cached = answerCache.get(question);
    if (cached && Date.now() - cached.timestamp < 2 * 60 * 1000) {
      return res.json({ answer: cached.answer });
    }

    const answer = await getGeminiAnswer(question);
    answerCache.set(question, { answer, timestamp: Date.now() });
    return res.json({ answer });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ answer: "Error fetching answer." });
  }
});

// Optional: root route
app.get("/", (req, res) => {
  res.send("AnswerForMe backend is running. Use POST /ask with JSON { question: ... }");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
