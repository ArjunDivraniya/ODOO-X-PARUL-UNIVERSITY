import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuUser, LuMail, LuLock, LuPhone, LuMapPin, LuGlobe, LuCamera, LuArrowRight, LuEye, LuEyeOff } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '',
    city: '', country: '', additionalInfo: '', password: '', confirmPassword: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords don't match!");
    }
    
    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'confirmPassword') data.append(key, formData[key]);
      });
      if (profilePhoto) {
        data.append('profilePhoto', profilePhoto);
      }

      await register(data);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="Join TripLoop." 
      subtitle="Start planning your dream vacations seamlessly."
    >
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold mb-2 text-secondary-bg tracking-tight">Create Account</h2>
        <p className="text-neutral-text">Join the next generation of travel</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Photo Upload */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full border border-dashed border-white/20 hover:border-accent-blue flex flex-col items-center justify-center cursor-pointer overflow-hidden group transition-all bg-white/5"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <LuCamera className="w-6 h-6 text-gray-500 group-hover:text-accent-blue transition-colors" />
                  <span className="text-[10px] font-medium text-gray-500 group-hover:text-accent-blue mt-1 uppercase tracking-wider">Upload</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" icon={LuUser} value={formData.firstName} onChange={handleChange} required placeholder="Jane" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" icon={LuUser} value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" name="email" icon={LuMail} value={formData.email} onChange={handleChange} required placeholder="jane@example.com" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" type="tel" name="phoneNumber" icon={LuPhone} value={formData.phoneNumber} onChange={handleChange} placeholder="+1 234 567 8900" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" icon={LuMapPin} value={formData.city} onChange={handleChange} placeholder="New York" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" icon={LuGlobe} value={formData.country} onChange={handleChange} placeholder="USA" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalInfo">Travel Bio</Label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            className="flex w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-secondary-bg shadow-sm transition-all placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue resize-none h-24 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Tell us about your travel preferences..."
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                icon={LuLock}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                icon={LuLock}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <LuEyeOff className="h-5 w-5" /> : <LuEye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-8 group"
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-primary-bg/20 border-t-primary-bg rounded-full animate-spin"></span>
          ) : (
            <>
              Create Account
              <LuArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-neutral-text">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary-bg font-medium hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
