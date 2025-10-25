
import React from 'react';
import { VIRTUAL_GIFTS } from '../../services/api';
import { VirtualGift } from '../../types';

interface VirtualGiftModalProps {
  onClose: () => void;
  onSendGift: (giftId: string) => void;
}

const VirtualGiftModal: React.FC<VirtualGiftModalProps> = ({ onClose, onSendGift }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-40" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-t-2xl p-4" onClick={e => e.stopPropagation()}>
        <h2 className="font-bold text-lg text-center mb-4">Send a Gift</h2>
        <div className="grid grid-cols-4 gap-4">
          {VIRTUAL_GIFTS.map(gift => (
            <div
              key={gift.id}
              onClick={() => onSendGift(gift.id)}
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <span className="text-4xl">{gift.icon}</span>
              <span className="text-xs font-medium">{gift.name}</span>
              <span className="text-xs text-secondary font-bold">$0.99</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 w-full text-center py-2 text-gray-600 font-semibold">Cancel</button>
      </div>
    </div>
  );
};

export default VirtualGiftModal;
