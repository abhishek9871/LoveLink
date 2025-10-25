
import React from 'react';
import { Message } from '../../types';

interface GiftMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

const GiftMessage: React.FC<GiftMessageProps> = ({ message, isOwnMessage }) => {
    if (!message.gift) return null;

    const containerClasses = isOwnMessage ? 'justify-end' : 'justify-start';

    return (
        <div className={`flex ${containerClasses} my-2`}>
            <div className="flex flex-col items-center gap-1 p-4 bg-gradient-to-br from-yellow-100 to-amber-200 rounded-2xl shadow-md">
                <p className="text-sm font-semibold text-amber-800">
                    {isOwnMessage ? 'You sent a' : `${message.senderId} sent you a`} {message.gift.name}!
                </p>
                <span className="text-6xl animate-bounce">{message.gift.icon}</span>
            </div>
        </div>
    );
};

export default GiftMessage;
