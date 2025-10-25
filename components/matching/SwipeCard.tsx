import React from 'react';
import { SwipeProfile } from '../../types';
import { HeartIcon, SuperlikeIcon } from '../icons';

interface SwipeCardProps {
  profile: SwipeProfile;
  isActive: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ profile, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute w-full h-full max-w-sm max-h-[70vh] p-4">
      <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden group">
        {profile.isSuperLike && (
            <div className="absolute inset-0 bg-blue-400/20 z-10 pointer-events-none flex items-center justify-center animate-pulse">
                <SuperlikeIcon className="w-32 h-32 text-blue-500/50" />
            </div>
        )}
        <img src={profile.photos[0]} alt={profile.name} className="w-full h-full object-cover" />
        <div className="absolute top-0 w-full p-4 flex justify-between items-start">
            <div className="flex flex-col gap-2">
                {profile.compatibilityScore && (
                     <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-green-600 font-bold text-sm w-fit">
                        <HeartIcon className="w-4 h-4 text-green-500" />
                        <span>{profile.compatibilityScore}% Compatible</span>
                    </div>
                )}
                 {profile.isSuperLike && (
                     <div className="bg-blue-500/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-white font-bold text-sm w-fit">
                        <SuperlikeIcon className="w-4 h-4" />
                        <span>Super Liked You!</span>
                    </div>
                )}
            </div>
            {profile.isDemo && (
                <div className="bg-yellow-500/80 backdrop-blur-sm rounded-full px-3 py-1 text-white font-bold text-sm">
                    Demo
                </div>
            )}
        </div>
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
          <h2 className="text-3xl font-bold text-white">{profile.name}, {profile.age}</h2>
          <p className="text-white/90 text-sm mt-1">{profile.location}</p>
          <p className="text-white/90 text-md mt-2 line-clamp-2">{profile.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;