import React, { useState } from 'react';
import { ShoppingBag, Search, Star } from 'lucide-react';

/**
 * App Store - System App Store
 */
const AppStoreApp = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredApps = [
    { name: 'VSCode', category: 'Developer Tools', rating: 4.8 },
    { name: 'Figma', category: 'Design', rating: 4.9 },
    { name: 'Notion', category: 'Productivity', rating: 4.7 },
  ];

  return (
    <div className="w-full h-full bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag size={20} className="text-blue-500" />
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">App Store</h1>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Featured Apps */}
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Featured</h2>
        <div className="space-y-4">
          {featuredApps.map((app) => (
            <div
              key={app.name}
              className="bg-white dark:bg-neutral-800 p-4 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{app.name}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{app.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">{app.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppStoreApp;
