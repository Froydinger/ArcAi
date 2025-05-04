import { useState, useEffect, useCallback } from 'react';
import { Settings } from '../types/settings';

const SETTINGS_KEY = 'arcana_settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        const parsedSettings: Settings = JSON.parse(storedSettings);

        // --- Migration/Cleanup Logic ---
        delete (parsedSettings as any).geminiApiKey;
        delete (parsedSettings as any).googleSearchApiKey;
        delete (parsedSettings as any).openaiKey;
        delete (parsedSettings as any).enableSoundEffects;
        delete (parsedSettings as any).soundEffectsVolume;
        delete (parsedSettings as any).enableMusic;
        delete (parsedSettings as any).musicVolume;
        delete (parsedSettings as any).hasCompletedOnboarding;
        // --- End Migration/Cleanup Logic ---


        setSettings(parsedSettings);

        // Save cleaned settings back to storage immediately after loading
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsedSettings));

      } else {
        // Initialize with defaults if nothing is stored
        const defaultSettings: Settings = {
          theme: 'purple', // Default theme set to purple
          instructions: '', // Default instructions
          name: '', // Default name - starts empty
        };
        setSettings(defaultSettings);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings)); // Save defaults
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      // Initialize with defaults in case of error
      const defaultSettings: Settings = {
        theme: 'purple', // Default theme set to purple
        instructions: '',
        name: '',
      };
      setSettings(defaultSettings);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prevSettings => {
      // Ensure unwanted/removed keys are not part of the update payload
      const {
        geminiApiKey,
        googleSearchApiKey,
        openaiKey,
        enableSoundEffects,
        soundEffectsVolume,
        enableMusic,
        musicVolume,
        hasCompletedOnboarding, // Ensure onboarding flag isn't saved
        ...restOfNewSettings
      } = newSettings as any;

      const updated = { ...prevSettings, ...restOfNewSettings };

      try {
        // Save updated settings (excluding removed keys)
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving settings:", error);
      }
      return updated;
    });
  }, []);

  // Function to reset settings and clear storage
  const resetSettings = useCallback(() => {
    const defaultSettings: Settings = {
      theme: 'purple', // Default theme set to purple on reset
      instructions: '',
      name: '',
    };
    setSettings(defaultSettings);
    localStorage.removeItem(SETTINGS_KEY); // Clear settings storage
    // Optionally clear other related storage like chat history
    localStorage.removeItem('arcana_chats');
    localStorage.removeItem('arcana_pinned_chats');
    localStorage.removeItem('arcana_current_chat_index');
    console.log("All settings and chat history reset.");
  }, []);


  return { settings, updateSettings, isLoaded, resetSettings };
};
