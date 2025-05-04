import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateHighlight = () => {
      if (message.startsWith('/search')) {
        setHighlightedText(`<span class="highlighted">/search</span>${message.slice(7)}`);
      } else if (message.startsWith('/draw')) {
        setHighlightedText(`<span class="highlighted">/draw</span>${message.slice(5)}`);
      } else {
        setHighlightedText(message);
      }
    };

    updateHighlight();
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 relative">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Ask Away..."
        className="flex-1 bg-gray-800/20 border border-gray-700/30 rounded-full px-6 py-4
          focus:outline-none chat-input
          text-[15px] text-gray-100 placeholder-gray-500 transition-all duration-300"
        disabled={disabled}
        ref={inputRef}
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-600/80 hover:bg-violet-600 
          text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed 
          transition-all duration-300 hover:scale-105"
      >
        <Send size={18} />
      </button>
      <style>
        {`
          .highlighted {
            color: rgb(var(--theme-accent));
          }
        `}
      </style>
    </form>
  );
};
