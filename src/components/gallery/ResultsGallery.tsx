import React, { useState } from 'react';
import { Share2, Download, ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PhotoData {
  id: string;
  url: string;
  timestamp: number;
  processed: boolean;
}

interface ResultsGalleryProps {
  photos: PhotoData[];
  onPhotoClick: (photoUrl: string) => void;
  onBackClick: () => void;
}

const ResultsGallery: React.FC<ResultsGalleryProps> = ({ 
  photos, 
  onPhotoClick, 
  onBackClick 
}) => {
  const { toast } = useToast();
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleShare = async (e: React.MouseEvent, photo: PhotoData) => {
    e.stopPropagation();

    try {
      if (navigator.share) {
        const blob = await fetch(photo.url).then(r => r.blob());
        const file = new File([blob], 'baby-photo.jpg', { type: 'image/jpeg' });

        await navigator.share({
          title: 'Baby Photo',
          text: 'Check out this adorable photo!',
          files: [file]
        });

        toast({
          title: "Shared!",
          description: "Photo shared successfully",
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        toast({
          title: "Not supported",
          description: "Sharing is not supported on this device",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast({
        title: "Error",
        description: "Failed to share photo",
        variant: "destructive"
      });
    }
  };

  const handleDelete = (photoId: string) => {
    setSelectedPhotoId(photoId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    // Here you would typically call an API to delete the photo
    toast({
      title: "Deleted",
      description: "Photo has been removed",
    });
    setShowDeleteDialog(false);
    setSelectedPhotoId(null);
  };

  const handleDownloadAll = async () => {
    try {
      for (const photo of photos) {
        const link = document.createElement('a');
        link.href = photo.url;
        link.download = `baby-snap-${format(photo.timestamp, 'yyyy-MM-dd-HH-mm-ss')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay between downloads
      }

      toast({
        title: "Success",
        description: "All photos downloaded successfully",
      });
    } catch (err) {
      console.error('Error downloading photos:', err);
      toast({
        title: "Error",
        description: "Failed to download photos",
        variant: "destructive"
      });
    }
  };

  // Generate random rotation classes for the photo card effect
  const getRandomRotation = () => {
    const rotations = ['-rotate-2', 'rotate-2', '-rotate-1', 'rotate-1', 'rotate-0'];
    return rotations[Math.floor(Math.random() * rotations.length)];
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

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100%-8rem)] text-gray-500">
          <p className="text-lg mb-4">No photos yet</p>
          <button
            onClick={onBackClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-full"
          >
            Take your first photo
          </button>
        </div>
      ) : (
        <div className="h-[calc(100%-8rem)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-6 mb-6">
            {photos.map((photo) => (
              <div 
                key={photo.id}
                className={`relative group ${getRandomRotation()} hover:-translate-y-2 transition-all duration-200 cursor-pointer`}
                onClick={() => onPhotoClick(photo.url)}
              >
                <div className="bg-white p-3 rounded-lg shadow-lg">
                  <div className="aspect-square bg-gray-100 mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={photo.url}
                      alt={`Photo from ${format(photo.timestamp, 'PPP')}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-center font-medium text-gray-700" style={{ fontFamily: 'cursive' }}>
                    {format(photo.timestamp, 'MMM d, h:mm a')}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button 
                    className="p-2 bg-white rounded-full shadow-lg hover:scale-110 transform transition-transform"
                    onClick={(e) => handleShare(e, photo)}
                  >
                    <Share2 className="w-4 h-4 text-gray-700" />
                  </button>
                  <button 
                    className="p-2 bg-white rounded-full shadow-lg hover:scale-110 transform transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download all button */}
      {photos.length > 0 && (
        <div className="absolute bottom-6 left-6 right-6">
          <button 
            className="w-full py-3 bg-blue-600 text-white rounded-full flex items-center justify-center
              shadow-lg transition-all duration-200 hover:bg-blue-700 hover:scale-105"
            onClick={handleDownloadAll}
          >
            <Download className="w-5 h-5 mr-2" />
            Download All Photos
          </button>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResultsGallery;