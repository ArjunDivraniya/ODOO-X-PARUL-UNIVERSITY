import React, { useEffect, useMemo, useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { getActivities, getTripSections } from '../../../api/tripTabs';
import { ActivityCard } from '../../../components/dashboard/trip/ActivityCard';
import { EmptyState } from '../../../components/ui/EmptyState';
import CreateActivityModal from '../../../components/dashboard/trip/CreateActivityModal';
import EditActivityModal from '../../../components/dashboard/trip/EditActivityModal';

const CATEGORIES = ['ALL', 'ADVENTURE', 'FOOD', 'CULTURE', 'NIGHTLIFE', 'NATURE', 'RELAXATION'];

const ActivitiesTab = ({ tripId }) => {
  const [activities, setActivities] = useState([]);
  const [sections, setSections] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'ALL') return activities;
    return activities.filter((activity) => activity.category === filter);
  }, [activities, filter]);

  useEffect(() => {
    const load = async () => {
      try {
        const [activitiesRes, sectionsRes] = await Promise.all([
          getActivities(tripId),
          getTripSections(tripId)
        ]);
        setActivities(activitiesRes.data.data.activities || []);
        setSections(sectionsRes.data.data.sections || []);
      } catch (err) {
        toast.error('Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tripId]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-secondary-bg">Activities</h2>
          <p className="text-neutral-text text-sm">Track every experience and booking.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 bg-accent-blue text-[#0A1622] rounded-[14px] font-semibold text-sm hover:bg-[#5bc0ff] transition-colors flex items-center gap-2"
        >
          <LuPlus className="w-4 h-4" /> Add Activity
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-[12px] text-xs font-medium transition-all ${
              filter === cat
                ? 'bg-accent-blue text-[#0A1622]'
                : 'bg-white/5 text-neutral-text hover:text-white'
            }`}
          >
            {cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No activities yet"
          description="Add your first activity and keep every plan in one place."
          actionLabel="Add Activity"
          onAction={() => setShowCreate(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={() => setEditingActivity(activity)}
              onDeleted={() => setActivities(prev => prev.filter(item => item.id !== activity.id))}
              onUpdated={(updated) => setActivities(prev => prev.map(item => item.id === updated.id ? updated : item))}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateActivityModal
          isOpen={showCreate}
          tripId={tripId}
          sections={sections}
          onClose={() => setShowCreate(false)}
          onCreated={(newActivity) => setActivities(prev => [newActivity, ...prev])}
        />
      )}

      {editingActivity && (
        <EditActivityModal
          isOpen={!!editingActivity}
          activity={editingActivity}
          sections={sections}
          onClose={() => setEditingActivity(null)}
          onUpdated={(updated) => setActivities(prev => prev.map(item => item.id === updated.id ? updated : item))}
        />
      )}
    </div>
  );
};

export default ActivitiesTab;
