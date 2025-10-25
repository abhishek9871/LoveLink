
import React from 'react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => {
  const bubbleClasses = isOwnMessage
    ? 'bg-primary text-white self-end'
    : 'bg-gray-200 text-text-primary self-start';
  
  const containerClasses = isOwnMessage ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${containerClasses}`}>
      <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${bubbleClasses}`}>
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
