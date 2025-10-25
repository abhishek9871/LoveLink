
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Profile } from '../types';
import { mockApi, FEATURES } from '../services/api';
import useAuthStore from '../store/authStore';
import Spinner from '../components/ui/Spinner';
import { CrownIcon } from '../components/icons';
import Button from '../components/ui/Button';

const LikesYouPage: React.FC = () => {
  const [likers, setLikers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  const canSeeLikers = user ? FEATURES[user.subscriptionTier].seeWhoLikedYou : false;

  const fetchLikers = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const fetchedLikers = await mockApi.getUsersWhoLikedMe(user.id);
      setLikers(fetchedLikers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLikers();
  }, [fetchLikers]);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner /></div>;
  }
  
  if (likers.length === 0) {
      return <div className="text-center p-8 text-gray-500">
        <h2 className="text-xl font-bold">No Likes Yet</h2>
        <p>Keep your profile active to attract more attention!</p>
      </div>;
  }

  return (
    <div className="p-4 relative">
        <h1 className="text-2xl font-bold mb-4">Who Likes You</h1>
        {!canSeeLikers && (
            <div className="absolute inset-0 top-16 bg-white/80 backdrop-blur-md z-10 flex flex-col items-center justify-center p-4 rounded-lg">
            <CrownIcon className="w-12 h-12 text-yellow-500 mb-2"/>
            <h3 className="font-bold text-lg text-center">See Who Likes You</h3>
            <p className="text-text-secondary text-center mb-4">Upgrade to LoveLink Plus to see everyone who has already liked you.</p>
            <Button onClick={() => navigate('/subscription')} className="max-w-xs">Upgrade to See</Button>
            </div>
        )}
        <div className={`grid grid-cols-2 gap-4 ${!canSeeLikers ? 'blur-md pointer-events-none' : ''}`}>
            {likers.map(profile => (
                <div key={profile.userId} className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md">
                    <img src={profile.photos[0]} alt={profile.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 p-2 bg-gradient-to-t from-black/70 w-full text-white">
                        <p className="font-bold">{profile.name}, {profile.age}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default LikesYouPage;
