import React, { useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuickStartPrompts } from './chat/QuickStartPrompts';
import { Bot, Camera } from 'lucide-react';
import { AppContext } from '../App';
import { initialImagePrompts } from '../lib/prompts';
import { cn } from '../utils/classNames'; // Import cn utility
import { Conversation } from '../lib/storage/chatStorage'; // Import Conversation type
import { useSettings } from '../hooks/useSettings'; // Import useSettings hook

interface WelcomeScreenProps {
  onPromptSelect?: (prompt: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptSelect }) => {
  const navigate = useNavigate();
  const { conversations, onSelectChat, settings } = useContext(AppContext); // Access settings from context

  // Filter out conversations with no messages and limit to 3
  const displayedConversations = conversations.filter(chat => chat.messages.length > 0).slice(0, 3);

  const handleChatClick = (chat: Conversation) => {
    // Find the index of the selected chat in the *original* conversations array
    const originalIndex = conversations.findIndex(c => c.id === chat.id);
    if (originalIndex !== -1) {
      onSelectChat(originalIndex);
      navigate(`/chat/${chat.id}`);
    } else {
      console.error("Clicked chat not found in original conversations array.");
      // Optionally handle this error, e.g., navigate to a new chat
      // navigate('/chat/new');
    }
  };

  const imagePrompts = initialImagePrompts;
  const halfLength = Math.ceil(imagePrompts.length / 2);
  const firstHalfPrompts = imagePrompts.slice(0, halfLength);
  const secondHalfPrompts = imagePrompts.slice(halfLength);


  const handleImagePromptSelect = (prompt: string) => {
    onPromptSelect?.(prompt);
  };

  // Ref for the scrolling container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Function to get time-based greeting
  const getTimeBasedGreeting = (): string => {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 5 && hours < 12) {
      return "Good morning,";
    } else if (hours >= 12 && hours < 18) {
      return "Good afternoon,";
    } else if (hours >= 18 || hours < 5) {
      return "Good evening,";
    } else {
      return "Hello,";
    }
  };

  return (
    <div className="flex flex-col items-start justify-start px-4 md:px-8 pt-4 pb-24 w-full">
      <div className="w-full flex justify-start">
        <img
          src="https://froydingermediagroup.wordpress.com/wp-content/uploads/2025/04/chatgpt-image-apr-22-2025-10_50_06-pm-e1745380747320.png"
          alt="ArcAi Logo"
          className="logo-image w-28 h-28 mb-0"
        />
      </div>
      <div className="mt-4 mb-2 w-full">
        <h1 className="text-3xl font-medium text-gray-200 mb-1 text-left">
          {getTimeBasedGreeting()} <span className="font-semibold text-[rgb(var(--theme-accent))]">{settings.name || 'User'}</span>!
        </h1>
      </div>
      <p className="text-lg text-gray-400 mb-4 text-left w-full">
        What can I help with today?
      </p>

      {displayedConversations.length > 0 && (
        <div className="w-full max-w-2xl mt-4 mb-2">
          <h2 className="text-xl font-medium text-gray-200 mb-3 text-left">Pick up where we left off:</h2>
          <ul className="space-y-2">
            {displayedConversations.map((chat, index) => {
              const title = chat.messages.length > 0
                ? chat.messages[0].text?.substring(0, 30) || `Chat ${index + 1}`
                : `Chat ${index + 1}`;
              const hasImage = chat.messages.some(msg => msg.imageUrl);
              const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : null;
              const lastMessageSnippet = lastMessage ? lastMessage.substring(0, 30) : 'No messages yet';

              return (
                <li
                  key={chat.id}
                  className="flex items-center p-2 rounded-full glass-panel cursor-pointer text-sm"
                  onClick={() => handleChatClick(chat)}
                >
                  <img
                    src="https://froydingermediagroup.wordpress.com/wp-content/uploads/2025/04/chatgpt-image-apr-22-2025-10_50_06-pm-e1745380747320.png"
                    alt="Chat Icon"
                    className="w-4 h-4 mr-3 logo-image"
                  />
                  <div className="flex flex-col flex-grow items-start">
                    <h3 className="text-sm font-semibold text-gray-100">{title}</h3>
                    <p className="text-xs text-gray-400">
                      {lastMessageSnippet}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="w-full max-w-2xl mt-6 mb-2">
        <h2 className="text-xl font-medium text-gray-400 mb-2 text-left" style={{ fontSize: '1rem' }}>Create:</h2>
        <div className="relative glass-panel rounded-full py-2 overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto px-4 scrollbar-hide"
          >
            <div className="flex flex-row gap-2 pr-2 flex-shrink-0">
              {firstHalfPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="flex-shrink-0 px-4 py-2 rounded-full cursor-pointer text-sm text-gray-300 hover:text-gray-100 transition-colors duration-200 border border-transparent hover:border-gray-700/50 bg-white/5 hover:bg-white/10"
                  onClick={() => handleImagePromptSelect(prompt.prompt)}
                >
                  {prompt.title}
                </button>
              ))}
            </div>
            <div className="flex flex-row gap-2 pr-8 flex-shrink-0">
              {secondHalfPrompts.map((prompt, index) => (
                <button
                  key={index + halfLength}
                  className="flex-shrink-0 px-4 py-2 rounded-full cursor-pointer text-sm text-gray-300 hover:text-gray-100 transition-colors duration-200 border border-transparent hover:border-gray-700/50 bg-white/5 hover:bg-white/10"
                  onClick={() => handleImagePromptSelect(prompt.prompt)}
                >
                  {prompt.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl mt-6">
        <h2 className="text-xl font-medium text-gray-200 mb-3 text-left">Chat:</h2>
        <QuickStartPrompts onPromptSelect={onPromptSelect} promptSet="initial" />
      </div>
    </div>
  );
};
