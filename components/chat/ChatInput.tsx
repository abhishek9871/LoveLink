
import React, { useState } from 'react';
import { SendIcon, GiftIcon } from '../icons';
import VirtualGiftModal from './VirtualGiftModal';

interface ChatInputProps {
  onSend: (content: string, giftId?: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [content, setContent] = useState('');
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSend(content.trim());
      setContent('');
    }
  };

  const handleSendGift = (giftId: string) => {
    onSend('', giftId);
    setIsGiftModalOpen(false);
  }

  return (
    <>
      {isGiftModalOpen && (
        <VirtualGiftModal 
            onClose={() => setIsGiftModalOpen(false)}
            onSendGift={handleSendGift}
        />
      )}
      <div className="p-3 border-t border-gray-200 bg-white sticky bottom-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button type="button" onClick={() => setIsGiftModalOpen(true)} className="p-3 text-secondary hover:bg-secondary/10 rounded-full transition-colors">
              <GiftIcon className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="p-3 bg-primary text-white rounded-full hover:bg-red-500 disabled:bg-gray-300 transition-colors" disabled={!content.trim()}>
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatInput;
