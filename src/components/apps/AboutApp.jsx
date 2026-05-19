import React from 'react';
import { profile } from '../../data/profile';

/**
 * About App
 * Shows Arhan's profile, journey, and key stats
 */
const AboutApp = ({ windowId, windowData }) => {
  return (
    <div className="h-full p-6 overflow-auto bg-gradient-to-br from-neutral-900 to-neutral-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
        <p className="text-primary-400 text-lg">{profile.title}</p>
        <p className="text-neutral-400 mt-1">{profile.tagline}</p>
      </div>

      {/* Bio */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">About</h2>
        <p className="text-neutral-300 leading-relaxed">{profile.bio.intro}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-primary-400">{profile.stats.projects}+</div>
          <div className="text-sm text-neutral-400">Projects</div>
        </div>
        <div className="bg-accent-500/10 border border-accent-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-accent-400">{profile.stats.yearsExperience}</div>
          <div className="text-sm text-neutral-400">Years Experience</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{profile.stats.contributions}</div>
          <div className="text-sm text-neutral-400">GitHub Commits</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{profile.stats.technologiesMastered}</div>
          <div className="text-sm text-neutral-400">Technologies</div>
        </div>
      </div>

      {/* Journey */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-3">My Journey</h2>
        <div className="text-neutral-300 whitespace-pre-line text-sm leading-relaxed">
          {profile.bio.journey}
        </div>
      </div>
    </div>
  );
};

export default AboutApp;
