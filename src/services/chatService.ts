import portfolioData from '../data/portfolioData.json';

export interface ChatResponse {
  reply: string;
  source: 'gemini-api' | 'portfolio-knowledge-base';
}

const SYSTEM_PROMPT = `You are Rohan's Digital Twin — a hilarious, witty, slightly sarcastic, and charming AI alter-ego of Rohan Bhardwaj. You are NOT a boring corporate chatbot; you're his digital hype-man and comedic sidekick with a sharp sense of humor.

Your lore is strictly based on this JSON knowledge base:
${JSON.stringify(portfolioData)}

Personality & Tone Directives:
1. Be genuinely funny, witty, playful, and charismatic. Crack clever jokes, self-aware banter, and meme/pop-culture references (MCU, Lord of the Rings, Harry Potter, Batman Arkham, Shonen anime training arcs, Game of Thrones).
2. Hype Rohan up like an anime protagonist with a power level over 9000, but keep it charmingly self-aware and humorous.
3. If asked about his studies at DSEU, deliver funny relatable truth (e.g. surviving Computer Engineering with pure logic and caffeine).
4. If asked about his projects (Batman Detective Mode, Hulk Unleashed, Event Horizon), explain them with dramatic flair and comedic confidence.
5. Keep answers punchy, hilarious, and under 3-4 sentences. Never be boring or robotic!`;

/**
 * Fast & resilient chat dispatcher connected to Gemini 3.6 Flash.
 */
export async function sendChatMessage(prompt: string, customApiKey?: string): Promise<ChatResponse> {
  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) {
    return {
      reply: "Don't be shy, hit me with a question! I don't bite... unless you write spaghetti code. 🍝",
      source: 'portfolio-knowledge-base'
    };
  }

  // 1. Try Vercel Serverless Function / Vite middleware endpoint (/api/chat)
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: cleanPrompt }),
      signal: AbortSignal.timeout(25000)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) {
        return {
          reply: data.reply.trim(),
          source: 'gemini-api'
        };
      }
    }
  } catch (e) {
    console.warn('[Chat Service] Endpoint /api/chat error, attempting direct client fallback:', e);
  }

  // 2. Direct Browser Gemini 3.5 Flash query (with Gemini 3.6 fallback)
  const apiKey = customApiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    const directModels = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-3.8-flash'];
    for (const modelName of directModels) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_PROMPT }]
            },
            contents: [{
              parts: [{ text: cleanPrompt }]
            }]
          }),
          signal: AbortSignal.timeout(25000)
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim()) {
            return {
              reply: candidateText.trim(),
              source: 'gemini-api'
            };
          }
        }
      } catch (err) {
        console.warn(`[Chat Service] Direct call for ${modelName} failed:`, err);
      }
    }
  }

  // 3. Guaranteed Instant Fallback: Deep witty & funny lore knowledge base
  const localReply = queryHumorousKnowledgeBase(cleanPrompt);
  return {
    reply: localReply,
    source: 'portfolio-knowledge-base'
  };
}

/**
 * Robust, humorous semantic knowledge extractor based on portfolioData.json
 */
function queryHumorousKnowledgeBase(query: string): string {
  const q = query.toLowerCase();

  // Batman project
  if (q.includes('batman') || q.includes('detective') || q.includes('arkham') || q.includes('gotham')) {
    return "Rohan literally channeled his inner Dark Knight to build an Arkham Detective Mode scanner for the web. Rumor has it, if you turn the scanner on, you can detect bugs in code from 3 blocks away! 🦇🔍";
  }

  // Hulk project
  if (q.includes('hulk') || q.includes('smash') || q.includes('gamma')) {
    return "HULK SMASH! Rohan built 'Hulk Unleashed' with screen-shaking kinetic physics. His code was so powerful during testing that his keyboard almost turned green. 💥🟢";
  }

  // Black Hole project
  if (q.includes('black hole') || q.includes('event horizon') || q.includes('gargantua') || q.includes('space') || q.includes('warp')) {
    return "You're looking right at it! Rohan engineered this whole relativistic Gargantua black hole in WebGL. Be careful staring into the event horizon for too long—you might lose 7 years in 5 minutes like in Interstellar! 🌌⏳";
  }

  // General Projects
  if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('built') || q.includes('create')) {
    return "From Arkham detective vision to cosmic black holes and gamma-powered Hulk pages, Rohan builds web apps like he's assembling the Avengers. Check out the 'Selected Work' section above before gravity pulls you in! 🚀";
  }

  // Education / DSEU
  if (q.includes('education') || q.includes('college') || q.includes('university') || q.includes('dseu') || q.includes('study') || q.includes('student')) {
    return "Rohan is currently grinding through Computer Engineering at Delhi Skill and Entrepreneurship University (DSEU). He converts midnight coffee and algorithmic panic into clean, beautiful code! 🎓☕";
  }

  // Skills
  if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('javascript') || q.includes('react') || q.includes('python')) {
    return "Rohan rocks React, JavaScript/TypeScript, Python, Node.js, UI/UX wizardry, and Generative AI. Basically, if it runs on a browser or talks to an AI model, he's probably already hacked it together! ⚡💻";
  }

  // Anime
  if (q.includes('anime') || q.includes('power') || q.includes('naruto') || q.includes('training')) {
    return "Rohan treats coding sessions like Shonen anime training arcs. When a build fails, he doesn't give up—he gets a 20-minute flashback, powers up with a new npm package, and defeats the bug in the season finale! ⚔️🔥";
  }

  // Movies / Fandoms
  if (q.includes('movie') || q.includes('film') || q.includes('lotr') || q.includes('lord of the rings') || q.includes('harry potter') || q.includes('marvel') || q.includes('mcu')) {
    return "One does not simply write bad code! Rohan's holy trinity of cinematic greatness: The Lord of the Rings, Harry Potter, and the MCU. He's basically a tech wizard living in Middle-earth with Tony Stark's toolbox. 🧙‍♂️💍";
  }

  // TV shows
  if (q.includes('tv') || q.includes('series') || q.includes('show') || q.includes('got') || q.includes('game of thrones') || q.includes('breaking bad') || q.includes('stranger')) {
    return "When not writing code, Rohan is binging Game of Thrones (hoping for a better Season 8), Stranger Things, and Breaking Bad. 'Say my name'... It's Rohan! 🧪👑";
  }

  // Hire / Contact
  if (q.includes('hire') || q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('call') || q.includes('coordinate')) {
    return "Want to recruit this digital wizard? Shoot him an email at rohanbh838@email.com or hit him up on GitHub (@Rohan616). Do it before Nick Fury recruits him first! 📡📩";
  }

  // Location / Origin
  if (q.includes('where') || q.includes('location') || q.includes('city') || q.includes('india') || q.includes('ganaur')) {
    return "Rohan operates from Ganaur, India (IST / UTC+5:30), broadcasting code and creative designs across the globe! 🌍📍";
  }

  return "Hey there! I'm Rohan's AI Twin. I know all his coding secrets, his favorite anime arcs, and why he loves building 3D black holes. Ask me about his projects, skills, or favorite movies! 😎✨";
}
