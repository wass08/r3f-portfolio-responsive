import React from 'react';
import { content } from '../../data/content';

/**
 * Content App
 * YouTube videos and blog posts
 */
const ContentApp = ({ windowId, windowData }) => {
  return (
    <div className="h-full p-6 overflow-auto bg-gradient-to-br from-neutral-900 to-neutral-800">
      <h1 className="text-2xl font-bold text-white mb-6">Content & Creator Hub</h1>

      {/* YouTube Channel */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">▶️</span>
          <h2 className="text-xl font-semibold text-white">YouTube Channel</h2>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
          <a
            href={content.youtube.channel}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 hover:text-red-300 font-semibold text-lg"
          >
            {content.youtube.channel}
          </a>
          <p className="text-sm text-neutral-400 mt-1">{content.youtube.subscribers} subscribers</p>
        </div>

        <div className="space-y-3">
          {content.youtube.videos.map((video, idx) => (
            <div key={idx} className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg">
              <h3 className="font-semibold text-white text-sm">{video.title}</h3>
              <p className="text-xs text-neutral-400 mt-1">{video.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Posts */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📝</span>
          <h2 className="text-xl font-semibold text-white">Blog Posts</h2>
        </div>
        <div className="space-y-3">
          {content.blog.posts.map((post, idx) => (
            <div key={idx} className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-white text-sm">{post.title}</h3>
                <span className="text-xs text-neutral-500">{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-neutral-400">{post.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentApp;
