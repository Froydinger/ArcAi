import React, { useState, useEffect, useCallback, createContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { ChatInput } from './components/chat/ChatInput';
import { useChat } from './hooks/useChat';
import { useMediaQuery } from './hooks/useMediaQuery';
import { Message } from './types/chat';
import { v4 as uuidv4 } from 'uuid';
import { SettingsPage } from './pages/SettingsPage';
import { useAudio } from './hooks/useAudio';
import { chatStorage } from './lib/storage/chatStorage';
import { Settings } from './types/settings';
import { ChatArea } from './components/chat/ChatArea';
import { useSettings } from './hooks/useSettings';
import { Loader2, Headphones, Settings as SettingsIcon, Music as MusicIcon, Plus } from 'lucide-react';
import { MenuToggle } from './components/MenuToggle';
import { SettingsLogo } from './components/SettingsLogo';
import { Button } from './components/ui/Button'; // Import Button

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

const modalVariant = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 20 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
};

// Function to determine if a query requires live information
const requiresLiveInformation = (query: string): boolean => {
  const lowerCaseQuery = query.toLowerCase();
  return (
    lowerCaseQuery.includes("weather") ||
    lowerCaseQuery.includes("stock price") ||
    lowerCaseQuery.includes("current news") ||
    lowerCaseQuery.includes("what is today's date") ||
    lowerCaseQuery.includes("what time is it")
  );
};

interface AppContextProps {
  conversations: Conversation[];
  onSelectChat: (index: number) => void;
  settings: Settings; // Add settings to context
  updateSettings: (newSettings: Partial<Settings>) => void; // Add updateSettings to context
}

export const AppContext = createContext<AppContextProps>({
  conversations: [],
  onSelectChat: () => {},
  settings: { theme: 'purple', instructions: '' }, // Default settings
  updateSettings: () => {} // Default updateSettings
});

export default function App() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([{ id: uuidv4(), title: 'New Chat', messages: [] }]);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);

  const { settings, updateSettings, isLoaded: settingsLoaded, resetSettings } = useSettings();
  const { isLoading, isGeneratingImage, sendMessage } = useChat();
  const { playing: lofiPlaying, toggle: toggleLofi } = useAudio();
  const navigate = useNavigate();
  const location = useLocation();
  const [pinnedChats, setPinnedChats] = useState<number[]>([]);

  // Initial load effect - Load chats and apply theme AFTER auth and settings load
  useEffect(() => {
    if (!settingsLoaded) return;

    const savedChats = chatStorage.getChats();
    const savedPinned = chatStorage.getPinnedChats();
    if (savedChats && savedChats.length > 0) {
      // Validate the structure of saved chats
      const validatedChats = savedChats.map(chat => ({
        ...chat,
        messages: chat.messages ? chat.messages : [] // Ensure messages exist
      }));
      setConversations(validatedChats);
      setPinnedChats(savedPinned || []);
      const savedIndex = localStorage.getItem('arcana_current_chat_index');
      // Validate savedIndex before using it
      const validIndex = savedIndex ? parseInt(savedIndex, 10) : 0;
      setCurrentChatIndex(validIndex >= 0 && validIndex < validatedChats.length ? validIndex : 0);
    } else {
      // Ensure initial state is clean if no saved chats
      setConversations([{ id: uuidv4(), title: 'New Chat', messages: [] }]);
      setCurrentChatIndex(0);
      setPinnedChats([]);
    }
    // Apply theme loaded by useSettings (defaults to purple if new)
    document.documentElement.setAttribute('data-theme', settings.theme || 'purple');

  }, [settingsLoaded, settings.theme]);

  // Close sidebar when route changes
  useEffect(() => {
    if (isMobile) {
        setShowSidebar(false);
    }
  }, [location.pathname, isMobile]);

  // Save chats and pinned chats whenever they change
  useEffect(() => {
    if (settingsLoaded && conversations.length > 0 && (conversations.length > 1 || conversations[0].messages.length > 0)) {
        chatStorage.saveChats(conversations);
        chatStorage.savePinnedChats(pinnedChats);
        localStorage.setItem('arcana_current_chat_index', currentChatIndex.toString());
    }
  }, [settingsLoaded, conversations, pinnedChats, currentChatIndex]);

  // Apply theme whenever settings change via the hook
  useEffect(() => {
    if (settingsLoaded && settings.theme) {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  }, [settingsLoaded, settings.theme]);

  const handleSaveSettings = (newSettings: Settings) => {
     updateSettings(newSettings);
     if (newSettings.theme && newSettings.theme !== settings.theme) {
        document.documentElement.setAttribute('data-theme', newSettings.theme);
     }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all settings and delete all chats? This cannot be undone.")) {
        // 1. Reset settings state and clear settings storage (via hook)
        resetSettings();

        // 2. Explicitly clear all chat-related storage
        chatStorage.clearChats();
        chatStorage.clearPinnedChats();
        localStorage.removeItem('arcana_current_chat_index'); // Ensure index is cleared

        // 3. Reset chat state variables to initial empty state
        setConversations([{ id: uuidv4(), title: 'New Chat', messages: [] }]);
        setCurrentChatIndex(0);
        setPinnedChats([]);

        // 4. Reset visual theme to default
        document.documentElement.setAttribute('data-theme', 'purple');

        // 5. Close settings popup and stop music if playing
        setShowSettingsPopup(false);
        if (lofiPlaying) toggleLofi();

        // 6. Log out the user - Removed logout call
        console.log("All settings and chat data cleared.");
        // --- UPDATED: Open a new chat after reset ---
        handleNewChat();
        // --- END UPDATED ---
    }
  };

  const handleSend = async (message: string, contextMessages?: Message[]) => {
    const currentChat = conversations[currentChatIndex];
    let updatedConversations = [...conversations];
    let newCurrentChatIndex = currentChatIndex;

    if (!contextMessages) {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        text: message,
        isBot: false,
        timestamp: new Date()
      };

      let newPinnedChats = [...pinnedChats];
      let tempConversations = [...conversations];

      // If not already the first chat, move it to the top
      if (currentChatIndex !== 0) {
        const [movedConversation] = tempConversations.splice(currentChatIndex, 1);
        tempConversations.unshift(movedConversation);
        // Adjust pinned indices accordingly
        newPinnedChats = pinnedChats.map(idx => {
          if (idx === currentChatIndex) return 0; // The moved chat is now at index 0
          if (idx < currentChatIndex) return idx + 1; // Chats before the moved one shift down
          return idx; // Chats after the moved one remain the same relative index
        }).sort((a, b) => a - b);
        newCurrentChatIndex = 0; // The current chat is now the first one
      }

      // Add the user message to the (potentially moved) current chat
      tempConversations[newCurrentChatIndex] = {
        ...tempConversations[newCurrentChatIndex],
        messages: [...tempConversations[newCurrentChatIndex].messages, userMessage]
      };

      updatedConversations = tempConversations;
      setPinnedChats(newPinnedChats);
      setConversations(updatedConversations);
      setCurrentChatIndex(newCurrentChatIndex);
    }

    // Prepare history for the API call (use the latest state)
    const historyForChat = updatedConversations[newCurrentChatIndex].messages;

    // Check if the query requires live information
    if (requiresLiveInformation(message)) {
      // If it does, prepend the /search command to the message
      message = `/search ${message}`;
    }

    // Modified to handle multiple image URLs
    const response = await sendMessage(message, historyForChat, settings.name || 'User', settings.instructions);

    // If image URLs are returned, create a single message with all URLs
    if (response.imageUrls && response.imageUrls.length > 0) {
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: response.text, // Or a default message like "Generated Images:"
        isBot: true,
        timestamp: new Date(),
        imageUrls: response.imageUrls, // Store the array of image URLs
      };

      // Update state with the bot's response
      setConversations(prevConversations => {
        const finalConversations = [...prevConversations];
        // Ensure the target conversation still exists (important after potential deletions/resets)
        if (finalConversations[newCurrentChatIndex]) {
           finalConversations[newCurrentChatIndex] = {
            ...finalConversations[newCurrentChatIndex],
            messages: finalConversations[newCurrentChatIndex].messages.concat(botMessage)
          };
        }
        return finalConversations;
      });
    } else {
      // If no image URLs, handle as a regular text message
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        imageUrl: response.imageUrl // Keep single image URL for non-image generation
      };

      // Update state with the bot's response
      setConversations(prevConversations => {
        const finalConversations = [...prevConversations];
        // Ensure the target conversation still exists (important after potential deletions/resets)
        if (finalConversations[newCurrentChatIndex]) {
           finalConversations[newCurrentChatIndex] = {
            ...finalConversations[newCurrentChatIndex],
            messages: finalConversations[newCurrentChatIndex].messages.concat(botMessage)
          };
        }
        return finalConversations;
      });
    }
  };


  const handleEditSave = async (messageId: string, newText: string) => {
    const currentChat = conversations[currentChatIndex];
    const editedMessageIndex = currentChat.messages.findIndex(msg => msg.id === messageId);

    if (editedMessageIndex === 1 || currentChat.messages[editedMessageIndex].isBot) {
      console.error("Cannot edit message: Not found or is a bot message.");
      return;
    }

    // History up to the message *before* the edited one
    const historyBeforeEdit = currentChat.messages.slice(0, editedMessageIndex);
    const updatedUserMessage: Message = {
      ...currentChat.messages[editedMessageIndex],
      text: newText,
      timestamp: new Date(), // Update timestamp on edit
    };

    // Create the new message list up to and including the edited message
    const updatedMessages = [...historyBeforeEdit, updatedUserMessage];

    // Update the state immediately to reflect the edit
    const updatedConversations = [...conversations];
    updatedConversations[currentChatIndex] = {
      ...conversations[currentChatIndex],
      messages: updatedMessages, // Temporarily truncate messages after edit
    };
    setConversations(updatedConversations);

    // Resend the edited message, using the history *before* the edit
    await handleSend(newText, historyBeforeEdit);
  };


  const handleNewChat = () => {
    const newConversation = { id: uuidv4(), title: 'New Chat', messages: [] };
    // Add the new chat to the beginning
    const updatedConversations = [newConversation, ...conversations];
    // Shift all existing pinned indices down by 1
    const newPinnedChats = pinnedChats.map(idx => idx + 1).sort((a, b) => a - b);
    setPinnedChats(newPinnedChats);
    setConversations(updatedConversations);
    setCurrentChatIndex(0); // New chat is now the current one
    if (isMobile) setShowSidebar(false);
    // --- UPDATED: Refresh page after creating a new chat ---
    window.location.reload();
    // --- END UPDATED ---
  };

  const handleDeleteChat = (indexToDelete: number) => {
    const chatTitle = conversations[indexToDelete]?.title || `Chat ${indexToDelete + 1}`;
    if (window.confirm(`Are you sure you want to delete "${chatTitle}"?`)) {
        const updatedConversations = conversations.filter((_, index) => index !== indexToDelete);
        // Update pinned chats: remove the deleted index and shift down higher indices
        const newPinnedChats = pinnedChats
          .map(idx => {
            if (idx === indexToDelete) return -1; // Mark for removal
            if (idx > indexToDelete) return idx - 1; // Shift down
            return idx;
          })
          .filter(idx => idx !== -1) // Remove the marked index
          .sort((a, b) => a - b);
        setPinnedChats(newPinnedChats);

        let newCurrentChatIndex = currentChatIndex;

        if (updatedConversations.length === 0) {
          // If all chats are deleted, create a new empty one
          setConversations([{ id: uuidv4(), title: 'New Chat', messages: [] }]);
          newCurrentChatIndex = 0;
          // Clear storage explicitly as well
          chatStorage.clearChats();
          chatStorage.clearPinnedChats();
          localStorage.removeItem('arcana_current_chat_index');
        } else {
          setConversations(updatedConversations);
          // Adjust currentChatIndex if necessary
          if (currentChatIndex === indexToDelete) {
            // If deleting the current chat, select the one before it, or the first one
            newCurrentChatIndex = Math.max(0, indexToDelete - 1);
          } else if (currentChatIndex > indexToDelete) {
            // If deleting a chat before the current one, shift the current index down
            newCurrentChatIndex = currentChatIndex - 1;
          }
          // If deleting a chat after the one, the index remains the same
        }
        setCurrentChatIndex(newCurrentChatIndex);
        if (isMobile) setShowSidebar(false);
    }
  };

  const handleDeleteAllChats = () => {
    if (window.confirm("Are you sure you want to delete ALL chats? This cannot be undone.")) {
      // Reset to a single new chat state
      setConversations([{ id: uuidv4(), title: 'New Chat', messages: [] }]);
      setCurrentChatIndex(0);
      setPinnedChats([]);
      // Clear all chat-related storage
      chatStorage.clearChats();
      chatStorage.clearPinnedChats();
      localStorage.removeItem('arcana_current_chat_index');
      if (isMobile) setShowSidebar(false);
    }
  };


  const handleRenameChat = (index: number, newTitle: string) => {
    const updatedConversations = [...conversations];
    if (updatedConversations[index]) {
      updatedConversations[index] = {
        ...updatedConversations[index],
        title: newTitle,
      };
      setConversations(updatedConversations);
    }
  };

  const handleTogglePinChat = (index: number) => {
    let newPinnedChats;
    if (pinnedChats.includes(index)) {
      // Unpin: filter out the index
      newPinnedChats = pinnedChats.filter((pinnedIndex) => pinnedIndex !== index);
    } else {
      // Pin: add the index if limit not reached
      if (pinnedChats.length < 3) {
        newPinnedChats = [...pinnedChats, index].sort((a, b) => a - b);
      } else {
        alert("You can only pin up to 3 chats.");
        return; // Don't update state if limit reached
      }
    }
    setPinnedChats(newPinnedChats);
  };

  const handleSelectChat = (index: number) => {
    // Ensure index is valid before setting
    if (index >= 0 && index < conversations.length) {
        setCurrentChatIndex(index);
        if (isMobile) setShowSidebar(false);
    } else {
        console.warn(`Attempted to select invalid chat index: ${index}`);
        // Optionally reset to 0 or handle error appropriately
        setCurrentChatIndex(0);
    }
  };

  const handleToggleSettings = () => {
    setShowSettingsPopup(!showSettingsPopup);
  };

  // --- Render Logic ---

  if (!settingsLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Ensure currentChatIndex is valid before rendering ChatArea/ChatInput
  const safeCurrentChatIndex = Math.min(Math.max(0, currentChatIndex), conversations.length - 1);
  const currentConversation = conversations[safeCurrentChatIndex];


  return (
    <AppContext.Provider value={{ conversations: conversations, onSelectChat: handleSelectChat, settings: settings, updateSettings: updateSettings }}>
      <div className="h-screen flex flex-col text-gray-100 overflow-hidden">
        {/* Removed Header component, added MenuToggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"> {/* Container for MenuToggle and New Chat Button */}
            <MenuToggle show={showSidebar} onClick={() => setShowSidebar(!showSidebar)} />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewChat}
              className="fixed top-4 left-16 z-50 w-12 h-12 rounded-full bg-gray-800/30 backdrop-blur-sm 
                hover:bg-gray-700/30 transition-all duration-300 hover:scale-105 p-0 flex items-center justify-center"
              aria-label="New Chat"
            >
              <Plus className="w-6 h-6 text-[rgb(var(--theme-accent))]" />
            </Button>
          </div>
          {/* --- NEW: Add SettingsLogo component --- */}
          <SettingsLogo onClick={handleToggleSettings} />
          {/* --- END NEW --- */}
        </div>

        <div className="flex flex-1 overflow-hidden">
          <AnimatePresence>
            {showSidebar && (
              <Sidebar
                key="sidebar"
                show={showSidebar}
                isMobile={isMobile}
                onClose={() => setShowSidebar(false)}
                conversations={conversations}
                onNewChat={handleNewChat}
                onSelectChat={handleSelectChat}
                onDeleteChat={handleDeleteChat}
                currentChatIndex={safeCurrentChatIndex} // Use safe index
                onRenameChat={handleRenameChat}
                pinnedChats={pinnedChats}
                onTogglePinChat={handleTogglePinChat}
                onDeleteAllChats={handleDeleteAllChats}
                onToggleSettings={handleToggleSettings} // Pass handleToggleSettings
                onToggleLofi={toggleLofi} // Pass toggleLofi function
                lofiPlaying={lofiPlaying} // Pass lofiPlaying state
              />
            )}
          </AnimatePresence>

          <main className="flex-1 h-full overflow-hidden">
            <div className="h-full flex flex-col overflow-hidden">
               {/* Ensure currentConversation is valid before accessing properties */}
              {currentConversation && (
                <ChatArea
                  messages={currentConversation.messages || []}
                  onEditMessage={handleEditSave}
                  isLoading={isLoading}
                  isGeneratingImage={isGeneratingImage}
                  userName={settings.name || 'You'}
                  userAvatarUrl={settings.avatarUrl}
                  currentChatId={currentConversation.id}
                  onPromptSelect={handleSend}
                />
              )}
            </div>
          </main>
        </div>

         {/* Ensure currentConversation is valid before passing props */}
        {currentConversation && (
          <ChatInput
            onSend={handleSend}
            isLoading={isLoading}
            isGeneratingImage={isGeneratingImage}
            quickPrompts={currentConversation.messages.length > 0}
            disabled={isLoading || isGeneratingImage}
          />
        )}

        {/* Settings Popup Modal */}
        <AnimatePresence>
          {showSettingsPopup && (
            <motion.div
              key="settings-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] flex items-start justify-center p-4 overflow-y-auto"
              onClick={() => setShowSettingsPopup(false)}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div
                key="settings-content"
                variants={modalVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative w-full max-w-2xl my-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <SettingsPage
                  settings={settings}
                  onSave={handleSaveSettings}
                  onReset={handleReset}
                  onClose={() => setShowSettingsPopup(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
}
