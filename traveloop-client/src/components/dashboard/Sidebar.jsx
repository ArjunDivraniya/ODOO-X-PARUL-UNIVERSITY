import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LuLayoutDashboard, LuPlane, LuUsers, LuBookmark, LuSettings, LuLogOut, LuCompass, LuSearch, LuBrain, LuChartColumn } from 'react-icons/lu';
import { AuthContext } from '../../context/AuthContext';

const navItems = [
  { icon: LuLayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: LuPlane, label: 'My Trips', path: '/dashboard/trips' },
  { icon: LuCompass, label: 'Explore', path: '/dashboard/explore' },
  { icon: LuSearch, label: 'Search', path: '/dashboard/search' },
  { icon: LuUsers, label: 'Community', path: '/dashboard/community' },
  { icon: LuBookmark, label: 'Saved', path: '/dashboard/saved' },
  { icon: LuBrain, label: 'AI Assistant', path: '/dashboard/ai' },
  { icon: LuChartColumn, label: 'Analytics', path: '/dashboard/analytics' }
];

export const Sidebar = ({ onLogout }) => {
  const { user } = useContext(AuthContext);

  return (
    <aside className="w-64 h-screen bg-[#0A1622] border-r border-white/5 flex flex-col hidden md:flex sticky top-0">
      <div className="p-8">
        <div className="text-secondary-bg text-2xl font-heading font-bold tracking-tight mb-12">
          TripLoop.
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-[16px] text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
                    : 'text-neutral-text hover:text-secondary-bg hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
          {user?.role === 'ADMIN' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-[16px] text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
                    : 'text-neutral-text hover:text-secondary-bg hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <LuSettings className="w-5 h-5" />
              Admin
            </NavLink>
          )}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-2">
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-[16px] text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
                : 'text-neutral-text hover:text-secondary-bg hover:bg-white/5 border border-transparent'
            }`
          }
        >
          <LuSettings className="w-5 h-5" />
          Settings
        </NavLink>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 border border-transparent transition-all duration-300"
        >
          <LuLogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
};
