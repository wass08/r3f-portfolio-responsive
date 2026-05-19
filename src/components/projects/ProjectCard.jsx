import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCaseStudyModal } from "./ProjectCaseStudyModal";

/**
 * ProjectCard Component - MEMOIZED to prevent unnecessary re-renders
 * Only re-renders when project data or onClick changes
 */
const ProjectCard = memo(({ project, index, onClick }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = () => {
    onClick?.(index);
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleExternalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <motion.div
        className="card-modern group cursor-pointer overflow-hidden h-full flex flex-col"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.05 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        whileHover={{ y: -4 }}
        onClick={handleCardClick}
      >
        {/* Project Image - OPTIMIZED WITH LAZY LOADING */}
        <div className="relative h-48 overflow-hidden rounded-xl mb-4 bg-neutral-800">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Overlay Actions */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex space-x-3">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary-500/90 text-white rounded-full hover:bg-primary-600 transition-colors"
                onClick={handleExternalClick}
                aria-label="Visit project"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-neutral-800/90 text-white rounded-full hover:bg-neutral-700 transition-colors"
                  onClick={handleExternalClick}
                  aria-label="View GitHub repository"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-primary-500/90 text-white text-xs font-medium rounded-full">
              {project.category || "Web"}
            </span>
          </div>

          {/* Project Type Badge */}
          {project.type && (
            <div className="absolute top-3 right-3">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  project.type === "original"
                    ? "bg-green-500/90 text-white"
                    : project.type === "inspired"
                      ? "bg-yellow-500/90 text-white"
                      : project.type === "learning"
                        ? "bg-blue-500/90 text-white"
                        : "bg-purple-500/90 text-white"
                }`}
              >
                {project.type === "original"
                  ? "✨ Original"
                  : project.type === "inspired"
                    ? "🎨 Inspired"
                    : project.type === "learning"
                      ? "📚 Learning"
                      : "👨‍💼 Client"}
              </span>
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-neutral-100 group-hover:text-primary-300 transition-colors line-clamp-2">
            {project.title}
          </h3>

          <p className="text-neutral-400 text-sm line-clamp-3 leading-relaxed" title={project.description}>
            {project.description}
          </p>

          {/* Tech Stack */}
          {project.technologies && (
            <div className="flex flex-wrap gap-2 pt-2">
              {project.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-neutral-800/50 text-neutral-300 text-xs rounded-md"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-2 py-1 bg-neutral-700/50 text-neutral-400 text-xs rounded-md">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Case study button */}
          <button
            onClick={handleDetailsClick}
            className="mt-2 text-xs text-primary-400 hover:text-primary-300 underline underline-offset-2 transition-colors"
          >
            View details →
          </button>
        </div>
      </motion.div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {showModal && <ProjectCaseStudyModal project={project} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo - only re-render if these change
  return (
    prevProps.project === nextProps.project &&
    prevProps.index === nextProps.index &&
    prevProps.onClick === nextProps.onClick
  );
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
