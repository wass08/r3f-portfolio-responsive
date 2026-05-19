import React, { useState, useRef, useEffect } from 'react';
import { profile } from '../../data/profile';
import { projects } from '../../data/projects';
import { skills } from '../../data/skills';

/**
 * AI Twin App
 * Arhan's AI portfolio assistant - answers questions using portfolio data
 */
const AITwinApp = ({ windowId, windowData }) => {
  const [messages, setMessages] = useState([
    { type: 'ai', text: `👋 Hey! I'm Arhan's AI Twin. Ask me anything about his ${projects.length}+ projects, skills, experience, or availability!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = (query) => {
    const q = query.toLowerCase();

    // Greeting
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `👋 Hey! I'm Arhan's AI assistant. You can ask me about his projects, skills, experience, or anything in his portfolio!`;
    }

    // About
    if (q.includes('who is') || q.includes('about') || q.includes('tell me about')) {
      return `📖 ${profile.bio.intro}\n\nArhan's Journey:\n${profile.bio.journey}`;
    }

    // All projects
    if (q.includes('all project') || q.includes('how many project')) {
      return `🚀 Arhan has built **${projects.length} projects**!\n\nTop categories:\n• AI & ML: ${projects.filter(p => p.category === 'ai').length} projects\n• Games: ${projects.filter(p => p.category === 'game').length} projects\n• Web Apps: ${projects.filter(p => p.category === 'web').length} projects\n• Productivity: ${projects.filter(p => p.category === 'productivity').length} projects\n\nUse the Projects app to explore them all!`;
    }

    // Featured projects
    if (q.includes('featured') || q.includes('best') || q.includes('showcase')) {
      const featured = projects.filter(p => p.type === 'featured').slice(0, 5);
      return `⭐ Arhan's Featured Projects:\n\n${featured.map(p => `• **${p.title}** — ${p.description}`).join('\n\n')}`;
    }

    // Projects
    if (q.includes('project') || q.includes('built') || q.includes('created')) {
      const recent = projects.slice(0, 4);
      return `🚀 Some of Arhan's latest projects:\n\n${recent.map(p => `• **${p.title}** — ${p.description}`).join('\n\n')}\n\nView all ${projects.length} projects in the Projects app!`;
    }

    // Skills
    if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('know')) {
      const skillsByCategory = Array.isArray(skills) 
        ? skills.reduce((acc, s) => { acc[s.category] = (acc[s.category] || 0) + 1; return acc; }, {})
        : {};
      return `⚡ Arhan's Tech Stack:\n\n${Object.entries(skillsByCategory).map(([cat, count]) => `• ${cat}: ${count}+ technologies`).join('\n')}`;
    }

    // AI Projects
    if (q.includes('ai') || q.includes('ml') || q.includes('machine learning') || q.includes('artificial') || q.includes('gemini') || q.includes('openai')) {
      const aiProjects = projects.filter(p => p.category === 'ai').slice(0, 5);
      return `🤖 Arhan's AI Projects (${projects.filter(p => p.category === 'ai').length} total):\n\n${aiProjects.map(p => `• **${p.title}** — ${p.technologies.join(', ')}`).join('\n\n')}`;
    }

    // 3D/Games
    if (q.includes('3d') || q.includes('three') || q.includes('game') || q.includes('graphics') || q.includes('webgl')) {
      const gameProjects = projects.filter(p => p.category === 'game').slice(0, 5);
      return `🎮 Arhan's Game & 3D Projects:\n\n${gameProjects.map(p => `• **${p.title}** — ${p.description}`).join('\n\n')}`;
    }

    // Web projects
    if (q.includes('web app') || q.includes('website') || q.includes('full stack')) {
      const webProjects = projects.filter(p => p.category === 'web').slice(0, 5);
      return `🌐 Arhan's Web Applications:\n\n${webProjects.map(p => `• **${p.title}** — Built with ${p.technologies.slice(0, 2).join(', ')}`).join('\n\n')}`;
    }

    // Contact/Hire
    if (q.includes('hire') || q.includes('contact') || q.includes('available') || q.includes('freelance')) {
      return `✅ ${profile.availability.message}!\n\nAvailable for:\n${profile.availability.services.map(s => `• ${s}`).join('\n')}\n\nReach him: ${profile.contact.email}`;
    }

    // Social
    if (q.includes('github') || q.includes('linkedin') || q.includes('twitter') || q.includes('social') || q.includes('connect') || q.includes('youtube') || q.includes('discord')) {
      return `🔗 Connect with Arhan:\n• GitHub: ${profile.contact.github}\n• LinkedIn: ${profile.contact.linkedin}\n• Twitter: ${profile.contact.twitter}\n• YouTube: ${profile.contact.youtube}\n• Discord: ${profile.contact.discord}`;
    }

    // Achievements
    if (q.includes('achievement') || q.includes('award') || q.includes('accomplish') || q.includes('contribution') || q.includes('stat')) {
      return `🏆 Arhan's Achievements:\n${profile.achievements.map(a => `• ${a.label} — ${a.icon}`).join('\n')}`;
    }

    // Default
    return `I can help you learn about Arhan's **${projects.length}+ projects**, technical skills, AI work, 3D creations, and more! Try asking about:\n• His projects or specific project\n• Technical skills and stack\n• AI & 3D work\n• Game projects\n• Availability for hire\n• How to contact him`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    // Simulate thinking time
    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages(prev => [...prev, { type: 'ai', text: response }]);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-neutral-900 to-neutral-800">
      {/* Header */}
      <div className="p-4 border-b border-neutral-700">
        <h1 className="text-lg font-bold text-white">🤖 Arhan's AI Twin</h1>
        <p className="text-xs text-neutral-400">Ask about {projects.length}+ projects, skills, and experience</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.type === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-800 text-neutral-200 border border-neutral-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 text-neutral-400 px-4 py-2 rounded-lg text-sm border border-neutral-700">
              ⚡ Arhan AI is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-neutral-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about projects, skills, AI work..."
            className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITwinApp;
