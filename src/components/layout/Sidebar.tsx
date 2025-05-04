import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X as CloseIcon, Trash2, Edit3, Check, X, Pin, PinOff, Headphones, Settings as SettingsIcon, Music as MusicIcon } from 'lucide-react';
import { Message } from '../../types/chat';
import { formatDate } from '../../utils/date';
import { cn } from '../../utils/classNames';
import { useAudio } from '../../hooks/useAudio';
import { useSettings } from '../../hooks/useSettings';

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

interface SidebarProps {
  show: boolean;
  isMobile: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onNewChat: () => void;
  onSelectChat: (index: number) => void;
  currentChatIndex: number;
  onDeleteChat: (index: number) => void;
  onRenameChat: (index: number, newTitle: string) => void;
  pinnedChats: number[];
  onTogglePinChat: (index: number) => void;
  onDeleteAllChats?: () => void;
  onToggleSettings: () => void;
  onToggleLofi: () => void;
  lofiPlaying: boolean;
}

const sidebarVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: "-50%",
    x: "-50%",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: "-50%",
    x: "-50%",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const Sidebar: React.FC<SidebarProps> = ({
  show,
  isMobile,
  onClose,
  conversations,
  onNewChat,
  onSelectChat,
  currentChatIndex,
  onDeleteChat,
  onRenameChat,
  pinnedChats,
  onTogglePinChat,
  onDeleteAllChats = () => console.warn("Delete All Chats not implemented"),
  onToggleSettings,
  onToggleLofi,
  lofiPlaying,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const { toggle } = useAudio();
  const { settings } = useSettings();

  const handleRenameClick = (index: number, currentTitle: string) => {
    setEditingIndex(index);
    setRenameValue(currentTitle || getChatPreview(conversations[index]));
  };

  const handleRenameConfirm = (index: number) => {
    if (renameValue.trim()) {
      onRenameChat(index, renameValue.trim());
    }
    setEditingIndex(null);
    setRenameValue('');
  };

  const handleRenameCancel = () => {
    setEditingIndex(null);
    setRenameValue('');
  };

  const getChatPreview = (chat: Conversation): string => {
    // Prioritize user-set title if it exists and isn't the default
    if (chat.title && chat.title !== 'New Chat') {
        return chat.title;
    }
    // Otherwise, try the last bot message
    const lastBotMessage = [...chat.messages].reverse().find(msg => msg.isBot && !msg.isTyping);
    if (lastBotMessage) return lastBotMessage.text;
    // Fallback to last user message
    const lastUserMessage = [...chat.messages].reverse().find(msg => !msg.isBot);
    if (lastUserMessage) return lastUserMessage.text;
    // Final fallback if no messages and no custom title
    return `Chat - ${formatDate(new Date())}`;
  };

  const pinnedConversations = conversations
    .map((chat, index) => ({ ...chat, originalIndex: index }))
    .filter((_, index) => pinnedChats.includes(index));

  const unpinnedConversations = conversations
    .map((chat, index) => ({ ...chat, originalIndex: index }))
    .filter((_, index) => !pinnedChats.includes(index));

  const renderChatItem = (chat: Conversation & { originalIndex: number }, isPinned: boolean) => {
    const index = chat.originalIndex;
    const isEditing = editingIndex === index;
    const isCurrent = currentChatIndex === index;
    const previewText = getChatPreview(chat);

    return (
      <div
        key={chat.id}
        className={cn(
          "relative group border-b border-[rgba(var(--theme-accent-rgb),0.1)]",
          isCurrent && 'bg-[rgba(var(--theme-accent-rgb),0.2)]'
        )}
      >
        {isEditing ? (
          <div className="p-3 flex items-center gap-2">
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRenameConfirm(index)}
              className="flex-grow bg-transparent border border-gray-600 rounded px-2 py-1 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-[rgb(var(--theme-accent))]"
              autoFocus
            />
            <button onClick={() => handleRenameConfirm(index)} className="p-1 text-green-400 hover:text-green-300">
              <Check size={16} />
            </button>
            <button onClick={handleRenameCancel} className="p-1 text-red-400 hover:text-red-300">
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onSelectChat(index)}
            className="w-full text-left p-3 pr-20 transition-colors duration-200 hover:bg-[rgba(var(--theme-accent-rgb),0.1)] flex items-center gap-3"
          >
            {/* --- REVERTED: Use img tag with logo-image class --- */}
            <img
              src="https://froydingermediagroup.wordpress.com/wp-content/uploads/2025/04/chatgpt-image-apr-22-2025-10_50_06-pm-e1745380747320.png"
              alt="Chat Icon"
              className="logo-image h-4 w-4 flex-shrink-0 opacity-80" // Apply logo-image class, keep size/opacity
            />
            {/* --- END REVERTED --- */}
            <div className="flex-grow overflow-hidden flex items-center gap-1">
              {isPinned && <Pin size={12} className="text-yellow-400 flex-shrink-0 mr-1" />}
              <span className="text-sm text-gray-100 font-medium truncate flex-grow">
                {previewText}
              </span>
            </div>
          </button>
        )}

        {!isEditing && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
             <button
              onClick={() => onTogglePinChat(index)}
              className={cn(
                "p-1.5 text-gray-400 hover:text-gray-100 hover:bg-white/10 rounded",
                pinnedChats.length >= 3 && !isPinned && 'opacity-50 cursor-not-allowed'
              )}
              aria-label={isPinned ? "Unpin chat" : "Pin chat"}
              disabled={pinnedChats.length >= 3 && !isPinned}
            >
              {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
            </button>
             <button
              onClick={() => handleRenameClick(index, getChatPreview(chat))} // Pass preview text as current title
              className="p-1.5 text-gray-400 hover:text-gray-100 hover:bg-white/10 rounded"
              aria-label="Rename chat"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={() => onDeleteChat(index)}
              className="p-1.5 text-red-500 hover:text-red-400 hover:bg-white/10 rounded"
              aria-label="Delete chat"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        key="sidebar-overlay" // Key for AnimatePresence
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.3 }} // Simple fade for overlay
        onClick={onClose} // Close sidebar when clicking overlay
      />

      {/* Floating Panel using motion.aside */}
      <motion.aside
        key="sidebar-panel" // Key for AnimatePresence
        variants={sidebarVariants} // Apply the jelly animation variants
        initial="hidden"
        animate="visible"
        exit="hidden"
        // CRITICAL: Added transform classes directly for robust centering
        className={`
          fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          /* Responsive width: near full on small screens, fixed on larger */
          w-[ w-[calc(100%-2rem)] sm:w-80
      max-h-[75vh]
      bg-gray-900/60 backdrop-blur-xl border border-[rgba(var(--theme-accent-rgb),0.2)]
      rounded-3xl shadow-2xl
      z-50 flex flex-col
    `}
  >
    {/* Header */}
    <div className="p-3 flex justify-between items-center border-b border-[rgba(var(--theme-accent-rgb),0.1)] flex-shrink-0">
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(var(--theme-accent-rgb),0.8)]
          hover:bg-[rgba(var(--theme-accent-rgb),1)] text-white text-sm transition-all duration-300 hover:scale-105 shadow-md"
      >
        <Plus size={16} />
        New Chat
      </button>

      {/* Music Toggle Button */}
      <button
        onClick={onToggleLofi}
        className={cn(
          "p-2 rounded-full hover:bg-white/10 transition-colors duration-200",
          lofiPlaying ? "pulsing-glow text-[rgb(var(--theme-accent))]" : "text-gray-400 hover:text-gray-200"
        )}
        aria-label={lofiPlaying ? 'Pause Music' : 'Play Music'}
      >
        <Headphones className="w-5 h-5" strokeWidth={1.5} />
      </button>

      {/* Settings Button */}
      <button onClick={onToggleSettings} className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 text-gray-400 hover:text-gray-200">
        <SettingsIcon className="w-5 h-5" strokeWidth={1.5} />
      </button>

      <button
        onClick={onClose}
        className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-100"
        aria-label="Close history panel"
      >
        <CloseIcon size={18} />
      </button>
    </div>

    {/* Chat List Container - Scrollable */}
    <div className="overflow-y-auto flex-grow sidebar-scroll-container">
      {/* Pinned Chats Section */}
      {pinnedChats.length > 0 && (
        <div className="pt-1">
          {pinnedConversations.map(chat => renderChatItem(chat, true))}
        </div>
      )}

       {/* Separator */}
      {pinnedChats.length > 0 && unpinnedConversations.length > 0 && (
        <hr className="border-t border-[rgba(var(--theme-accent-rgb),0.1)] my-1" />
      )}

      {/* Unpinned Chats Section */}
      {unpinnedConversations.map(chat => renderChatItem(chat, false))}

      {/* Add some bottom padding inside the scrollable area */}
      <div className="h-4"></div>
    </div>

    {/* Footer Actions */}
    <div className="p-3 border-t border-[rgba(var(--theme-accent-rgb),0.1)] flex-shrink-0">
      <button
        onClick={onDeleteAllChats}
        className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg
          bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300
          text-sm transition-all duration-300"
        aria-label="Delete all chats"
      >
        <Trash2 size={16} />
        Delete All Chats
      </button>
    </div>
  </motion.aside>
</>
);
};
