import React, { useState } from 'react';

const themes = [
  { name: 'Original', icon: '👶' },
  { name: 'Dreamy', icon: '✨' },
  { name: 'Vintage', icon: '🎞️' },
  { name: 'Bright', icon: '☀️' },
  { name: 'Soft', icon: '🌸' },
  { name: 'Classic', icon: '📷' }
];

const ThemeSelector = () => {
  const [selectedTheme, setSelectedTheme] = useState(0);

  return (
    <div className="absolute right-4 top-1/3 -translate-y-1/2">
      <div className="flex flex-col gap-4">
        {themes.map((theme, index) => (
          <button
            key={theme.name}
            onClick={() => setSelectedTheme(index)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
              transition-all duration-200 hover:scale-110
              ${selectedTheme === index 
                ? 'bg-white text-black shadow-lg' 
                : 'bg-black/30 text-white hover:bg-black/40'}`}
          >
            {theme.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;