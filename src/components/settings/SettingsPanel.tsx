import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, User, ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { generateImage } from '../../lib/openai';

interface SettingsPanelProps {
  show: boolean;
  onClose: () => void;
  settings: {
    name: string;
    instructions: string;
    theme: string;
    avatarUrl?: string;
  };
  onSave: (settings: { name: string; instructions: string; theme: string; avatarUrl?: string }) => void;
  onReset: () => void;
}

const themes = [
  { id: 'blue', name: 'Ocean Blue', color: 'bg-blue-500' },
  { id: 'purple', name: 'Royal Purple', color: 'bg-purple-500' },
  { id: 'red', name: 'Ruby Red', color: 'bg-red-500' },
  { id: 'green', name: 'Emerald Green', color: 'bg-emerald-500' },
  { id: 'gold', name: 'Sunset Gold', color: 'bg-amber-500' },
];

const robotStyles = [
  "wearing a cozy sweater and scarf",
  "in a stylish business suit",
  "wearing a casual hoodie and beanie",
  "in a chef's outfit with a cute apron",
  "wearing a lab coat and glasses",
  "in adventurer's gear with a backpack",
  "wearing a creative artist's smock",
  "in a comfy cardigan with reading glasses",
  "wearing a gardener's hat and overalls",
  "in a meditation teacher's flowing robes"
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  show,
  onClose,
  settings,
  onSave,
  onReset,
}) => {
  const [name, setName] = useState(settings.name);
  const [instructions, setInstructions] = useState(settings.instructions);
  const [theme, setTheme] = useState(settings.theme);
  const [avatarUrl, setAvatarUrl] = useState(settings.avatarUrl);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    setName(settings.name);
    setInstructions(settings.instructions);
    setTheme(settings.theme);
    setAvatarUrl(settings.avatarUrl);
  }, [settings]);

  if (!show) return null;

  const handleSave = () => {
    onSave({ name, instructions, theme, avatarUrl });
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  const generateAvatar = async () => {
    if (isGeneratingAvatar) {
      setGenerationError('Please wait for the current generation to complete');
      return;
    }

    setIsGeneratingAvatar(true);
    setGenerationError(null);

    try {
      const style = robotStyles[Math.floor(Math.random() * robotStyles.length)];
      const prompt = `Create a friendly cartoon robot character ${style}. The robot should have a charming, approachable design with soft colors and clean lines, perfect for a chat avatar. Make it cute and expressive with visible mechanical elements but dressed in human clothing. Centered composition, front view, head and shoulders only.`;
      const urls = await generateImage(prompt);
      if (urls && urls.length > 0) {
        setAvatarUrl(urls[0]);
      }
    } catch (error: any) {
      console.error('Failed to generate avatar:', error);
      setGenerationError(error.message || 'Failed to generate avatar');
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => {
          if (!showResetConfirm) onClose();
        }}
      />
      
      <div className="relative w-full max-w-lg mx-4 bg-[#030712]/90 backdrop-blur-xl 
        rounded-2xl overflow-hidden shadow-2xl shadow-theme animate-float-up">
        <div className="p-4 border-b border-theme">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extralight text-white">Settings</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              {isGeneratingAvatar ? (
                <div className="w-24 h-24 rounded-full bg-theme-gradient animate-pulse flex items-center justify-center">
                  <div className="relative">
                    <ImageIcon className="w-8 h-8 text-theme-accent animate-bounce" />
                    <Sparkles className="w-4 h-4 text-theme-secondary absolute -top-1 -right-1 animate-pulse" />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full object-cover ring-2 ring-theme shadow-lg shadow-theme"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-theme-gradient flex items-center justify-center ring-2 ring-theme shadow-lg shadow-theme">
                      <User className="w-10 h-10 text-theme-accent" />
                    </div>
                  )}
                  <button
                    onClick={generateAvatar}
                    disabled={isGeneratingAvatar}
                    className="absolute -bottom-2 -right-2 p-2 rounded-full bg-theme-gradient shadow-lg shadow-theme
                      ring-2 ring-theme hover:scale-110 active:scale-95 transition-transform duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ImageIcon className="w-4 h-4 text-theme-accent" />
                  </button>
                </div>
              )}
            </div>
            {generationError && (
              <p className="text-xs text-red-400">{generationError}</p>
            )}
            <p className="text-xs text-gray-400">Click the camera icon to generate a new robot avatar</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/20 border border-theme rounded-xl px-4 py-2
                text-gray-100 placeholder-theme-accent/70 focus:outline-none focus:ring-2 focus:ring-theme"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Custom Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-black/20 border border-theme rounded-xl px-4 py-2
                text-gray-100 placeholder-theme-accent/70 focus:outline-none focus:ring-2 focus:ring-theme
                min-h-[100px] resize-none"
              placeholder="Add any specific instructions for Arcana..."
            />
            <p className="text-xs text-gray-500">These instructions will be included in every conversation.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Theme Color</label>
            <div className="grid grid-cols-5 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`relative w-full aspect-square rounded-xl ${t.color} 
                    transition-all duration-200 hover:opacity-90 
                    ring-2 ${theme === t.id ? 'ring-white' : 'ring-transparent'}`}
                  title={t.name}
                >
                  {theme === t.id && (
                    <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-theme pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-950/20"
            >
              <Trash2 className="w-4 h-4" />
              Reset All Data
            </Button>
          </div>
        </div>

        <div className="sticky bottom-0 p-4 border-t border-theme bg-[#030712]/90 backdrop-blur-xl">
          <Button
            onClick={handleSave}
            className="w-full px-6 py-2"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm mx-4 bg-[#030712]/90 backdrop-blur-xl 
            rounded-2xl overflow-hidden shadow-2xl shadow-theme animate-float-up p-6">
            <h3 className="text-lg font-medium text-white mb-2">Reset All Data?</h3>
            <p className="text-gray-400 mb-6">
              This will delete all your conversations, settings, and preferences. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="ghost"
                onClick={handleReset}
                className="text-red-400 hover:bg-red-950/20"
              >
                Reset Everything
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
