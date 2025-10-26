
import React, { useState, useEffect, useCallback } from 'react';
import { SwipeProfile, Profile } from '../types';
import { mockApi, FEATURES } from '../services/api';
import useAuthStore from '../store/authStore';
import SwipeCard from '../components/matching/SwipeCard';
import ActionButtons from '../components/matching/ActionButtons';
import MatchModal from '../components/matching/MatchModal';
import UpsellModal from '../components/ui/UpsellModal';
import { BoostIcon } from '../components/icons';
import Button from '../components/ui/Button';

const DiscoverPage: React.FC = () => {
  const [profiles, setProfiles] = useState<SwipeProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUser } = useAuthStore();
  
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [icebreaker, setIcebreaker] = useState('');

  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [upsellReason, setUpsellReason] = useState<'likes' | 'rewind' | 'superlikes' | 'boosts'>('likes');

  const fetchProfiles = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const fetchedProfiles = await mockApi.getDiscoverProfiles(user.id);
      setProfiles(fetchedProfiles);
      setCurrentIndex(0);
    } catch (err) {
      setError('Failed to load profiles.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log('User object in DiscoverPage:', user);
    fetchProfiles();

    const handleProfilesSeeded = () => fetchProfiles();
    window.addEventListener('profilesSeeded', handleProfilesSeeded);

    return () => {
      window.removeEventListener('profilesSeeded', handleProfilesSeeded);
    };
  }, [fetchProfiles]);

  const handleSwipe = async (action: 'like' | 'pass' | 'superlike') => {
    if (currentIndex >= profiles.length || !user) return;
    
    if(action === 'superlike' && user.superLikes <= 0) {
        setUpsellReason('superlikes');
        setShowUpsellModal(true);
        return;
    }

    const targetUser = profiles[currentIndex];
    
    // Optimistically move to the next card
    setCurrentIndex(prev => prev + 1);

    try {
      const result = await mockApi.swipe(user.id, targetUser.userId, action);
      if(action === 'superlike') {
          updateUser({ superLikes: user.superLikes - 1});
      }

      if (result.error === 'LIKE_LIMIT_REACHED') {
          setUpsellReason('likes');
          setShowUpsellModal(true);
          setCurrentIndex(prev => prev - 1); // Revert optimistic update
          return;
      }

      if (result.match && result.matchedProfile && result.icebreaker) {
        setMatchedProfile(result.matchedProfile);
        setIcebreaker(result.icebreaker);
        setShowMatchModal(true);
      }
    } catch (error) {
      console.error('Swipe failed:', error);
    }
  };

  const handleRewind = async () => {
    if (!user || !FEATURES[user.subscriptionTier].rewind) {
        setUpsellReason('rewind');
        setShowUpsellModal(true);
        return;
    }
    if (currentIndex > 0) {
        const result = await mockApi.rewind(user.id);
        if(result.success) {
            setCurrentIndex(prev => prev - 1);
        }
    }
  };

  const handleBoost = async () => {
      if(!user) return;
      if (user.boosts <= 0) {
          setUpsellReason('boosts');
          setShowUpsellModal(true);
          return;
      }
      try {
        const updatedUser = await mockApi.activateBoost(user.id);
        updateUser(updatedUser);
        // Maybe show a toast "Boost activated!"
      } catch (error) {
        console.error("Failed to activate boost", error);
      }
  };
  
  const handleCloseMatchModal = () => {
      setShowMatchModal(false);
      setMatchedProfile(null);
      setIcebreaker('');
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">{error}</div>;
  }

  const canRewind = user ? FEATURES[user.subscriptionTier].rewind : false;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {showMatchModal && matchedProfile && user && user.profile && (
        <MatchModal
          currentUser={user.profile}
          matchedUser={matchedProfile}
          icebreaker={icebreaker}
          onClose={handleCloseMatchModal}
        />
      )}
      {showUpsellModal && <UpsellModal reason={upsellReason} onClose={() => setShowUpsellModal(false)} />}
      <div className="absolute top-2 right-2 z-20">
        <Button onClick={handleBoost} variant="secondary" className="!w-auto !py-2 px-3 rounded-full shadow-md">
            <BoostIcon className="w-5 h-5 text-secondary" />
        </Button>
      </div>

      <div className="flex-grow relative flex items-center justify-center p-4">
        {profiles.length > 0 && currentIndex < profiles.length ? (
          profiles.map((profile, index) => (
             <SwipeCard
                key={profile.userId}
                profile={profile}
                isActive={index === currentIndex}
            />
          )).reverse()
        ) : (
          <div className="text-center text-gray-500">
            <h2 className="text-2xl font-bold">That's everyone for now!</h2>
            <p>Check back later for new profiles.</p>
            <button onClick={fetchProfiles} className="mt-4 text-primary font-semibold">Refresh</button>
          </div>
        )}
      </div>
      {profiles.length > 0 && currentIndex < profiles.length && user && (
         <ActionButtons
            onPass={() => handleSwipe('pass')}
            onLike={() => handleSwipe('like')}
            onSuperLike={() => handleSwipe('superlike')}
            onRewind={handleRewind}
            canRewind={canRewind}
            superLikesCount={user.superLikes}
         />
      )}
    </div>
  );
};

export default DiscoverPage;
