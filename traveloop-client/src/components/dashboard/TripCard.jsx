import React from 'react';
import { motion } from 'framer-motion';
import { LuMapPin, LuCalendar, LuSettings, LuGlobe, LuLock } from 'react-icons/lu';
import { format } from 'date-fns';

export const TripCard = ({ trip }) => {
  const isPublic = trip.visibility === 'PUBLIC';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
      className="bg-[#0A1622] rounded-[24px] overflow-hidden border border-white/5 hover:border-white/10 shadow-lg group cursor-pointer"
    >
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-white/5">
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

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-heading font-bold text-secondary-bg truncate pr-4">
            {trip.title}
          </h3>
          <button className="text-neutral-text hover:text-white transition-colors p-1">
            <LuSettings className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex items-center text-sm text-neutral-text">
            <LuCalendar className="w-4 h-4 mr-2 text-gray-500" />
            {trip.startDate ? format(new Date(trip.startDate), 'MMM dd, yyyy') : 'No dates set'}
            {trip.endDate && ` - ${format(new Date(trip.endDate), 'MMM dd, yyyy')}`}
          </div>
          <div className="flex items-center text-sm text-neutral-text">
            <LuMapPin className="w-4 h-4 mr-2 text-gray-500" />
            {trip.travelersCount} Traveler{trip.travelersCount > 1 ? 's' : ''}
          </div>
        </div>

        {/* Progress Bar (Mocked for now based on budget) */}
        <div className="mt-6">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-neutral-text">Budget</span>
            <span className="text-secondary-bg">${trip.totalExpense || 0} / ${trip.estimatedBudget || 0}</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-accent-blue h-full rounded-full" 
              style={{ width: `${Math.min(((trip.totalExpense || 0) / (trip.estimatedBudget || 1)) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
