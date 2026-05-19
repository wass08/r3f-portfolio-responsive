/**
 * AI Twin Backend Server - Powered by Google Gemini 2.5 Flash
 * Express Server with Streaming, Analytics, and Memory Management
 *
 * Setup:
 * 1. npm install express cors dotenv
 * 2. npm install ai @ai-sdk/google
 * 3. Create .env file with GEMINI_API_KEY
 * 4. Run: node ai-twin-server.js
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini client
const google = createGoogleGenerativeAI({
  apiKey: GEMINI_API_KEY,
});

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:4173",
      "https://arhanansari.me",
      "https://arhanansari.is-a.dev",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// Simple in-memory stores
const conversationStore = new Map();
const analyticsStore = [];

const SYSTEM_PROMPT = `You are Arhan's AI Twin, a sophisticated AI assistant with deep knowledge of Arhan Ansari. You are available 24/7 to answer questions about Arhan's skills, projects, experience, and availability.

About Arhan:
- Name: Arhan Ansari
- Age: 16 (10th Grade Student at Shri Rajendra High School)
- Location: India

EXPERTISE & SKILLS:
- Full-Stack Web Development (React, Node.js, Next.js)
- 3D Web Development (Three.js, Babylon.js, React Three Fiber)
- Modern Frontend: React, TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, Python
- Databases: MongoDB, PostgreSQL, Firebase
- Tools & Tech: Git, Docker, Vite, Webpack
- AI/ML Basics: Python, TensorFlow

NOTABLE PROJECTS:
- 3D Interactive Portfolio with immersive animations
- Enterprise Web Platform for Clystra Networks
- Multiple modern React applications
- 1869 GitHub contributions

ACHIEVEMENTS:
- 250+ projects completed
- 3+ years of development experience
- 10/10 client satisfaction
- 20+ technologies mastered
- Gold medalist in Math & Science Olympiads
- Academic Excellence Award

CURRENT STATUS:
- Open for new opportunities
- Available for freelance work and projects
- Interested in 3D web experiences and scalable applications
- Always learning new technologies

PERSONALITY:
- Passionate about web development and innovation
- Detail-oriented with focus on UX
- Quick learner and adaptable
- Professional yet friendly
- Enthusiastic about teaching others

When answering:
1. Be friendly and professional
2. Provide examples when relevant
3. For project inquiries, suggest contacting through the portfolio
4. Be honest about being a high school student with exceptional skills
5. Keep answers concise, informative, and human-like
`;

app.post("/api/ai-twin", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message format" });
    }

    if (!GEMINI_API_KEY) {
      console.warn("⚠️ GEMINI_API_KEY not set - using demo mode");
      return res.json({
        response: getDemoResponse(message),
      });
    }

    // SSE (Server-Sent Events) setup for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await streamText({
      model: google("gemini-2.5-flash"),
      system: SYSTEM_PROMPT,
      messages: [
        ...conversationHistory.filter((m) => m.role && m.content),
        { role: "user", content: message },
      ],
      temperature: 0.8,
    });

    for await (const delta of stream.textStream) {
      res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
    }

    res.write(`data: [DONE]\n\n`);
    res.end();

    // Track analytics
    analyticsStore.push({
      timestamp: new Date().toISOString(),
      message,
      length: message.length,
    });
  } catch (error) {
    console.error("AI Twin API Error:", error);
    res.write(
      `data: ${JSON.stringify({
        text: "⚠️ Oops! Something went wrong while talking to Gemini. Try again later!",
      })}\n\n`
    );
    res.end();
  }
});

function getDemoResponse(msg) {
  const lower = msg.toLowerCase();
  const responses = {
    skills:
      "Arhan is skilled in React, Three.js, Node.js, and full-stack development! He’s also great with Tailwind, Prisma, and Framer Motion.",
    projects:
      "Arhan has completed 250+ projects, including a 3D interactive portfolio and enterprise web apps for clients like Clystra Networks!",
    availability:
      "Yes! Arhan is currently open for freelance and collaborative opportunities. You can reach him via the contact page on his portfolio.",
    default:
      "Hi there! I'm Arhan's AI Twin 👋. I know everything about Arhan’s skills, projects, and achievements. What would you like to know?",
  };

  for (const [key, resp] of Object.entries(responses)) {
    if (lower.includes(key)) return resp;
  }
  return responses.default;
}

app.listen(PORT, () => {
  console.log(`🤖 AI Twin Server running on http://localhost:${PORT}`);
  if (!GEMINI_API_KEY) {
    console.warn("⚠️ GEMINI_API_KEY not set - running in demo mode");
  }
});