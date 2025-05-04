import { Message } from '../../types/chat';
import { Settings } from '../../types/settings';
import { v4 as uuidv4 } from 'uuid';

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

class ChatStorage {
  private static instance: ChatStorage;
  private readonly CHATS_STORAGE_KEY = 'arcana_chats';
  private readonly SETTINGS_KEY = 'arcana_settings';
  private readonly PINNED_CHATS_KEY = 'arcana_pinned_chats'; // New key for pinned chats

  private constructor() {}

  static getInstance(): ChatStorage {
    if (!ChatStorage.instance) {
      ChatStorage.instance = new ChatStorage();
    }
    return ChatStorage.instance;
  }

  saveChats(chats: Conversation[]): void {
    try {
      const serializedChats = JSON.stringify(chats, (key, value) => {
        if (key === 'timestamp' && value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
      localStorage.setItem(this.CHATS_STORAGE_KEY, serializedChats);
    } catch (error) {
      console.error('Error saving chats:', error);
    }
  }

  getChats(): Conversation[] | null {
    try {
      const stored = localStorage.getItem(this.CHATS_STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);

      // Ensure all messages have proper Date objects for timestamps
      return parsed.map((chat: any) => ({
        ...chat,
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
          id: msg.id || crypto.randomUUID(), // Ensure all messages have IDs
          imageUrl: msg.imageUrl || undefined // Preserve image URLs
        }))
      }));
    } catch (error) {
      console.error('Error getting chats:', error);
      return null;
    }
  }

  clearChats(): void {
    try {
      localStorage.removeItem(this.CHATS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing chats:', error);
    }
  }

  // --- Pinned Chats Methods ---
  savePinnedChats(pinnedIndices: number[]): void {
    try {
      localStorage.setItem(this.PINNED_CHATS_KEY, JSON.stringify(pinnedIndices));
    } catch (error) {
      console.error('Error saving pinned chats:', error);
    }
  }

  getPinnedChats(): number[] | null {
    try {
      const stored = localStorage.getItem(this.PINNED_CHATS_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Basic validation: ensure it's an array of numbers
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'number')) {
        return parsed;
      }
      console.warn('Invalid pinned chats data found in storage:', parsed);
      this.clearPinnedChats(); // Clear invalid data
      return null;
    } catch (error) {
      console.error('Error getting pinned chats:', error);
      return null;
    }
  }

  clearPinnedChats(): void {
    try {
      localStorage.removeItem(this.PINNED_CHATS_KEY);
    } catch (error) {
      console.error('Error clearing pinned chats:', error);
    }
  }
  // --- End Pinned Chats Methods ---


  async saveSettings(settings: Settings): Promise<void> {
    try {
      const serializedSettings = JSON.stringify(settings);
      localStorage.setItem(this.SETTINGS_KEY, serializedSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  async getSettings(): Promise<Settings | null> {
    try {
      // Corrected: Should get from SETTINGS_KEY, not STORAGE_KEY
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }

  async resetSettings(): Promise<void> {
    try {
      localStorage.removeItem(this.SETTINGS_KEY);
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  }
}

export const chatStorage = ChatStorage.getInstance();

// Keep these exports if they are used elsewhere, otherwise they are redundant
export const saveSettings = (settings: Settings) => chatStorage.saveSettings(settings);
export const getSettings = () => chatStorage.getSettings();
export const resetSettings = () => chatStorage.resetSettings();
