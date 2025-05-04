import { ConversationContext, ConversationOptions } from '../types/conversation';
import { Message } from '../../types/chat';

// Increased default history limit
const DEFAULT_OPTIONS: ConversationOptions = {
  maxHistory: 16, // Increased default
  temperature: 0.7
};

export class ConversationManager {
  private context: ConversationContext;
  private options: ConversationOptions;

  constructor(options: Partial<ConversationOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    // Ensure the initial context respects the potentially overridden maxHistory
    this.context = {
      messages: [],
      temperature: this.options.temperature
    };
    // If a maxHistory is explicitly passed, use it, otherwise use the default.
    this.options.maxHistory = options.maxHistory ?? DEFAULT_OPTIONS.maxHistory; 
  }

  updateContext(messages: Message[]): ConversationContext {
    // Convert chat messages to conversation format
    // Use the manager's specific maxHistory setting for slicing
    const contextMessages = messages
      .slice(-(this.options.maxHistory!)) 
      .map(msg => ({
        role: msg.isBot ? 'assistant' : 'user' as const,
        content: msg.text
      }));

    this.context.messages = contextMessages;
    return this.context;
  }

  getContext(): ConversationContext {
    return this.context;
  }

  clear(): void {
    this.context.messages = [];
  }
}
