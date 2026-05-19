import React, { useState, useMemo, useCallback, memo } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { usePagination, useFilteredPagination } from "../../hooks/usePagination";

/**
 * ProjectGrid Component - OPTIMIZED
 * Handles:
 * - Category filtering
 * - Pagination with "Load More"
 * - Memoized rendering
 */
const ProjectGrid = memo(
  ({ projects, initialVisibleCount = 12 }) => {
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Memoize categories to prevent recalculation
    const categories = useMemo(() => {
      return ["all", ...new Set(projects.map((p) => p.category || "web").filter(Boolean))];
    }, [projects]);

    // Filter projects by category
    const filterFunction = useCallback(
      (project) => {
        return selectedCategory === "all" || project.category === selectedCategory;
      },
      [selectedCategory]
    );

    // Use filtered pagination hook
    const { displayItems, loadMore, hasMore, remainingItems } = useFilteredPagination(
      projects,
      filterFunction,
      initialVisibleCount
    );

    // Handle category change - reset pagination
    const handleCategoryChange = useCallback((category) => {
      setSelectedCategory(category);
    }, []);

    return (
      <div className="w-full space-y-8">
        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-primary-500 text-white shadow-glow"
                  : "bg-neutral-800/50 text-neutral-400 hover:bg-neutral-700/50 hover:text-white border border-neutral-700/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid - OPTIMIZED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((project, index) => (
            <ProjectCard
              key={`${project.title}-${selectedCategory}`}
              project={project}
              index={index}
              onClick={() => {
                // Handle click if needed
              }}
            />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={loadMore}
              className="px-8 py-3 rounded-xl border border-primary-500/40 text-neutral-200 glass-morphism font-semibold hover:border-primary-500/80 transition-colors duration-300"
              whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(14,165,233,0.2)" }}
              whileTap={{ scale: 0.97 }}
            >
              Load More Projects ({remainingItems} remaining)
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {displayItems.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-neutral-400 text-sm">
              No projects found in "{selectedCategory}" category.
            </p>
          </motion.div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom memo comparison
    return prevProps.projects === nextProps.projects;
  }
);

ProjectGrid.displayName = "ProjectGrid";

export default ProjectGrid;
