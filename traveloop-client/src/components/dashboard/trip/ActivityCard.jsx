import React from 'react';
import { LuMapPin, LuClock, LuPencil, LuTrash2 } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { Badge } from '../../ui/Badge';
import { deleteActivity } from '../../../api/tripTabs';

const CATEGORY_TONE = {
  ADVENTURE: 'orange',
  FOOD: 'mint',
  CULTURE: 'blue',
  NIGHTLIFE: 'orange',
  NATURE: 'mint',
  RELAXATION: 'blue'
};

export const ActivityCard = ({ activity, onEdit, onDeleted, onUpdated }) => {
  const handleDelete = async () => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await deleteActivity(activity.id);
      onDeleted();
      toast.success('Activity deleted');
    } catch (err) {
      toast.error('Failed to delete activity');
    }
  };

  return (
    <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Badge tone={CATEGORY_TONE[activity.category] || 'gray'}>{activity.category}</Badge>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="p-2 bg-white/5 rounded-[12px] text-neutral-text hover:text-white">
            <LuPencil className="w-4 h-4" />
          </button>
          <button onClick={handleDelete} className="p-2 bg-red-500/20 rounded-[12px] text-red-300 hover:text-red-200">
            <LuTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-heading font-bold text-secondary-bg">{activity.title}</h4>
        {activity.description && <p className="text-sm text-neutral-text mt-1">{activity.description}</p>}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-neutral-text">
        {activity.location && (
          <div className="flex items-center gap-2">
            <LuMapPin className="w-3 h-3" /> {activity.location}
          </div>
        )}
        {(activity.startTime || activity.endTime) && (
          <div className="flex items-center gap-2">
            <LuClock className="w-3 h-3" /> {activity.startTime || '—'} - {activity.endTime || '—'}
          </div>
        )}
        {activity.price && <div>Price: ${activity.price}</div>}
      </div>
    </div>
  );
};
