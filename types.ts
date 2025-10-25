
export type SubscriptionTier = 'free' | 'plus' | 'gold' | 'platinum';

export interface User {
  id: string;
  email: string;
  profileComplete: boolean;
  profile: Profile;
  subscriptionTier: SubscriptionTier;
  superLikes: number;
  boosts: number;
}

export interface Profile {
  userId: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  photos: string[];
  interests: string[];
  quizAnswers: Record<string, string>;
  vector?: number[];
}

export interface Match {
  id: string;
  user: Profile;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export interface VirtualGift {
    id: string;
    name: string;
    icon: string; // e.g., emoji or image URL
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  gift?: VirtualGift;
}

export interface SwipeProfile extends Profile {
    compatibilityScore?: number;
    isSuperLike?: boolean; // Indicates if this profile Super Liked the current user
}
