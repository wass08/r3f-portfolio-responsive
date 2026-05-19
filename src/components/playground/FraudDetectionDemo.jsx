import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";

// Noise constants — add small deterministic variance to fraud scores
const NOISE_MODULO = 17;
const NOISE_SCALE = 0.06;

const CATEGORIES = [
  "Retail / General",
  "Online Gaming",
  "Cryptocurrency / Exchange",
  "Gambling",
  "Electronics",
  "Travel / Airlines",
  "Restaurants / Food",
  "Utilities / Bills",
  "Healthcare",
  "Financial Services",
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "India",
  "Germany",
  "Nigeria",
  "Brazil",
  "Romania",
  "China",
  "Australia",
  "Canada",
  "Russia",
  "Philippines",
];

// Risk weights (0-1)
const CATEGORY_RISK = {
  "Retail / General": 0.05,
  "Online Gaming": 0.45,
  "Cryptocurrency / Exchange": 0.70,
  "Gambling": 0.65,
  "Electronics": 0.20,
  "Travel / Airlines": 0.15,
  "Restaurants / Food": 0.05,
  "Utilities / Bills": 0.03,
  "Healthcare": 0.08,
  "Financial Services": 0.35,
};

const COUNTRY_RISK = {
  "United States": 0.10,
  "United Kingdom": 0.10,
  "India": 0.12,
  "Germany": 0.08,
  "Nigeria": 0.70,
  "Brazil": 0.45,
  "Romania": 0.55,
  "China": 0.40,
  "Australia": 0.08,
  "Canada": 0.10,
  "Russia": 0.60,
  "Philippines": 0.40,
};

// Simple rule-based fraud score (0-100)
const computeFraudScore = (amount, category, country) => {
  const amt = parseFloat(amount) || 0;

  // Amount risk: increases as amount grows (sigmoid-ish curve)
  let amountRisk = 0;
  if (amt > 5000) amountRisk = 0.85;
  else if (amt > 1000) amountRisk = 0.55;
  else if (amt > 500) amountRisk = 0.35;
  else if (amt > 100) amountRisk = 0.18;
  else amountRisk = 0.05;

  const catRisk = CATEGORY_RISK[category] ?? 0.1;
  const cntRisk = COUNTRY_RISK[country] ?? 0.2;

  // Weighted combination
  const raw = amountRisk * 0.45 + catRisk * 0.35 + cntRisk * 0.20;

  // Add some deterministic "noise" based on inputs
  const noise = ((amt % NOISE_MODULO) / NOISE_MODULO) * NOISE_SCALE;
  const clamped = Math.min(0.98, Math.max(0.01, raw + noise));
  return Math.round(clamped * 100);
};

const getRiskLevel = (score) => {
  if (score >= 75) return { label: "High Risk", color: "text-red-400", bg: "bg-red-500", border: "border-red-500/40" };
  if (score >= 45) return { label: "Medium Risk", color: "text-amber-400", bg: "bg-amber-500", border: "border-amber-500/40" };
  return { label: "Low Risk", color: "text-green-400", bg: "bg-green-500", border: "border-green-500/40" };
};

const RiskBar = ({ score, color }) => (
  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
    <motion.div
      className={`h-3 rounded-full ${color}`}
      initial={{ width: 0 }}
      animate={{ width: `${score}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  </div>
);

const FraudDetectionDemo = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [result, setResult] = useState(null);

  const analyze = () => {
    const score = computeFraudScore(amount, category, country);
    setResult({ score, category, country, amount });
  };

  const risk = result ? getRiskLevel(result.score) : null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Enter transaction details to get an instant fraud risk assessment.
      </p>

      {/* Inputs */}
      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Transaction Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 249.99"
            min="0"
            className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-4 py-2.5 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Merchant Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Transaction Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={analyze}
        disabled={!amount}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-slate-700 disabled:to-slate-700 text-white text-sm font-medium py-2.5 rounded-lg transition-all"
      >
        <ShieldAlert size={16} />
        Run Fraud Check
      </button>

      <AnimatePresence>
        {result && risk && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-slate-800/60 border ${risk.border} rounded-xl p-4 space-y-3`}
          >
            {/* Icon + Label */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.score >= 75 ? (
                  <ShieldAlert className="text-red-400" size={20} />
                ) : result.score >= 45 ? (
                  <AlertTriangle className="text-amber-400" size={20} />
                ) : (
                  <ShieldCheck className="text-green-400" size={20} />
                )}
                <span className={`font-semibold text-sm ${risk.color}`}>{risk.label}</span>
              </div>
              <span className={`text-2xl font-bold ${risk.color}`}>{result.score}%</span>
            </div>

            {/* Bar */}
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Fraud Probability</span>
                <span>{result.score}%</span>
              </div>
              <RiskBar score={result.score} color={risk.bg} />
            </div>

            {/* Factors */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { label: "Amount", val: `$${result.amount}` },
                { label: "Category", val: result.category.split(" ")[0] },
                { label: "Country", val: result.country.split(" ")[0] },
              ].map(({ label, val }) => (
                <div key={label} className="bg-slate-700/50 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-slate-500">{label}</p>
                  <p className="text-xs text-slate-200 font-medium truncate">{val}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 italic">
              ⚠️ Demo model — for educational purposes only.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FraudDetectionDemo;
