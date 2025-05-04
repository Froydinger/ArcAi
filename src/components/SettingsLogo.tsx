import React from 'react';
import { cn } from '../utils/classNames';

interface SettingsLogoProps {
  onClick: () => void;
}

export const SettingsLogo: React.FC<SettingsLogoProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "fixed top-4 right-4 z-50", // Positioning and z-index
        "p-3 rounded-full bg-gray-800/30 backdrop-blur-sm", // Bubble background and blur
        "hover:bg-gray-700/30 transition-all duration-300 hover:scale-105", // Hover effect
        "cursor-pointer w-14 h-14" // Match size to menu toggle
      )}
    >
      <img
        src="https://froydingermediagroup.wordpress.com/wp-content/uploads/2025/04/chatgpt-image-apr-22-2025-10_50_06-pm-e1745380747320.png"
        alt="Settings"
        className="logo-image w-full h-full object-contain opacity-90" // Maintain opacity
      />
    </div>
  );
};
