import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LuSearch, LuBell, LuMenu } from 'react-icons/lu';
import { AuthContext } from '../../context/AuthContext';

export const Topbar = ({ onMenuClick }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="h-20 bg-[#07111A]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-neutral-text hover:text-secondary-bg transition-colors"
        >
          <LuMenu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-[16px] border border-white/5 w-64 lg:w-96 focus-within:border-accent-blue/50 focus-within:ring-1 focus-within:ring-accent-blue/50 transition-all">
          <LuSearch className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search trips, places, people..." 
            className="bg-transparent border-none outline-none text-sm text-secondary-bg w-full placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-neutral-text hover:text-secondary-bg transition-colors">
          <LuBell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-orange rounded-full"></span>
        </button>
        
        <Link to="/dashboard/profile" className="flex items-center gap-3 pl-6 border-l border-white/10 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-secondary-bg group-hover:text-white transition-colors">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-neutral-text">Traveler</div>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#0A1622] group-hover:border-accent-blue transition-colors bg-[#0A1622] flex items-center justify-center">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent-blue/20 to-accent-mint/20 text-accent-blue flex items-center justify-center text-lg font-heading font-bold">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
};
