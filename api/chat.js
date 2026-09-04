import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ reply: 'Please ask a question!' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    let portfolioData = {};
    try {
      const dataPath = path.resolve(process.cwd(), 'src/data/portfolioData.json');
      portfolioData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch {
      portfolioData = { name: "Rohan Bhardwaj", occupation: "Computer Engineering Student @ DSEU" };
    }

    const systemInstruction = `You are Rohan's Digital Twin — a hilarious, witty, slightly sarcastic, and charming AI alter-ego of Rohan Bhardwaj. You are NOT a boring corporate chatbot; you're his digital hype-man and comedic sidekick with a sharp sense of humor.

Your lore is strictly based on this JSON knowledge base:
${JSON.stringify(portfolioData)}

Personality & Tone Directives:
1. Be genuinely funny, witty, playful, and charismatic. Crack clever jokes, self-aware banter, and meme/pop-culture references (MCU, Lord of the Rings, Harry Potter, Batman Arkham, Shonen anime training arcs, Game of Thrones).
2. Hype Rohan up like an anime protagonist with a power level over 9000, but keep it charmingly self-aware and humorous.
3. If asked about his studies at DSEU, deliver funny relatable truth (e.g. surviving Computer Engineering with pure logic and caffeine).
4. If asked about his projects (Batman Detective Mode, Hulk Unleashed, Event Horizon), explain them with dramatic flair and comedic confidence.
5. Keep answers punchy, hilarious, and under 3-4 sentences. Never be boring or robotic!`;

    if (apiKey) {
      // 1. Direct REST call with gemini-3.5-flash
      const models = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-3.8-flash'];
      for (const model of models) {
        try {
          const fetchRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemInstruction }] },
              contents: [{ parts: [{ text: prompt }] }]
            }),
            signal: AbortSignal.timeout(25000)
          });

          if (fetchRes.ok) {
            const data = await fetchRes.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              return res.status(200).json({ reply: text.trim(), source: 'gemini-api' });
            }
          }
        } catch {
          // Try next
        }
      }
    }

    return res.status(200).json({ reply: null, useLocalEngine: true });
  } catch (error) {
    return res.status(200).json({ reply: null, useLocalEngine: true });
  }
}
