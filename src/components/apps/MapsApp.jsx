import React, { useState } from 'react';
import { MapPin, Search, Navigation } from 'lucide-react';

/**
 * Maps App - System Maps Application
 */
const MapsApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [coords, setCoords] = useState({ latitude: 28.6139, longitude: 77.2090 });
  const [loading, setLoading] = useState(false);

  const geocode = async (q) => {
    setLoading(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1`);
      const json = await res.json();
      if (json?.results?.length) {
        const r = json.results[0];
        setCoords({ latitude: r.latitude, longitude: r.longitude });
      }
    } catch (e) {
      // ignore
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-full bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={20} className="text-red-500" />
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Maps</h1>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <div className="p-4">
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-3 text-neutral-500" />
            <input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none"
            />
            <button onClick={() => geocode(searchQuery)} className="absolute right-2 top-2 px-3 py-1 rounded bg-white/10">Search</button>
          </div>

          <div className="w-full h-[60vh] bg-white/5 rounded-lg overflow-hidden">
            <iframe
              title="map"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.longitude - 0.02}%2C${coords.latitude - 0.02}%2C${coords.longitude + 0.02}%2C${coords.latitude + 0.02}&layer=mapnik&marker=${coords.latitude}%2C${coords.longitude}`}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapsApp;
