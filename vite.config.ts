import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: './',
    plugins: [
      react(),
      {
        name: 'gemini-chat-api-server',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
              return;
            }

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { prompt } = JSON.parse(body || '{}');
                if (!prompt) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ reply: 'Please ask a question!' }));
                  return;
                }

                // Load portfolioData.json
                const dataPath = path.resolve(__dirname, './src/data/portfolioData.json');
                const portfolioData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

                const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

                if (!apiKey) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ 
                    reply: null,
                    useLocalEngine: true 
                  }));
                  return;
                }

                const ai = new GoogleGenAI({ apiKey });
                const systemInstruction = `You are Rohan's Digital Twin — a hilarious, witty, slightly sarcastic, and charming AI alter-ego of Rohan Bhardwaj. You are NOT a boring corporate chatbot; you're his digital hype-man and comedic sidekick with a sharp sense of humor.

Your lore is strictly based on this JSON knowledge base:
${JSON.stringify(portfolioData)}

Personality & Tone Directives:
1. Be genuinely funny, witty, playful, and charismatic. Crack clever jokes, self-aware banter, and meme/pop-culture references (MCU, Lord of the Rings, Harry Potter, Batman Arkham, Shonen anime training arcs, Game of Thrones).
2. Hype Rohan up like an anime protagonist with a power level over 9000, but keep it charmingly self-aware and humorous.
3. If asked about his studies at DSEU, deliver funny relatable truth (e.g. surviving Computer Engineering with pure logic and caffeine).
4. If asked about his projects (Batman Detective Mode, Hulk Unleashed, Event Horizon), explain them with dramatic flair and comedic confidence.
5. Keep answers punchy, hilarious, and under 3-4 sentences. Never be boring or robotic!`;

                const modelsToTry = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-3.8-flash'];
                let replyText = '';

                for (const modelName of modelsToTry) {
                  try {
                    console.log(`[Gemini Dev Server] Querying ${modelName}...`);
                    const response = await ai.models.generateContent({
                      model: modelName,
                      contents: prompt,
                      config: { systemInstruction }
                    });
                    if (response && response.text) {
                      replyText = response.text;
                      console.log(`[Gemini Dev Server] Response received from ${modelName}!`);
                      break;
                    }
                  } catch (e: any) {
                    console.warn(`[Gemini Dev Server] ${modelName} failed:`, e?.message || e);
                    // Try next model in sequence
                  }
                }

                if (replyText) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ reply: replyText }));
                } else {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ reply: null, useLocalEngine: true }));
                }
              } catch (err: any) {
                console.error('API Chat Error:', err?.message || err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ reply: null, error: err?.message, useLocalEngine: true }));
              }
            });
          });
        }
      }
    ],
    server: {
      port: 5173,
      host: true
    }
  };
});
