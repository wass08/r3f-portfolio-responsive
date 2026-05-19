import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader, CheckCircle, AlertCircle, Zap } from "lucide-react";

const MAX_RESUME_LENGTH = 3000;

const MOCK_ANALYSIS = {
  score: 72,
  strengths: [
    "Clear project descriptions with measurable outcomes",
    "Modern tech stack mentioned (React, Next.js, Node.js)",
    "Quantified achievements (e.g., '250+ projects')",
  ],
  improvements: [
    "Add more quantified metrics (% improvements, user counts)",
    "Include a concise 2-line professional summary at the top",
    "List technical skills in a dedicated section",
    "Add links to live projects or GitHub portfolio",
  ],
  keywords: ["React", "Node.js", "AI", "Full Stack", "Next.js"],
};

const ScoreRing = ({ score }) => {
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#334155" strokeWidth="8" />
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{score}</span>
        <span className="text-xs text-slate-400">/100</span>
      </div>
    </div>
  );
};

const ResumeAnalyzerDemo = () => {
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = useCallback(async () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      // Demo mode — return mock after short delay
      await new Promise((r) => setTimeout(r, 1200));
      setResult(MOCK_ANALYSIS);
      setIsAnalyzing(false);
      return;
    }

    try {
      const prompt = `You are an expert resume reviewer. Analyze the following resume text and respond ONLY with valid JSON in this exact format:
{
  "score": <number 0-100>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>", "<improvement 4>"],
  "keywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"]
}

Resume text:
${resumeText.slice(0, MAX_RESUME_LENGTH)}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
          }),
        }
      );
      if (!response.ok) throw new Error(`API error ${response.status}`);
      const data = await response.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      // Strip markdown code fences if present
      const clean = raw.replace(/```json\n?/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      console.error("Resume analysis error:", err);
      setError("Analysis failed. Showing mock result.");
      setResult(MOCK_ANALYSIS);
    } finally {
      setIsAnalyzing(false);
    }
  }, [resumeText]);
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Paste your resume text below. AI will score it and suggest improvements.
      </p>

      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="Paste your resume text here…"
        rows={6}
        className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-4 py-3 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
      />

      <button
        onClick={analyze}
        disabled={!resumeText.trim() || isAnalyzing}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 text-white text-sm font-medium py-2.5 rounded-lg transition-all"
      >
        {isAnalyzing ? (
          <>
            <Loader size={16} className="animate-spin" />
            Analyzing with AI…
          </>
        ) : (
          <>
            <Zap size={16} />
            Analyze Resume
          </>
        )}
      </button>

      {error && (
        <p className="text-xs text-amber-400 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Score */}
            <div className="bg-slate-800/60 rounded-xl p-4 flex items-center gap-4">
              <ScoreRing score={result.score} />
              <div>
                <p className="text-white font-semibold">Resume Score</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {result.score >= 80
                    ? "Excellent — ready to impress!"
                    : result.score >= 60
                    ? "Good — a few improvements will help"
                    : "Needs work — see suggestions below"}
                </p>
                {/* Keywords */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {(result.keywords ?? []).map((kw) => (
                    <span
                      key={kw}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-slate-800/60 rounded-xl p-4">
              <p className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-1">
                <CheckCircle size={14} /> Strengths
              </p>
              <ul className="space-y-1">
                {(result.strengths ?? []).map((s, i) => (
                  <li key={i} className="text-xs text-slate-300 flex gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-slate-800/60 rounded-xl p-4">
              <p className="text-amber-400 font-semibold text-sm mb-2 flex items-center gap-1">
                <AlertCircle size={14} /> Improvements
              </p>
              <ul className="space-y-1">
                {(result.improvements ?? []).map((imp, i) => (
                  <li key={i} className="text-xs text-slate-300 flex gap-2">
                    <span className="text-amber-500 mt-0.5">→</span>
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeAnalyzerDemo;
