import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuCalendar, LuMapPin, LuUsers, LuDollarSign, LuGlobe } from 'react-icons/lu';
import { format } from 'date-fns';
import api from '../api/axios';

const SharedTrip = () => {
  const { shareCode } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedTrip = async () => {
      try {
        const res = await api.get(`/trips/shared/${shareCode}`);
        setTrip(res.data.data.trip);
      } catch (err) {
        setError(err.response?.data?.error || 'This trip is not available.');
      } finally {
        setLoading(false);
      }
    };
    fetchSharedTrip();
  }, [shareCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111A] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#07111A] flex items-center justify-center text-center p-6">
        <div>
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <LuGlobe className="w-10 h-10 text-gray-500" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Trip Not Found</h1>
          <p className="text-neutral-text max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111A] text-white font-body">
      {/* Hero */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        <img
          src={trip.coverImage || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop"}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111A] via-[#07111A]/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-5xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent-blue/20 text-accent-blue border border-accent-blue/20 mb-3 inline-block">
            {trip.status}
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight">{trip.title}</h1>
          {trip.description && <p className="text-white/70 mt-3 max-w-2xl">{trip.description}</p>}

          {trip.owner && (
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                {trip.owner.profileImage ? (
                  <img src={trip.owner.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-accent-blue font-heading font-bold">{trip.owner.firstName?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <div className="text-sm font-medium">{trip.owner.firstName} {trip.owner.lastName}</div>
                {trip.owner.username && <div className="text-xs text-neutral-text">@{trip.owner.username}</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0A1622] border border-white/5 rounded-[16px] p-5 text-center">
            <LuCalendar className="w-5 h-5 mx-auto mb-2 text-accent-blue" />
            <div className="text-xs text-neutral-text mb-1">Dates</div>
            <div className="text-sm font-medium">
              {trip.startDate ? format(new Date(trip.startDate), 'MMM dd') : '—'}
              {trip.endDate ? ` – ${format(new Date(trip.endDate), 'MMM dd')}` : ''}
            </div>
          </div>
          <div className="bg-[#0A1622] border border-white/5 rounded-[16px] p-5 text-center">
            <LuUsers className="w-5 h-5 mx-auto mb-2 text-accent-mint" />
            <div className="text-xs text-neutral-text mb-1">Travelers</div>
            <div className="text-sm font-medium">{trip.travelersCount}</div>
          </div>
          <div className="bg-[#0A1622] border border-white/5 rounded-[16px] p-5 text-center">
            <LuDollarSign className="w-5 h-5 mx-auto mb-2 text-accent-orange" />
            <div className="text-xs text-neutral-text mb-1">Budget</div>
            <div className="text-sm font-medium">{trip.currency} {trip.estimatedBudget || '—'}</div>
          </div>
          <div className="bg-[#0A1622] border border-white/5 rounded-[16px] p-5 text-center">
            <LuMapPin className="w-5 h-5 mx-auto mb-2 text-accent-blue" />
            <div className="text-xs text-neutral-text mb-1">Activities</div>
            <div className="text-sm font-medium">{trip._count?.activities || 0}</div>
          </div>
        </div>

        {/* Itinerary */}
        {trip.itinerarySections && trip.itinerarySections.length > 0 && (
          <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-6">
            <h3 className="text-lg font-heading font-bold mb-4">Itinerary</h3>
            <div className="space-y-4">
              {trip.itinerarySections.map((section, i) => (
                <div key={section.id} className="flex gap-4 items-start p-4 bg-white/5 rounded-[16px] border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold">{section.title}</h4>
                    {section.city && <p className="text-xs text-neutral-text mt-1">{section.city.name}, {section.city.country}</p>}
                    {section.description && <p className="text-xs text-neutral-text mt-1">{section.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activities */}
        {trip.activities && trip.activities.length > 0 && (
          <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-6">
            <h3 className="text-lg font-heading font-bold mb-4">Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trip.activities.map((activity) => (
                <div key={activity.id} className="p-4 bg-white/5 rounded-[16px] border border-white/5">
                  <h4 className="text-sm font-semibold">{activity.title}</h4>
                  {activity.location && <p className="text-xs text-neutral-text mt-1">{activity.location}</p>}
                  {activity.startTime && <p className="text-xs text-neutral-text mt-1">{format(new Date(activity.startTime), 'MMM dd, hh:mm a')}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8 border-t border-white/5">
          <p className="text-neutral-text text-sm">Shared via <span className="text-accent-blue font-heading font-bold">TripLoop</span></p>
        </div>
      </div>
    </div>
  );
};

export default SharedTrip;
