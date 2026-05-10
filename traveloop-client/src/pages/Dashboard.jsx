import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500 mb-4 bg-white/10">
            {user.profilePhoto ? (
              <img src={`http://localhost:5000${user.profilePhoto}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-indigo-300">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.firstName}!</h1>
          <p className="text-gray-400 mb-6">{user.email}</p>
          
          <button 
            onClick={logout}
            className="px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/30 transition-colors"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
