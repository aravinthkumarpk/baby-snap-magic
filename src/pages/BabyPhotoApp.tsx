import React, { useState } from 'react';
import CameraView from '@/components/camera/CameraView';
import PostCaptureView from '@/components/camera/PostCaptureView';
import ResultsGallery from '@/components/gallery/ResultsGallery';
import PhotoViewer from '@/components/gallery/PhotoViewer';
import { useToast } from '@/components/ui/use-toast';

const BabyPhotoApp = () => {
  const [currentView, setCurrentView] = useState<'camera' | 'preview' | 'gallery'>('camera');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCapture = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setCurrentView('preview');
  };

  const handleSave = () => {
    toast({
      title: "Photo saved!",
      description: "Your precious moment has been saved to the gallery.",
    });
    setCurrentView('gallery');
  };

  const handlePhotoClick = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
  };

  return (
    <div className="h-screen bg-black">
      {currentView === 'camera' && (
        <CameraView onCapture={handleCapture} onGalleryClick={() => setCurrentView('gallery')} />
      )}
      
      {currentView === 'preview' && selectedPhoto && (
        <PostCaptureView 
          photoUrl={selectedPhoto}
          onSave={handleSave}
          onDiscard={() => setCurrentView('camera')}
        />
      )}
      
      {currentView === 'gallery' && (
        <ResultsGallery 
          onPhotoClick={handlePhotoClick}
          onBackClick={() => setCurrentView('camera')}
        />
      )}

      {selectedPhoto && currentView === 'gallery' && (
        <PhotoViewer
          photoUrl={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
};

export default BabyPhotoApp;