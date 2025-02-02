import React, { useState, useCallback } from 'react';
import CameraView from '@/components/camera/CameraView';
import PostCaptureView from '@/components/camera/PostCaptureView';
import ResultsGallery from '@/components/gallery/ResultsGallery';
import PhotoViewer from '@/components/gallery/PhotoViewer';
import ProcessingView from '@/components/processing/ProcessingView';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type ViewState = 'camera' | 'preview' | 'gallery' | 'processing';

interface PhotoData {
  id: string;
  url: string;
  timestamp: number;
  processed: boolean;
}

const BabyPhotoApp = () => {
  const [currentView, setCurrentView] = useState<ViewState>('camera');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [showExitAlert, setShowExitAlert] = useState(false);
  const { toast } = useToast();

  const handleCapture = useCallback((photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setCurrentView('preview');
  }, []);

  const handleSave = useCallback(() => {
    if (!selectedPhoto) return;

    setCurrentView('processing');
    setProcessingProgress(0);

    // Simulate AI processing with incremental progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Store the current selectedPhoto value
    const photoToSave = selectedPhoto;

    // Simulate completion after processing
    setTimeout(() => {
      clearInterval(progressInterval);
      setProcessingProgress(100);

      const newPhoto: PhotoData = {
        id: Date.now().toString(),
        url: photoToSave,
        timestamp: Date.now(),
        processed: true
      };

      setPhotos(prev => [newPhoto, ...prev]);
      setCurrentView('gallery');
      setSelectedPhoto(null);

      toast({
        title: "Success!",
        description: "Your photo has been enhanced and saved.",
        duration: 3000,
      });
    }, 3000);
  }, [selectedPhoto, toast]);

  const handleDiscard = useCallback(() => {
    setShowExitAlert(true);
  }, []);

  const confirmDiscard = useCallback(() => {
    setShowExitAlert(false);
    setSelectedPhoto(null);
    setCurrentView('camera');
  }, []);

  const handlePhotoClick = useCallback((photoUrl: string) => {
    setSelectedPhoto(photoUrl);
  }, []);

  const handleBackToCamera = useCallback(() => {
    setCurrentView('camera');
    setSelectedPhoto(null);
  }, []);

  return (
    <div className="h-screen bg-black">
      {currentView === 'camera' && (
        <CameraView 
          onCapture={handleCapture} 
          onGalleryClick={() => setCurrentView('gallery')} 
        />
      )}

      {currentView === 'preview' && selectedPhoto && (
        <PostCaptureView 
          photoUrl={selectedPhoto}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
      )}

      {currentView === 'processing' && (
        <ProcessingView progress={processingProgress} />
      )}

      {currentView === 'gallery' && (
        <ResultsGallery 
          onPhotoClick={handlePhotoClick}
          onBackClick={handleBackToCamera}
          photos={photos}
        />
      )}

      {selectedPhoto && currentView === 'gallery' && (
        <PhotoViewer
          photoUrl={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      <AlertDialog open={showExitAlert} onOpenChange={setShowExitAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Photo?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discard this photo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDiscard}>
              Yes, discard photo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BabyPhotoApp;