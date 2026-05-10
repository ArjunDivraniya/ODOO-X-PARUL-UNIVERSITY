import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAnalyticsDashboard, getTripAnalytics } from '../../api/analytics';
import api from '../../api/axios';

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [trips, setTrips] = useState([]);
  const [tripId, setTripId] = useState('');
  const [tripAnalytics, setTripAnalytics] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashboardRes, tripsRes] = await Promise.all([
          getAnalyticsDashboard(),
          api.get('/trips?limit=50')
        ]);
        setDashboard(dashboardRes.data.data.analytics || null);
        setTrips(tripsRes.data.data.trips || []);
      } catch (err) {
        toast.error('Failed to load analytics');
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!tripId) return;
    const loadTrip = async () => {
      try {
        const res = await getTripAnalytics(tripId);
        setTripAnalytics(res.data.data.analytics);
      } catch {
        setTripAnalytics(null);
      }
    };
    loadTrip();
  }, [tripId]);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-secondary-bg">Analytics</h1>
        <p className="text-neutral-text text-sm">Track travel trends and spend insights.</p>
      </div>

      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-5">
            <div className="text-xs text-neutral-text mb-1">Total Trips</div>
            <div className="text-2xl font-heading font-bold text-secondary-bg">{dashboard.trips?.total || 0}</div>
          </div>
          <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-5">
            <div className="text-xs text-neutral-text mb-1">Total Spent</div>
            <div className="text-2xl font-heading font-bold text-secondary-bg">${dashboard.spending || 0}</div>
          </div>
          <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-5">
            <div className="text-xs text-neutral-text mb-1">Activities</div>
            <div className="text-2xl font-heading font-bold text-secondary-bg">{dashboard.activities || 0}</div>
          </div>
        </div>
      )}

      <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-bold text-secondary-bg">Trip Analytics</h2>
          <select
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
            className="rounded-[12px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-bg"
          >
            <option value="" className="bg-[#0A1622]">Select trip</option>
            {trips.map(trip => (
              <option key={trip.id} value={trip.id} className="bg-[#0A1622]">{trip.title}</option>
            ))}
          </select>
        </div>

        {tripAnalytics ? (
          <div className="space-y-3">
            <div className="text-sm text-neutral-text">Budget Used: ${tripAnalytics.budgetUsed || 0}</div>
            <div className="text-sm text-neutral-text">Estimated Budget: ${tripAnalytics.estimatedBudget || 0}</div>
            <div className="text-sm text-neutral-text">Activity Count: {tripAnalytics.activityCount || 0}</div>
            <div className="text-sm text-neutral-text">Section Count: {tripAnalytics.sectionCount || 0}</div>
          </div>
        ) : (
          <div className="text-sm text-neutral-text">Select a trip to view analytics.</div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
