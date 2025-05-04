import React from 'react';
import { Menu, Plus, Settings, Headphones } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/classNames';

interface HeaderProps {
  onMenuClick: () => void;
  isMobile: boolean; // Add isMobile prop
  onNewChat: () => void;
  onSettingsClick: () => void;
  lofiPlaying: boolean;
  onToggleLofi: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  isMobile,
  onNewChat,
  onSettingsClick,
  lofiPlaying,
  onToggleLofi,
}) => {
  const iconStrokeWidth = 1.5;

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50",
      "flex items-center p-3 h-16 shrink-0", // Removed justify-center
      "glass-panel rounded-none border-x-0 border-t-0"
    )}>
      {/* Left side button */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onMenuClick} aria-label="Toggle Menu">
          <Menu className="h-6 w-6" strokeWidth={iconStrokeWidth} />
        </Button>
      </div>

      {/* Right side buttons */}
      <div className="flex items-center gap-1 bg-gray-900/40 rounded-full p-1 border border-gray-700/50">
        {/* Settings Logo */}
        <img
          src="https://froydingermediagroup.wordpress.com/wp-content/uploads/2025/04/b230d8eb-0f19-4e89-8860-e537f2b47283.png"
          alt="Settings"
          className="w-6 h-6 cursor-pointer"
          onClick={onSettingsClick} // Link to settings popup
        />
        <Button variant="ghost" size="icon" className="rounded-full" onClick={onNewChat} aria-label="New Chat">
          <Plus className="h-6 w-6" strokeWidth={iconStrokeWidth} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleLofi}
          className={cn(
            "rounded-full transition-colors duration-200",
            'text-gray-400 hover:text-gray-200'
          )}
          aria-label={lofiPlaying ? 'Pause Music' : 'Play Music'}
        >
          <Headphones
            className={cn(
              "h-6 w-6",
              lofiPlaying && "pulsing-glow"
            )}
            strokeWidth={iconStrokeWidth}
          />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={onSettingsClick} aria-label="Settings">
          <Settings className="h-6 w-6" strokeWidth={iconStrokeWidth} />
        </Button>
      </div>
    </header>
  );
};
