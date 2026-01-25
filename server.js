import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const MODEL = "gemini-1.5-flash";

const GEMINI_URL =
  https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY};

app.post("/chat", async (req, res) => {
  try {
    const userText = req.body.message;

    if (!userText) {
      return res.status(400).json({ error: "Message is required." });
    }

    const body = {
      contents: [
        {
          parts: [{ text: userText }]
        }
      ]
    };

    const result = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await result.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response.";

    res.json({ reply });

  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🔥 Rixo Server is running on port", PORT);
});
