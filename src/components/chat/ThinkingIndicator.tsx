import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

// Removed ThinkingIndicatorProps interface as 'show' prop is no longer needed

export const ThinkingIndicator: React.FC = () => {
  // Removed if (!show) return null;

  return (
    // Removed fixed positioning classes, added margin for spacing in chat flow
    <div className="flex justify-center py-2 my-2"> {/* Adjusted padding/margin */}
      <div className="relative">
        {/* Glow effects */}
        <div className="absolute inset-0 bg-[#60A5FA] rounded-full blur-xl opacity-20 animate-pulse-slow" />
        <div className="absolute inset-0 bg-[#3B82F6] rounded-full blur-lg opacity-20 animate-pulse-slow delay-75" />

        {/* Main pill container */}
        <div className="relative glass-panel rounded-full shadow-lg px-6 py-3 animate-fade-in border-[#60A5FA]/20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Brain className="w-6 h-6 text-[#60A5FA] animate-bounce" />
              <Sparkles className="w-4 h-4 text-[#93C5FD] absolute -top-1 -right-1 animate-pulse" />
            </div>
            <p className="text-base text-[#93C5FD] font-medium">Thinking...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
