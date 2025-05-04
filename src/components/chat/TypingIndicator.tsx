import React from 'react';

export const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse [animation-delay:150ms]" />
    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse [animation-delay:300ms]" />
  </div>
);
