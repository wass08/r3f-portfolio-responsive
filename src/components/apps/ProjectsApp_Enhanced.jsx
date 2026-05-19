import React, { useState } from 'react';
import { projects } from '../../data/projects';
import { X } from 'lucide-react';

/**
 * Projects App - Enhanced
 * Browse all portfolio projects with filtering, thumbnails, and detail modals
 */
const ProjectsApp = ({ windowId, windowData }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    { id: 'all', label: 'All', color: 'neutral' },
    { id: 'featured', label: '⭐ Featured', color: 'yellow' },
    { id: 'ai', label: '🤖 AI & ML', color: 'purple' },
    { id: 'web', label: '🌐 Web', color: 'blue' },
    { id: 'game', label: '🎮 Games', color: 'pink' },
    { id: 'productivity', label: '⚙️ Tools', color: 'green' },
  ];

  const categoryColors = {
    ai: 'from-purple-900/30 to-purple-800/10',
    web: 'from-blue-900/30 to-blue-800/10',
    game: 'from-pink-900/30 to-pink-800/10',
    productivity: 'from-green-900/30 to-green-800/10',
    featured: 'from-yellow-900/30 to-yellow-800/10',
    default: 'from-neutral-800/30 to-neutral-700/10',
  };

  const filtered = selectedCategory === 'all'
    ? projects
    : projects.filter(p => {
        if (selectedCategory === 'featured') return p.featured === true || p.type === 'featured';
        return p.category === selectedCategory;
      });

  const getCategoryColor = (category) => categoryColors[category] || categoryColors.default;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-neutral-900 to-neutral-800">
      {/* Header */}
      <div className="p-6 border-b border-neutral-700">
        <h1 className="text-2xl font-bold text-white mb-4">
          🚀 Portfolio ({filtered.length})
        </h1>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-600 hover:scale-105'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(project => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer transform transition-all hover:scale-105"
            >
              {/* Card */}
              <div className={`bg-gradient-to-br ${getCategoryColor(project.category)} border border-neutral-700 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all shadow-lg hover:shadow-cyan-500/20`}>
                {/* Image/Thumbnail Area */}
                <div className="relative h-40 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(project.category)} flex items-center justify-center text-4xl`}>
                      {project.category === 'ai' && '🤖'}
                      {project.category === 'web' && '🌐'}
                      {project.category === 'game' && '🎮'}
                      {project.category === 'productivity' && '⚙️'}
                      {!['ai', 'web', 'game', 'productivity'].includes(project.category) && '🚀'}
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  {(project.featured === true || project.type === 'featured') && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/90 text-yellow-900 text-xs font-bold rounded-full">
                      ⭐ Featured
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs font-medium rounded backdrop-blur-sm">
                    {project.category.toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-neutral-400 mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.slice(0, 4).map(tech => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-xs px-2 py-1 bg-neutral-700/50 text-neutral-400 rounded-full">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex gap-2 pt-2 border-t border-neutral-700">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 px-2 py-1 text-xs bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 rounded-lg transition-all text-center font-medium"
                      >
                        🔗 Live
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 px-2 py-1 text-xs bg-neutral-700/50 text-neutral-300 hover:bg-neutral-600 rounded-lg transition-all text-center font-medium"
                      >
                        🐙 Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-lg max-w-2xl w-full max-h-96 overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-neutral-700 bg-neutral-800/50 backdrop-blur">
              <h2 className="text-2xl font-bold text-white">{selectedProject.title}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1 hover:bg-neutral-700 rounded-lg transition-all"
              >
                <X size={20} className="text-neutral-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Image */}
              {selectedProject.image && (
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-cyan-300 mb-2">ABOUT THIS PROJECT</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-sm font-semibold text-cyan-300 mb-2">TECH STACK</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map(tech => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-cyan-500/30 text-cyan-200 rounded-full text-sm font-medium border border-cyan-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Category & Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-1">Category</h3>
                  <p className="text-white font-medium capitalize">{selectedProject.category}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-1">Type</h3>
                  <p className="text-white font-medium capitalize">{selectedProject.type || 'Project'}</p>
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-3 pt-4 border-t border-neutral-700">
                {selectedProject.url && (
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all text-center font-medium"
                  >
                    🔗 View Live
                  </a>
                )}
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-all text-center font-medium"
                  >
                    🐙 View Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsApp;
