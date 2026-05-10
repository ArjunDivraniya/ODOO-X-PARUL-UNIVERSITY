import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { LuMapPin, LuCalendar, LuMail, LuPhone } from 'react-icons/lu';
import { format } from 'date-fns';
import api from '../../../api/axios';

const ProfileOverview = ({ profile }) => {
  const [stats, setStats] = useState({ totalTrips: 0, totalExpenses: 0, countriesVisited: 0 });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          api.get('/users/dashboard-stats'),
          api.get('/users/activity-summary')
        ]);
        setStats(statsRes.data.data);
        setActivity(activityRes.data.data.activities || []);
      } catch (error) {
        console.error('Failed to fetch overview data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return <div className="py-12 flex justify-center"><div className="w-8 h-8 border-2 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8">
      {/* About Section */}
      <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-8 shadow-lg">
        <h3 className="text-xl font-heading font-bold text-secondary-bg mb-4">About</h3>
        <p className="text-neutral-text leading-relaxed">
          {profile?.bio || "No bio provided. Update your profile to tell the community about your travel style!"}
        </p>
        
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile?.email && (
            <div className="flex items-center text-sm text-neutral-text">
              <LuMail className="w-4 h-4 mr-3 text-accent-blue" />
              {profile.email}
            </div>
          )}
          {profile?.phoneNumber && (
            <div className="flex items-center text-sm text-neutral-text">
              <LuPhone className="w-4 h-4 mr-3 text-accent-blue" />
              {profile.phoneNumber}
            </div>
          )}
          {profile?.city && profile?.country && (
            <div className="flex items-center text-sm text-neutral-text">
              <LuMapPin className="w-4 h-4 mr-3 text-accent-blue" />
              {profile.city}, {profile.country}
            </div>
          )}
          <div className="flex items-center text-sm text-neutral-text">
            <LuCalendar className="w-4 h-4 mr-3 text-accent-blue" />
            Joined {profile?.createdAt ? format(new Date(profile.createdAt), 'MMMM yyyy') : 'Recently'}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-6 text-center">
          <div className="text-3xl font-heading font-bold text-secondary-bg mb-1">{stats.totalTrips}</div>
          <div className="text-sm text-neutral-text font-medium">Total Trips</div>
        </div>
        <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-6 text-center">
          <div className="text-3xl font-heading font-bold text-secondary-bg mb-1">${stats.totalExpenses.toLocaleString()}</div>
          <div className="text-sm text-neutral-text font-medium">Total Expenses</div>
        </div>
        <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-6 text-center">
          <div className="text-3xl font-heading font-bold text-secondary-bg mb-1">{stats.countriesVisited}</div>
          <div className="text-sm text-neutral-text font-medium">Countries Visited</div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-8 shadow-lg">
        <h3 className="text-xl font-heading font-bold text-secondary-bg mb-6">Recent Activity</h3>
        {activity.length > 0 ? (
          <div className="space-y-6">
            {activity.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-accent-blue"></div>
                <div>
                  <p className="text-sm text-secondary-bg">{item.description}</p>
                  <p className="text-xs text-neutral-text mt-1">{format(new Date(item.date), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-text text-sm italic">No recent activity found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileOverview;
