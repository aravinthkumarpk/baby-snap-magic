import React, { useState } from 'react';
import CameraView from '@/components/camera/CameraView';
import PostCaptureView from '@/components/camera/PostCaptureView';
import ResultsGallery from '@/components/gallery/ResultsGallery';
import PhotoViewer from '@/components/gallery/PhotoViewer';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

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
    
    // Simulate AI processing with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    // Switch to gallery after processing
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setCurrentView('gallery');
      toast({
        title: "Processing complete!",
        description: "Your AI-enhanced photos are ready to view.",
      });
    }, 3000);
  };

  const handlePhotoClick = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
  };

  const ProcessingView = () => (
    <div className="h-full bg-black flex flex-col items-center justify-center px-8 text-white">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Enhancing your photo</h2>
          <p className="text-gray-400">Our AI is creating magical variations of your precious moment</p>
        </div>
        
        <Progress value={progress} className="h-2 w-full" />
        
        <div className="text-center text-sm text-gray-400">
          {progress < 30 && "Analyzing photo..."}
          {progress >= 30 && progress < 60 && "Applying AI enhancements..."}
          {progress >= 60 && progress < 90 && "Creating variations..."}
          {progress >= 90 && "Finalizing results..."}
        </div>
      </div>
    </div>
  );

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
        <ProcessingView />
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