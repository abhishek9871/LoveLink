
import React from 'react';
import { CloseIcon, HeartIcon, RewindIcon, SuperlikeIcon } from '../icons';

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onRewind: () => void;
  canRewind: boolean;
  superLikesCount: number;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onPass, onLike, onSuperLike, onRewind, canRewind, superLikesCount }) => {
  return (
    <div className="flex justify-center items-center gap-4 py-4 px-4 bg-transparent">
      <button
        onClick={onRewind}
        disabled={!canRewind}
        className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-transform transform active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Rewind"
      >
        <RewindIcon className="w-8 h-8" />
      </button>
      <button
        onClick={onPass}
        className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-yellow-500 hover:bg-yellow-100 transition-transform transform active:scale-90"
        aria-label="Pass"
      >
        <CloseIcon className="w-10 h-10" />
      </button>
      <button
        onClick={onLike}
        className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center text-primary hover:bg-red-100 transition-transform transform active:scale-90"
        aria-label="Like"
      >
        <HeartIcon className="w-12 h-12" />
      </button>
       <button
        onClick={onSuperLike}
        disabled={superLikesCount <= 0}
        className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-transform transform active:scale-90 disabled:opacity-50"
        aria-label="Super Like"
      >
        <SuperlikeIcon className="w-10 h-10" />
      </button>
    </div>
  );
};

export default ActionButtons;
