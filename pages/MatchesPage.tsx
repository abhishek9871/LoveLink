
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Match, Profile } from '../types';
import { mockApi, FEATURES } from '../services/api';
import useAuthStore from '../store/authStore';
import Spinner from '../components/ui/Spinner';
import Avatar from '../components/ui/Avatar';
import { CrownIcon, HeartIcon } from '../components/icons';

const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [likers, setLikers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('matches');
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  const canSeeLikers = user ? FEATURES[user.subscriptionTier].seeWhoLikedYou : false;

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [fetchedMatches, fetchedLikers] = await Promise.all([
        mockApi.getMatches(user.id),
        mockApi.getUsersWhoLikedMe(user.id)
      ]);
      setMatches(fetchedMatches);
      setLikers(fetchedLikers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const TabButton = ({ tabName, label, count }: { tabName: string, label: string, count: number }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`w-full pb-2 font-bold border-b-4 ${activeTab === tabName ? 'text-primary border-primary' : 'text-gray-400 border-transparent'}`}
    >
      {label} {count > 0 && <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeTab === tabName ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>{count}</span>}
    </button>
  );

  const renderMatches = () => (
    <div className="space-y-2 mt-4">
      {matches.map(match => (
        <Link key={match.id} to={`/chat/${match.user.userId}`} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50">
          <Avatar src={match.user.photos[0]} alt={match.user.name} size="md" />
          <div className="ml-4 flex-grow overflow-hidden">
            <p className="font-bold text-text-primary">{match.user.name}</p>
            <p className="text-sm text-text-secondary truncate">{match.lastMessage}</p>
          </div>
          {match.unreadCount > 0 && (
            <div className="w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
              {match.unreadCount}
            </div>
          )}
        </Link>
      ))}
    </div>
  );

  const renderLikers = () => (
    <div className="relative mt-4">
      {!canSeeLikers && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-10 flex flex-col items-center justify-center p-4 rounded-lg">
           <CrownIcon className="w-12 h-12 text-yellow-500 mb-2"/>
           <h3 className="font-bold text-lg text-center">See Who Likes You</h3>
           <p className="text-text-secondary text-center mb-4">Upgrade to LoveLink Plus to see everyone who has already liked you.</p>
           <button onClick={() => navigate('/subscription')} className="bg-primary text-white font-bold py-2 px-6 rounded-full">Upgrade</button>
        </div>
      )}
      <div className={`grid grid-cols-2 gap-4 ${!canSeeLikers ? 'blur-md' : ''}`}>
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

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner /></div>;
  }

  return (
    <div className="p-4">
      <div className="flex border-b border-gray-200">
        <TabButton tabName="matches" label="Conversations" count={matches.filter(m => m.unreadCount > 0).length} />
        <TabButton tabName="likes" label="Likes You" count={likers.length} />
      </div>
      {activeTab === 'matches' ? (
        matches.length > 0 ? renderMatches() : <p className="text-gray-500 mt-4 text-center">No conversations yet.</p>
      ) : (
        likers.length > 0 ? renderLikers() : <p className="text-gray-500 mt-4 text-center">No one has liked you yet. Check back soon!</p>
      )}
    </div>
  );
};

export default MatchesPage;
