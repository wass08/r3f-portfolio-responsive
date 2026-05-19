import React from 'react';
import { skillsArray } from '../../data/skills';

/**
 * Skills App
 * Interactive technical skills and technologies organized by category
 */
const SkillsApp = ({ windowId, windowData }) => {
  return (
    <div className="h-full p-6 overflow-auto bg-gradient-to-br from-neutral-900 to-neutral-800">
      <h1 className="text-2xl font-bold text-white mb-6">Technical Skills</h1>
      <div className="space-y-6">
        {skillsArray.map((skillGroup, idx) => (
          <div key={idx}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{skillGroup.icon}</span>
              <h2 className="text-lg font-semibold text-white">{skillGroup.category}</h2>
            </div>
            <div className="flex flex-wrap gap-2 pl-8">
              {skillGroup.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/30 rounded-full text-sm text-neutral-200 hover:border-primary-500 transition-all"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsApp;
