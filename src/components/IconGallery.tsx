import React, { useEffect, useState } from "react";
import { fetchIcons, IconscoutIcon } from "../lib/iconscout/fetchIcons";

interface IconGalleryProps {
  darkMode?: boolean;
  searchQuery?: string;
}

const IconGallery: React.FC<IconGalleryProps> = ({ 
  darkMode = false, 
  searchQuery = "medical" 
}) => {
  const [icons, setIcons] = useState<IconscoutIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIcons = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fetchedIcons = await fetchIcons(searchQuery);
        setIcons(fetchedIcons);
      } catch (err) {
        setError("Failed to load icons");
        console.error("Error loading icons:", err);
      } finally {
        setLoading(false);
      }
    };

    loadIcons();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className={`p-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <div className="grid grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className={`w-16 h-4 mt-2 rounded animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="grid grid-cols-5 gap-4">
        {icons.map((icon) => (
          <div key={icon.id} className="flex flex-col items-center">
            <img 
              src={icon.download_url} 
              alt={icon.name} 
              className="w-10 h-10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-xs text-center mt-2 truncate w-full">
              {icon.name}
            </span>
          </div>
        ))}
      </div>
      
      {icons.length === 0 && (
        <div className="text-center py-8">
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No icons found for "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
};

export default IconGallery;