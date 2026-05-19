/**
 * AI Twin Route — Gemini 2.5 Integration (Vercel AI SDK)
 * Add this to vite.config.js as middleware
 */

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export function aiTwinRoute(app) {
  app.post("/api/ai-twin", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({
          error: "Invalid message format",
        });
      }

      if (!process.env.GEMINI_API_KEY) {
        console.warn("⚠️ GEMINI_API_KEY not set, using demo response");
        return res.json({
          response: getDemoResponse(message),
        });
      }

      // Set streaming headers (Server-Sent Events)
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = await streamText({
        model: google("gemini-2.5-flash"), // or "gemini-2.5-pro" if preferred
        system: getSystemPrompt(),
        messages: [
          ...(conversationHistory || []),
          { role: "user", content: message },
        ],
        temperature: 0.8,
      });

      for await (const delta of stream.textStream) {
        res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
      }

      res.write(`data: [DONE]\n\n`);
      res.end();
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
}

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

function getDemoResponse(message) {
  const responses = {
    default:
      "I'm currently in demo mode. Please set up your GEMINI_API_KEY to enable full AI Twin functionality!",
    skills:
      "Arhan is skilled in React, Three.js, Node.js, and modern web development! What else would you like to know?",
    projects:
      "Arhan has completed 250+ projects including interactive 3D portfolios and enterprise applications!",
    availability:
      "Arhan is currently open for new opportunities! You can contact him through the portfolio.",
  };

  const msg = message.toLowerCase();
  for (const [key, value] of Object.entries(responses)) {
    if (msg.includes(key)) return value;
  }
  return responses.default;
}