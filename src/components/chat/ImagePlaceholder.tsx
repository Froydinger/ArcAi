import React from 'react';

interface ImagePlaceholderProps {
  isLoading: boolean;
  progress: number;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ isLoading, progress }) => {
  return (
    <div className="relative group">
      <div className="relative">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          {isLoading ? (
            <div className="w-full max-w-[200px] h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[rgb(var(--theme-primary))] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          ) : (
            <div className="text-gray-400">Image Generating...</div>
          )}
        </div>
        <img
          src=""
          alt="Image Placeholder"
          className="w-full h-auto rounded-lg shadow-lg opacity-0"
        />
      </div>
    </div>
  );
};
