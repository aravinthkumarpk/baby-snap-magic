import React, { useState } from 'react';
import { X, Download, Check, AlertCircle } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { toast } from '@/components/ui/use-toast';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!photoUrl.startsWith('data:image')) {
        throw new Error('Invalid photo format');
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      onSave();
    } catch (err) {
      console.error('Error saving photo:', err);
      setError(err instanceof Error ? err.message : 'Failed to save photo');
      toast({
        title: "Error",
        description: "Failed to save photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = photoUrl;
      link.download = `baby-snap-${new Date().getTime()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Photo downloaded successfully",
      });
    } catch (err) {
      console.error('Error downloading photo:', err);
      toast({
        title: "Error",
        description: "Failed to download photo",
        variant: "destructive"
      });
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-white text-black rounded-full"
            onClick={onDiscard}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Full screen photo container */}
      <div className="absolute inset-0">
        <img 
          src={photoUrl}
          alt="Captured Preview" 
          className="h-full w-full object-cover"
          onError={() => setError('Failed to load photo preview')}
        />
      </div>

      {/* Controls overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top controls */}
        <div className="absolute top-safe inset-x-0 p-4 flex justify-between items-center pointer-events-auto">
          <button 
            className="p-2 bg-black/50 rounded-full transition-transform hover:scale-110"
            onClick={onDiscard}
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <button 
            className="p-2 bg-black/50 rounded-full transition-transform hover:scale-110"
            onClick={handleDownload}
          >
            <Download className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Theme selector */}
        <div className="absolute right-4 top-1/4 pointer-events-auto">
          <ThemeSelector />
        </div>

        {/* Bottom save button */}
        <div className="absolute bottom-0 inset-x-0 p-6 pointer-events-auto">
          <button 
            className={`w-full py-3 bg-blue-600 rounded-full flex items-center justify-center
              transition-all duration-200 hover:bg-blue-700 hover:scale-105
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                <span className="text-white">Processing...</span>
              </div>
            ) : (
              <div className="flex items-center text-white">
                <Check className="w-5 h-5 mr-2" />
                Save
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCaptureView;