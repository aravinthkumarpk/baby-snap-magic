import React, { useState } from 'react';
import CameraView from '@/components/camera/CameraView';
import PostCaptureView from '@/components/camera/PostCaptureView';
import ResultsGallery from '@/components/gallery/ResultsGallery';
import PhotoViewer from '@/components/gallery/PhotoViewer';
import ProcessingView from '@/components/processing/ProcessingView';
import { useToast } from '@/components/ui/use-toast';

const BabyPhotoApp = () => {
  const [currentView, setCurrentView] = useState<'camera' | 'preview' | 'gallery' | 'processing'>('gallery');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleCapture = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setCurrentView('preview');
  };

  const handleSave = () => {
    setCurrentView('processing');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setCurrentView('gallery');
      setSelectedPhoto(null); // Reset selected photo when going to gallery
      toast({
        title: "Processing complete!",
        description: "Your AI-enhanced photos are ready to view.",
        duration: 2000, // Auto dismiss after 2 seconds
      });
    }, 3000);
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
      
      {currentView === 'processing' && (
        <ProcessingView progress={progress} />
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