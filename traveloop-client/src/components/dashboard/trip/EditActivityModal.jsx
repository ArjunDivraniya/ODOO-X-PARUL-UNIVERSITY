import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { updateActivity } from '../../../api/tripTabs';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import { Button } from '../../ui/Button';

const CATEGORIES = ['ADVENTURE', 'FOOD', 'CULTURE', 'NIGHTLIFE', 'NATURE', 'RELAXATION'];

const buildIsoTime = (time, fallbackDate) => {
  if (!time) return undefined;
  if (time.includes('T')) return new Date(time).toISOString();

  const date = fallbackDate ? new Date(fallbackDate) : new Date();
  const [hours, minutes] = time.split(':');
  date.setHours(Number(hours), Number(minutes || 0), 0, 0);
  return date.toISOString();
};

const formatTimeInput = (value) => {
  if (!value) return '';
  if (/^\d{2}:\d{2}/.test(value)) return value.slice(0, 5);

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toTimeString().slice(0, 5);
};

const EditActivityModal = ({ isOpen, onClose, activity, sections, onUpdated }) => {
  const [formData, setFormData] = useState({
    title: activity?.title || '',
    category: activity?.category || 'ADVENTURE',
    activityType: activity?.activityType || '',
    location: activity?.location || '',
    startTime: formatTimeInput(activity?.startTime),
    endTime: formatTimeInput(activity?.endTime),
    duration: activity?.duration || '',
    price: activity?.price || '',
    description: activity?.description || '',
    sectionId: activity?.sectionId || ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const selectedSection = sections.find(section => section.id === formData.sectionId);
      const fallbackDate = selectedSection?.startDate || selectedSection?.endDate || activity?.startTime || activity?.endTime;
      const payload = {
        title: formData.title,
        category: formData.category,
        activityType: formData.activityType || undefined,
        location: formData.location || undefined,
        startTime: buildIsoTime(formData.startTime, fallbackDate),
        endTime: buildIsoTime(formData.endTime, fallbackDate),
        duration: formData.duration ? Number(formData.duration) : undefined,
        price: formData.price ? Number(formData.price) : undefined,
        description: formData.description || undefined,
        sectionId: formData.sectionId || undefined
      };
      const res = await updateActivity(activity.id, payload);
      onUpdated(res.data.data.activity);
      toast.success('Activity updated');
      onClose();
    } catch (err) {
      toast.error('Failed to update activity');
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
            <div className="bg-[#0A1622] border border-white/10 rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-8 pb-4 border-b border-white/5">
                <h2 className="text-2xl font-heading font-bold text-secondary-bg">Edit Activity</h2>
                <button onClick={onClose} className="p-2 text-neutral-text hover:text-white rounded-full hover:bg-white/5 transition-colors">
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="flex w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-secondary-bg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map(category => (
                        <option key={category} value={category} className="bg-[#0A1622]">{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activityType">Activity Type</Label>
                    <Input id="activityType" name="activityType" value={formData.activityType} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={formData.location} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sectionId">Section (Optional)</Label>
                    <select
                      id="sectionId"
                      name="sectionId"
                      value={formData.sectionId}
                      onChange={handleChange}
                      className="flex w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-secondary-bg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#0A1622]">No section</option>
                      {sections.map(section => (
                        <option key={section.id} value={section.id} className="bg-[#0A1622]">{section.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" name="startTime" type="time" value={formData.startTime} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" name="endTime" type="time" value={formData.endTime} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (hrs)</Label>
                    <Input id="duration" name="duration" type="number" value={formData.duration} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Notes</Label>
                    <Input id="description" name="description" value={formData.description} onChange={handleChange} />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                  <button type="button" onClick={onClose} className="px-6 py-3 text-neutral-text hover:text-white rounded-[16px] text-sm font-medium transition-colors">Cancel</button>
                  <Button type="submit" disabled={submitting} className="min-w-[160px]">
                    {submitting ? 'Saving...' : 'Save Changes'}
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

export default EditActivityModal;
