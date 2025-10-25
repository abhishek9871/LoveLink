
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { mockApi } from '../services/api';
import { SubscriptionTier } from '../types';
import Button from '../components/ui/Button';
import { CrownIcon, HeartIcon, BoostIcon, SuperlikeIcon } from '../components/icons';

const Checkmark: React.FC = () => <span className="text-primary">✓</span>;

const SubscriptionPage: React.FC = () => {
    const { user, updateUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubscribe = async (tier: SubscriptionTier) => {
        if(!user) return;
        setLoading(true);
        const updatedUser = await mockApi.subscribe(user.id, tier);
        updateUser(updatedUser);
        setLoading(false);
        // navigate('/profile'); // or show a success message
    };
    
    const handlePurchaseSuperLikes = async () => {
        if(!user) return;
        setLoading(true);
        const updatedUser = await mockApi.purchaseSuperLikes(user.id, 10);
        updateUser(updatedUser);
        setLoading(false);
    };

    const tiers = [
        { name: 'Plus', price: 14.99, features: ['50 daily likes', 'See who liked you', 'Rewind last swipe'], tier: 'plus' as SubscriptionTier },
        { name: 'Gold', price: 24.99, features: ['Unlimited likes', '1 weekly Boost', '5 Super Likes/day'], tier: 'gold' as SubscriptionTier, popular: true },
        { name: 'Platinum', price: 39.99, features: ['All Gold features', 'AI Dating Coach', 'Priority Support'], tier: 'platinum' as SubscriptionTier },
    ];

    return (
        <div className="p-4 space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-center mb-2">Upgrade Your Experience</h1>
                <p className="text-text-secondary text-center">Choose a plan that fits your dating goals.</p>
            </div>
            
            <div className="space-y-4">
                {tiers.map(tier => (
                    <div key={tier.name} className={`border-2 rounded-xl p-4 ${tier.popular ? 'border-primary' : 'border-gray-200'} relative`}>
                        {tier.popular && <div className="absolute top-[-12px] right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
                        <h2 className={`font-bold text-2xl ${tier.popular ? 'text-primary' : ''}`}>{tier.name}</h2>
                        <p className="text-xl font-semibold">${tier.price}<span className="text-sm font-normal text-text-secondary">/month</span></p>
                        <ul className="mt-4 space-y-2 text-sm">
                            {tier.features.map(f => <li key={f} className="flex items-center gap-2"><Checkmark /> {f}</li>)}
                        </ul>
                        <Button
                            onClick={() => handleSubscribe(tier.tier)}
                            isLoading={loading}
                            disabled={user?.subscriptionTier === tier.tier}
                            className="mt-4"
                        >
                           {user?.subscriptionTier === tier.tier ? 'Current Plan' : `Go ${tier.name}`}
                        </Button>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                 <h2 className="text-2xl font-bold text-center">One-Time Purchases</h2>
                <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-1"><SuperlikeIcon className="w-5 h-5 text-blue-500"/> Super Likes</h3>
                        <p className="text-sm text-text-secondary">Stand out from the crowd.</p>
                         <p className="font-bold mt-1">10 for $9.99</p>
                    </div>
                    <Button onClick={handlePurchaseSuperLikes} variant="secondary" className="!w-auto px-4 !py-2">Purchase</Button>
                </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-1"><BoostIcon className="w-5 h-5 text-secondary"/> Profile Boost</h3>
                        <p className="text-sm text-text-secondary">Be a top profile for 30 mins.</p>
                        <p className="font-bold mt-1">$4.99</p>
                    </div>
                    <Button onClick={() => navigate('/discover')} variant="secondary" className="!w-auto px-4 !py-2">Use Boost</Button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;
