import { Message } from '../types/chat';

class ChatCache {
  private static instance: ChatCache;
  private cache: Map<string, Message[][]>;

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): ChatCache {
    if (!ChatCache.instance) {
      ChatCache.instance = new ChatCache();
    }
    return ChatCache.instance;
  }

  saveChats(sessionId: string, chats: Message[][]): void {
    this.cache.set(sessionId, chats);
  }

  getChats(sessionId: string): Message[][] | undefined {
    return this.cache.get(sessionId);
  }

  clearSession(sessionId: string): void {
    this.cache.delete(sessionId);
  }
}

export const chatCache = ChatCache.getInstance();
