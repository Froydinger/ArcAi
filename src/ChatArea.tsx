import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from './types/chat';
import { ChatMessage } from './components/ChatMessage';
import { ThinkingIndicator } from './components/chat/ThinkingIndicator';
import { ImageGenerationIndicator } from './components/chat/ImageGenerationIndicator';
import { ImageMessage } from './components/chat/ImageMessage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { QuickStartPrompts } from './components/chat/QuickStartPrompts';
import { ArrowDown } from 'lucide-react';
import { cn } from './utils/classNames';
import { useMediaQuery } from './hooks/useMediaQuery';

interface ChatAreaProps {
  messages: Message[];
  onEditMessage: (messageId: string, newText: string) => void;
  isLoading: boolean;
  isGeneratingImage: boolean;
  userName: string;
  userAvatarUrl?: string;
  currentChatId: string;
  onPromptSelect: (prompt: string) => void;
}

// Define constants for padding and header height
const TOP_MARGIN_PERCENT = 5;
const BOTTOM_MARGIN_PERCENT = 5;
const INPUT_BAR_HEIGHT_PX = 64;

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onEditMessage,
  isLoading,
  isGeneratingImage,
  userName,
  userAvatarUrl,
  currentChatId,
  onPromptSelect,
}) => {
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleScroll = useCallback(() => {
    if (chatAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatAreaRef.current;
      // Show button if not at bottom
      setShowScrollButton(scrollTop + clientHeight < scrollHeight - 50);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    chatAreaRef.current?.scrollTo({
      top: chatAreaRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    handleScroll(); // Initial check on mount
    scrollToBottom(); // Scroll to bottom on initial load
  }, [handleScroll, scrollToBottom]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    // Observe scroll events
    const chatArea = chatAreaRef.current;
    if (chatArea) {
      chatArea.addEventListener('scroll', handleScroll);
      return () => {
        chatArea.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden">
      {/* Scrollable Chat Area */}
      <div
        ref={chatAreaRef}
        className="flex-1 overflow-y-auto scrollbar-hide relative"
      style={{
        paddingTop: isMobile ? `calc(${TOP_MARGIN_PERCENT}vh + env(safe-area-inset-top, 0px))` : `calc(${TOP_MARGIN_REM}rem + env(safe-area-inset-top, 0px))`,
        paddingBottom: isMobile ? `calc(${BOTTOM_MARGIN_PERCENT}vh)` : `${BOTTOM_PADDING_PX}px`,
      }}
      >
        {/* Chat Messages */}
        <div className="flex flex-col gap-3 py-2 px-4">
          {messages.map((message) => {
            if (message.imageUrl) {
              return (
                <ErrorBoundary key={message.id}>
                  <ImageMessage message={message} />
                </ErrorBoundary>
              );
            } else {
              return (
                <ErrorBoundary key={message.id}>
                  <ChatMessage
                    message={message}
                    userName={userName}
                    userAvatarUrl={userAvatarUrl}
                    onEditMessage={onEditMessage}
                    currentChatId={currentChatId}
                  />
                </ErrorBoundary>
              );
            }
          })}

          {/* Thinking Indicator */}
          {isLoading && <ThinkingIndicator />}

          {/* Image Generation Indicator */}
          {isGeneratingImage && <ImageGenerationIndicator />}
        </div>
      </div>

      {/* Scroll Down Button (Mobile Only) */}
      {isMobile && showScrollButton && (
        <div className="absolute bottom-[70px] left-0 right-0 flex justify-center">
          <button
            onClick={scrollToBottom}
            className="glass-panel rounded-full p-2 text-gray-100 hover:text-white transition-colors duration-200"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
