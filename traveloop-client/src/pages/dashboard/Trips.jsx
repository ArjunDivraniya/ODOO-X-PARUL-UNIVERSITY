import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuPlus, LuFilter } from 'react-icons/lu';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { TripCard } from '../../components/dashboard/TripCard';
import CreateTripModal from '../../components/dashboard/CreateTripModal';
import EditTripModal from '../../components/dashboard/EditTripModal';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips');
      setTrips(res.data.data.trips || []);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // --- Handlers ---

  const handleTripCreated = (newTrip) => {
    setTrips(prev => [newTrip, ...prev]);
  };

  const handleTripUpdated = (updatedTrip) => {
    setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
  };

  const handleDelete = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip? This cannot be undone.')) return;
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips(prev => prev.filter(t => t.id !== tripId));
      toast.success('Trip deleted.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete trip');
    }
  };

  const handleDuplicate = async (tripId) => {
    try {
      const res = await api.post(`/trips/${tripId}/duplicate`);
      setTrips(prev => [res.data.data.trip, ...prev]);
      toast.success('Trip duplicated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to duplicate trip');
    }
  };

  const handleShare = async (tripId) => {
    try {
      const res = await api.post(`/trips/${tripId}/share`);
      const shareUrl = res.data.data.shareUrl;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate share link');
    }
  };

  const handleToggleVisibility = async (tripId, currentVisibility) => {
    const newVisibility = currentVisibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
    try {
      await api.patch(`/trips/${tripId}/visibility`, { visibility: newVisibility });
      setTrips(prev => prev.map(t => t.id === tripId ? { ...t, visibility: newVisibility } : t));
      toast.success(`Trip is now ${newVisibility.toLowerCase()}.`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update visibility');
    }
  };

  const handleToggleStatus = async (tripId, newStatus) => {
    try {
      await api.patch(`/trips/${tripId}/status`, { status: newStatus });
      setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: newStatus } : t));
      toast.success(`Trip status changed to ${newStatus.toLowerCase()}.`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  // --- Filter ---
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
          {/* Filter Buttons */}
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

          <button className="md:hidden flex-1 px-4 py-3 bg-[#0A1622] rounded-[16px] border border-white/5 text-sm font-medium flex items-center justify-center gap-2 text-neutral-text">
            <LuFilter className="w-4 h-4" /> Filter
          </button>

          {/* Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 md:flex-none px-6 py-3 bg-accent-blue text-[#0A1622] rounded-[16px] font-semibold text-sm hover:bg-[#5bc0ff] transition-colors flex items-center justify-center gap-2"
          >
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
        {/* Create Card */}
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
          onClick={() => setShowCreateModal(true)}
          className="bg-[#0A1622]/50 border-2 border-dashed border-white/10 rounded-[24px] flex flex-col items-center justify-center min-h-[320px] cursor-pointer hover:border-accent-blue/50 hover:bg-accent-blue/5 transition-colors group"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-accent-blue/20 transition-colors">
            <LuPlus className="w-8 h-8 text-neutral-text group-hover:text-accent-blue transition-colors" />
          </div>
          <h3 className="text-lg font-heading font-semibold text-secondary-bg mb-1">Create New Trip</h3>
          <p className="text-neutral-text text-sm text-center max-w-[200px]">Start planning your next amazing adventure.</p>
        </motion.div>

        {/* Trip Cards */}
        {filteredTrips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onEdit={setEditingTrip}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onShare={handleShare}
            onToggleVisibility={handleToggleVisibility}
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </motion.div>

      {filteredTrips.length === 0 && trips.length > 0 && (
        <div className="mt-12 text-center text-neutral-text">
          No trips found matching the current filter.
        </div>
      )}

      {/* Modals */}
      <CreateTripModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTripCreated={handleTripCreated}
      />

      {editingTrip && (
        <EditTripModal
          isOpen={!!editingTrip}
          onClose={() => setEditingTrip(null)}
          trip={editingTrip}
          onTripUpdated={handleTripUpdated}
        />
      )}
    </div>
  );
};

export default Trips;
