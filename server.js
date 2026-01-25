import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 🔥 FIXED: Gemini v1beta Working Model + Endpoint
const GEMINI_MODEL = "gemini-1.5-flash";
const GEMINI_URL = https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY};

// =============================
// API ROUTE FOR AI RESPONSE
// =============================
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Gemini request body
    const requestBody = {
      contents: [
        {
          parts: [{ text: userMessage }]
        }
      ]
    };

    // Call Gemini API
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    // Error handling
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    res.json({ reply: aiText });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// =============================
// START SERVER
// =============================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(🔥 Rixo Server Running on PORT: ${PORT});
});
