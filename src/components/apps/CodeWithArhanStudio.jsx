import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, TrendingUp, Users } from 'lucide-react';

/**
 * CodeWithArhan Studio
 * YouTube content analytics and shorts dashboard
 */
const CodeWithArhanStudio = ({ windowId, windowData }) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const channelStats = {
    subscribers: '762',
    views: '2.7 Lakh',
    watchTime: '500 hours',
    uploads: '123',
  };

  const recentShorts = [
    { id: 1, title: '3D Portfolio in React', views: '45K', duration: '60s' },
    { id: 2, title: 'React Hooks Tips', views: '32K', duration: '45s' },
    { id: 3, title: 'Three.js Performance', views: '28K', duration: '55s' },
    { id: 4, title: 'AI Integration Guide', views: '51K', duration: '50s' },
  ];

  const videoSeries = [
    {
      id: 1,
      name: 'Full Stack MERN',
      episodes: 24,
      views: '500K',
      thumbnail: '🏗️',
    },
    {
      id: 2,
      name: 'Three.js Mastery',
      episodes: 18,
      views: '350K',
      thumbnail: '🌐',
    },
    {
      id: 3,
      name: 'AI Products',
      episodes: 12,
      views: '280K',
      thumbnail: '🤖',
    },
    {
      id: 4,
      name: 'Game Dev Basics',
      episodes: 15,
      views: '220K',
      thumbnail: '🎮',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-neutral-900 to-neutral-800">
      {/* Header */}
      <div className="border-b border-white/10 p-6 bg-black/20 backdrop-blur">
        <h1 className="text-3xl font-bold text-white mb-2">CodeWithArhan Studio</h1>
        <p className="text-neutral-400">YouTube Content Analytics & Management</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 px-6 pt-4 border-b border-white/10">
        {['overview', 'shorts', 'series', 'analytics'].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              selectedTab === tab
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {selectedTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {Object.entries(channelStats).map(([key, value]) => (
                <motion.div
                  key={key}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-primary-500/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-2xl font-bold text-primary-400">{value}</div>
                  <div className="text-sm text-neutral-400 capitalize mt-1">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Channel Performance */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-green-400" />
                Monthly Growth
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Subscribers', growth: '+8.2%', color: 'bg-green-500' },
                  { name: 'Views', growth: '+15.3%', color: 'bg-blue-500' },
                  { name: 'Watch Time', growth: '+12.1%', color: 'bg-purple-500' },
                ].map((metric) => (
                  <div key={metric.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-neutral-300">{metric.name}</span>
                      <span className="text-sm text-green-400">{metric.growth}</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${metric.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: ['70%', '75%', '78%'][metric.name.length % 3] }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'shorts' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <PlayCircle size={20} className="text-primary-400" />
              Recent Shorts
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {recentShorts.map((short) => (
                <motion.div
                  key={short.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-primary-500/50 transition-all group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-4xl mb-2">📹</div>
                  <h4 className="font-semibold text-white text-sm">{short.title}</h4>
                  <div className="flex justify-between text-xs text-neutral-400 mt-2">
                    <span>{short.views}</span>
                    <span>{short.duration}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'series' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Video Series</h3>
            <div className="grid grid-cols-2 gap-4">
              {videoSeries.map((series) => (
                <motion.div
                  key={series.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-primary-500/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-5xl mb-3">{series.thumbnail}</div>
                  <h4 className="font-semibold text-white">{series.name}</h4>
                  <div className="text-sm text-neutral-400 mt-2 space-y-1">
                    <p>{series.episodes} episodes</p>
                    <p>{series.views} views</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Top Performers</h3>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="space-y-3">
                {[
                  {
                    title: 'React 3D Portfolio',
                    views: '125K',
                    ctr: '8.2%',
                    watch: '4.5m',
                  },
                  {
                    title: 'AI Integration Tips',
                    views: '98K',
                    ctr: '7.1%',
                    watch: '3.8m',
                  },
                  {
                    title: 'Full Stack Guide',
                    views: '87K',
                    ctr: '6.5%',
                    watch: '3.2m',
                  },
                ].map((video, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-black/30 rounded">
                    <div>
                      <p className="font-medium text-white text-sm">{video.title}</p>
                      <p className="text-xs text-neutral-500">{video.views} views</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-400">{video.ctr}</p>
                      <p className="text-xs text-neutral-500">{video.watch} watch</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeWithArhanStudio;
