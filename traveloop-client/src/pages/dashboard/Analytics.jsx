import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getAnalyticsDashboard, getTripAnalytics } from '../../api/analytics';
import api from '../../api/axios';
import { Badge } from '../../components/ui/Badge';

const formatMoney = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
};

const percent = (value, max) => {
  if (!max || max <= 0) return 0;
  return Math.min(Math.round((Number(value || 0) / Number(max)) * 100), 100);
};

const MetricCard = ({ label, value, detail }) => (
  <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-5 min-h-[120px]">
    <div className="text-xs text-neutral-text mb-2">{label}</div>
    <div className="text-2xl font-heading font-bold text-secondary-bg">{value}</div>
    {detail && <div className="text-xs text-neutral-text mt-2">{detail}</div>}
  </div>
);

const BarRow = ({ label, value, max, tone = 'blue', meta }) => {
  const toneClasses = {
    blue: 'bg-accent-blue',
    mint: 'bg-accent-mint',
    orange: 'bg-accent-orange'
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-xs">
        <span className="text-secondary-bg truncate">{label}</span>
        <span className="text-neutral-text shrink-0">{meta || value}</span>
      </div>
      <div className="h-3 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full ${toneClasses[tone] || toneClasses.blue}`}
          style={{ width: `${percent(value, max)}%` }}
        />
      </div>
    </div>
  );
};

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [trips, setTrips] = useState([]);
  const [tripMetrics, setTripMetrics] = useState([]);
  const [tripId, setTripId] = useState('');
  const [tripAnalytics, setTripAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [dashboardResult, tripsResult] = await Promise.allSettled([
        getAnalyticsDashboard(),
        api.get('/trips?limit=50')
      ]);

      if (dashboardResult.status === 'fulfilled') {
        setDashboard(dashboardResult.value.data.data.analytics || null);
      }

      if (tripsResult.status === 'fulfilled') {
        const fetchedTrips = tripsResult.value.data.data.trips || [];
        setTrips(fetchedTrips);

        const analyticsResults = await Promise.allSettled(
          fetchedTrips.map(trip => getTripAnalytics(trip.id))
        );
        setTripMetrics(fetchedTrips.map((trip, index) => ({
          trip,
          analytics: analyticsResults[index].status === 'fulfilled'
            ? analyticsResults[index].value.data.data.analytics
            : null
        })));
      }

      if (dashboardResult.status === 'rejected' && tripsResult.status === 'rejected') {
        toast.error('Failed to load analytics');
      }

      setLoading(false);
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

  const selectedTrip = useMemo(() => trips.find(trip => trip.id === tripId), [trips, tripId]);

  const totals = useMemo(() => {
    return tripMetrics.reduce((acc, item) => {
      const analytics = item.analytics || {};
      acc.budget += Number(analytics.estimatedBudget || item.trip.estimatedBudget || 0);
      acc.spent += Number(analytics.budgetUsed || item.trip.totalExpense || 0);
      acc.activities += Number(analytics.activityCount || 0);
      acc.sections += Number(analytics.sectionCount || 0);
      return acc;
    }, { budget: 0, spent: 0, activities: 0, sections: 0 });
  }, [tripMetrics]);

  const statusCounts = useMemo(() => {
    return trips.reduce((acc, trip) => {
      const status = trip.status || 'PLANNING';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }, [trips]);

  const categoryBreakdown = useMemo(() => {
    const categories = {};
    tripMetrics.forEach(({ analytics }) => {
      (analytics?.expenseBreakdown || []).forEach(item => {
        const amount = item._sum?.amount || 0;
        categories[item.category] = (categories[item.category] || 0) + amount;
      });
    });
    return Object.entries(categories)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [tripMetrics]);

  const maxSpent = Math.max(...tripMetrics.map(item => item.analytics?.budgetUsed || item.trip.totalExpense || 0), 1);
  const maxActivities = Math.max(...tripMetrics.map(item => item.analytics?.activityCount || 0), 1);
  const maxCategory = Math.max(...categoryBreakdown.map(item => item.amount), 1);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-secondary-bg">Analytics</h1>
        <p className="text-neutral-text text-sm">Track travel trends and spend insights.</p>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="w-8 h-8 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard label="Total Trips" value={dashboard?.trips?.total || trips.length} detail={`${dashboard?.trips?.completed || statusCounts.COMPLETED || 0} completed`} />
            <MetricCard label="Total Spent" value={formatMoney(totals.spent || dashboard?.spending)} detail={`${percent(totals.spent, totals.budget)}% of planned budget`} />
            <MetricCard label="Total Budget" value={formatMoney(totals.budget)} detail={`${formatMoney(Math.max(totals.budget - totals.spent, 0))} remaining`} />
            <MetricCard label="Activities" value={totals.activities || dashboard?.activities || 0} detail={`${totals.sections} itinerary sections`} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#0A1622] border border-white/5 rounded-[20px] p-6 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-heading font-bold text-secondary-bg">Trip Spend Overview</h2>
                  <p className="text-xs text-neutral-text">Every trip compared by actual spend.</p>
                </div>
                <Badge tone="blue">{tripMetrics.length} trips</Badge>
              </div>

              <div className="space-y-5">
                {tripMetrics.length === 0 ? (
                  <div className="text-sm text-neutral-text">No trips available for analytics.</div>
                ) : (
                  tripMetrics.map(({ trip, analytics }) => {
                    const spent = analytics?.budgetUsed || trip.totalExpense || 0;
                    const budget = analytics?.estimatedBudget || trip.estimatedBudget || 0;
                    return (
                      <div key={trip.id} className="space-y-2">
                        <BarRow
                          label={trip.title}
                          value={spent}
                          max={maxSpent}
                          tone={spent > budget && budget > 0 ? 'orange' : 'blue'}
                          meta={`${formatMoney(spent)} spent`}
                        />
                        <div className="flex items-center justify-between text-[11px] text-neutral-text">
                          <span>{trip.status || 'PLANNING'}</span>
                          <span>Budget {formatMoney(budget)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-6 space-y-5">
              <div>
                <h2 className="text-lg font-heading font-bold text-secondary-bg">Trip Status</h2>
                <p className="text-xs text-neutral-text">Planning progress across all trips.</p>
              </div>
              {['PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map(status => (
                <BarRow
                  key={status}
                  label={status.charAt(0) + status.slice(1).toLowerCase()}
                  value={statusCounts[status] || 0}
                  max={Math.max(trips.length, 1)}
                  tone={status === 'COMPLETED' ? 'mint' : status === 'ACTIVE' ? 'blue' : 'orange'}
                  meta={`${statusCounts[status] || 0}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-6 space-y-5">
              <div>
                <h2 className="text-lg font-heading font-bold text-secondary-bg">Activities By Trip</h2>
                <p className="text-xs text-neutral-text">Experience density per itinerary.</p>
              </div>
              {tripMetrics.map(({ trip, analytics }) => (
                <BarRow
                  key={trip.id}
                  label={trip.title}
                  value={analytics?.activityCount || 0}
                  max={maxActivities}
                  tone="mint"
                  meta={`${analytics?.activityCount || 0} activities`}
                />
              ))}
            </div>

            <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-6 space-y-5">
              <div>
                <h2 className="text-lg font-heading font-bold text-secondary-bg">Expense Categories</h2>
                <p className="text-xs text-neutral-text">Aggregated from all selected trip expenses.</p>
              </div>
              {categoryBreakdown.length === 0 ? (
                <div className="text-sm text-neutral-text">No expense categories recorded yet.</div>
              ) : (
                categoryBreakdown.map(item => (
                  <BarRow
                    key={item.category}
                    label={item.category.charAt(0) + item.category.slice(1).toLowerCase()}
                    value={item.amount}
                    max={maxCategory}
                    tone="orange"
                    meta={formatMoney(item.amount)}
                  />
                ))
              )}
            </div>
          </div>
        </>
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
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard label="Budget Used" value={formatMoney(tripAnalytics.budgetUsed)} detail={selectedTrip?.title} />
              <MetricCard label="Estimated Budget" value={formatMoney(tripAnalytics.estimatedBudget)} detail={`${percent(tripAnalytics.budgetUsed, tripAnalytics.estimatedBudget)}% used`} />
              <MetricCard label="Activities" value={tripAnalytics.activityCount || 0} detail="planned experiences" />
              <MetricCard label="Sections" value={tripAnalytics.sectionCount || 0} detail="cities or days" />
            </div>

            <div className="space-y-3">
              <BarRow
                label="Budget utilization"
                value={tripAnalytics.budgetUsed || 0}
                max={tripAnalytics.estimatedBudget || tripAnalytics.budgetUsed || 1}
                tone={Number(tripAnalytics.budgetUsed || 0) > Number(tripAnalytics.estimatedBudget || 0) ? 'orange' : 'mint'}
                meta={`${percent(tripAnalytics.budgetUsed, tripAnalytics.estimatedBudget)}%`}
              />
              {(tripAnalytics.expenseBreakdown || []).map(item => (
                <BarRow
                  key={item.category}
                  label={item.category.charAt(0) + item.category.slice(1).toLowerCase()}
                  value={item._sum?.amount || 0}
                  max={Math.max(...(tripAnalytics.expenseBreakdown || []).map(row => row._sum?.amount || 0), 1)}
                  tone="blue"
                  meta={formatMoney(item._sum?.amount || 0)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-neutral-text">Select a trip to view analytics.</div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
