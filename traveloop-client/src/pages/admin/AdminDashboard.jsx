import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAdminDashboard } from '../../api/admin';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminDashboard();
        setStats(res.data.data);
      } catch {
        toast.error('Failed to load admin stats');
      }
    };
    load();
  }, []);

  if (!stats) {
    return <div className="text-sm text-neutral-text">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-[16px] p-5">
          <div className="text-xs text-neutral-text mb-1">Total Users</div>
          <div className="text-2xl font-heading font-bold">{stats.totalUsers}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[16px] p-5">
          <div className="text-xs text-neutral-text mb-1">Total Trips</div>
          <div className="text-2xl font-heading font-bold">{stats.totalTrips}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[16px] p-5">
          <div className="text-xs text-neutral-text mb-1">Total Posts</div>
          <div className="text-2xl font-heading font-bold">{stats.totalPosts}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
