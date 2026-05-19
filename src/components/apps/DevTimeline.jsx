import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/**
 * Dev Timeline
 * Interactive timeline of Arhan's development journey
 */
const DevTimeline = ({ windowId, windowData }) => {
  const [selectedYear, setSelectedYear] = useState(2024);

  const timelineEvents = {
    2021: {
      title: 'The Beginning',
      icon: '🌱',
      milestones: [
        { month: 'Jan', achievement: 'Started learning web development', tags: ['HTML', 'CSS'] },
        { month: 'Apr', achievement: 'First JavaScript project', tags: ['JavaScript', 'DOM'] },
        { month: 'Jul', achievement: 'Built first website', tags: ['Portfolio', 'Bootstrap'] },
        { month: 'Dec', achievement: 'Completed bootcamp', tags: ['Certification'] },
      ],
      stats: { projects: 5, followers: '0K', hours: '500+' },
    },
    2022: {
      title: 'Full Stack Era',
      icon: '🚀',
      milestones: [
        { month: 'Feb', achievement: 'Started MERN development', tags: ['MongoDB', 'Express', 'React'] },
        { month: 'Jun', achievement: 'First SaaS project', tags: ['SaaS', 'Stripe', 'JWT'] },
        { month: 'Sep', achievement: 'Reached 10K followers', tags: ['Social', 'Network'] },
        { month: 'Nov', achievement: 'Deployed 10+ production apps', tags: ['DevOps', 'AWS'] },
      ],
      stats: { projects: 15, followers: '10K', hours: '2000+' },
    },
    2023: {
      title: '3D & Advanced Graphics',
      icon: '🌐',
      milestones: [
        { month: 'Jan', achievement: 'Learned Three.js basics', tags: ['3D', 'WebGL', 'GLSL'] },
        { month: 'Apr', achievement: 'Built 3D portfolio website', tags: ['Three.js', 'R3F'] },
        { month: 'Aug', achievement: 'Launched game project', tags: ['Game Dev', 'Babylon.js'] },
        { month: 'Oct', achievement: 'Reached 50K followers', tags: ['Milestone', 'Creator'] },
      ],
      stats: { projects: 25, followers: '50K', hours: '3500+' },
    },
    2024: {
      title: 'AI Products & Scaling',
      icon: '🤖',
      milestones: [
        { month: 'Jan', achievement: 'Integrated AI into projects', tags: ['OpenAI', 'GPT', 'ML'] },
        { month: 'Mar', achievement: 'Launched AutoYT product', tags: ['SaaS', 'Launch'] },
        { month: 'Jun', achievement: 'Reached 100K followers', tags: ['Milestone', 'YouTube'] },
        { month: 'Nov', achievement: 'Building advanced AI systems', tags: ['AI', 'Production'] },
      ],
      stats: { projects: 40, followers: '100K', hours: '5000+' },
    },
    2025: {
      title: 'Future Vision',
      icon: '🚀',
      milestones: [
        { month: 'Goal', achievement: 'Scale AI products to 10K users', tags: ['Growth', 'Target'] },
        { month: 'Goal', achievement: 'Build web3 integrations', tags: ['Web3', 'Blockchain'] },
        { month: 'Goal', achievement: 'Create educational platform', tags: ['EdTech', 'Community'] },
        { month: 'Goal', achievement: 'Become AI thought leader', tags: ['Leadership', 'Speaking'] },
      ],
      stats: { projects: '50+', followers: '250K+', hours: '10000+' },
    },
  };

  const currentEvent = timelineEvents[selectedYear];
  const years = Object.keys(timelineEvents).map(Number);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-neutral-900 to-neutral-800">
      {/* Header */}
      <div className="border-b border-white/10 p-6 bg-black/20 backdrop-blur">
        <h1 className="text-3xl font-bold text-white mb-2">Dev Journey Timeline</h1>
        <p className="text-neutral-400">Tracking progress from 2021 to future vision</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Year Selector */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-3">
            Select Year
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {years.map((year) => (
              <motion.button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedYear === year
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50'
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {year}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Timeline Event */}
        <motion.div
          key={selectedYear}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Title */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{currentEvent.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-white">{currentEvent.title}</h2>
              <p className="text-sm text-neutral-400">{selectedYear}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Projects', value: currentEvent.stats.projects },
              { label: 'Followers', value: currentEvent.stats.followers },
              { label: 'Coding Hours', value: currentEvent.stats.hours },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:border-primary-500/50 transition-all"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-2xl font-bold text-primary-400">{stat.value}</div>
                <div className="text-xs text-neutral-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Milestones */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Milestones</h3>
            <div className="space-y-4">
              {currentEvent.milestones.map((milestone, idx) => (
                <motion.div
                  key={idx}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {/* Timeline Dot */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="w-4 h-4 rounded-full bg-primary-500 border-2 border-primary-300"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.1 + 0.1 }}
                    />
                    {idx < currentEvent.milestones.length - 1 && (
                      <div className="w-0.5 h-12 bg-gradient-to-b from-primary-500 to-transparent mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white">{milestone.achievement}</h4>
                      <span className="text-xs text-neutral-500">{milestone.month}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {milestone.tags.map((tag, tagIdx) => (
                        <motion.span
                          key={tagIdx}
                          className="px-2 py-1 bg-primary-500/20 border border-primary-500/30 rounded text-xs text-primary-300"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 + tagIdx * 0.05 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Next Year Preview */}
          {selectedYear < Math.max(...years) && (
            <motion.button
              onClick={() => setSelectedYear(selectedYear + 1)}
              className="w-full py-3 bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-white/10 rounded-lg text-primary-400 font-medium hover:border-primary-500/50 transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              See Next Year
              <ChevronRight size={16} />
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DevTimeline;
