import React, { useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-primary-bg text-secondary-bg flex font-body selection:bg-accent-blue selection:text-primary-bg">
      {/* Desktop Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden flex"
            >
              <Sidebar onLogout={handleLogout} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {/* Subtle background ambient gradients */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/5 blur-[150px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-mint/5 blur-[150px] rounded-full mix-blend-screen" />
          </div>

          <div className="relative z-10 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
