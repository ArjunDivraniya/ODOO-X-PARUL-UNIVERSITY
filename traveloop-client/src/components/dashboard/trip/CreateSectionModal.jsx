import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { createTripSection } from '../../../api/tripTabs';
import { getCities } from '../../../api/explore';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import { Button } from '../../ui/Button';

const TRANSPORT_TYPES = ['FLIGHT', 'TRAIN', 'BUS', 'CAR', 'FERRY', 'WALK'];

const CreateSectionModal = ({ isOpen, onClose, tripId, onCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cityId: '',
    startDate: '',
    endDate: '',
    transportType: '',
    estimatedBudget: ''
  });
  const [cities, setCities] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await getCities();
        setCities(res.data.data.cities || []);
      } catch {
        setCities([]);
      }
    };
    if (isOpen) loadCities();
  }, [isOpen]);

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
        description: formData.description || undefined,
        cityId: formData.cityId || undefined,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        transportType: formData.transportType || undefined,
        estimatedBudget: formData.estimatedBudget ? Number(formData.estimatedBudget) : undefined
      };
      const res = await createTripSection(payload);
      onCreated(res.data.data.section);
      toast.success('Section created');
      onClose();
    } catch (err) {
      toast.error('Failed to create section');
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
                <h2 className="text-2xl font-heading font-bold text-secondary-bg">Add Section</h2>
                <button onClick={onClose} className="p-2 text-neutral-text hover:text-white rounded-full hover:bg-white/5 transition-colors">
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Day 1: Arrival" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="flex w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-secondary-bg shadow-sm transition-all placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue resize-none h-24"
                    placeholder="Section details..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cityId">City</Label>
                    <select
                      id="cityId"
                      name="cityId"
                      value={formData.cityId}
                      onChange={handleChange}
                      className="flex w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-secondary-bg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#0A1622]">Select city</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id} className="bg-[#0A1622]">{city.name}, {city.country}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transportType">Transport</Label>
                    <select
                      id="transportType"
                      name="transportType"
                      value={formData.transportType}
                      onChange={handleChange}
                      className="flex w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-secondary-bg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#0A1622]">Select transport</option>
                      {TRANSPORT_TYPES.map(type => (
                        <option key={type} value={type} className="bg-[#0A1622]">{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedBudget">Estimated Budget</Label>
                  <Input id="estimatedBudget" name="estimatedBudget" type="number" value={formData.estimatedBudget} onChange={handleChange} placeholder="500" />
                </div>

                <div className="pt-4 flex justify-end gap-4">
                  <button type="button" onClick={onClose} className="px-6 py-3 text-neutral-text hover:text-white rounded-[16px] text-sm font-medium transition-colors">Cancel</button>
                  <Button type="submit" disabled={submitting} className="min-w-[160px]">
                    {submitting ? 'Saving...' : 'Create Section'}
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

export default CreateSectionModal;
