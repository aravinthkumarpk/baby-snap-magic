import React, { useState } from 'react';
import { Camera, ImagePlus, Zap, RotateCcw } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

interface CameraViewProps {
  onCapture: (photoUrl: string) => void;
  onGalleryClick: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onGalleryClick }) => {
  const [flash, setFlash] = useState(false);

  const handleCapture = () => {
    // Simulate photo capture - in a real app, this would use the device camera
    onCapture('/placeholder.svg');
  };

  return (
    <div className="relative h-full bg-black text-white">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white/50 text-xl">Camera area</span>
      </div>
      
      <div className="absolute top-0 w-full p-4 flex justify-between">
        <button 
          className="p-2 bg-black/50 rounded-full transition-transform hover:scale-110"
          onClick={() => setFlash(!flash)}
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <button 
          className="p-2 bg-black/50 rounded-full transition-transform hover:scale-110"
        >
          <Zap className={`w-6 h-6 ${flash ? 'text-yellow-400' : 'text-white'}`} />
        </button>
      </div>

      <ThemeSelector />

      <div className="absolute bottom-6 w-full px-12">
        <div className="flex justify-between items-center">
          <button 
            className="p-3 bg-black/50 rounded-full transition-transform hover:scale-110"
            onClick={onGalleryClick}
          >
            <ImagePlus className="w-6 h-6" />
          </button>

          <button 
            className="p-6 bg-white rounded-full transition-transform hover:scale-105"
            onClick={handleCapture}
          >
            <div className="w-4 h-4 bg-transparent border-2 border-gray-900 rounded-full" />
          </button>

          <div className="w-12 h-12" />
        </div>
      </div>
    </div>
  );
};

export default CameraView;