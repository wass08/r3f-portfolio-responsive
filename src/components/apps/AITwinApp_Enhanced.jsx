import React, { useState, useRef, useEffect } from 'react';
import { profile } from '../../data/profile';
import { projects } from '../../data/projects';
import { skills } from '../../data/skills';

/**
 * Utility: Fuzzy search for projects or skills
 * Returns array of matches sorted by relevance
 */
const fuzzySearch = (query, items, searchField = 'title') => {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return items
    .map(item => {
      const text = item[searchField]?.toLowerCase() || '';
      const score = calculateFuzzyScore(q, text);
      return { item, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(result => result.item);
};

/**
 * Calculate fuzzy match score (0-100)
 */
const calculateFuzzyScore = (query, text) => {
  if (!text) return 0;
  
  // Exact match bonus
  if (text === query) return 100;
  if (text.includes(query)) return 80;
  
  // Check if all characters match in order
  let queryIndex = 0;
  let score = 0;
  
  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      queryIndex++;
      score += 10;
    }
  }
  
  return queryIndex === query.length ? score : 0;
};

/**
 * Classify user query intent
 */
const classifyQuery = (query) => {
  const q = query.toLowerCase();
  
  if (q.match(/\b(hello|hi|hey|what'?s up)\b/)) return 'greeting';
  if (q.match(/\b(who|tell me|about|bio|background)\b/)) return 'about';
  if (q.match(/\b(ai|ml|machine learning|neural|nlp|gemini|openai|tensorflow|pytorch)\b/)) return 'ai_projects';
  if (q.match(/\b(3d|three|game|graphics|webgl|threejs|babylon)\b/)) return 'game_projects';
  if (q.match(/\b(web|fullstack|react|node|frontend|backend)\b/)) return 'web_projects';
  if (q.match(/\b(skill|tech|stack|know|proficient|language|framework)\b/)) return 'skills';
  if (q.match(/\b(project|built|created|develop|make)\b/)) return 'projects';
  if (q.match(/\b(hire|available|freelance|contact|email|reach|work with me)\b/)) return 'contact';
  if (q.match(/\b(achievement|award|stat|contribution|github|gpa)\b/)) return 'achievements';
  if (q.match(/\b(github|linkedin|twitter|social|connect|youtube|discord)\b/)) return 'social';
  
  return 'general';
};

/**
 * AI Twin App
 * Arhan's AI portfolio assistant - answers questions using portfolio data
 */
const AITwinApp = ({ windowId, windowData }) => {
  const [messages, setMessages] = useState([
    { type: 'ai', text: `👋 Hey! I'm Arhan's AI Twin. Ask me about his ${projects.length}+ projects, skills, experience, or availability!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = (query) => {
    const intent = classifyQuery(query);
    const q = query.toLowerCase();

    switch (intent) {
      case 'greeting':
        return `👋 Hey! I'm Arhan's AI assistant. You can ask me about his ${projects.length}+ projects, skills, experience, or anything in his portfolio!`;

      case 'about':
        return `📖 ${profile.bio.intro}\n\n🎯 Current Focus:\n${profile.bio.journey}`;

      case 'ai_projects': {
        const aiProjects = projects.filter(p => 
          p.category === 'ai' || 
          p.technologies?.some(t => ['OpenAI', 'Gemini', 'TensorFlow', 'PyTorch', 'NLP', 'ML'].some(x => t.toLowerCase().includes(x.toLowerCase())))
        );
        if (aiProjects.length === 0) return `🤖 Arhan has ${projects.filter(p => p.category === 'ai').length} AI/ML projects. Try asking about specific tech stacks!`;
        return `🤖 Arhan's AI/ML Projects (${aiProjects.length} total):\n\n${aiProjects.slice(0, 5).map(p => 
          `• **${p.title}**\n  🔧 ${p.technologies.join(', ')}\n  📝 ${p.description}`
        ).join('\n\n')}`;
      }

      case 'game_projects': {
        const gameProjects = projects.filter(p => 
          p.category === 'game' || 
          p.technologies?.some(t => ['Three.js', 'Babylon.js', 'WebGL', '3D', 'Game'].some(x => t.toLowerCase().includes(x.toLowerCase())))
        );
        if (gameProjects.length === 0) return `🎮 Arhan has ${projects.filter(p => p.category === 'game').length} game/3D projects!`;
        return `🎮 Arhan's Game & 3D Projects:\n\n${gameProjects.slice(0, 5).map(p => 
          `• **${p.title}**\n  📝 ${p.description}\n  🔧 ${p.technologies.join(', ')}`
        ).join('\n\n')}`;
      }

      case 'web_projects': {
        const webProjects = projects.filter(p => 
          p.category === 'web' || 
          p.technologies?.some(t => ['React', 'Node', 'Vue', 'Angular', 'Full Stack'].some(x => t.toLowerCase().includes(x.toLowerCase())))
        );
        if (webProjects.length === 0) return `🌐 Arhan has ${projects.filter(p => p.category === 'web').length} web projects!`;
        return `🌐 Arhan's Web Applications (${webProjects.length}):\n\n${webProjects.slice(0, 4).map(p => 
          `• **${p.title}**\n  🔧 Built with: ${p.technologies.slice(0, 3).join(', ')}`
        ).join('\n\n')}`;
      }

      case 'skills': {
        const skillsByCategory = {};
        skills.forEach(skill => {
          if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
          skillsByCategory[skill.category].push(skill.name);
        });
        return `⚡ Arhan's Tech Stack:\n\n${Object.entries(skillsByCategory).slice(0, 6).map(([cat, items]) => 
          `• **${cat}**: ${items.slice(0, 5).join(', ')}${items.length > 5 ? ` +${items.length - 5} more` : ''}`
        ).join('\n')}`;
      }

      case 'projects': {
        // Check if user is asking about a specific project
        const matches = fuzzySearch(query, projects, 'title');
        if (matches.length > 0) {
          const p = matches[0];
          return `🚀 **${p.title}**\n\n📝 ${p.description}\n🔧 Tech: ${p.technologies.join(', ')}\n${p.github ? `🔗 GitHub: ${p.github}` : ''}${p.url ? `\n🌐 Live: ${p.url}` : ''}`;
        }
        const recent = projects.slice(0, 5);
        return `🚀 Arhan's Latest Projects (${projects.length} total):\n\n${recent.map(p => 
          `• **${p.title}** — ${p.description.substring(0, 50)}...`
        ).join('\n')}\n\nAsk about a specific project or browse the Projects app!`;
      }

      case 'contact':
        return `✅ ${profile.availability.message}!\n\n📋 Available for:\n${profile.availability.services.map(s => `• ${s}`).join('\n')}\n\n📧 Reach him: ${profile.contact.email}`;

      case 'achievements':
        return `🏆 Arhan's Key Stats:\n• 250+ Projects Built\n• 1,869 GitHub Contributions\n• 3+ Years of Experience\n• Full Stack Developer\n\n${profile.achievements.slice(0, 3).map(a => `• ${a.label}`).join('\n')}`;

      case 'social':
        return `🔗 Connect with Arhan:\n• GitHub: github.com/rhearhan\n• LinkedIn: linkedin.com/in/arhankhimani\n• Twitter: @rhearhan\n• YouTube: youtube.com/@CodeWithArhan\n• Discord: For collaborations`;

      default: {
        // Try to match against project names
        const projectMatches = fuzzySearch(query, projects, 'title').slice(0, 3);
        if (projectMatches.length > 0) {
          return `🔍 Found projects matching "${query}":\n\n${projectMatches.map(p => 
            `• **${p.title}** — ${p.technologies.join(', ')}`
          ).join('\n')}\n\nAsk more about any of these!`;
        }
        
        return `I can help you explore Arhan's portfolio! Try asking about:\n• **Specific projects** (e.g., "Show me AI projects")\n• **Tech stack** (e.g., "What does he know?")\n• **Achievements** and stats\n• **3D/Game** projects\n• **How to hire** or contact him`;
      }
    }
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
    }, 300);
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
              className={`max-w-xs px-4 py-2 rounded-lg text-sm whitespace-pre-wrap break-words ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-neutral-200 border border-neutral-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 text-neutral-400 px-4 py-2 rounded-lg text-sm border border-neutral-700 animate-pulse">
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
            className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITwinApp;
