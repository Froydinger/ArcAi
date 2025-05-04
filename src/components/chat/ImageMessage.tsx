import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface ImageMessageProps {
  url?: string;
  prompt: string;
  index: number;
  totalImages: number;
  isLoading?: boolean;
  onLoad?: () => void;
}

export const ImageMessage: React.FC<ImageMessageProps> = ({ url, prompt, index, totalImages, isLoading, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!url) return;

    setIsExpired(false);

    let startTime = Date.now();
    const duration = 20000; // 20 seconds

    const timer = setTimeout(() => {
      setIsExpired(true);
    }, duration);

    const img = new Image();
    img.src = url;

    img.onload = () => {
      setIsLoaded(true);
      clearTimeout(timer);
      if (onLoad) {
        onLoad(); // Notify parent that the image has loaded
      }
    };

    img.onerror = () => {
      setIsExpired(true);
      clearTimeout(timer);
    };

    return () => clearTimeout(timer);
  }, [url, onLoad]);

  return (
    <div className="relative">
      <div className="relative">
        {url && (
          <img
            src={url}
            alt={prompt}
            className={`w-full h-auto rounded-lg shadow-lg transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transitionDelay: `${index * 200}ms`, // Staggered delay for each image
            }}
            onLoad={() => setIsLoaded(true)}
          />
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 z-10 bg-black/50 rounded-full p-1.5 
            text-white hover:bg-black/70 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
