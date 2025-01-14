import { Progress } from '@/components/ui/progress';

interface ProcessingViewProps {
  progress: number;
}

const ProcessingView = ({ progress }: ProcessingViewProps) => (
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

export default ProcessingView;