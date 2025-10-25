
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { CrownIcon, HeartIcon, RewindIcon, SuperlikeIcon, BoostIcon } from '../icons';

interface UpsellModalProps {
  reason: 'likes' | 'rewind' | 'superlikes' | 'boosts';
  onClose: () => void;
}

const REASON_DETAILS = {
  likes: {
    icon: <HeartIcon className="w-12 h-12 text-primary" />,
    title: 'You\'re Out of Likes!',
    description: 'Upgrade to LoveLink Gold for unlimited likes and never miss a potential match.',
    cta: 'Get Unlimited Likes',
  },
  rewind: {
    icon: <RewindIcon className="w-12 h-12 text-gray-500" />,
    title: 'Rewind Your Last Swipe',
    description: 'Accidentally passed on someone? Upgrade to LoveLink Plus to get your second chance.',
    cta: 'Get Rewind',
  },
  superlikes: {
      icon: <SuperlikeIcon className="w-12 h-12 text-blue-500" />,
      title: 'Get More Super Likes',
      description: 'You\'re 3x more likely to get a match with a Super Like! Upgrade your plan or buy more.',
      cta: 'Get Super Likes',
  },
   boosts: {
      icon: <BoostIcon className="w-12 h-12 text-secondary" />,
      title: 'Boost Your Profile',
      description: 'Get up to 10x more profile views. Get more Boosts with a premium plan or purchase them anytime.',
      cta: 'Get More Boosts',
  }
};

const UpsellModal: React.FC<UpsellModalProps> = ({ reason, onClose }) => {
  const navigate = useNavigate();
  const details = REASON_DETAILS[reason];

  const handleUpgrade = () => {
    navigate('/subscription');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 text-center max-w-sm w-full relative">
        <div className="mb-4">
          {details.icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{details.title}</h2>
        <p className="text-text-secondary mt-2">{details.description}</p>
        <div className="mt-6 space-y-3">
          <Button onClick={handleUpgrade}>{details.cta}</Button>
          <Button variant="ghost" onClick={onClose}>No Thanks</Button>
        </div>
      </div>
    </div>
  );
};

export default UpsellModal;
