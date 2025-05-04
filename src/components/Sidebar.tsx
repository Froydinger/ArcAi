import React from 'react';
import { Bot, Plus, ChevronLeft } from 'lucide-react'; // Removed Trash2
import { Message } from '../types/chat';

interface SidebarProps {
  show: boolean;
  isMobile: boolean;
  onClose: () => void;
  conversations: Message[][];
  onNewChat: () => void;
  onSelectChat: (index: number) => void;
  currentChatIndex: number;
  onDeleteChat: (index: number) => void;
  onRenameChat: (index: number, newTitle: string) => void;
  // Removed onDeleteAllChats prop from here
}

export const Sidebar: React.FC<SidebarProps> = ({
  show,
  isMobile,
  onClose,
  conversations,
  onNewChat,
  onSelectChat,
  currentChatIndex,
  onDeleteChat, // Keep existing props
  onRenameChat, // Keep existing props
  // Removed onDeleteAllChats usage from here
}) => (
  <aside className={`
    ${show ? 'translate-x-0' : '-translate-x-full'}
    ${isMobile ? 'fixed' : 'sticky'}
    top-0 left-0 h-full w-72 transform transition-transform duration-300
    bg-gray-900/40 backdrop-blur-xl border-r border-gray-800/50
    z-50
  `}>
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 flex justify-between items-center border-b border-gray-800/50">
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/80 
            hover:bg-violet-600 text-white text-sm transition-all duration-300 hover:scale-105"
        >
          <Plus size={16} />
          New Chat
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-800/30 transition-colors text-gray-400"
        >
          <ChevronLeft size={16} />
        </button>
      </div>
      
      {/* Chat List */}
      <div className="overflow-y-auto h-0 flex-grow">
        {conversations.map((chat, index) => (
          <button
            key={index}
            onClick={() => onSelectChat(index)}
            className={`w-full text-left p-4 hover:bg-gray-800/30 transition-all duration-300 ${
              currentChatIndex === index ? 'bg-gray-800/30' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <Bot size={16} className="text-violet-400 opacity-75" />
              <div className="text-sm text-gray-300 truncate">
                {/* Improved title generation: Use first user message or default */}
                {chat.find(msg => msg.role === 'user')?.text.substring(0, 30) || `Chat ${index + 1}`}
                {(chat.find(msg => msg.role === 'user')?.text?.length ?? 0) > 30 ? '...' : ''}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Actions - Removed this section */}
      {/* 
      <div className="p-3 border-t border-gray-800/50">
        <button
          onClick={onDeleteAllChats} 
          className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg 
            bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 
            text-sm transition-all duration-300"
        >
          <Trash2 size={16} />
          Delete All Chats
        </button>
      </div> 
      */}
    </div>
  </aside>
);
