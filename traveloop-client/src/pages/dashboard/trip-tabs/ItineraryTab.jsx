import React, { useEffect, useMemo, useState } from 'react';
import { LuPlus, LuMoveUp, LuMoveDown } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { getTripSections, updateTripSection } from '../../../api/tripTabs';
import { EmptyState } from '../../../components/ui/EmptyState';
import { SectionCard } from '../../../components/dashboard/trip/SectionCard';
import CreateSectionModal from '../../../components/dashboard/trip/CreateSectionModal';
import EditSectionModal from '../../../components/dashboard/trip/EditSectionModal';

const ItineraryTab = ({ tripId }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const orderedSections = useMemo(() => {
    return [...sections].sort((a, b) => (a.sectionOrder || 0) - (b.sectionOrder || 0));
  }, [sections]);

  const fetchSections = async () => {
    try {
      const res = await getTripSections(tripId);
      setSections(res.data.data.sections || []);
    } catch (err) {
      toast.error('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [tripId]);

  const handleReorder = async (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= orderedSections.length) return;

    const reordered = [...orderedSections];
    [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
    const updatedOrder = reordered.map((section, i) => ({
      id: section.id,
      sectionOrder: i
    }));
    const changedSections = updatedOrder.filter((section) => {
      const current = orderedSections.find(item => item.id === section.id);
      return current && (current.sectionOrder || 0) !== section.sectionOrder;
    });

    try {
      await Promise.all(
        changedSections.map(section =>
          updateTripSection(section.id, { sectionOrder: section.sectionOrder })
        )
      );
      setSections(prev => prev.map((section) => {
        const match = updatedOrder.find(item => item.id === section.id);
        return match ? { ...section, sectionOrder: match.sectionOrder } : section;
      }));
    } catch (err) {
      toast.error('Failed to reorder sections');
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-secondary-bg">Itinerary Sections</h2>
          <p className="text-neutral-text text-sm">Plan your trip day-by-day with clear sections.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 bg-accent-blue text-[#0A1622] rounded-[14px] font-semibold text-sm hover:bg-[#5bc0ff] transition-colors flex items-center gap-2"
        >
          <LuPlus className="w-4 h-4" /> Add Section
        </button>
      </div>

      {orderedSections.length === 0 ? (
        <EmptyState
          title="No sections yet"
          description="Create your first section to map out days, cities, and transport."
          actionLabel="Add Section"
          onAction={() => setShowCreate(true)}
        />
      ) : (
        <div className="space-y-4">
          {orderedSections.map((section, index) => (
            <div key={section.id} className="flex gap-3">
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => handleReorder(index, -1)}
                  className="p-2 bg-white/5 rounded-[12px] text-neutral-text hover:text-white"
                >
                  <LuMoveUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleReorder(index, 1)}
                  className="p-2 bg-white/5 rounded-[12px] text-neutral-text hover:text-white"
                >
                  <LuMoveDown className="w-4 h-4" />
                </button>
              </div>
              <SectionCard
                section={section}
                onEdit={() => setEditingSection(section)}
                onDeleted={() => setSections(prev => prev.filter(item => item.id !== section.id))}
                onUpdated={(updated) => setSections(prev => prev.map(item => item.id === updated.id ? updated : item))}
              />
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateSectionModal
          isOpen={showCreate}
          tripId={tripId}
          onClose={() => setShowCreate(false)}
          onCreated={(newSection) => setSections(prev => [...prev, newSection])}
        />
      )}

      {editingSection && (
        <EditSectionModal
          isOpen={!!editingSection}
          section={editingSection}
          onClose={() => setEditingSection(null)}
          onUpdated={(updated) => setSections(prev => prev.map(item => item.id === updated.id ? updated : item))}
        />
      )}
    </div>
  );
};

export default ItineraryTab;
