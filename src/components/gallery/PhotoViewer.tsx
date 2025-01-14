import React from 'react';
import { X, Download, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PhotoViewerProps {
  photoUrl: string;
  onClose: () => void;
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ photoUrl, onClose }) => {
  const { toast } = useToast();

  const handleShare = () => {
    toast({
      title: "Sharing photo",
      description: "Preparing to share this precious moment.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Saving photo",
      description: "Photo saved to your device.",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-4/5 h-4/5">
          <button 
            className="absolute -top-12 right-0 p-2 bg-white/10 rounded-full backdrop-blur-md
              transition-transform hover:scale-110"
            onClick={onClose}
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <img 
            src={photoUrl}
            alt="Full size preview"
            className="w-full h-full object-contain rounded-lg"
          />

          <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-4">
            <button 
              className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full flex items-center gap-2 text-white
                transition-all duration-200 hover:bg-white/20"
              onClick={handleSave}
            >
              <Download className="w-5 h-5" />
              Save
            </button>
            <button 
              className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full flex items-center gap-2 text-white
                transition-all duration-200 hover:bg-white/20"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoViewer;