import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

interface CameraConfig {
  width?: number;
  height?: number;
  facingMode?: 'user' | 'environment';
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  photoRef: React.RefObject<HTMLCanvasElement>;
  stream: MediaStream | null;
  error: string | null;
  status: 'idle' | 'loading' | 'ready' | 'error' | 'denied';
  takePicture: () => Promise<string | null>;
  switchCamera: () => Promise<void>;
  currentFacingMode: 'user' | 'environment';
}

const DEFAULT_CONSTRAINTS: CameraConfig = {
  width: 1280,
  height: 720,
  facingMode: 'environment'
};

const HIGH_QUALITY_CONSTRAINTS = {
  audio: false,
  video: {
    facingMode: 'environment' as 'environment' | 'user',
    width: { ideal: 4096 },
    height: { ideal: 2160 },
    aspectRatio: { ideal: 4/3 },
    resizeMode: 'none' as const,
    frameRate: { ideal: 30 }
  }
};

const MEDIUM_QUALITY_CONSTRAINTS = {
  audio: false,
  video: {
    facingMode: 'environment' as 'environment' | 'user',
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    aspectRatio: { ideal: 4/3 },
    frameRate: { ideal: 30 }
  }
};

const BASE_CONSTRAINTS = {
  audio: false,
  video: {
    facingMode: 'environment' as 'environment' | 'user',
    width: { ideal: 1280 },
    height: { ideal: 720 }
  }
};

export const useCamera = (config: CameraConfig = DEFAULT_CONSTRAINTS): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<UseCameraReturn['status']>('idle');
  const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>(
    config.facingMode || 'environment'
  );
  const mountedRef = useRef(true);

  const logDeviceCapabilities = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('📸 Available video devices:', videoDevices);
      return videoDevices;
    } catch (err) {
      console.warn('⚠️ Failed to enumerate devices:', err);
      return [];
    }
  };

  const getMediaStream = async (): Promise<MediaStream> => {
    try {
      console.log('🎥 Attempting high quality stream...');
      const highQualityConstraints = {
        ...HIGH_QUALITY_CONSTRAINTS,
        video: {
          ...HIGH_QUALITY_CONSTRAINTS.video,
          facingMode: currentFacingMode
        }
      };
      console.log('📝 High quality constraints:', highQualityConstraints);
      return await navigator.mediaDevices.getUserMedia(highQualityConstraints);
    } catch (err) {
      console.log('⚠️ High quality stream failed, trying medium quality...', err);
      try {
        const mediumQualityConstraints = {
          ...MEDIUM_QUALITY_CONSTRAINTS,
          video: {
            ...MEDIUM_QUALITY_CONSTRAINTS.video,
            facingMode: currentFacingMode
          }
        };
        console.log('📝 Medium quality constraints:', mediumQualityConstraints);
        return await navigator.mediaDevices.getUserMedia(mediumQualityConstraints);
      } catch (err) {
        console.log('⚠️ Medium quality stream failed, trying base quality...', err);
        const baseConstraints = {
          ...BASE_CONSTRAINTS,
          video: {
            ...BASE_CONSTRAINTS.video,
            facingMode: currentFacingMode
          }
        };
        console.log('📝 Base quality constraints:', baseConstraints);
        return await navigator.mediaDevices.getUserMedia(baseConstraints);
      }
    }
  };

  const stopCurrentStream = useCallback(() => {
    if (streamRef.current) {
      console.log('🛑 Stopping current stream...');
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => {
        track.stop();
        console.log(`✅ Stopped track: ${track.kind}`);
      });
      streamRef.current = null;
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const initializeCamera = useCallback(async () => {
    console.log('🎥 Initializing camera...');
    try {
      setStatus('loading');
      stopCurrentStream();

      // Log available devices
      await logDeviceCapabilities();

      // Get media stream with fallback
      const mediaStream = await getMediaStream();

      // Log the actual constraints being used
      const track = mediaStream.getVideoTracks()[0];
      console.log('📊 Track capabilities:', track.getCapabilities());
      console.log('⚙️ Active settings:', track.getSettings());
      console.log('🎯 Applied constraints:', track.getConstraints());

      const videoEl = videoRef.current;
      if (!videoEl) {
        throw new Error('Video element not available');
      }

      // Set up video element
      videoEl.srcObject = mediaStream;
      videoEl.setAttribute('playsinline', 'true');
      videoEl.muted = true;

      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => reject('Video load timeout'), 10000);

        videoEl.onloadedmetadata = () => {
          clearTimeout(timeoutId);
          videoEl.play()
            .then(() => {
              console.log('✅ Video playback started');
              console.log(`📐 Video dimensions: ${videoEl.videoWidth}x${videoEl.videoHeight}`);
              resolve();
            })
            .catch(reject);
        };
      });

      // Store stream in refs and state
      streamRef.current = mediaStream;
      if (mountedRef.current) {
        setStream(mediaStream);
        setStatus('ready');
        setError(null);
        console.log('✨ Camera initialization complete');
      }

    } catch (err) {
      console.error('❌ Camera initialization error:', err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to initialize camera');
        setStatus(err instanceof Error && err.name === 'NotAllowedError' ? 'denied' : 'error');

        toast({
          title: "Camera Error",
          description: err instanceof Error ? err.message : 'Failed to initialize camera',
          variant: "destructive"
        });
      }
    }
  }, [currentFacingMode, stopCurrentStream]);

  const switchCamera = useCallback(async () => {
    console.log('🔄 Switching camera...');
    stopCurrentStream();
    setCurrentFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, [stopCurrentStream]);

  const takePicture = useCallback(async (): Promise<string | null> => {
    try {
      const video = videoRef.current;
      const photo = photoRef.current;

      if (!video || !photo || status !== 'ready') {
        throw new Error('Camera is not ready');
      }

      const ctx = photo.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Set canvas size to match video
      photo.width = video.videoWidth;
      photo.height = video.videoHeight;
      console.log(`📸 Taking photo at resolution: ${photo.width}x${photo.height}`);

      // Disable image smoothing
      ctx.imageSmoothingEnabled = false;

      // Handle mirroring for selfie mode
      if (currentFacingMode === 'user') {
        ctx.translate(photo.width, 0);
        ctx.scale(-1, 1);
      }

      // Draw the frame
      ctx.drawImage(video, 0, 0);

      // Reset transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // Create high-quality blob
      return new Promise((resolve, reject) => {
        photo.toBlob(
          (blob) => {
            if (blob) {
              console.log(`📊 Photo size: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
              resolve(URL.createObjectURL(blob));
            } else {
              reject(new Error('Failed to create photo blob'));
            }
          },
          'image/jpeg',
          1.0  // Maximum quality
        );
      });

    } catch (err) {
      console.error('❌ Error taking picture:', err);
      toast({
        title: "Error",
        description: "Failed to capture photo",
        variant: "destructive"
      });
      return null;
    }
  }, [status, currentFacingMode]);

  useEffect(() => {
    mountedRef.current = true;

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Your browser does not support camera access');
      setStatus('error');
      return;
    }

    initializeCamera();

    return () => {
      mountedRef.current = false;
      console.log('🧹 Cleaning up camera...');
      stopCurrentStream();
    };
  }, [currentFacingMode, initializeCamera, stopCurrentStream]);

  return {
    videoRef,
    photoRef,
    stream,
    error,
    status,
    takePicture,
    switchCamera,
    currentFacingMode
  };
};