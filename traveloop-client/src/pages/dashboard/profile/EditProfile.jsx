import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { LuCamera, LuSave, LuLoader } from 'react-icons/lu';
import api from '../../../api/axios';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Button } from '../../../components/ui/Button';

const EditProfile = ({ profile, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    phoneNumber: profile?.phoneNumber || '',
    city: profile?.city || '',
    country: profile?.country || ''
  });
  
  const [images, setImages] = useState({ profileImage: null, coverImage: null });
  const [previews, setPreviews] = useState({ 
    profileImage: profile?.profileImage || null, 
    coverImage: profile?.coverImage || null 
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setImages({ ...images, [type]: file });
      setPreviews({ ...previews, [type]: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      if (images.profileImage) data.append('profileImage', images.profileImage);
      if (images.coverImage) data.append('coverImage', images.coverImage);

      const res = await api.patch('/users/profile', data);
      toast.success('Profile updated successfully!');
      
      if (onProfileUpdate) onProfileUpdate(res.data.data.user);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-8 shadow-lg">
      <h3 className="text-xl font-heading font-bold text-secondary-bg mb-6">Edit Profile</h3>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Cover Image Upload */}
        <div className="space-y-3">
          <Label>Cover Image</Label>
          <div 
            onClick={() => coverInputRef.current?.click()}
            className="w-full h-32 md:h-48 rounded-[16px] border border-dashed border-white/20 hover:border-accent-blue bg-white/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden group relative"
          >
            {previews.coverImage ? (
              <>
                <img src={previews.coverImage} alt="Cover Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-[#0A1622]/80 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <LuCamera className="w-4 h-4" /> Change Cover
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center text-neutral-text group-hover:text-accent-blue transition-colors">
                <LuCamera className="w-8 h-8 mx-auto mb-2" />
                <span className="text-sm font-medium">Click to upload cover image</span>
              </div>
            )}
            <input type="file" ref={coverInputRef} onChange={(e) => handleImageChange(e, 'coverImage')} accept="image/*" className="hidden" />
          </div>
        </div>

        {/* Profile Image Upload */}
        <div className="space-y-3">
          <Label>Profile Picture</Label>
          <div className="flex items-center gap-6">
            <div 
              onClick={() => profileInputRef.current?.click()}
              className="w-24 h-24 rounded-full border border-dashed border-white/20 hover:border-accent-blue bg-white/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden group relative flex-shrink-0"
            >
              {previews.profileImage ? (
                <>
                  <img src={previews.profileImage} alt="Profile Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <LuCamera className="w-6 h-6 text-white" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full h-full bg-gradient-to-br from-accent-blue/20 to-accent-mint/20 text-accent-blue flex items-center justify-center text-4xl font-heading font-bold opacity-100 group-hover:opacity-60 transition-opacity">
                    {profile?.firstName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <LuCamera className="w-6 h-6 text-white" />
                  </div>
                </>
              )}
              <input type="file" ref={profileInputRef} onChange={(e) => handleImageChange(e, 'profileImage')} accept="image/*" className="hidden" />
            </div>
            <p className="text-sm text-neutral-text max-w-xs">
              Upload a clear picture of yourself so friends and collaborators can recognize you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Jane" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe123" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+1 234 567 890" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="New York" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" value={formData.country} onChange={handleChange} placeholder="USA" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="flex w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-secondary-bg shadow-sm transition-all placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue resize-none h-32"
            placeholder="Tell us about your travel style..."
          ></textarea>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
            {isSubmitting ? <LuLoader className="w-5 h-5 animate-spin mx-auto" /> : (
              <>
                <LuSave className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
