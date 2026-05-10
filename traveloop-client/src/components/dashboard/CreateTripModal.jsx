import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX, LuImage, LuLoader } from 'react-icons/lu';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Button } from '../../components/ui/Button';

const TRIP_TYPES = ['LEISURE', 'BUSINESS', 'BACKPACKING', 'FAMILY', 'COUPLE', 'SOLO', 'OTHER'];
const VISIBILITY_OPTIONS = ['PRIVATE', 'PUBLIC', 'FRIENDS'];

const CreateTripModal = ({ isOpen, onClose, onTripCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tripType: 'LEISURE',
    startDate: '',
    endDate: '',
    estimatedBudget: '',
    currency: 'USD',
    travelersCount: 1,
    visibility: 'PRIVATE'
  });
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || formData.title.length < 3) {
      return toast.error('Title must be at least 3 characters.');
    }
    setIsSubmitting(true);

    try {
      // Build JSON body with proper types (numbers stay numbers)
      const body = { title: formData.title };
      if (formData.description) body.description = formData.description;
      if (formData.tripType) body.tripType = formData.tripType;
      if (formData.startDate) body.startDate = new Date(formData.startDate).toISOString();
      if (formData.endDate) body.endDate = new Date(formData.endDate).toISOString();
      if (formData.estimatedBudget) body.estimatedBudget = parseFloat(formData.estimatedBudget);
      if (formData.currency) body.currency = formData.currency;
      if (formData.travelersCount) body.travelersCount = parseInt(formData.travelersCount);
      if (formData.visibility) body.visibility = formData.visibility;

      // Step 1: Create trip with JSON
      const res = await api.post('/trips', body);
      let trip = res.data.data.trip;

      // Step 2: Upload cover image separately if present
      if (coverImage && trip.id) {
        const imgData = new FormData();
        imgData.append('coverImage', coverImage);
        const imgRes = await api.patch(`/trips/${trip.id}`, imgData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        trip = imgRes.data.data.trip;
      }

      toast.success('Trip created successfully!');
      onTripCreated(trip);
      onClose();

      // Reset form
      setFormData({ title: '', description: '', tripType: 'LEISURE', startDate: '', endDate: '', estimatedBudget: '', currency: 'USD', travelersCount: 1, visibility: 'PRIVATE' });
      setCoverImage(null);
      setCoverPreview(null);
    } catch (err) {
      const errorData = err.response?.data?.error;
      const msg = Array.isArray(errorData) ? errorData[0] : (typeof errorData === 'string' ? errorData : 'Failed to create trip');
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#0A1622] border border-white/10 rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-8 pb-4 border-b border-white/5">
                <h2 className="text-2xl font-heading font-bold text-secondary-bg">Create New Trip</h2>
                <button onClick={onClose} className="p-2 text-neutral-text hover:text-white rounded-full hover:bg-white/5 transition-colors">
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Cover Image */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-40 rounded-[16px] border border-dashed border-white/20 hover:border-accent-blue bg-white/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden group relative"
                >
                  {coverPreview ? (
                    <>
                      <img src={coverPreview} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-[#0A1622]/80 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                          <LuImage className="w-4 h-4" /> Change Cover
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-neutral-text group-hover:text-accent-blue transition-colors">
                      <LuImage className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm font-medium">Upload cover image (optional)</span>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Trip Title *</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Bali Backpacking 2026" required />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="flex w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-secondary-bg shadow-sm transition-all placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue resize-none h-24"
                    placeholder="A quick overview of your trip..."
                  />
                </div>

                {/* Row: Type + Visibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tripType">Trip Type</Label>
                    <select id="tripType" name="tripType" value={formData.tripType} onChange={handleChange}
                      className="flex w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-secondary-bg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue appearance-none cursor-pointer">
                      {TRIP_TYPES.map(t => <option key={t} value={t} className="bg-[#0A1622]">{t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <select id="visibility" name="visibility" value={formData.visibility} onChange={handleChange}
                      className="flex w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-secondary-bg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue appearance-none cursor-pointer">
                      {VISIBILITY_OPTIONS.map(v => <option key={v} value={v} className="bg-[#0A1622]">{v.charAt(0) + v.slice(1).toLowerCase()}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row: Start + End dates */}
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

                {/* Row: Budget + Currency + Travelers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedBudget">Budget</Label>
                    <Input id="estimatedBudget" name="estimatedBudget" type="number" value={formData.estimatedBudget} onChange={handleChange} placeholder="5000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input id="currency" name="currency" value={formData.currency} onChange={handleChange} placeholder="USD" maxLength={3} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelersCount">Travelers</Label>
                    <Input id="travelersCount" name="travelersCount" type="number" min="1" value={formData.travelersCount} onChange={handleChange} />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4 flex justify-end gap-4">
                  <button type="button" onClick={onClose} className="px-6 py-3 text-neutral-text hover:text-white rounded-[16px] text-sm font-medium transition-colors">
                    Cancel
                  </button>
                  <Button type="submit" disabled={isSubmitting} className="min-w-[160px]">
                    {isSubmitting ? <LuLoader className="w-5 h-5 animate-spin mx-auto" /> : 'Create Trip'}
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

export default CreateTripModal;
