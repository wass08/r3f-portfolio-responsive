import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Youtube, Loader, Zap, Lightbulb, List } from "lucide-react";

const MOCK_RESULT = {
  title: "10 AI Tools That Will Change Your Workflow Forever (2025)",
  hook: "Most developers are wasting 3 hours a day on tasks that AI can do in 3 minutes — here's exactly how to stop.",
  outline: [
    { section: "Intro (0:00–1:00)", detail: "Hook + why AI tools matter in 2025" },
    { section: "Tool #1 — Gemini (1:00–3:30)", detail: "Coding, writing, and research assistant" },
    { section: "Tool #2 — Cursor AI (3:30–6:00)", detail: "AI-first code editor for 10x productivity" },
    { section: "Tool #3 — Perplexity (6:00–8:30)", detail: "AI search engine replacing traditional Googling" },
    { section: "Tool #4 — Runway (8:30–11:00)", detail: "AI video generation and editing" },
    { section: "Bonus Tools (11:00–14:00)", detail: "ElevenLabs, Midjourney, Claude, and more" },
    { section: "Outro + CTA (14:00–15:00)", detail: "Subscribe prompt + next video preview" },
  ],
  tags: ["AI Tools", "Productivity", "Developer", "2025", "ChatGPT", "Gemini"],
};

const AutoYTGeneratorDemo = () => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generate = useCallback(async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setResult(null);
    setError(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      await new Promise((r) => setTimeout(r, 1000));
      setResult(MOCK_RESULT);
      setIsGenerating(false);
      return;
    }

    try {
      const prompt = `You are a top YouTube content strategist. Generate content for a video about: "${topic}"

Respond ONLY with valid JSON in this exact format:
{
  "title": "<catchy YouTube video title>",
  "hook": "<1-2 sentence hook that opens the video — must be compelling>",
  "outline": [
    {"section": "<Section title + timestamp>", "detail": "<brief description>"},
    {"section": "<Section title + timestamp>", "detail": "<brief description>"},
    {"section": "<Section title + timestamp>", "detail": "<brief description>"},
    {"section": "<Section title + timestamp>", "detail": "<brief description>"},
    {"section": "<Section title + timestamp>", "detail": "<brief description>"}
  ],
  "tags": ["<tag1>","<tag2>","<tag3>","<tag4>","<tag5>"]
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 800 },
          }),
        }
      );
      if (!response.ok) throw new Error(`API error ${response.status}`);
      const data = await response.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      const clean = raw.replace(/```json\n?/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      console.error("AutoYT generation error:", err);
      setError("Generation failed. Showing mock result.");
      setResult(MOCK_RESULT);
    } finally {
      setIsGenerating(false);
    }
  }, [topic]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Enter a video topic. AI will generate a title, hook, and full outline.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isGenerating && topic.trim() && generate()}
          placeholder="e.g. 'How I built 250 projects in 3 years'"
          className="flex-1 bg-slate-800 text-slate-200 text-sm rounded-lg px-4 py-2.5 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={generate}
          disabled={!topic.trim() || isGenerating}
          className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-slate-700 disabled:to-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all whitespace-nowrap"
        >
          {isGenerating ? <Loader size={14} className="animate-spin" /> : <Zap size={14} />}
          {isGenerating ? "Generating…" : "Generate"}
        </button>
      </div>

      {error && (
        <p className="text-xs text-amber-400">{error}</p>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Title */}
            <div className="bg-slate-800/60 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Youtube size={16} className="text-red-500" />
                <span className="text-xs text-slate-400 font-medium">VIDEO TITLE</span>
              </div>
              <p className="text-white font-semibold text-sm leading-snug">{result.title}</p>
            </div>

            {/* Hook */}
            <div className="bg-slate-800/60 border border-yellow-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-yellow-400" />
                <span className="text-xs text-slate-400 font-medium">OPENING HOOK</span>
              </div>
              <p className="text-slate-300 text-sm italic leading-relaxed">&ldquo;{result.hook}&rdquo;</p>
            </div>

            {/* Outline */}
            <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <List size={16} className="text-blue-400" />
                <span className="text-xs text-slate-400 font-medium">VIDEO OUTLINE</span>
              </div>
              <ol className="space-y-2">
                {(result.outline ?? []).map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-blue-400 text-xs font-bold w-4 flex-shrink-0 mt-0.5">{i + 1}.</span>
                    <div>
                      <p className="text-xs text-slate-200 font-medium">{item.section}</p>
                      <p className="text-xs text-slate-400">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tags */}
            {result.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {result.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutoYTGeneratorDemo;
