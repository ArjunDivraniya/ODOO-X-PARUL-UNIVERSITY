import React from 'react';
import { LuCalendar, LuDollarSign, LuMapPin, LuUsers, LuCheck } from 'react-icons/lu';
import { format } from 'date-fns';
import { CollaboratorsSection } from '../../../components/dashboard/trip/CollaboratorsSection';

const STATUS_FLOW = ['PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED'];

const OverviewTab = ({ trip, overview, onStatusChange }) => {
  return (
    <div className="space-y-8">
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
              onClick={() => onStatusChange(status)}
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

      {/* Itinerary Preview */}
      {trip.itinerarySections && trip.itinerarySections.length > 0 && (
        <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-6">
          <h3 className="text-lg font-heading font-bold text-secondary-bg mb-4">Itinerary Preview</h3>
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
      <CollaboratorsSection tripId={trip.id} collaborators={trip.collaborators || []} />
    </div>
  );
};

export default OverviewTab;
