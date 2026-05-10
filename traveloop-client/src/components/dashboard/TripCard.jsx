import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LuMapPin, LuCalendar, LuEllipsisVertical, LuGlobe, LuLock, LuPencil, LuTrash2, LuCopy, LuShare2, LuEye } from 'react-icons/lu';
import { format } from 'date-fns';

export const TripCard = ({ trip, onEdit, onDelete, onDuplicate, onShare, onToggleVisibility, onToggleStatus }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const isPublic = trip.visibility === 'PUBLIC';

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
      className="bg-[#0A1622] rounded-[24px] overflow-hidden border border-white/5 hover:border-white/10 shadow-lg group"
    >
      {/* Cover Image — Clickable to detail */}
      <Link to={`/dashboard/trips/${trip.id}`}>
        <div className="relative h-48 w-full overflow-hidden bg-white/5 cursor-pointer">
          <img
            src={trip.coverImage || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop`}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1622] via-[#0A1622]/20 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
              trip.status === 'PLANNING' ? 'bg-accent-orange/20 text-accent-orange border-accent-orange/20' :
              trip.status === 'ACTIVE' ? 'bg-accent-mint/20 text-accent-mint border-accent-mint/20' :
              trip.status === 'COMPLETED' ? 'bg-accent-blue/20 text-accent-blue border-accent-blue/20' :
              'bg-white/20 text-white border-white/20'
            }`}>
              {trip.status}
            </span>
          </div>

          {/* Visibility Badge */}
          <div className="absolute top-4 right-4 bg-[#0A1622]/60 backdrop-blur-md p-1.5 rounded-full text-white/70">
            {isPublic ? <LuGlobe className="w-4 h-4" /> : <LuLock className="w-4 h-4" />}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/dashboard/trips/${trip.id}`}>
            <h3 className="text-xl font-heading font-bold text-secondary-bg truncate pr-4 hover:text-accent-blue transition-colors">
              {trip.title}
            </h3>
          </Link>

          {/* Action Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-neutral-text hover:text-white transition-colors p-1"
            >
              <LuEllipsisVertical className="w-5 h-5" />
            </button>

            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-8 w-48 bg-[#0D1B2A] border border-white/10 rounded-[16px] shadow-2xl z-30 overflow-hidden"
              >
                <button onClick={() => { onEdit(trip); setMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-secondary-bg hover:bg-white/5 flex items-center gap-3 transition-colors">
                  <LuPencil className="w-4 h-4 text-accent-blue" /> Edit Trip
                </button>
                <button onClick={() => { onDuplicate(trip.id); setMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-secondary-bg hover:bg-white/5 flex items-center gap-3 transition-colors">
                  <LuCopy className="w-4 h-4 text-accent-mint" /> Duplicate
                </button>
                <button onClick={() => { onShare(trip.id); setMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-secondary-bg hover:bg-white/5 flex items-center gap-3 transition-colors">
                  <LuShare2 className="w-4 h-4 text-accent-orange" /> Share Link
                </button>
                <button onClick={() => { onToggleVisibility(trip.id, trip.visibility); setMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-secondary-bg hover:bg-white/5 flex items-center gap-3 transition-colors">
                  <LuEye className="w-4 h-4" /> {isPublic ? 'Make Private' : 'Make Public'}
                </button>
                <div className="border-t border-white/5" />
                <button onClick={() => { onDelete(trip.id); setMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors">
                  <LuTrash2 className="w-4 h-4" /> Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex items-center text-sm text-neutral-text">
            <LuCalendar className="w-4 h-4 mr-2 text-gray-500" />
            {trip.startDate ? format(new Date(trip.startDate), 'MMM dd, yyyy') : 'No dates set'}
            {trip.endDate && ` — ${format(new Date(trip.endDate), 'MMM dd, yyyy')}`}
          </div>
          <div className="flex items-center text-sm text-neutral-text">
            <LuMapPin className="w-4 h-4 mr-2 text-gray-500" />
            {trip.travelersCount} Traveler{trip.travelersCount > 1 ? 's' : ''} · {trip.tripType ? trip.tripType.charAt(0) + trip.tripType.slice(1).toLowerCase() : 'Leisure'}
          </div>
        </div>

        {/* Budget Bar */}
        {trip.estimatedBudget > 0 && (
          <div className="mt-6">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-neutral-text">Budget</span>
              <span className="text-secondary-bg">${trip.totalExpense || 0} / ${trip.estimatedBudget}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-accent-blue h-full rounded-full transition-all"
                style={{ width: `${Math.min(((trip.totalExpense || 0) / trip.estimatedBudget) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
