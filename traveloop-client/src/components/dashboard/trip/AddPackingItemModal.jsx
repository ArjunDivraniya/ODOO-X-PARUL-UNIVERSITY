import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { createPackingItem } from '../../../api/tripTabs';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import { Button } from '../../ui/Button';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

const AddPackingItemModal = ({ isOpen, onClose, tripId, onCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'MEDIUM'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error('Title is required');
    setSubmitting(true);

    try {
      const payload = {
        tripId,
        title: formData.title,
        category: formData.category || undefined,
        priority: formData.priority
      };
      const res = await createPackingItem(payload);
      onCreated(res.data.data.item);
      toast.success('Item added');
      onClose();
    } catch (err) {
      toast.error('Failed to add item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#0A1622] border border-white/10 rounded-[32px] shadow-2xl w-full max-w-lg">
              <div className="flex items-center justify-between p-8 pb-4 border-b border-white/5">
                <h2 className="text-2xl font-heading font-bold text-secondary-bg">Add Item</h2>
                <button onClick={onClose} className="p-2 text-neutral-text hover:text-white rounded-full hover:bg-white/5 transition-colors">
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Item *</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Clothing" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="flex w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-secondary-bg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue appearance-none cursor-pointer"
                    >
                      {PRIORITIES.map(priority => (
                        <option key={priority} value={priority} className="bg-[#0A1622]">{priority}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                  <button type="button" onClick={onClose} className="px-6 py-3 text-neutral-text hover:text-white rounded-[16px] text-sm font-medium transition-colors">Cancel</button>
                  <Button type="submit" disabled={submitting} className="min-w-[160px]">
                    {submitting ? 'Saving...' : 'Add Item'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddPackingItemModal;
