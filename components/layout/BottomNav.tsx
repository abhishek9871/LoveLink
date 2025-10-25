
import React from 'react';
import { NavLink } from 'react-router-dom';
import { DiscoverIcon, MatchesIcon, ProfileIcon } from '../icons';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `flex flex-col items-center justify-center gap-1 w-full pt-2 pb-1 transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};

const BottomNav: React.FC = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm sticky bottom-0 z-10 w-full">
      <nav className="flex items-center justify-around h-16 border-t border-gray-200">
        <NavItem to="/discover" icon={<DiscoverIcon className="w-6 h-6" />} label="Discover" />
        <NavItem to="/matches" icon={<MatchesIcon className="w-6 h-6" />} label="Matches" />
        <NavItem to="/profile" icon={<ProfileIcon className="w-6 h-6" />} label="Profile" />
      </nav>
    </footer>
  );
};

export default BottomNav;
