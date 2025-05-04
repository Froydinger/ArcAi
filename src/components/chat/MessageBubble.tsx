import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Pencil, X, Save } from 'lucide-react'; // Removed User icon
import { Message } from '../../types/chat';
import { formatTime } from '../../utils/date';
import { ImageMessage } from './ImageMessage';
import { marked } from 'marked';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import ErrorBoundary from '../ErrorBoundary';
import TextareaAutosize from 'react-textarea-autosize';

interface MessageBubbleProps {
  message: Message;
  isTyping?: boolean;
  // userAvatar prop removed
  onEditSave?: (messageId: string, newText: string) => void;
}

const bubbleVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    }
  }
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  // userAvatar removed from destructuring
  onEditSave
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);
  const navigate = useNavigate();
  const messageContentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(editedText.length, editedText.length);
    }
  }, [isEditing, editedText.length]);

  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: false,
    mangle: false,
  });

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleEditClick = () => {
    setEditedText(message.text);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (editedText.trim() === message.text.trim()) {
      setIsEditing(false);
      return;
    }
    if (editedText.trim() && onEditSave) {
      onEditSave(message.id, editedText.trim());
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSaveEdit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      handleCancelEdit();
    }
  };

  const handleApiKeyError = () => {
    if (message.text.includes('API key') && message.text.includes('⚠️')) {
      return (
        <div className="mt-4">
          <button
            onClick={() => {
              navigate('/settings');
              setTimeout(() => {
                const element = document.getElementById('api-settings');
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
            }}
            className="px-4 py-2 bg-[rgb(var(--theme-primary))]/20 hover:bg-[rgb(var(--theme-primary))]/30
              text-[rgb(var(--theme-accent))] rounded-lg text-sm transition-colors duration-200"
          >
            Add API Keys in Settings →
          </button>
        </div>
      );
    }
    return null;
  };

  const renderMessageContent = () => {
    if (message.imageUrl) {
      return <ImageMessage url={message.imageUrl} prompt={message.text} />;
    }

    if (isEditing && !message.isBot) {
      return (
        <div className="flex flex-col gap-2 w-full">
          <TextareaAutosize
            ref={textareaRef}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 rounded-md bg-white/10 text-white text-base resize-none focus:outline-none focus:ring-1 focus:ring-[rgb(var(--theme-accent))]/50"
            minRows={1}
            maxRows={10}
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={handleCancelEdit}
              className="p-1.5 rounded hover:bg-white/20 transition-colors text-gray-300 hover:text-white"
              aria-label="Cancel edit"
            >
              <X size={16} />
            </button>
            <button
              onClick={handleSaveEdit}
              className="p-1.5 rounded bg-[rgb(var(--theme-accent))]/80 hover:bg-[rgb(var(--theme-accent))] transition-colors text-white"
              aria-label="Save edit"
              disabled={!editedText.trim() || editedText.trim() === message.text.trim()}
            >
              <Save size={16} />
            </button>
          </div>
        </div>
      );
    }

    const rawHtml = marked(message.text);
    const cleanHtml = DOMPurify.sanitize(rawHtml, { ADD_ATTR: ['target'] });

    return (
      <ErrorBoundary>
        <div
          ref={messageContentRef}
          className="prose prose-invert max-w-none break-words text-base"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
      </ErrorBoundary>
    );
  };

  return (
    <motion.div
      // Use flex justify-start/end for alignment
      className={`group flex w-full ${
        message.isBot ? 'justify-start' : 'justify-end'
      }`}
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      {/* REMOVED Bot Avatar */}

      {/* Message Bubble */}
      <div
        // Adjusted max-width slightly now that avatars are gone
        className={`group/bubble relative max-w-[80%] glass-panel
          ${message.isBot ? 'rounded-t-2xl rounded-br-2xl rounded-bl-lg' : 'rounded-t-2xl rounded-bl-2xl rounded-br-lg'}
          ${message.isBot ? 'bg-white/5' : 'bg-[rgb(var(--theme-primary))]/20'} p-4`}
      >
        {handleApiKeyError()}
        <div className="text-base leading-relaxed space-y-4 min-h-[1.5rem] w-full">
          {renderMessageContent()}
        </div>

        {!isEditing && (!message.text.includes('API key') || !message.text.includes('⚠️')) ? (
          <div className="flex items-center justify-end mt-2 transition-opacity duration-200">
             <span className="text-[10px] text-gray-400 mr-auto">
               {message.timestamp && formatTime(message.timestamp)}
             </span>
            {!message.isBot && onEditSave && (
              <button
                onClick={handleEditClick}
                className="p-1 rounded hover:bg-white/10 transition-colors ml-2"
                aria-label="Edit message"
              >
                <Pencil className="w-3 h-3 text-gray-400" />
              </button>
            )}
            <button
              onClick={handleCopyToClipboard}
              className="p-1 rounded hover:bg-white/10 transition-colors ml-1"
              aria-label="Copy message"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3 text-gray-400" />
              )}
            </button>
          </div>
        ) : null}
      </div>

      {/* REMOVED User Avatar */}
    </motion.div>
  );
};
