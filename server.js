import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// Boot up Gemini API client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
console.log(`🔑 Gemini API Key: ${apiKey ? "Active" : "Not set (set GEMINI_API_KEY in .env)"}`);

// Load Rohan's lore
let portfolioData = {};
try {
  portfolioData = JSON.parse(fs.readFileSync('./src/data/portfolioData.json', 'utf8'));
} catch {
  console.log("Loading portfolio lore from default...");
}

// Main AI chat brain endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ reply: "Say something!" });

    if (!ai) {
      return res.json({ 
        reply: "Rohan's backend is running in offline mode. Set GEMINI_API_KEY in your .env file to enable live Gemini neural responses!" 
      });
    }

    const systemInstruction = `You are a helpful, witty assistant for Rohan Bhardwaj's portfolio. Answer questions based strictly on this data: ${JSON.stringify(portfolioData)}. Keep answers punchy, friendly, professional, and under 3 sentences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { systemInstruction }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ reply: "Sorry, my brain is taking a quick breather. Try again in a second!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Rohan's AI Backend server cruising on http://localhost:${PORT}`);
});
