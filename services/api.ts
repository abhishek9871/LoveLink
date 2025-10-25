import { User, Profile, SwipeProfile, Match, Message, SubscriptionTier, VirtualGift, AdminUserMetrics, AdminRevenueMetrics, AdminSafetyMetrics, AdminSystemHealth } from '../types';

// --- SPRINT 3: PREMIUM FEATURES ---
export const FEATURES = {
  free: { dailyLikes: 10, superLikesPerDay: 0, seeWhoLikedYou: false, rewind: false, boostPerMonth: 0 },
  plus: { dailyLikes: 50, superLikesPerDay: 3, seeWhoLikedYou: true, rewind: true, boostPerMonth: 0 },
  gold: { dailyLikes: -1, superLikesPerDay: 5, seeWhoLikedYou: true, rewind: true, boostPerMonth: 1 }, // -1 for unlimited
  platinum: { dailyLikes: -1, superLikesPerDay: 10, seeWhoLikedYou: true, rewind: true, boostPerMonth: 2 },
};

export const VIRTUAL_GIFTS: VirtualGift[] = [
    { id: 'rose', name: 'Rose', icon: '🌹' },
    { id: 'heart', name: 'Heart', icon: '💖' },
    { id: 'teddy', name: 'Teddy Bear', icon: '🧸' },
    { id: 'ring', name: 'Ring', icon: '💍' },
];

// --- QUIZ QUESTIONS ---
export const quizQuestions = [
    { id: 'q1', text: 'A perfect date night is:', options: { 'a': 'A cozy night in', 'b': 'A fancy dinner out', 'c': 'A spontaneous adventure', 'd': 'A lively party' } },
    { id: 'q2', text: 'I recharge my social battery by:', options: { 'a': 'Being with a large group of friends', 'b': 'Having a deep one-on-one conversation', 'c': 'Spending quality time alone', 'd': 'Exploring a new hobby' } },
    { id: 'q3', text: 'In a relationship, I value this the most:', options: { 'a': 'Honesty and trust', 'b': 'Shared humor and fun', 'c': 'Intellectual stimulation', 'd': 'Emotional support' } },
];


// --- MOCK DATABASE ---
let users: User[] = JSON.parse(localStorage.getItem('ll_users') || '[]');
let profiles: Profile[] = JSON.parse(localStorage.getItem('ll_profiles') || '[]');
let matches: { id: string; user1_id: string; user2_id: string; status: 'pending' | 'matched' | 'superlike' }[] = JSON.parse(localStorage.getItem('ll_matches') || '[]');
let messages: Message[] = JSON.parse(localStorage.getItem('ll_messages') || '[]');
let swipes: { userId: string, targetUserId: string, action: string, timestamp: number }[] = JSON.parse(localStorage.getItem('ll_swipes') || '[]');
let reports: { reporterId: string, reportedId: string, reason: string, timestamp: number }[] = JSON.parse(localStorage.getItem('ll_reports') || '[]');
let blocks: { blockerId: string, blockedId: string }[] = JSON.parse(localStorage.getItem('ll_blocks') || '[]');

// Re-populate user.profile from profiles array to avoid data duplication in storage and prevent quota errors
users.forEach(user => {
    if (user && !user.profile) {
        user.profile = profiles.find(p => p.userId === user.id) || null;
    }
});


const saveToLocalStorage = () => {
    try {
        // Create a copy of users with profile nulled out to save space in localStorage
        const usersToStore = users.map(u => ({...u, profile: null}));
        localStorage.setItem('ll_users', JSON.stringify(usersToStore));
        localStorage.setItem('ll_profiles', JSON.stringify(profiles));
        localStorage.setItem('ll_matches', JSON.stringify(matches));
        localStorage.setItem('ll_messages', JSON.stringify(messages));
        localStorage.setItem('ll_swipes', JSON.stringify(swipes));
        localStorage.setItem('ll_reports', JSON.stringify(reports));
        localStorage.setItem('ll_blocks', JSON.stringify(blocks));
    } catch (e) {
        console.error("Failed to save to localStorage. Quota may be exceeded.", e);
    }
}

// --- MOCK DATA SEEDING ---
if (users.length === 0) {
    const seedProfiles: Omit<Profile, 'userId'>[] = [
        { name: 'Sophia', age: 28, bio: 'Lover of art, travel, and quiet nights in. Looking for a genuine connection.', location: 'New York, NY', photos: ['https://picsum.photos/id/1027/800/1200'], interests: ['Art', 'Travel', 'Cooking'], quizAnswers: {q1: 'a', q2: 'c', q3: 'd'} },
        { name: 'Liam', age: 31, bio: 'Software engineer by day, musician by night. Let\'s grab a coffee and see where it goes.', location: 'San Francisco, CA', photos: ['https://picsum.photos/id/1005/800/1200'], interests: ['Music', 'Hiking', 'Tech'], quizAnswers: {q1: 'c', q2: 'b', q3: 'c'} },
        { name: 'Olivia', age: 26, bio: 'Adventurous soul who loves hiking, photography, and my golden retriever. Seeking a partner in crime.', location: 'Denver, CO', photos: ['https://picsum.photos/id/1011/800/1200'], interests: ['Hiking', 'Photography', 'Dogs'], quizAnswers: {q1: 'c', q2: 'd', q3: 'b'} },
        { name: 'Noah', age: 29, bio: 'Fitness enthusiast and foodie. I can cook you a great meal or join you for a marathon.', location: 'Miami, FL', photos: ['https://picsum.photos/id/1012/800/1200'], interests: ['Fitness', 'Food', 'Beach'], quizAnswers: {q1: 'b', q2: 'a', q3: 'b'} },
        { name: 'Ava', age: 27, bio: 'Bookworm, aspiring writer, and lover of all things vintage. Tell me about the last book you read.', location: 'Chicago, IL', photos: ['https://picsum.photos/id/1015/800/1200'], interests: ['Reading', 'Writing', 'History'], quizAnswers: {q1: 'a', q2: 'c', q3: 'a'} },
    ];

    seedProfiles.forEach((p, i) => {
        const userId = `seed_user_${i+1}`;
        const user: User = { id: userId, email: `${p.name.toLowerCase()}@example.com`, profileComplete: true, profile: null, subscriptionTier: 'free', superLikes: 5, boosts: 1 };
        const profile: Profile = { userId, vector: Array.from({length: 384}, () => Math.random()), ...p };
        user.profile = profile;
        users.push(user);
        profiles.push(profile);
    });
    // Have Olivia like Liam to test "Likes You"
    matches.push({ id: 'seed_like_1', user1_id: 'seed_user_3', user2_id: 'seed_user_2', status: 'pending' });
    saveToLocalStorage();
}


// --- API SIMULATION ---
const simulateNetworkDelay = (delay = 500) => new Promise(res => setTimeout(res, delay));

class MockApiService {
    
    // --- SPRINT 4: AI Security Simulation ---
    private async _verifyPhoto(photo: File | string): Promise<{verified: boolean, reason?: string}> {
        await simulateNetworkDelay(400);
        // ~5% chance of failing verification
        if (Math.random() < 0.05) {
            return { verified: false, reason: 'No clear face detected in the photo.' };
        }
        return { verified: true };
    }

    private async _moderateContent(content: File | string): Promise<{flagged: boolean, reason?: string}> {
        await simulateNetworkDelay(400);
         // ~5% chance of being flagged
        if (Math.random() < 0.05) {
            return { flagged: true, reason: 'Photo violates our content policy.' };
        }
        return { flagged: false };
    }

    async register(email: string, password_hash: string): Promise<{ token: string; user: User }> {
        await simulateNetworkDelay();
        if (email === 'owner@lovelink.app') {
            throw new Error('This email address is reserved.');
        }
        if (users.find(u => u.email === email)) {
            throw new Error('User with this email already exists.');
        }
        const newUser: User = {
            id: `user_${Date.now()}`,
            email,
            profileComplete: false,
            profile: null,
            subscriptionTier: 'free',
            superLikes: 0,
            boosts: 0,
        };
        users.push(newUser);
        saveToLocalStorage();
        const token = `mock_jwt_${newUser.id}`;
        return { token, user: newUser };
    }

    async login(email: string, password_hash: string): Promise<{ token: string; user: User }> {
        await simulateNetworkDelay();
        const isOwner = email === 'owner@lovelink.app' && password_hash === 'password123';
        
        let user = users.find(u => u.email === email);

        if (isOwner) {
            if (!user) { // First time owner login
                user = {
                    id: `user_owner_${Date.now()}`,
                    email,
                    profileComplete: false,
                    profile: null,
                    subscriptionTier: 'platinum',
                    superLikes: 99,
                    boosts: 10,
                };
                users.push(user);
            } else { // Existing owner, refresh premium features
                user.subscriptionTier = 'platinum';
                user.superLikes = 99;
                user.boosts = 10;
            }
            saveToLocalStorage();
            const token = `mock_jwt_${user.id}`;
            return { token, user };
        }

        if (!user) {
            throw new Error('Invalid credentials.');
        }
        // Simulate giving free users some premium currency to try
        if(user.subscriptionTier === 'free' && user.superLikes === 0){
            user.superLikes = 3;
        }
        const token = `mock_jwt_${user.id}`;
        return { token, user };
    }

    async verifyToken(token: string): Promise<User> {
        await simulateNetworkDelay(100);
        const userId = token.replace('mock_jwt_', '');
        const user = users.find(u => u.id === userId);
        if (!user) {
            throw new Error('Invalid token.');
        }
        return user;
    }

    async updateProfile(userId: string, profileData: Omit<Profile, 'userId' | 'photos'> & { photos: (string | File)[] }): Promise<Profile> {
        await simulateNetworkDelay();
        
        // --- SPRINT 4: Security checks ---
        for (const photo of profileData.photos) {
            if (photo instanceof File) { // Only check new files
                const verification = await this._verifyPhoto(photo);
                if (!verification.verified) throw new Error(verification.reason);
                const moderation = await this._moderateContent(photo);
                if (moderation.flagged) throw new Error(moderation.reason);
            }
        }

        const photoUrls = await Promise.all(profileData.photos.map(async (p) => {
            if (typeof p === 'string') return p;
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(p);
            });
        }));

        const mockVector = Array.from({length: 384}, () => Math.random());

        const newProfile: Profile = {
            userId,
            ...profileData,
            photos: photoUrls,
            vector: mockVector,
        };

        let user = users.find(u => u.id === userId);
        if(user){
            user.profile = newProfile;
            user.profileComplete = true;
        }

        const profileIndex = profiles.findIndex(p => p.userId === userId);
        if (profileIndex > -1) {
            profiles[profileIndex] = newProfile;
        } else {
            profiles.push(newProfile);
        }
        saveToLocalStorage();
        return newProfile;
    }

    private _calculateQuizCompatibility(user1Answers: Record<string, string>, user2Answers: Record<string, string>): number {
        const totalQuestions = quizQuestions.length;
        let commonAnswers = 0;
        for (const qId of quizQuestions.map(q => q.id)) {
            if (user1Answers[qId] && user1Answers[qId] === user2Answers[qId]) {
                commonAnswers++;
            }
        }
        return Math.round((commonAnswers / totalQuestions) * 100);
    }
    
    async getDiscoverProfiles(userId: string): Promise<SwipeProfile[]> {
        await simulateNetworkDelay();
        const currentUser = users.find(u => u.id === userId);
        if (!currentUser || !currentUser.profile) return [];

        const swipedUserIds = swipes
            .filter(s => s.userId === userId)
            .map(s => s.targetUserId);

        const blockedUserIds = blocks
            .filter(b => b.blockerId === userId)
            .map(b => b.blockedId);
        
        const potentialProfiles = profiles.filter(p => p.userId !== userId && !swipedUserIds.includes(p.userId) && !blockedUserIds.includes(p.userId));

        const scoredProfiles = potentialProfiles.map(p => {
            const isSuperLike = matches.some(m => m.user1_id === p.userId && m.user2_id === userId && m.status === 'superlike');
            return {
                ...p,
                compatibilityScore: this._calculateQuizCompatibility(currentUser.profile!.quizAnswers, p.quizAnswers),
                isSuperLike,
            }
        });

        scoredProfiles.sort((a, b) => {
            // Prioritize real users over demo users
            if (a.isDemo && !b.isDemo) return 1;
            if (!a.isDemo && b.isDemo) return -1;
            
            // Prioritize super likes
            if (a.isSuperLike && !b.isSuperLike) return -1;
            if (!a.isSuperLike && b.isSuperLike) return 1;
            
            // Prioritize boosted profiles
            const isBBoosted = users.find(u => u.id === b.userId && (u as any).boostActive);
            if (isBBoosted) return 1;
            const isABoosted = users.find(u => u.id === a.userId && (u as any).boostActive);
            if (isABoosted) return -1;

            // Fallback to compatibility score
            return b.compatibilityScore - a.compatibilityScore;
        });

        return scoredProfiles;
    }
    
    private async _generateIcebreaker(user1Profile: Profile, user2Profile: Profile): Promise<string> {
        await simulateNetworkDelay(800);
        const sharedInterests = user1Profile.interests.filter(i => user2Profile.interests.includes(i));
        
        if(sharedInterests.length > 0) {
            return `You both like ${sharedInterests[0]}! What's your favorite thing about it?`;
        }
        return `You and ${user2Profile.name} seem to have a lot in common. Say hello!`;
    }

    async swipe(userId: string, targetUserId: string, action: 'like' | 'pass' | 'superlike'): Promise<{ match: boolean, icebreaker?: string, matchedProfile?: Profile, error?: string }> {
        await simulateNetworkDelay(200);
        const currentUser = users.find(u => u.id === userId)!;
        const featureLimits = FEATURES[currentUser.subscriptionTier];
        
        if (action === 'like') {
            const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
            const recentLikes = swipes.filter(s => s.userId === userId && s.action === 'like' && s.timestamp > twentyFourHoursAgo);
            if (featureLimits.dailyLikes !== -1 && recentLikes.length >= featureLimits.dailyLikes) {
                return { match: false, error: 'LIKE_LIMIT_REACHED' };
            }
        }
        if(action === 'superlike') {
            if(currentUser.superLikes <= 0) {
                return { match: false, error: 'INSUFFICIENT_SUPERLIKES' };
            }
            currentUser.superLikes -= 1;
        }

        swipes.push({ userId, targetUserId, action, timestamp: Date.now() });

        if (action === 'pass') {
            saveToLocalStorage();
            return { match: false };
        }
        
        const theyLikedUs = matches.find(m => m.user1_id === targetUserId && m.user2_id === userId && (m.status === 'pending' || m.status === 'superlike'));
        
        if (theyLikedUs) {
            theyLikedUs.status = 'matched';
            const currentUserProfile = profiles.find(p => p.userId === userId)!;
            const matchedProfile = profiles.find(p => p.userId === targetUserId)!;
            const icebreaker = await this._generateIcebreaker(currentUserProfile, matchedProfile);
            saveToLocalStorage();
            // SPRINT 4: Push notification simulation
            if ('Notification' in window && Notification.permission === 'granted') {
                 new Notification("It's a Match!", {
                    body: `You and ${matchedProfile.name} have liked each other.`,
                    icon: matchedProfile.photos[0]
                });
            }
            return { match: true, icebreaker, matchedProfile };
        } else {
            matches.push({ id: `match_${Date.now()}`, user1_id: userId, user2_id: targetUserId, status: action === 'superlike' ? 'superlike' : 'pending' });
            saveToLocalStorage();
            return { match: false };
        }
    }

    async rewind(userId: string): Promise<{ success: boolean, profile?: SwipeProfile, error?: string }> {
        await simulateNetworkDelay();
        const currentUser = users.find(u => u.id === userId)!;
        if (!FEATURES[currentUser.subscriptionTier].rewind) {
            return { success: false, error: 'REWIND_NOT_ALLOWED' };
        }
        
        let lastSwipeIndex = -1;
        for (let i = swipes.length - 1; i >= 0; i--) {
            if (swipes[i].userId === userId) {
                lastSwipeIndex = i;
                break;
            }
        }
        if (lastSwipeIndex === -1) return { success: false };

        const lastSwipe = swipes[lastSwipeIndex];
        swipes.splice(lastSwipeIndex, 1);

        let matchIndex = -1;
        for (let i = matches.length - 1; i >= 0; i--) {
            const m = matches[i];
            if (m.user1_id === userId && m.user2_id === lastSwipe.targetUserId) {
                matchIndex = i;
                break;
            }
        }
        if(matchIndex > -1) matches.splice(matchIndex, 1);
        
        const profile = profiles.find(p => p.userId === lastSwipe.targetUserId);
        if (!profile) return { success: false };

        saveToLocalStorage();
        return { success: true, profile: { ...profile, compatibilityScore: 99 } };
    }

    async getMatches(userId: string): Promise<Match[]> {
        await simulateNetworkDelay();
        const blockedUserIds = blocks.filter(b => b.blockerId === userId).map(b => b.blockedId);
        const matchedIds = matches
            .filter(m => (m.user1_id === userId || m.user2_id === userId) && m.status === 'matched')
            .map(m => m.user1_id === userId ? m.user2_id : m.user1_id)
            .filter(id => !blockedUserIds.includes(id));
        
        const matchProfiles = profiles.filter(p => matchedIds.includes(p.userId));
        
        const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;

        return matchProfiles.map(p => {
            const conversationMessages = messages.filter(msg => (msg.senderId === userId && msg.receiverId === p.userId) || (msg.senderId === p.userId && msg.receiverId === userId));
            const lastMessage = conversationMessages.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            
            // SPRINT 4: Anti-ghosting nudge logic
            let needsNudge = false;
            if (lastMessage && new Date(lastMessage.timestamp).getTime() < threeDaysAgo && lastMessage.senderId !== userId) {
                needsNudge = true;
            }

            return {
                id: `match_${userId}_${p.userId}`,
                user: p,
                lastMessage: lastMessage?.gift ? `${lastMessage.senderId === userId ? 'You sent a' : 'Sent you a'} ${lastMessage.gift.name}` : lastMessage?.content || 'You matched! Say hello.',
                timestamp: lastMessage ? lastMessage.timestamp : new Date().toISOString(),
                unreadCount: conversationMessages.filter(msg => msg.receiverId === userId && !msg.read).length,
                needsNudge,
            };
        }).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    
    async getUsersWhoLikedMe(userId: string): Promise<Profile[]> {
        await simulateNetworkDelay();
        const likerIds = matches
            .filter(m => m.user2_id === userId && (m.status === 'pending' || m.status === 'superlike'))
            .map(m => m.user1_id);

        return profiles.filter(p => likerIds.includes(p.userId));
    }

    async getConversation(userId: string, targetUserId: string): Promise<{ profile: Profile, messages: Message[] }> {
        await simulateNetworkDelay();
        const profile = profiles.find(p => p.userId === targetUserId);
        if (!profile) throw new Error('User not found');

        const conversationMessages = messages.filter(
            msg => (msg.senderId === userId && msg.receiverId === targetUserId) || (msg.senderId === targetUserId && msg.receiverId === userId)
        ).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        return { profile, messages: conversationMessages };
    }

    async sendMessage(senderId: string, receiverId: string, content: string, giftId?: string): Promise<Message> {
        await simulateNetworkDelay(300);
        const gift = giftId ? VIRTUAL_GIFTS.find(g => g.id === giftId) : undefined;
        const newMessage: Message = {
            id: `msg_${Date.now()}`,
            senderId,
            receiverId,
            content,
            timestamp: new Date().toISOString(),
            read: false,
            gift,
        };
        messages.push(newMessage);
        saveToLocalStorage();

        setTimeout(() => {
            const reply: Message = {
                id: `msg_${Date.now() + 1}`,
                senderId: receiverId,
                receiverId: senderId,
                content: gift ? 'Wow, thank you so much! ❤️' : 'That sounds interesting! Tell me more.',
                timestamp: new Date().toISOString(),
                read: false,
            };
            messages.push(reply);
            saveToLocalStorage();
            window.dispatchEvent(new CustomEvent('newMessage', { detail: reply }));
            if ('Notification' in window && Notification.permission === 'granted') {
                 new Notification(`New message from ${profiles.find(p=>p.userId === receiverId)?.name}`, {
                    body: reply.content,
                    icon: profiles.find(p=>p.userId === receiverId)?.photos[0]
                });
            }
        }, 2000);

        return newMessage;
    }

    async getCurrentUserProfile(userId: string): Promise<User> {
        await simulateNetworkDelay();
        const user = users.find(u => u.id === userId);
        if (!user) throw new Error("User not found");
        return user;
    }

    async subscribe(userId: string, tier: SubscriptionTier): Promise<User> {
        await simulateNetworkDelay();
        const user = users.find(u => u.id === userId);
        if (!user) throw new Error("User not found");
        user.subscriptionTier = tier;
        saveToLocalStorage();
        return user;
    }

    async purchaseSuperLikes(userId: string, quantity: number): Promise<User> {
        await simulateNetworkDelay();
        const user = users.find(u => u.id === userId);
        if (!user) throw new Error("User not found");
        user.superLikes += quantity;
        saveToLocalStorage();
        return user;
    }

    async activateBoost(userId: string): Promise<User> {
        await simulateNetworkDelay();
        const user = users.find(u => u.id === userId);
        if (!user) throw new Error("User not found");
        if(user.boosts <= 0) throw new Error("Insufficient boosts");
        user.boosts -= 1;
        (user as any).boostActive = true;
        (user as any).boostEndTime = Date.now() + 30 * 60 * 1000;
        saveToLocalStorage();
        
        setTimeout(() => {
            (user as any).boostActive = false;
            saveToLocalStorage();
        }, 30 * 60 * 1000);

        return user;
    }

    // --- SPRINT 4: Safety & GDPR ---
    async reportUser(reporterId: string, reportedId: string, reason: string): Promise<{success: boolean}> {
        await simulateNetworkDelay();
        reports.push({ reporterId, reportedId, reason, timestamp: Date.now() });
        saveToLocalStorage();
        return { success: true };
    }

    async blockUser(blockerId: string, blockedId: string): Promise<{success: boolean}> {
        await simulateNetworkDelay();
        if (!blocks.some(b => b.blockerId === blockerId && b.blockedId === blockedId)) {
            blocks.push({ blockerId, blockedId });
        }
        // Remove any existing match
        matches = matches.filter(m => !( (m.user1_id === blockerId && m.user2_id === blockedId) || (m.user1_id === blockedId && m.user2_id === blockerId) ));
        saveToLocalStorage();
        return { success: true };
    }

    async exportUserData(userId: string): Promise<any> {
        await simulateNetworkDelay();
        const user = users.find(u => u.id === userId);
        const profile = profiles.find(p => p.userId === userId);
        const userMatches = matches.filter(m => m.user1_id === userId || m.user2_id === userId);
        const userMessages = messages.filter(m => m.senderId === userId || m.receiverId === userId);
        const userSwipes = swipes.filter(s => s.userId === userId);
        return { user, profile, matches: userMatches, messages: userMessages, swipes: userSwipes };
    }

    // --- SPRINT 4: Admin Dashboard ---
    async getAdminMetrics(): Promise<{
        users: AdminUserMetrics,
        revenue: AdminRevenueMetrics,
        safety: AdminSafetyMetrics,
        system: AdminSystemHealth
    }> {
        await simulateNetworkDelay(800);
        return {
            users: { dau: 1234 + profiles.filter(p => p.isDemo).length, mau: 10432 + profiles.filter(p => p.isDemo).length, newUsers: 56, retentionRate: 62.5 },
            revenue: { mrr: 24503, arpu: 2.35, ltv: 45.50, conversionRate: 8.2 },
            safety: { openReports: reports.length, avgResponseTimeHours: 6, moderationActions: 112 },
            system: { apiLatency: 180, errorRate: 0.8, uptime: 99.9 }
        }
    }

    // --- SPRINT 5: Data Population ---
    private async _generateDemoBio(name: string): Promise<string> {
        await simulateNetworkDelay(50);
        const intros = [`Hey, I'm ${name}.`, `${name} here.`, `Just a ${name} looking for a connection.`];
        const hobbies = ['Love hiking on weekends.', 'Big foodie, always looking for the next great restaurant.', 'You can usually find me at a concert or a coffee shop.', 'Aspiring world traveler, where should we go first?', 'Always down for a good movie and a cozy night in.'];
        const outros = ['Let\'s chat and see where it goes!', 'Send me a message if you\'re interested.', 'Looking for someone to share adventures with.', 'Swipe right if you have a cute dog.'];
        return `${intros[Math.floor(Math.random() * intros.length)]} ${hobbies[Math.floor(Math.random() * hobbies.length)]} ${outros[Math.floor(Math.random() * outros.length)]}`;
    }

    async seedDemoProfiles(): Promise<{ success: boolean; message: string }> {
        if (profiles.some(p => p.isDemo)) {
            return { success: false, message: 'Demo profiles have already been seeded.' };
        }
        try {
            const response = await fetch('https://randomuser.me/api/?results=50&inc=name,location,email,picture,dob,gender,phone&nat=us,gb,au,ca,nz&seed=lovelink');
            if (!response.ok) throw new Error('Failed to fetch from Random User API');
            
            const data = await response.json();
            const demoUsers = data.results;

            for (const demoUser of demoUsers) {
                const userId = `demo_${demoUser.email.replace(/[^a-zA-Z0-9]/g, '')}`;
                if (users.some(u => u.id === userId)) continue;

                const bio = await this._generateDemoBio(demoUser.name.first);
                const interestsList = ['Travel', 'Cooking', 'Music', 'Hiking', 'Movies', 'Art', 'Fitness', 'Reading', 'Photography', 'Dogs'];
                const userInterests = [...new Set(Array.from({ length: Math.floor(Math.random() * 3) + 2 }, () => interestsList[Math.floor(Math.random() * interestsList.length)]))];
                const userQuizAnswers: Record<string, string> = {};
                quizQuestions.forEach(q => {
                    const options = Object.keys(q.options);
                    userQuizAnswers[q.id] = options[Math.floor(Math.random() * options.length)];
                });

                const newProfile: Profile = {
                    userId,
                    name: `${demoUser.name.first}`,
                    age: demoUser.dob.age,
                    bio,
                    location: `${demoUser.location.city}, ${demoUser.location.state}`,
                    photos: [demoUser.picture.large],
                    interests: userInterests,
                    quizAnswers: userQuizAnswers,
                    vector: Array.from({ length: 384 }, () => Math.random()),
                    isDemo: true,
                };
                const newUser: User = { id: userId, email: demoUser.email, profileComplete: true, profile: newProfile, subscriptionTier: 'free', superLikes: 0, boosts: 0 };
                users.push(newUser);
                profiles.push(newProfile);
            }
            saveToLocalStorage();
            return { success: true, message: `${demoUsers.length} demo profiles added successfully.` };
        } catch (error: any) {
            console.error("Failed to seed profiles:", error);
            return { success: false, message: error.message || 'An error occurred while seeding.' };
        }
    }
}

export const mockApi = new MockApiService();