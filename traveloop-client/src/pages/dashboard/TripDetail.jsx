import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuArrowLeft, LuCalendar, LuMapPin, LuUsers, LuDollarSign, LuShare2, LuPencil, LuTrash2, LuCopy, LuGlobe, LuLock, LuCheck, LuEye } from 'react-icons/lu';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import EditTripModal from '../../components/dashboard/EditTripModal';

const STATUS_FLOW = ['PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED'];

const TripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchTrip = async () => {
    try {
      const [tripRes, overviewRes] = await Promise.all([
        api.get(`/trips/${tripId}`),
        api.get(`/trips/${tripId}/overview`).catch(() => ({ data: { data: { overview: null } } }))
      ]);
      setTrip(tripRes.data.data.trip);
      setOverview(overviewRes.data.data.overview || null);
    } catch (error) {
      console.error('Failed to fetch trip:', error);
      toast.error('Trip not found.');
      navigate('/dashboard/trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this trip permanently?')) return;
    try {
      await api.delete(`/trips/${tripId}`);
      toast.success('Trip deleted.');
      navigate('/dashboard/trips');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete trip');
    }
  };

  const handleDuplicate = async () => {
    try {
      const res = await api.post(`/trips/${tripId}/duplicate`);
      toast.success('Trip duplicated!');
      navigate(`/dashboard/trips/${res.data.data.trip.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to duplicate');
    }
  };

  const handleShare = async () => {
    try {
      const res = await api.post(`/trips/${tripId}/share`);
      await navigator.clipboard.writeText(res.data.data.shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to share');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.patch(`/trips/${tripId}/status`, { status: newStatus });
      setTrip(prev => ({ ...prev, status: newStatus }));
      toast.success(`Status changed to ${newStatus.toLowerCase()}.`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleVisibilityToggle = async () => {
    const newVis = trip.visibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
    try {
      await api.patch(`/trips/${tripId}/visibility`, { visibility: newVis });
      setTrip(prev => ({ ...prev, visibility: newVis }));
      toast.success(`Trip is now ${newVis.toLowerCase()}.`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update visibility');
    }
  };

  const handleTripUpdated = (updatedTrip) => {
    setTrip(updatedTrip);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Back Button */}
      <Link to="/dashboard/trips" className="inline-flex items-center gap-2 text-neutral-text hover:text-white transition-colors text-sm font-medium group">
        <LuArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Trips
      </Link>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[32px] overflow-hidden bg-[#0A1622] border border-white/5 shadow-2xl"
      >
        <div className="h-56 md:h-72 w-full overflow-hidden relative bg-white/5">
          <img
            src={trip.coverImage || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop"}
            alt={trip.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1622] via-[#0A1622]/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                  trip.status === 'PLANNING' ? 'bg-accent-orange/20 text-accent-orange border-accent-orange/20' :
                  trip.status === 'ACTIVE' ? 'bg-accent-mint/20 text-accent-mint border-accent-mint/20' :
                  trip.status === 'COMPLETED' ? 'bg-accent-blue/20 text-accent-blue border-accent-blue/20' :
                  'bg-white/20 text-white border-white/20'
                }`}>
                  {trip.status}
                </span>
                <span className="text-white/60 text-xs flex items-center gap-1">
                  {trip.visibility === 'PUBLIC' ? <LuGlobe className="w-3 h-3" /> : <LuLock className="w-3 h-3" />}
                  {trip.visibility}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight">{trip.title}</h1>
              {trip.description && <p className="text-white/70 mt-2 max-w-xl text-sm">{trip.description}</p>}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setEditModalOpen(true)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-[12px] text-white transition-colors" title="Edit"><LuPencil className="w-4 h-4" /></button>
              <button onClick={handleShare} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-[12px] text-white transition-colors" title="Share"><LuShare2 className="w-4 h-4" /></button>
              <button onClick={handleDuplicate} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-[12px] text-white transition-colors" title="Duplicate"><LuCopy className="w-4 h-4" /></button>
              <button onClick={handleVisibilityToggle} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-[12px] text-white transition-colors" title="Toggle Visibility"><LuEye className="w-4 h-4" /></button>
              <button onClick={handleDelete} className="p-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-[12px] text-red-400 transition-colors" title="Delete"><LuTrash2 className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0A1622] border border-white/5 rounded-[16px] p-5 text-center">
          <LuCalendar className="w-5 h-5 mx-auto mb-2 text-accent-blue" />
          <div className="text-xs text-neutral-text mb-1">Dates</div>
          <div className="text-sm font-medium text-secondary-bg">
            {trip.startDate ? format(new Date(trip.startDate), 'MMM dd') : '—'}
            {trip.endDate ? ` – ${format(new Date(trip.endDate), 'MMM dd')}` : ''}
          </div>
        </div>
        <div className="bg-[#0A1622] border border-white/5 rounded-[16px] p-5 text-center">
          <LuUsers className="w-5 h-5 mx-auto mb-2 text-accent-mint" />
          <div className="text-xs text-neutral-text mb-1">Travelers</div>
          <div className="text-sm font-medium text-secondary-bg">{trip.travelersCount}</div>
        </div>
        <div className="bg-[#0A1622] border border-white/5 rounded-[16px] p-5 text-center">
          <LuDollarSign className="w-5 h-5 mx-auto mb-2 text-accent-orange" />
          <div className="text-xs text-neutral-text mb-1">Budget</div>
          <div className="text-sm font-medium text-secondary-bg">{trip.currency} {trip.estimatedBudget || '—'}</div>
        </div>
        <div className="bg-[#0A1622] border border-white/5 rounded-[16px] p-5 text-center">
          <LuMapPin className="w-5 h-5 mx-auto mb-2 text-accent-blue" />
          <div className="text-xs text-neutral-text mb-1">Days</div>
          <div className="text-sm font-medium text-secondary-bg">{overview?.totalDays || '—'}</div>
        </div>
      </div>

      {/* Status Workflow */}
      <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-6">
        <h3 className="text-lg font-heading font-bold text-secondary-bg mb-4">Trip Status</h3>
        <div className="flex flex-wrap gap-3">
          {STATUS_FLOW.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-5 py-2.5 rounded-[12px] text-sm font-medium transition-all flex items-center gap-2 ${
                trip.status === status
                  ? 'bg-accent-blue text-[#0A1622]'
                  : 'bg-white/5 text-neutral-text hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {trip.status === status && <LuCheck className="w-4 h-4" />}
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-6">
          <h3 className="text-lg font-heading font-bold text-secondary-bg mb-4">Trip Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-secondary-bg">{overview.citiesCount}</div>
              <div className="text-xs text-neutral-text mt-1">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-secondary-bg">{overview.activitiesCount}</div>
              <div className="text-xs text-neutral-text mt-1">Activities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-secondary-bg">{overview.packingProgress}%</div>
              <div className="text-xs text-neutral-text mt-1">Packed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-secondary-bg">{overview.expensesSummary.percentageUsed}%</div>
              <div className="text-xs text-neutral-text mt-1">Budget Used</div>
            </div>
          </div>
          {/* Budget Bar */}
          {overview.expensesSummary.estimatedBudget > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-neutral-text">Budget Usage</span>
                <span className="text-secondary-bg">${overview.expensesSummary.total} / ${overview.expensesSummary.estimatedBudget}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div className="bg-accent-blue h-full rounded-full transition-all" style={{ width: `${overview.expensesSummary.percentageUsed}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Itinerary Sections */}
      {trip.itinerarySections && trip.itinerarySections.length > 0 && (
        <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-6">
          <h3 className="text-lg font-heading font-bold text-secondary-bg mb-4">Itinerary</h3>
          <div className="space-y-4">
            {trip.itinerarySections.map((section, i) => (
              <div key={section.id} className="flex gap-4 items-start p-4 bg-white/5 rounded-[16px] border border-white/5">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-secondary-bg">{section.title}</h4>
                  {section.city && <p className="text-xs text-neutral-text mt-1">{section.city.name}, {section.city.country}</p>}
                  {section.description && <p className="text-xs text-neutral-text mt-1">{section.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collaborators */}
      {trip.collaborators && trip.collaborators.length > 0 && (
        <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-6">
          <h3 className="text-lg font-heading font-bold text-secondary-bg mb-4">Collaborators</h3>
          <div className="flex flex-wrap gap-3">
            {trip.collaborators.map((collab) => (
              <div key={collab.id} className="flex items-center gap-3 bg-white/5 rounded-[12px] px-4 py-2.5 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center text-xs font-bold">
                  {collab.user.firstName?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-secondary-bg">{collab.user.firstName} {collab.user.lastName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <EditTripModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          trip={trip}
          onTripUpdated={handleTripUpdated}
        />
      )}
    </div>
  );
};

export default TripDetail;
