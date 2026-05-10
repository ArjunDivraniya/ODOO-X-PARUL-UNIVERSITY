import React, { useEffect, useMemo, useState } from 'react';
import { LuPlus, LuSquareCheck } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { getPackingList, togglePackingItem, deletePackingItem } from '../../../api/tripTabs';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { Badge } from '../../../components/ui/Badge';
import AddPackingItemModal from '../../../components/dashboard/trip/AddPackingItemModal';

const PackingTab = ({ tripId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const normalizeItems = (rawItems = []) => {
    if (!Array.isArray(rawItems)) return [];
    if (rawItems.length > 0 && Array.isArray(rawItems[0]?.list)) {
      return rawItems.flatMap(group =>
        group.list.map(item => ({
          ...item,
          category: item.category || group.category
        }))
      );
    }
    return rawItems;
  };

  const grouped = useMemo(() => {
    return items.reduce((acc, item) => {
      const key = item.category || 'Uncategorized';
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [items]);

  const progress = useMemo(() => {
    if (items.length === 0) return 0;
    const packed = items.filter(item => item.isPacked).length;
    return Math.round((packed / items.length) * 100);
  }, [items]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPackingList(tripId);
        setItems(normalizeItems(res.data.data.items));
      } catch (err) {
        toast.error('Failed to load packing list');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tripId]);

  const handleToggle = async (itemId) => {
    try {
      const res = await togglePackingItem(itemId);
      const updated = res.data.data.item;
      const isPacked = res.data.data.isPacked;
      setItems(prev => prev.map(item => {
        if (item.id !== itemId) return item;
        return updated || { ...item, isPacked };
      }));
    } catch (err) {
      toast.error('Failed to update item');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await deletePackingItem(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      toast.error('Failed to delete item');
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-secondary-bg">Packing List</h2>
          <p className="text-neutral-text text-sm">Stay on top of everything you need to bring.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 bg-accent-blue text-[#0A1622] rounded-[14px] font-semibold text-sm hover:bg-[#5bc0ff] transition-colors flex items-center gap-2"
        >
          <LuPlus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-text">
            <LuSquareCheck className="w-4 h-4" />
            {items.filter(item => item.isPacked).length} of {items.length} packed
          </div>
          <span className="text-sm text-secondary-bg font-semibold">{progress}%</span>
        </div>
        <ProgressBar value={progress} max={100} />
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Packing list is empty"
          description="Add your first item and keep things organized."
          actionLabel="Add Item"
          onAction={() => setShowCreate(true)}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, groupItems]) => (
            <div key={category} className="bg-[#0A1622] border border-white/5 rounded-[20px] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-heading font-bold text-secondary-bg">{category}</h3>
                <span className="text-xs text-neutral-text">{groupItems.length} items</span>
              </div>
              <div className="space-y-3">
                {groupItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white/5 rounded-[14px] p-3 border border-white/5">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.isPacked}
                        onChange={() => handleToggle(item.id)}
                        className="w-4 h-4 accent-accent-blue"
                      />
                      <span className={`text-sm ${item.isPacked ? 'line-through text-neutral-text' : 'text-secondary-bg'}`}>
                        {item.title}
                      </span>
                    </label>
                    <div className="flex items-center gap-3">
                      {item.priority && <Badge tone="orange">{item.priority}</Badge>}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs text-red-300 hover:text-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <AddPackingItemModal
          isOpen={showCreate}
          tripId={tripId}
          onClose={() => setShowCreate(false)}
          onCreated={(newItem) => setItems(prev => [newItem, ...prev])}
        />
      )}
    </div>
  );
};

export default PackingTab;
