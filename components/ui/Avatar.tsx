
import React from 'react';
import { ProfileIcon } from '../icons';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = "Profile", size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  return (
    <div className={`relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <ProfileIcon className="h-3/5 w-3/5 text-gray-400" />
      )}
    </div>
  );
};

export default Avatar;
