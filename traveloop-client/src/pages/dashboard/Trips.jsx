import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuPlus, LuFilter } from 'react-icons/lu';
import api from '../../api/axios';
import { TripCard } from '../../components/dashboard/TripCard';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PLANNING, ACTIVE, COMPLETED

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get('/trips');
        setTrips(res.data.data.trips);
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const filteredTrips = trips.filter(trip => filter === 'ALL' || trip.status === filter);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-heading font-bold text-secondary-bg tracking-tight mb-2">My Trips</h1>
          <p className="text-neutral-text">Manage all your upcoming and past adventures.</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Filter Dropdown/Buttons */}
          <div className="hidden md:flex items-center bg-[#0A1622] rounded-[16px] p-1 border border-white/5">
            {['ALL', 'PLANNING', 'ACTIVE', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-[12px] text-xs font-medium transition-all ${
                  filter === status 
                    ? 'bg-white/10 text-secondary-bg' 
                    : 'text-neutral-text hover:text-white'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <button className="md:hidden flex-1 px-4 py-3 bg-[#0A1622] rounded-[16px] border border-white/5 text-sm font-medium flex items-center justify-center gap-2">
            <LuFilter className="w-4 h-4" /> Filter
          </button>

          {/* Create Button */}
          <button className="flex-1 md:flex-none px-6 py-3 bg-accent-blue text-[#0A1622] rounded-[16px] font-semibold text-sm hover:bg-[#5bc0ff] transition-colors flex items-center justify-center gap-2">
            <LuPlus className="w-5 h-5" />
            <span className="hidden md:inline">New Trip</span>
          </button>
        </div>
      </div>

      {/* Trips Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Create New Trip Card (Sticky) */}
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
          className="bg-[#0A1622]/50 border-2 border-dashed border-white/10 rounded-[24px] flex flex-col items-center justify-center min-h-[320px] cursor-pointer hover:border-accent-blue/50 hover:bg-accent-blue/5 transition-colors group"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-accent-blue/20 transition-colors">
            <LuPlus className="w-8 h-8 text-neutral-text group-hover:text-accent-blue transition-colors" />
          </div>
          <h3 className="text-lg font-heading font-semibold text-secondary-bg mb-1">Create New Trip</h3>
          <p className="text-neutral-text text-sm text-center max-w-[200px]">Start planning your next amazing adventure.</p>
        </motion.div>

        {/* Existing Trips */}
        {filteredTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </motion.div>

      {filteredTrips.length === 0 && trips.length > 0 && (
        <div className="mt-12 text-center text-neutral-text">
          No trips found matching the current filter.
        </div>
      )}
    </div>
  );
};

export default Trips;
