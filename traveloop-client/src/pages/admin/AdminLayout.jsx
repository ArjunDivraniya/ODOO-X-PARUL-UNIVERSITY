import React, { useContext, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LuUsers, LuPlane, LuLayoutDashboard, LuLogOut } from 'react-icons/lu';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (user?.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-[#0A1622] text-secondary-bg flex">
      <aside className="w-64 border-r border-white/5 p-6 space-y-6">
        <div className="text-2xl font-heading font-bold">Admin</div>
        <nav className="space-y-2">
          {[
            { path: '/admin', label: 'Dashboard', icon: LuLayoutDashboard },
            { path: '/admin/users', label: 'Users', icon: LuUsers },
            { path: '/admin/trips', label: 'Trips', icon: LuPlane }
          ].map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-[16px] text-sm font-medium ${
                  isActive ? 'bg-accent-blue/10 text-accent-blue' : 'text-neutral-text hover:text-secondary-bg hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10"
        >
          <LuLogOut className="w-4 h-4" />
          Log out
        </button>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
