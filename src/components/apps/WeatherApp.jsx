import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Wind, Droplets, Search } from 'lucide-react';

/**
 * Weather App - System Weather Application
 */
const WeatherApp = () => {
  const [temperature, setTemperature] = useState(null);
  const [location, setLocation] = useState('New York');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const geocodeAndFetch = async (query) => {
    setLoading(true);
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`);
      const geo = await geoRes.json();
      if (!geo || !geo.results || geo.results.length === 0) {
        setForecast(null);
        setLoading(false);
        return;
      }
      const { latitude, longitude, name, country } = geo.results[0];
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&current_weather=true&timezone=auto`);
      const weather = await weatherRes.json();
      setLocation(`${name}${country ? ', ' + country : ''}`);
      setTemperature(weather.current_weather?.temperature ?? null);
      setForecast(weather.daily || null);
    } catch (err) {
      setForecast(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    geocodeAndFetch(location);
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-900 dark:to-blue-700 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2">
            <Search size={18} className="text-white/80" />
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-white/10 rounded px-3 py-2 text-white outline-none" />
            <button onClick={() => geocodeAndFetch(location)} className="px-3 py-2 rounded bg-white/10">Search</button>
          </div>
        </div>

        <Cloud size={96} className="mx-auto mb-6" />
        <div className="text-7xl font-bold mb-2">{loading ? '...' : (temperature !== null ? `${temperature}°` : '--')}</div>
        <p className="text-2xl mb-8">{location}</p>

        {/* Weather Details / Forecast */}
        {forecast ? (
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto bg-white/10 backdrop-blur-lg p-6 rounded-2xl">
            {(forecast.time || []).slice(0,3).map((d, idx) => (
              <div key={d} className="text-center">
                <div className="text-sm opacity-75">{new Date(d).toLocaleDateString()}</div>
                <div className="font-semibold">{Math.round(forecast.temperature_2m_max[idx])}° / {Math.round(forecast.temperature_2m_min[idx])}°</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/70">No forecast available</div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
