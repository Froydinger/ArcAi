import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { Send, Plus, Headphones, Settings, Copy, Edit, Trash2, ArrowDown, Search as SearchIcon } from 'lucide-react';
import { ThinkingIndicator } from './chat/ThinkingIndicator';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './chat/ChatInput';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../App';
import { QuickStartPrompts } from './chat/QuickStartPrompts';
import { midChatPromptsBase, midImagePrompts, midTherapyPrompts, midCreativeWritingPrompts, midFunPrompts } from '../lib/prompts';
import { ImageGenerationIndicator } from './chat/ImageGenerationIndicator';
import { ImageMessage } from './chat/ImageMessage';
import { ImagePlaceholder } from './chat/ImagePlaceholder';
import { VoiceChat } from './chat/VoiceChat';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { ZapMenu } from './ZapMenu';

const TOP_MARGIN_REM = 5;
const INPUT_BAR_HEIGHT_PX = 65;
const BOTTOM_PADDING_PX = 100;

export const ChatArea: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const {
    addMessageToConversation,
    currentMessage,
    setCurrentMessage,
    isThinking,
    setIsThinking,
    conversations,
    deleteConversation,
    editConversationTitle,
    onSelectChat,
    addImageToConversation,
    isGeneratingImage,
    setIsGeneratingImage,
    imageUrls,
    setImageUrls,
    isRecording,
    setIsRecording,
    audioUrl,
    setAudioUrl,
    isTranscribing,
    setIsTranscribing,
    transcription,
    setTranscription,
    userName,
    theme,
  } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [showMidChatPrompts, setShowMidChatPrompts] = useState(false);
  const [selectedMidChatCategory, setSelectedMidChatCategory] = useState<'chat' | 'therapy' | 'write' | 'create'>('chat');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageWarning, setImageWarning] = useState(false);
  const [imageCount, setImageCount] = useState(0);
  const [imagePlaceholders, setImagePlaceholders] = useState(Array(4).fill(false));
  const [isImageGenerationComplete, setIsImageGenerationComplete] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');

  const currentConversation = conversations.find((c) => c.id === chatId);

  useEffect(() => {
    if (chatId && currentConversation) {
      const index = conversations.findIndex((c) => c.id === chatId);
      onSelectChat(index);
    }
  }, [chatId, conversations, onSelectChat]);

  const scrollToBottom = useCallback(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      setShowScrollDown(false);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            setShowScrollDown(true);
          } else {
            setShowScrollDown(false);
          }
        });
      },
      {
        root: chatAreaRef.current,
        threshold: 0.1,
      }
    );

    if (chatAreaRef.current && chatAreaRef.current.lastElementChild) {
      observer.observe(chatAreaRef.current.lastElementChild);
    }

    return () => {
      observer.disconnect();
    };
  }, [conversations, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, conversations, chatId]);

  const handlePromptSelect = (prompt: string) => {
    setCurrentMessage(prompt);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleEditTitle = () => {
    const newTitle = prompt('Enter new title:', currentConversation?.title || '');
    if (newTitle && currentConversation) {
      editConversationTitle(currentConversation.id, newTitle);
    }
  };

  const handleDeleteConversation = () => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      if (chatId) {
        deleteConversation(chatId);
        navigate('/');
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (currentMessage.trim() !== '' && !isThinking) {
      const messageToSend = currentMessage.trim();
      setCurrentMessage('');
      setIsThinking(true);

      const updatedConversation = await addMessageToConversation(chatId, {
        text: messageToSend,
        isUser: true,
      });

      if (updatedConversation) {
        scrollToBottom();
      } else {
        setIsThinking(false);
        alert('Failed to send message. Please try again.');
        return;
      }

      let botResponse = '';

      if (messageToSend.startsWith('/search')) {
        const searchTerm = messageToSend.substring(7).trim();
        setSearchParams({ search: searchTerm });
      } else if (messageToSend.startsWith('/draw')) {
        setIsGeneratingImage(true);
        setImageUrls([]);
        setImageCount(0);
        setImageError(false);
        setImageWarning(false);
        setIsImageGenerationComplete(false);
        setImagePlaceholders(Array(4).fill(true));

        const imageDescription = messageToSend.substring(5).trim();

        try {
          const response = await fetch('/.netlify/functions/generateImage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: `A painting of ${imageDescription} in the style of impressionism` }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data && data.revised_prompt) {
            botResponse = `Revised prompt: ${data.revised_prompt}`;
          }

          if (data && data.images && Array.isArray(data.images)) {
            const newImageUrls = data.images.map((image, index) => ({
              id: `image-${Date.now()}-${index}`,
              url: image,
            }));

            setImageUrls(newImageUrls);
            setIsGeneratingImage(false);
            setIsImageGenerationComplete(true);
            setImagePlaceholders(Array(4).fill(false));

            newImageUrls.forEach(async (imageUrlObject) => {
              await addImageToConversation(chatId, {
                imageUrl: imageUrlObject.url,
                isUser: false,
              });
            });
          } else {
            console.error('Unexpected data structure:', data);
            setImageError(true);
            setIsGeneratingImage(false);
            setIsImageGenerationComplete(true);
            setImagePlaceholders(Array(4).fill(false));
          }
        } catch (error: any) {
          console.error('Error generating image:', error);
          setImageError(true);
          setIsGeneratingImage(false);
          setIsImageGenerationComplete(true);
          setImagePlaceholders(Array(4).fill(false));
        } finally {
          setIsThinking(false);
        }
      } else {
        try {
          const response = await fetch('/.netlify/functions/generateText', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: messageToSend, userName: userName }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          botResponse = data.response;
        } catch (error) {
          console.error('Error generating text:', error);
          botResponse = 'Sorry, I am having trouble generating a response. Please try again later.';
        } finally {
          setIsThinking(false);

          await addMessageToConversation(chatId, {
            text: botResponse,
            isUser: false,
          });

          scrollToBottom();
        }
      }
    }
  };

  const handleScrollDownClick = () => {
    scrollToBottom();
  };

  const toggleMidChatPrompts = () => {
    setShowMidChatPrompts(!showMidChatPrompts);
  };

  const handleMidChatCategoryClick = (category: 'chat' | 'therapy' | 'write' | 'create') => {
    setSelectedMidChatCategory(category);
  };

  let midChatPrompts;
  switch (selectedMidChatCategory) {
    case 'therapy':
      midChatPrompts = midTherapyPrompts;
      break;
    case 'write':
      midChatPrompts = midCreativeWritingPrompts;
      break;
    case 'create':
      midChatPrompts = midImagePrompts;
      break;
    default:
      midChatPrompts = midChatPromptsBase;
      break;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Area */}
      <div
        ref={chatAreaRef}
        className={`flex-grow overflow-y-auto px-4 md:px-6 pt-[calc(${TOP_MARGIN_REM}rem + 1rem + env(safe-area-inset-top, 0px))] pb-[calc(${INPUT_BAR_HEIGHT_PX}px + ${BOTTOM_PADDING_PX}px + env(safe-area-inset-bottom, 0px))]`}
      >
        {currentConversation &&
          currentConversation.messages.map((message, index) => {
            if (message.imageUrl) {
              return <ImageMessage key={index} imageUrl={message.imageUrl} isUser={message.isUser} />;
            } else {
              return <ChatMessage key={index} message={message.text || ''} isUser={message.isUser} />;
            }
          })}
        {imagePlaceholders.some(placeholder => placeholder) && (
          <ImagePlaceholder imagePlaceholders={imagePlaceholders} />
        )}
        {isThinking && <ThinkingIndicator />}
      </div>

      {/* Scroll Down Button */}
      {showScrollDown && (
        <button
          onClick={handleScrollDownClick}
          className="absolute bottom-20 right-4 bg-gray-800 text-white rounded-full p-2 shadow-lg"
        >
          <ArrowDown />
        </button>
      )}

      {/* Chat Input Area */}
      <div className="absolute bottom-0 left-0 w-full">
        {/* Mid-Chat Prompts */}
        {showMidChatPrompts && (
          <div className="px-4 md:px-6 pb-4">
            <div className="flex space-x-2 mb-2">
              <button
                className={`px-4 py-2 rounded-full text-sm ${selectedMidChatCategory === 'chat'
                  ? 'glass-panel-active'
                  : 'glass-panel hover:bg-gray-700/20'
                  }`}
                onClick={() => handleMidChatCategoryClick('chat')}
              >
                Chat
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm ${selectedMidChatCategory === 'therapy'
                  ? 'glass-panel-active'
                  : 'glass-panel hover:bg-gray-700/20'
                  }`}
                onClick={() => handleMidChatCategoryClick('therapy')}
              >
                Therapy
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm ${selectedMidChatCategory === 'write'
                  ? 'glass-panel-active'
                  : 'glass-panel hover:bg-gray-700/20'
                  }`}
                onClick={() => handleMidChatCategoryClick('write')}
              >
                Write
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm ${selectedMidChatCategory === 'create'
                  ? 'glass-panel-active'
                  : 'glass-panel hover:bg-gray-700/20'
                  }`}
                onClick={() => handleMidChatCategoryClick('create')}
              >
                Create
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {midChatPrompts && midChatPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="px-4 py-2 rounded-full glass-panel cursor-pointer text-sm text-gray-300 hover:text-gray-100 transition-colors duration-200"
                  onClick={() => handlePromptSelect(prompt.prompt)}
                >
                  {prompt.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <ChatInput
          ref={inputRef}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
          toggleMidChatPrompts={toggleMidChatPrompts}
        />
      </div>
    </div>
  );
};
