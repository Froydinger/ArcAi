import React from 'react';
import { useAudio } from '../hooks/useAudio';

interface MusicPopupProps {
  show: boolean;
  // onClose: () => void; // Might not be needed if clicking outside doesn't close it
}

export const MusicPopup: React.FC<MusicPopupProps> = ({ show }) => {
  const { currentTrack, playing, toggle, PlayIcon, PauseIcon } = useAudio();

  if (!show) {
    return null;
  }

  return (
    <div
      className="absolute top-full right-0 mt-2 w-48 z-60" // Position below the button group, adjust 'right-0' as needed
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing (if needed)
    >
      <div className="glass-panel rounded-lg p-3 flex items-center justify-between">
        <span className="text-sm text-gray-200 font-medium truncate mr-2">
          {currentTrack.title}
        </span>
        <button
          onClick={toggle}
          className="p-1 rounded-full hover:bg-white/10 transition-colors text-gray-300"
          aria-label={playing ? 'Pause Lofi Beats' : 'Play Lofi Beats'}
        >
          {playing ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
        </button>
      </div>
    </div>
  );
};
