import { Message } from '../types/chat';

class ChatStorage {
  private static instance: ChatStorage;
  private readonly STORAGE_KEY = 'arcana_chats';

  private constructor() {}

  static getInstance(): ChatStorage {
    if (!ChatStorage.instance) {
      ChatStorage.instance = new ChatStorage();
    }
    return ChatStorage.instance;
  }

  saveChats(sessionId: string, chats: Message[][]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chats:', error);
    }
  }

  getChats(sessionId: string): Message[][] | undefined {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const chats = JSON.parse(stored);
        return chats.map((chat: any[]) => 
          chat.map(msg => ({
            ...msg,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined
          }))
        );
      }
    } catch (error) {
      console.error('Error getting chats:', error);
    }
    return undefined;
  }

  clearSession(sessionId: string): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }
}

export const chatStorage = ChatStorage.getInstance();
