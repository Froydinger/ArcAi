import React, { useState } from 'react';
import { Button } from './ui/Button';

interface NamePromptProps {
  onSubmit: (name: string) => void;
}

export const NamePrompt: React.FC<NamePromptProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-md mx-4 bg-[#030712]/90 backdrop-blur-xl 
        rounded-2xl overflow-hidden shadow-2xl shadow-theme animate-float-up">
        <div className="p-8 text-center">
          {/* Logo with glow effects */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-theme-primary/20 via-theme-secondary/20 to-theme-accent/20 rounded-full blur-xl animate-pulse-slow" />
            <div className="relative w-full h-full rounded-full bg-theme-gradient p-4 flex items-center justify-center shadow-xl shadow-theme/30">
              <img 
                src="https://froydinger.com/wp-content/uploads/2025/03/arcana2.png"
                alt="Arcana"
                className="w-full h-full object-contain animate-float theme-logo"
              />
            </div>
          </div>

          <h2 className="text-2xl font-extralight text-white mb-2">Welcome to Arcana</h2>
          <p className="text-gray-400 mb-8">What should I call you?</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/20 border border-theme rounded-xl px-4 py-3
                text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theme"
              placeholder="Enter your name"
              autoFocus
            />
            <Button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-3"
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
