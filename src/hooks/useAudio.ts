import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

// The specific Lofi track requested
const lofiTrack: Track = {
  id: 'lofi-beats-mix',
  title: 'Lofi Beats Mix',
  artist: 'Unknown', // You can update this if known
  url: 'https://froydingermediagroup.wordpress.com/wp-content/uploads/2025/03/lofi-beats-mix.mp3',
};

export const useAudio = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isReady = useRef(false); // Track if audio is ready to play

  // Initialize Audio Element
  useEffect(() => {
    // Cleanup previous instance if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ""; // Release resource
    }

    // Create new audio element
    audioRef.current = new Audio(lofiTrack.url);
    const audioElement = audioRef.current;
    audioElement.loop = true; // Loop the track
    audioElement.preload = 'metadata'; // Preload metadata initially

    const handleCanPlay = () => {
      isReady.current = true;
      console.log("Audio ready");
    };

    const handleEnded = () => {
      // Should not be called if loop=true, but good practice
      setPlaying(false);
      if (audioElement) audioElement.currentTime = 0;
      console.log("Audio ended (should loop)");
    };

    const handleError = (e: Event) => {
      console.error("Audio Error:", e);
      setPlaying(false); // Stop trying to play on error
      isReady.current = false;
    };

    // Add event listeners
    audioElement.addEventListener('canplay', handleCanPlay, { once: true });
    audioElement.addEventListener('ended', handleEnded); // Though loop=true
    audioElement.addEventListener('error', handleError);

    // Attempt to load
    audioElement.load();

    // Cleanup function
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('canplay', handleCanPlay);
        audioElement.removeEventListener('ended', handleEnded);
        audioElement.removeEventListener('error', handleError);
        audioElement.pause();
        audioElement.src = ""; // Release resource
        console.log("Audio element cleaned up");
      }
      audioRef.current = null;
      isReady.current = false;
      setPlaying(false); // Ensure state is reset on cleanup/re-render
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Toggle Play/Pause Function
  const toggle = useCallback(() => {
    const audioElement = audioRef.current;
    if (!audioElement) {
      console.error("Audio element not available");
      return;
    }

    if (playing) {
      audioElement.pause();
      setPlaying(false);
      console.log("Audio paused");
    } else {
      // Check if ready or try to play anyway (browsers might allow after interaction)
      audioElement.play().then(() => {
        setPlaying(true);
        console.log("Audio playing");
      }).catch(error => {
        console.error("Audio playback failed:", error);
        // Attempt to load again if play fails, might be due to needing interaction
        if (!isReady.current) {
            console.log("Attempting to load audio again...");
            audioElement.load();
        }
        setPlaying(false); // Ensure state reflects failure
      });
    }
  }, [playing]); // Dependency on `playing` state

  return {
    currentTrack: lofiTrack,
    playing,
    toggle,
    PlayIcon: Play, // Export icons for potential UI use elsewhere
    PauseIcon: Pause,
  };
};
