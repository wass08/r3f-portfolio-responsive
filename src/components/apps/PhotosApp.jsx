import React, { useState, useEffect } from 'react';
import photosManifest from '../../generated/photos.json';

const PhotosApp = () => {
  const [photos, setPhotos] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    setPhotos(photosManifest || []);
  }, []);

  return (
    <div className="h-full p-4 bg-neutral-900 text-neutral-100 overflow-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.length === 0 && <div className="text-sm text-neutral-400">No photos found</div>}
        {photos.map((p) => (
          <button key={p} className="rounded overflow-hidden" onClick={() => setActive(p)}>
            <img src={p} alt="photo" className="w-full h-28 object-cover" />
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setActive(null)}>
          <img src={active} alt="active" className="max-w-[90%] max-h-[90%] rounded shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default PhotosApp;
