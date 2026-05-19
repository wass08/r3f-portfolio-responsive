import React, { useState } from 'react';
import { projects } from '../../data/projects';

/**
 * Projects App
 * Browse all portfolio projects with filtering
 */
const ProjectsApp = ({ windowId, windowData }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'featured', label: 'Featured' },
    { id: 'ai', label: 'AI & ML' },
    { id: 'web', label: 'Web' },
    { id: 'game', label: 'Games' },
    { id: 'productivity', label: 'Productivity' },
  ];

  const filtered = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory || (selectedCategory === 'featured' && p.type === 'featured'));

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-neutral-900 to-neutral-800">
      {/* Header */}
      <div className="p-6 border-b border-neutral-700">
        <h1 className="text-2xl font-bold text-white mb-4">Portfolio Projects</h1>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(project => (
            <div
              key={project.id}
              className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg hover:border-primary-500/50 hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">{project.title}</h3>
                {project.type === 'featured' && (
                  <span className="text-xs px-2 py-1 bg-accent-500/20 text-accent-300 rounded">Featured</span>
                )}
              </div>
              <p className="text-sm text-neutral-400 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies.slice(0, 3).map(tech => (
                  <span key={tech} className="text-xs px-2 py-0.5 bg-primary-500/10 text-primary-300 rounded">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 text-xs">
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">
                    🔗 View
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-300">
                    🐙 Code
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsApp;
