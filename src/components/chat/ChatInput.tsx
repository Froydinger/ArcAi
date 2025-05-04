import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUp, Zap, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuickStartPrompts } from './QuickStartPrompts';
import { cn } from '../../utils/classNames';
import { useSettings } from '../../hooks/useSettings';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
  isGeneratingImage: boolean;
  quickPrompts?: boolean;
  currentTonePrompt?: string;
}

const quickPromptsVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 10,
    transition: {
      opacity: { duration: 0.1, ease: "linear" },
      scale: { type: "spring", stiffness: 500, damping: 12 },
      y: { type: "spring", stiffness: 500, damping: 12 }
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.1, ease: "linear" },
      scale: { type: "spring", stiffness: 500, damping: 12 },
      y: { type: "spring", stiffness: 500, damping: 12 }
    }
  }
};

const chevronVariants = {
  hidden: { opacity: 0, transition: { duration: 0.1 } },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.2 } },
};

const MIN_TEXTAREA_HEIGHT = 44; // Increased min height

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, isGeneratingImage, currentTonePrompt }) => {
  const [message, setMessage] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isQuickPromptsOpen, setIsQuickPromptsOpen] = useState(false);
  const [isPromptsScrollable, setIsPromptsScrollable] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const quickPromptsRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();
  const isMobile = useMediaQuery('(max-width: 640px)');

  const isDisabled = isLoading || isGeneratingImage;

  useEffect(() => {
    if (textareaRef.current && !isDisabled) {
      textareaRef.current.style.height = 'auto';
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.whiteSpace = 'pre-wrap';
      tempSpan.style.wordBreak = 'break-word';
      tempSpan.style.width = `${textareaRef.current.clientWidth - parseInt(getComputedStyle(textareaRef.current).paddingLeft) - parseInt(getComputedStyle(textareaRef.current).paddingRight)}px`;
      tempSpan.style.font = getComputedStyle(textareaRef.current).font;
      tempSpan.textContent = displayValue || ' ';
      document.body.appendChild(tempSpan);
      const scrollHeight = tempSpan.offsetHeight;
      document.body.removeChild(tempSpan);
      const targetHeight = scrollHeight + 16;
      textareaRef.current.style.height = `${Math.max(targetHeight, MIN_TEXTAREA_HEIGHT)}px`;
    } else if (textareaRef.current) {
      textareaRef.current.style.height = `${MIN_TEXTAREA_HEIGHT}px`;
    }
  }, [displayValue, isFocused, isDisabled]);

  const handleScroll = useCallback(() => {
    if (quickPromptsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = quickPromptsRef.current;
      const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 5;
      setShowScrollIndicator(!isAtBottom && isPromptsScrollable);
    }
  }, [isPromptsScrollable]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isQuickPromptsOpen && quickPromptsRef.current) {
      const checkScrollability = () => {
        if (quickPromptsRef.current) {
          const { scrollHeight, clientHeight } = quickPromptsRef.current;
          const scrollable = scrollHeight > clientHeight;
          setIsPromptsScrollable(scrollable);
          const { scrollTop } = quickPromptsRef.current;
          const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 5;
          setShowScrollIndicator(scrollable && !isAtBottom);

          if (scrollable) {
            quickPromptsRef.current.addEventListener('scroll', handleScroll);
          }
        }
      };
      timer = setTimeout(checkScrollability, 150);

      return () => {
        if (timer) clearTimeout(timer);
        if (quickPromptsRef.current) {
          quickPromptsRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    } else {
      setIsPromptsScrollable(false);
      setShowScrollIndicator(false);
      if (quickPromptsRef.current) {
         quickPromptsRef.current.removeEventListener('scroll', handleScroll);
      }
    }
  }, [isQuickPromptsOpen, handleScroll]);

  const handleSend = async () => {
    const messageToSend = message.trim();
    if (messageToSend !== '' && !isDisabled) {
      setIsQuickPromptsOpen(false);
      const messageBeingSent = message;
      setMessage('');
      setDisplayValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = `${MIN_TEXTAREA_HEIGHT}px`;
        textareaRef.current.focus();
      }
      await onSend(messageBeingSent);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const currentDisplayValue = e.target.value;
    setDisplayValue(currentDisplayValue);
    setMessage(currentDisplayValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !isDisabled) {
      event.preventDefault();
      handleSend();
    }
     if (event.key === 'Escape') {
       setIsQuickPromptsOpen(false);
     }
  };

  const toggleQuickPrompts = () => {
    if (!isDisabled) {
      setIsQuickPromptsOpen(!isQuickPromptsOpen);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    if (!isDisabled) {
      setMessage(prompt);
      setDisplayValue(prompt);
      setIsQuickPromptsOpen(false);
      queueMicrotask(() => {
         onSend(prompt).then(() => {
            setMessage('');
            setDisplayValue('');
            if (textareaRef.current) {
              textareaRef.current.style.height = `${MIN_TEXTAREA_HEIGHT}px`;
              textareaRef.current.focus();
            }
         });
      });
    }
  };

  const handleTextareaClick = () => {
    textareaRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 pointer-events-none",
        isMobile ? "px-[5px]" : "px-4",
        "mb-4"
      )}
    >
      <div className="relative max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto pointer-events-auto">
        <AnimatePresence>
          {isQuickPromptsOpen && !isDisabled && (
            <motion.div
              ref={quickPromptsRef}
              key="quick-prompts-menu"
              variants={quickPromptsVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute bottom-full mb-2 left-0 right-0 mx-auto w-full max-w-md
                         rounded-3xl shadow-lg z-40 overflow-y-auto scrollbar-hide bg-black/20 backdrop-blur-md"
              style={{ maxHeight: '60vh' }}
            >
              <div className="p-3 pb-7">
                <QuickStartPrompts
                  onPromptSelect={handlePromptSelect}
                  promptSet="midChat"
                  currentTonePrompt={currentTonePrompt}
                />
              </div>

              <div className="sticky bottom-0 left-0 right-0 h-7 pointer-events-none flex justify-center items-end pb-1">
                <AnimatePresence>
                  {showScrollIndicator && (
                    <motion.div
                      key="scroll-chevron"
                      variants={chevronVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="flex justify-center pointer-events-none"
                    >
                      <ChevronDown className="w-5 h-5 text-white/40 animate-bounce" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative glass-panel rounded-full py-2 px-2 sm:px-4">
          <div className="relative flex items-stretch w-full">
            <textarea
              ref={textareaRef}
              rows={1}
              value={displayValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              onClick={handleTextareaClick}
              placeholder="Ask anything..."
              disabled={isLoading || isGeneratingImage}
              className="block w-full flex-grow bg-transparent border-none focus:ring-0 resize-none
                text-gray-100 placeholder-[rgb(var(--theme-accent))]/70 focus:outline-none
                transition-shadow duration-200 pl-6 pr-6 py-2"
              style={{
                minHeight: `${MIN_TEXTAREA_HEIGHT}px`,
                maxHeight: '150px',
                overflowY: 'auto',
                cursor: isDisabled ? 'not-allowed' : 'text',
              }}
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
              <motion.button
                whileHover={{ scale: isDisabled ? 1 : 1.1 }}
                whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                disabled={isDisabled || message.trim() === ''}
                onClick={handleSend}
                className="p-2 rounded-full bg-[rgb(var(--theme-accent))] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Send message"
              >
                <ArrowUp className="w-5 h-5 text-black" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
