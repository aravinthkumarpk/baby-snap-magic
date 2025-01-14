import React, { useState } from 'react';
import { Camera, ImagePlus, RotateCcw, AlertCircle } from 'lucide-react';
import { useCamera } from '@/hooks/use-camera';
import ThemeSelector from './ThemeSelector';
import { Button } from '@/components/ui/button';

interface CameraViewProps {
  onCapture: (photoUrl: string) => void;
  onGalleryClick: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onGalleryClick }) => {
  const {
    videoRef,
    photoRef,
    status,
    error,
    takePicture,
    switchCamera,
    currentFacingMode
  } = useCamera();

  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);

  const handleCapture = async () => {
    const photo = await takePicture();
    if (photo) {
      setCapturedPhotoUrl(photo);
      onCapture(photo);
    }
  };

  if (status === 'denied') {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Camera Access Denied</h2>
          <p className="text-gray-400 mb-4">Please enable camera access in your browser settings to use this feature.</p>
          <Button 
            variant="secondary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-semibold mb-2">Camera Error</h2>
          <p className="text-gray-400 mb-4">{error || 'Failed to initialize camera'}</p>
          <Button 
            variant="secondary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Hidden canvas for photo capture */}
      <canvas ref={photoRef} className="hidden" />

      {/* Full screen video container */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
          style={{
            transform: currentFacingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)',
            display: status === 'ready' ? 'block' : 'none'
          }}
        />
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
          </div>
        )}
      </div>

      {/* Controls overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top controls */}
        <div className="absolute top-safe inset-x-0 p-4 flex justify-between pointer-events-auto">
          <button 
            className="p-2 bg-black/50 rounded-full transition-transform hover:scale-110"
            onClick={switchCamera}
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Theme selector */}
        <div className="absolute right-4 top-1/4 pointer-events-auto">
          <ThemeSelector />
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 inset-x-0 p-6 flex justify-between items-center pointer-events-auto">
          <button 
            className="p-3 bg-black/50 rounded-full transition-transform hover:scale-110"
            onClick={onGalleryClick}
          >
            <ImagePlus className="w-6 h-6 text-white" />
          </button>

          <button 
            className={`p-6 rounded-full transition-transform hover:scale-105 ${
              status === 'ready' ? 'bg-white' : 'bg-gray-500'
            }`}
            onClick={handleCapture}
            disabled={status !== 'ready'}
          >
            <div className="w-4 h-4 bg-transparent border-2 border-gray-900 rounded-full" />
          </button>

          {/* Spacer for symmetry */}
          <div className="w-12 h-12" />
        </div>
      </div>
    </div>
  );
};

export default CameraView;