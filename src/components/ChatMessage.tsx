import React from 'react';
import { MessageBubble } from './chat/MessageBubble';
import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
  // userAvatar prop removed
  onEditSave: (messageId: string, newContent: string) => Promise<void>;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  // userAvatar removed from destructuring
  onEditSave,
}) => {
  return (
    <MessageBubble
      message={message}
      // userAvatar prop removed
      onEditSave={!message.isBot ? onEditSave : undefined} // Only allow editing user messages
    />
  );
};
