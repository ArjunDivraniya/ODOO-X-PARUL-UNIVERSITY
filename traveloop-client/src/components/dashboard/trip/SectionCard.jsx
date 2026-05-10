import React, { useState } from 'react';
import { LuCalendar, LuMapPin, LuPencil, LuTrash2, LuBus } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { deleteTripSection } from '../../../api/tripTabs';

export const SectionCard = ({ section, onEdit, onDeleted, onUpdated }) => {
  const [expanded, setExpanded] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this section?')) return;
    try {
      await deleteTripSection(section.id);
      onDeleted();
      toast.success('Section deleted');
    } catch (err) {
      toast.error('Failed to delete section');
    }
  };

  return (
    <div className="flex-1 bg-[#0A1622] border border-white/5 rounded-[20px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-heading font-bold text-secondary-bg">{section.title}</h4>
          {section.city && (
            <div className="flex items-center gap-2 text-xs text-neutral-text mt-1">
              <LuMapPin className="w-3 h-3" /> {section.city.name}, {section.city.country}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="p-2 bg-white/5 rounded-[12px] text-neutral-text hover:text-white">
            <LuPencil className="w-4 h-4" />
          </button>
          <button onClick={handleDelete} className="p-2 bg-red-500/20 rounded-[12px] text-red-300 hover:text-red-200">
            <LuTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-text mt-3">
        <div className="flex items-center gap-2">
          <LuCalendar className="w-3 h-3" />
          {section.startDate ? format(new Date(section.startDate), 'MMM dd') : '—'}
          {section.endDate ? ` – ${format(new Date(section.endDate), 'MMM dd')}` : ''}
        </div>
        {section.transportType && (
          <div className="flex items-center gap-2">
            <LuBus className="w-3 h-3" /> {section.transportType}
          </div>
        )}
        {section.estimatedBudget && (
          <div>Budget: {section.estimatedBudget}</div>
        )}
      </div>

      {section.description && (
        <p className="text-sm text-neutral-text mt-4">{section.description}</p>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-accent-blue mt-4"
      >
        {expanded ? 'Hide details' : 'View details'}
      </button>
      {expanded && (
        <div className="mt-3 text-xs text-neutral-text space-y-1">
          <div>Section Order: {section.sectionOrder ?? '—'}</div>
          <div>City Id: {section.cityId || '—'}</div>
        </div>
      )}
    </div>
  );
};
