import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { LuPlaneTakeoff, LuWallet, LuMapPin, LuArrowRight } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { TripCard } from '../../components/dashboard/TripCard';

const StatCard = ({ icon: Icon, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-6 flex items-center gap-6"
  >
    <div className="w-14 h-14 rounded-[16px] bg-[#0A1622] flex items-center justify-center border border-white/5">
      <Icon className="w-6 h-6 text-accent-blue" />
    </div>
    <div>
      <p className="text-neutral-text text-sm font-medium mb-1">{label}</p>
      <h4 className="text-3xl font-heading font-bold text-secondary-bg">{value}</h4>
    </div>
  </motion.div>
);

const Overview = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalTrips: 0, totalExpenses: 0, countriesVisited: 0 });
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, tripsRes] = await Promise.all([
          api.get('/users/dashboard-stats'),
          api.get('/trips?limit=3')
        ]);
        
        setStats(statsRes.data.data);
        setRecentTrips(tripsRes.data.data.trips);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
      {/* Welcome Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[32px] bg-[#0A1622] border border-white/5 shadow-2xl p-8 md:p-12 min-h-[240px] flex items-end"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={user?.coverImage || "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop"} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1622] via-[#0A1622]/80 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-white mb-2">
              Welcome back, {user?.firstName}.
            </h1>
            <p className="text-white/70 text-lg max-w-xl">
              You have {stats.totalTrips} upcoming trips planned. Where are we heading next?
            </p>
          </div>
          <Link to="/dashboard/trips">
            <button className="px-6 py-3 bg-white text-[#0A1622] rounded-[16px] font-semibold text-sm hover:bg-white/90 transition-colors flex items-center gap-2 group">
              Plan New Trip
              <LuArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={LuPlaneTakeoff} label="Total Trips" value={stats.totalTrips} delay={0.1} />
        <StatCard icon={LuWallet} label="Total Expenses" value={`$${stats.totalExpenses.toLocaleString()}`} delay={0.2} />
        <StatCard icon={LuMapPin} label="Countries Visited" value={stats.countriesVisited} delay={0.3} />
      </div>

      {/* Recent Trips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-secondary-bg">Recent Itineraries</h2>
            <p className="text-neutral-text text-sm mt-1">Jump back into your planning.</p>
          </div>
          <Link to="/dashboard/trips" className="text-accent-blue text-sm font-medium hover:text-white transition-colors flex items-center gap-1 group">
            View All
            <LuArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {recentTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuPlaneTakeoff className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-secondary-bg mb-2">No trips planned yet</h3>
            <p className="text-neutral-text text-sm max-w-sm mx-auto mb-6">
              Create your first itinerary to start organizing your flights, stays, and activities.
            </p>
            <Link to="/dashboard/trips">
              <button className="px-6 py-2.5 bg-accent-blue text-[#0A1622] rounded-[16px] font-semibold text-sm hover:bg-[#5bc0ff] transition-colors">
                Create First Trip
              </button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Overview;
