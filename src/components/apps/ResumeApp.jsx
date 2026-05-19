import React from 'react';
import { profile } from '../../data/profile';

/**
 * Resume App
 * Interactive resume and CV viewer
 */
const ResumeApp = ({ windowId, windowData }) => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-neutral-900 to-neutral-800">
      {/* Header */}
      <div className="p-6 border-b border-neutral-700">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
            <p className="text-primary-400">{profile.title}</p>
          </div>
          <a
            href="#download"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors"
          >
            📥 Download PDF
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Experience */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>💼</span> Experience
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">Full Stack Developer & Content Creator</h3>
                <span className="text-xs text-neutral-400">2021 - Present</span>
              </div>
              <p className="text-sm text-neutral-400">
                Building innovative web experiences, creating educational content, and developing scalable applications.
              </p>
            </div>
          </div>
        </section>

        {/* Skills Summary */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>⚡</span> Technical Stack
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-semibold text-primary-400 mb-1">Frontend</p>
              <p className="text-neutral-400">React, Next.js, Three.js, TypeScript</p>
            </div>
            <div>
              <p className="font-semibold text-primary-400 mb-1">Backend</p>
              <p className="text-neutral-400">Node.js, Express, Prisma, Convex</p>
            </div>
            <div>
              <p className="font-semibold text-primary-400 mb-1">Databases</p>
              <p className="text-neutral-400">MongoDB, PostgreSQL, Firebase</p>
            </div>
            <div>
              <p className="font-semibold text-primary-400 mb-1">AI & ML</p>
              <p className="text-neutral-400">Gemini, OpenAI, LangChain</p>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>🏆</span> Achievements
          </h2>
          <ul className="space-y-2 text-sm text-neutral-400">
            {profile.achievements.map((achievement, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-lg">{achievement.icon}</span>
                {achievement.label}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ResumeApp;
