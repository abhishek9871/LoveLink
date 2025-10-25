
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Profile } from '../../types';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { LogoIcon } from '../icons';

interface MatchModalProps {
  currentUser: Profile;
  matchedUser: Profile;
  icebreaker: string;
  onClose: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ currentUser, matchedUser, icebreaker, onClose }) => {
  const navigate = useNavigate();

  const handleSendMessage = () => {
    navigate(`/chat/${matchedUser.userId}`);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 text-center max-w-sm w-full relative transform transition-all scale-100 opacity-100">
        <h2 className="text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          It's a Match!
        </h2>
        <p className="text-text-secondary mt-1">You and {matchedUser.name} have liked each other.</p>

        <div className="flex justify-center items-center my-6 space-x-[-20px]">
          <Avatar src={currentUser.photos[0]} alt={currentUser.name} size="lg" className="border-4 border-white shadow-md" />
          <Avatar src={matchedUser.photos[0]} alt={matchedUser.name} size="lg" className="border-4 border-white shadow-md" />
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold text-sm text-secondary flex items-center justify-center gap-1">
                <LogoIcon className="w-4 h-4" />
                AI Dating Coach
            </h3>
            <p className="text-text-primary mt-2 italic">"{icebreaker}"</p>
        </div>

        <div className="mt-6 space-y-3">
          <Button onClick={handleSendMessage}>Send a Message</Button>
          <Button variant="ghost" onClick={onClose}>Keep Swiping</Button>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
