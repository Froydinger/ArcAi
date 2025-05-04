import React, { useState } from 'react';
import { Key, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { ApiKeys } from '../types/settings';

interface ApiKeyPromptProps {
  onSubmit: (keys: ApiKeys) => void;
  name: string;
}

export const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onSubmit, name }) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (openaiKey.trim() && geminiKey.trim()) {
      onSubmit({
        openai: openaiKey.trim(),
        gemini: geminiKey.trim()
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-[rgb(var(--theme-bg-dark))] backdrop-blur-sm" />
      
      <div className="relative w-full max-w-md mx-4 glass-panel rounded-2xl overflow-hidden shadow-2xl animate-float-up">
        <div className="p-8 text-center">
          {/* Logo */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--theme-primary))]/20 via-[rgb(var(--theme-secondary))]/20 to-[rgb(var(--theme-accent))]/20 rounded-full blur-xl animate-pulse-slow" />
            <div className="relative w-full h-full rounded-full glass-panel p-4 flex items-center justify-center">
              <Key className="w-12 h-12 text-[rgb(var(--theme-accent))]" />
            </div>
          </div>

          <h2 className="text-2xl font-extralight text-white mb-2">One Last Step, {name}!</h2>
          <p className="text-gray-400 mb-6">
            Please enter your API keys to continue. You can find them in your OpenAI and Google Cloud dashboards.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-left text-gray-300">OpenAI API Key</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full glass-panel rounded-xl px-4 py-3
                  text-gray-100 placeholder-[rgb(var(--theme-accent))]/70 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--theme-accent))]"
                placeholder="sk-..."
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-left text-gray-300">Google Gemini API Key</label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full glass-panel rounded-xl px-4 py-3
                  text-gray-100 placeholder-[rgb(var(--theme-accent))]/70 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--theme-accent))]"
                placeholder="AIza..."
              />
            </div>

            <div className="bg-yellow-500/10 rounded-lg p-4 text-left">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm text-yellow-500">Your API keys are stored locally</p>
                  <p className="text-xs text-yellow-500/80">
                    Keys are saved in your browser and never sent to our servers.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!openaiKey.trim() || !geminiKey.trim()}
              className="w-full py-3"
            >
              Continue
            </Button>
          </form>

          <div className="mt-4 space-y-2 text-left">
            <p className="text-xs text-gray-500">
              Need help finding your API keys?
            </p>
            <div className="space-y-1">
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-xs text-[rgb(var(--theme-accent))] hover:underline"
              >
                • Get OpenAI API Key
              </a>
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-xs text-[rgb(var(--theme-accent))] hover:underline"
              >
                • Get Google Gemini API Key
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
