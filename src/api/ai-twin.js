// =============================================
// AI Twin API (Gemini 2.5 - Streaming + Bug-Free)
// =============================================

import express from "express";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

const router = express.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY in environment variables");
}

// ===========================
// System Prompt (Stable)
// ===========================
function getSystemPrompt() {
  return `You are Arhan's AI Twin, an intelligent assistant that knows everything about Arhan Ansari. You are available 24/7 to answer questions about Arhan's skills, projects, experience, and availability.

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

Be friendly, professional, and authentic. Show enthusiasm about development and learning.`;
}

// ===========================
// Initialize Gemini client
// ===========================
const google = createGoogleGenerativeAI({ apiKey: GEMINI_API_KEY });

// ===========================
// POST /api/ai-twin
// ===========================
router.post("/api/ai-twin", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    // ✅ Prepare streaming headers
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.(); // For safety with some Express versions

    // ✅ Stream response from Gemini 2.5
    const result = await streamText({
      model: google("gemini-2.5-pro"),
      system: getSystemPrompt(),
      messages: [
        ...conversationHistory,
        { role: "user", content: message },
      ],
      temperature: 0.8,
      maxOutputTokens: 1024,
    });

    for await (const delta of result.textStream) {
      res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
    }

    // ✅ Signal completion
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    console.error("💥 AI Twin Error:", error);

    const friendlyMessage =
      "⚠️ Oops! Something went wrong while talking to Gemini. Please try again in a few moments.";

    res.write(`data: ${JSON.stringify({ text: friendlyMessage })}\n\n`);
    res.write(`data: [DONE]\n\n`);
    res.end();
  }
});

export default router;