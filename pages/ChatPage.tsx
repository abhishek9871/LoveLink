
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Message, Profile } from '../types';
import { mockApi } from '../services/api';
import useAuthStore from '../store/authStore';
import MessageBubble from '../components/chat/MessageBubble';
import ChatInput from '../components/chat/ChatInput';
import Spinner from '../components/ui/Spinner';
import Avatar from '../components/ui/Avatar';
import { BackIcon, VideoIcon } from '../components/icons';
import GiftMessage from '../components/chat/GiftMessage';

const ChatPage: React.FC = () => {
  const { userId: targetUserId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const [messages, setMessages] = useState<Message[]>([]);
  const [matchProfile, setMatchProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const fetchConversation = useCallback(async () => {
    if (!user || !targetUserId) return;
    setLoading(true);
    try {
        const { profile, messages: fetchedMessages } = await mockApi.getConversation(user.id, targetUserId);
        setMatchProfile(profile);
        setMessages(fetchedMessages);
    } catch (error) {
        console.error("Failed to load conversation", error);
    } finally {
        setLoading(false);
    }
  }, [user, targetUserId]);


  useEffect(() => {
    fetchConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserId]);

  useEffect(() => {
    const handleNewMessage = (event: Event) => {
        const newMessage = (event as CustomEvent<Message>).detail;
        if(newMessage.senderId === targetUserId) {
            setMessages(prev => [...prev, newMessage]);
        }
    };
    window.addEventListener('newMessage', handleNewMessage);
    return () => {
        window.removeEventListener('newMessage', handleNewMessage);
    };
  }, [targetUserId]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (content: string, giftId?: string) => {
    if (!user || !targetUserId) return;
    const newMessage = await mockApi.sendMessage(user.id, targetUserId, content, giftId);
    setMessages(prev => [...prev, newMessage]);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner /></div>;
  }
  
  if (!matchProfile) {
    return <div className="p-4 text-center">Match not found.</div>
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center p-3 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <button onClick={() => navigate('/matches')} className="p-2 text-gray-600">
            <BackIcon className="w-6 h-6"/>
        </button>
        <Avatar src={matchProfile.photos[0]} alt={matchProfile.name} size="sm" className="ml-2"/>
        <h2 className="ml-3 font-bold text-lg flex-grow">{matchProfile.name}</h2>
        <button onClick={() => navigate(`/video/${targetUserId}`)} className="p-2 text-primary hover:bg-primary/10 rounded-full">
            <VideoIcon className="w-6 h-6"/>
        </button>
      </header>
      <div className="flex-grow p-4 overflow-y-auto space-y-2">
        {messages.map(msg => 
            msg.gift ? (
                <GiftMessage key={msg.id} message={msg} isOwnMessage={msg.senderId === user?.id} />
            ) : (
                <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.senderId === user?.id} />
            )
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatPage;
