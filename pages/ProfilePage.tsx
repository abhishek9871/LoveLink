import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { User } from '../types';
import { mockApi } from '../services/api';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { CrownIcon, SuperlikeIcon, BoostIcon } from '../components/icons';

const ProfilePage: React.FC = () => {
    const { user, logout } = useAuthStore();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const fullUser = await mockApi.getCurrentUserProfile(user.id);
            setProfileUser(fullUser);
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleDataExport = async () => {
        if (!user) return;
        const data = await mockApi.exportUserData(user.id);
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(data, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "lovelink_data.json";
        link.click();
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }
    
    if (!profileUser || !profileUser.profile) {
        return <div className="p-4 text-center">Could not load profile.</div>
    }
    
    const { profile } = profileUser;

    return (
        <div className="p-4 space-y-6 pb-8">
            <div className="relative">
                <img src={profile.photos[0]} alt={profile.name} className="w-full h-64 object-cover rounded-xl shadow-lg" />
                <div className="absolute bottom-4 left-4">
                     <h1 className="text-3xl font-bold text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>{profile.name}, {profile.age}</h1>
                     <p className="text-white font-medium" style={{textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}>{profile.location}</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-lg">My Plan</h2>
                        <p className="text-secondary font-bold capitalize flex items-center gap-1">
                            <CrownIcon className="w-5 h-5" />
                            LoveLink {profileUser.subscriptionTier}
                        </p>
                    </div>
                    <Button onClick={() => navigate('/subscription')} variant="secondary" className="!w-auto px-4 !py-2">Upgrade</Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="font-bold text-2xl text-blue-600">{profileUser.superLikes}</p>
                        <p className="text-sm font-medium text-blue-500">Super Likes</p>
                    </div>
                     <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="font-bold text-2xl text-purple-600">{profileUser.boosts}</p>
                        <p className="text-sm font-medium text-purple-500">Boosts Left</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm space-y-2">
                <h2 className="font-bold text-lg">Settings</h2>
                <Button variant="ghost" onClick={handleDataExport} className="!justify-start !p-2 !font-medium text-text-secondary">Export My Data</Button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
                <h2 className="font-bold text-lg mb-2">About Me</h2>
                <p className="text-text-secondary">{profile.bio}</p>
            </div>
            
             <div className="bg-white p-4 rounded-xl shadow-sm">
                <h2 className="font-bold text-lg mb-2">Interests</h2>
                <div className="flex flex-wrap gap-2">
                    {profile.interests.map(interest => (
                        <span key={interest} className="bg-primary/20 text-primary text-sm font-semibold px-3 py-1 rounded-full">{interest}</span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {profile.photos.slice(1).map((photo, index) => (
                    <img key={index} src={photo} alt={`${profile.name} ${index+1}`} className="w-full h-40 object-cover rounded-xl"/>
                ))}
            </div>

            <div className="pt-4">
                <Button variant="secondary" onClick={logout}>
                    Logout
                </Button>
                 <div className="text-center mt-4">
                    <Link to="/admin" className="text-sm text-gray-400 hover:text-gray-600">Admin Dashboard</Link>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;