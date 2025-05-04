import React, { useRef, useEffect, useState, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../ChatMessage';
import { WelcomeScreen } from '../WelcomeScreen';
import { ThinkingIndicator } from './ThinkingIndicator';
import { ImageGenerationIndicator } from './ImageGenerationIndicator';
import { ChatMessage as Message } from '../../types/chat';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '../../utils/classNames';
import { ImageMessage } from './ImageMessage'; // Import ImageMessage
import { ImagePlaceholder } from './ImagePlaceholder';
import { AppContext } from '../../App'; // Import AppContext

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  isGeneratingImage: boolean;
  currentChatId: string | null;
  userName?: string;
  userAvatarUrl?: string; // Added avatarUrl prop
  onPromptSelect?: (prompt: string) => void;
  onEditMessage: (messageId: string, newContent: string) => Promise<void>;
}

const HEADER_HEIGHT_REM = 4; // h-16 = 4rem
const TOP_MARGIN_REM = 3; // Extra space below header (Increased significantly)
const INPUT_BAR_HEIGHT_PX = 70; // Approximate height of the input bar
const BOTTOM_PADDING_PX = 80; // Additional padding below messages (Increased significantly)

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  isGeneratingImage,
  currentChatId,
  userName,
  userAvatarUrl, // Use avatarUrl prop
  onPromptSelect,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const isAutoScrolling = useRef(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showWelcomeScreen = messages.length === 0 && !isLoading;
  const [imageLoadingStates, setImageLoadingStates] = useState<boolean[]>([]);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
      isAutoScrolling.current = true;
      setIsUserScrolledUp(false);
      setIsNearBottom(true);
    }
  }, []);

  const checkScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const nearBottomThreshold = 150;
      const atBottomThreshold = 5;

      const currentlyNearBottom = scrollHeight - scrollTop - clientHeight < nearBottomThreshold;
      const currentlyAtBottom = scrollHeight - scrollTop - clientHeight <= atBottomThreshold;

      setIsNearBottom(currentlyNearBottom);

      // Determine if user scrolled up manually
      if (!isAutoScrolling.current && scrollTop > 10 && scrollTop < scrollHeight - clientHeight - atBottomThreshold) {
        setIsUserScrolledUp(true);
      } else if (currentlyAtBottom || scrollTop <= 10) {
        // If at bottom or top, assume not manually scrolled up (or auto-scrolled)
        isAutoScrolling.current = currentlyAtBottom; // Re-enable auto-scroll if at bottom
        setIsUserScrolledUp(false);
      }
    }
  }, []);


  useEffect(() => {
    // Auto-scroll when new messages arrive or loading starts, but only if not manually scrolled up
    if (!showWelcomeScreen && isAutoScrolling.current && (messages.length > 0 || isLoading)) {
      // Use requestAnimationFrame to ensure layout is updated before scrolling
      requestAnimationFrame(() => {
        scrollToBottom('smooth');
      });
    }
  }, [messages, isLoading, showWelcomeScreen, scrollToBottom]);

  useEffect(() => {
    // Reset scroll position when switching chats or showing welcome screen
    if ((showWelcomeScreen || currentChatId) && scrollContainerRef.current) {
      // setting scrolltop to 0 here fixes the issue where the chat area starts scrolled up
      scrollContainerRef.current.scrollTop = 0;
      isAutoScrolling.current = true; // Assume auto-scrolling on new chat/welcome
      setIsUserScrolledUp(false);
      setIsNearBottom(true);
    }
  }, [showWelcomeScreen, currentChatId]);


  useEffect(() => {
    const scrollableDiv = scrollContainerRef.current;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Detect if user initiated the scroll (not an auto-scroll)
      const { scrollTop, scrollHeight, clientHeight } = scrollableDiv!;
      const atBottomThreshold = 5;
      // If scrolling up and not already at the bottom, assume manual scroll
      if (scrollTop < scrollHeight - clientHeight - atBottomThreshold) {
         isAutoScrolling.current = false;
      }

      // Debounce the scroll position check
      scrollTimeoutRef.current = setTimeout(() => {
        checkScrollPosition();
      }, 150);

      // Immediate check for responsiveness
      checkScrollPosition();
    };


    if (scrollableDiv) {
      scrollableDiv.addEventListener('scroll', handleScroll);
    }

    // Initial check
    checkScrollPosition();

    // Cleanup
    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [checkScrollPosition]);

  useEffect(() => {
    // Initialize image loading states when a new image generation starts
    if (isGeneratingImage && messages.length > 0 && messages[messages.length - 1].imageUrls) {
      const numImages = messages[messages.length - 1].imageUrls!.length;
      setImageLoadingStates(new Array(Math.min(numImages, 4)).fill(false)); // Limit to 4 images
      setAllImagesLoaded(false); // Reset all images loaded state
    }
  }, [isGeneratingImage, messages]);

  const handleImageLoad = (index: number) => {
    // Update the loading state for the specific image
    setImageLoadingStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = true;
      return newStates;
    });
  };

  useEffect(() => {
    // Check if all images are loaded
    if (imageLoadingStates.length > 0 && imageLoadingStates.every(state => state === true)) {
      setAllImagesLoaded(true);
    }
  }, [imageLoadingStates]);

  const hasImageUrls = messages.length > 0 && messages[messages.length - 1].imageUrls;

  const { onEditMessage } = useContext(AppContext);

  return (
    <div className="h-full flex flex-col">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scrollbar-hide"
        style={{
          paddingBottom: `calc(${INPUT_BAR_HEIGHT_PX}px + ${BOTTOM_PADDING_PX}px + env(safe-area-inset-bottom, 0px))`,
          paddingTop: `calc(${HEADER_HEIGHT_REM}rem + ${TOP_MARGIN_REM}rem + env(safe-area-inset-top, 0px))`,
        }}
      >
        <AnimatePresence initial={false}>
          {showWelcomeScreen ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col max-w-[650px] mx-auto w-full px-4 md:px-0"
            >
              <WelcomeScreen userName={userName} onPromptSelect={onPromptSelect} />
            </motion.div>
          ) : (
            <div className="max-w-[650px] mx-auto w-full">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 15,
                    layout: { duration: 0.3 }
                   }}
                  className="px-4 md:px-0 mb-4"
                >
                  {message.imageUrls ? (
                    <div className="relative">
                      {!allImagesLoaded && (
                        <ImagePlaceholder isLoading={isGeneratingImage} progress={100} />
                      )}
                      <div className={`flex flex-wrap gap-2 ${!allImagesLoaded ? 'opacity-0' : ''}`}
                      style={{ transition: 'opacity 0.5s ease-in-out' }}>
                        {message.imageUrls.slice(0, 4).map((url, index) => (
                          <div key={index} className="w-1/2">
                            <ImageMessage url={url} prompt={message.text} index={index} totalImages={4} onLoad={() => handleImageLoad(index)} />
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-gray-400 text-center">
                        <span className="italic">
                          Note: Generated images may expire after a short period.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <ChatMessage
                      message={message}
                      onEditMessage={onEditMessage}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Loading Indicators */}
        {isLoading && !showWelcomeScreen && (
          <motion.div
            key="thinking"
            layout // Animate layout changes
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 md:px-0 mb-4 max-w-[650px] mx-auto w-full" // Consistent padding/width
          >
             {isGeneratingImage && hasImageUrls ? (
              <ImageGenerationIndicator />
            ) : (
              <ThinkingIndicator />
            )}
          </motion.div>
        )}
        {/* Anchor for scrolling to bottom */}
        <div ref={messagesEndRef} style={{ height: '1px' }} />
      </div>
    </div>
  );
};
