import React, { useState, useEffect } from 'react';
import { LogoIcon, BoostIcon } from '../icons';

interface HeaderProps {
    isOnline: boolean;
}

const Header: React.FC<HeaderProps> = ({ isOnline }) => {
  const [boostTimeLeft, setBoostTimeLeft] = useState(0);

  useEffect(() => {
    // This is a simple simulation. A real app would get this from a global state/context.
    const boostEndTime = (JSON.parse(localStorage.getItem('ll_users') || '[]').find((u: any) => u.id === localStorage.getItem('love_link_token')?.replace('mock_jwt_', '')) as any)?.boostEndTime;
    
    if (boostEndTime && boostEndTime > Date.now()) {
      setBoostTimeLeft(boostEndTime - Date.now());
    }

    const interval = setInterval(() => {
      setBoostTimeLeft(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 w-full">
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 relative">
        <div className="flex items-center gap-2">
          <LogoIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-heading font-bold text-primary">LoveLink</h1>
        </div>
         {boostTimeLeft > 0 && (
          <div className="absolute right-4 flex items-center gap-2 bg-purple-100 text-secondary font-bold text-sm px-3 py-1 rounded-full">
            <BoostIcon className="w-4 h-4 text-secondary animate-pulse" />
            <span>{formatTime(boostTimeLeft)}</span>
          </div>
        )}
         {!isOnline && (
            <div className="absolute left-4 text-xs font-bold text-white bg-gray-500 px-2 py-1 rounded-md">
                Offline
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;