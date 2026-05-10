import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import api from '../../../api/axios';
import { AuthContext } from '../../../context/AuthContext';
import ProfileOverview from './ProfileOverview';
import EditProfile from './EditProfile';
import AccountSettings from './AccountSettings';

const Profile = () => {
  const { user: authUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, edit, settings

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setProfile(res.data.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-[32px] overflow-visible bg-[#0A1622] border border-white/5 shadow-2xl mb-24">
        {/* Cover Image */}
        <div className="h-48 md:h-64 w-full rounded-t-[32px] overflow-hidden relative bg-white/5">
          <img 
            src={profile?.coverImage || "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop"} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1622] to-transparent" />
        </div>

        {/* Profile Avatar & Info Overlay */}
        <div className="absolute -bottom-20 left-8 md:left-12 flex items-end gap-6 w-full">
          {/* Avatar with Letter Fallback */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#07111A] bg-[#0A1622] shadow-2xl overflow-hidden flex-shrink-0 flex items-center justify-center">
            {profile?.profileImage ? (
              <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent-blue/20 to-accent-mint/20 text-accent-blue flex items-center justify-center text-5xl font-heading font-bold">
                {profile?.firstName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="pb-4 flex-1 pr-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-secondary-bg">
              {profile?.firstName} {profile?.lastName}
            </h1>
            <p className="text-accent-blue font-medium mt-1">
              {profile?.username ? `@${profile.username}` : 'Traveler'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto hide-scrollbar">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'edit', label: 'Edit Profile' },
          { id: 'settings', label: 'Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-accent-blue text-[#0A1622]'
                : 'text-neutral-text hover:text-secondary-bg hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeTab === 'overview' && <ProfileOverview profile={profile} />}
        {activeTab === 'edit' && <EditProfile profile={profile} onProfileUpdate={handleProfileUpdate} />}
        {activeTab === 'settings' && <AccountSettings />}
      </motion.div>
    </div>
  );
};

export default Profile;
