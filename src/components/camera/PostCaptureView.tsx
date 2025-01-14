import React from 'react';
import { X, Download, Check } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

interface PostCaptureViewProps {
  photoUrl: string;
  onSave: () => void;
  onDiscard: () => void;
}

const PostCaptureView: React.FC<PostCaptureViewProps> = ({ 
  photoUrl, 
  onSave, 
  onDiscard 
}) => {
  return (
    <div className="relative h-full bg-black text-white">
      <div className="h-full">
        <img 
          src={photoUrl}
          alt="Captured Preview" 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute top-0 w-full p-4 flex justify-between items-center">
          <button 
            className="p-2 bg-black/50 rounded-full transition-transform hover:scale-110"
            onClick={onDiscard}
          >
            <X className="w-6 h-6" />
          </button>
          <button className="p-2 bg-black/50 rounded-full transition-transform hover:scale-110">
            <Download className="w-6 h-6" />
          </button>
        </div>

        <ThemeSelector />

        <div className="absolute bottom-0 w-full p-6 flex justify-center">
          <button 
            className="px-8 py-3 bg-blue-600 rounded-full flex items-center justify-center
              transition-all duration-200 hover:bg-blue-700 hover:scale-105"
            onClick={onSave}
          >
            <Check className="w-5 h-5 mr-2" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCaptureView;