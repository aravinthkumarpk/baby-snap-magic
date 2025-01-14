import React, { useState } from 'react';
import { Share2, Download, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ResultsGalleryProps {
  onPhotoClick: (photoUrl: string) => void;
  onBackClick: () => void;
}

const ResultsGallery: React.FC<ResultsGalleryProps> = ({ onPhotoClick, onBackClick }) => {
  const { toast } = useToast();
  const photos = [
    { id: 1, name: 'Morning smile', rotate: '-rotate-3' },
    { id: 2, name: 'Playtime', rotate: 'rotate-2' },
    { id: 3, name: 'Nap time', rotate: 'rotate-1' },
    { id: 4, name: 'First steps', rotate: '-rotate-2' },
    { id: 5, name: 'Bath time', rotate: 'rotate-3' },
    { id: 6, name: 'Giggles', rotate: '-rotate-1' }
  ];

  const handleShare = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    toast({
      title: "Sharing photo",
      description: `Sharing "${name}" with your loved ones.`,
    });
  };

  return (
    <div className="h-full bg-white p-6 relative">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBackClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold ml-2">Gallery</h1>
      </div>

      <div className="h-[calc(100%-8rem)] overflow-y-auto">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {photos.map((photo) => (
            <div 
              key={photo.id}
              className={`relative group ${photo.rotate} hover:-translate-y-2 transition-all duration-200 cursor-pointer`}
              onClick={() => onPhotoClick('/placeholder.svg')}
            >
              <div className="bg-white p-3 rounded-lg shadow-lg">
                <div className="aspect-square bg-gray-100 mb-4 rounded-lg overflow-hidden">
                  <img 
                    src="/placeholder.svg"
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-center font-medium text-gray-700" style={{ fontFamily: 'cursive' }}>
                  {photo.name}
                </p>
              </div>
              <button 
                className="absolute top-5 right-5 p-2 bg-white rounded-full shadow-lg 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  hover:scale-110 transform"
                onClick={(e) => handleShare(e, photo.name)}
              >
                <Share2 className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <button 
          className="w-full py-3 bg-blue-600 text-white rounded-full flex items-center justify-center
            shadow-lg transition-all duration-200 hover:bg-blue-700 hover:scale-105"
        >
          <Download className="w-5 h-5 mr-2" />
          Save All Photos
        </button>
      </div>
    </div>
  );
};

export default ResultsGallery;