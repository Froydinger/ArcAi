export interface ConversationContext {
  messages: {
    role: 'user' | 'assistant';
    content: string;
  }[];
  maxTokens?: number;
  temperature?: number;
}

export interface ConversationOptions {
  maxHistory?: number;
  temperature?: number;
}
