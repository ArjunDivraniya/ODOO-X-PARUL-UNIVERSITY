import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Globe, Camera, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';

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
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ label, icon: Icon, type = "text", ...props }) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-300 ml-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-gray-500" />
        </div>
        <input
          type={type}
          className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-500 text-sm"
          {...props}
        />
      </div>
    </div>
  );

  return (
    <AuthLayout 
      title="Join Traveloop" 
      subtitle="Start planning your dream vacations with AI."
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold mb-1">Create Account</h2>
        <p className="text-gray-400 text-sm">Join the next generation of travel</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Photo Upload */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-full border-2 border-dashed border-gray-500 hover:border-blue-400 flex flex-col items-center justify-center cursor-pointer overflow-hidden group transition-colors bg-white/5"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  <span className="text-[10px] text-gray-400 group-hover:text-blue-400 mt-1">Upload</span>
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
          <InputField label="First Name" icon={User} name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" />
          <InputField label="Last Name" icon={User} name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
        </div>

        <InputField label="Email Address" icon={Mail} type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
        <InputField label="Phone Number" icon={Phone} type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+1 234 567 8900" />

        <div className="grid grid-cols-2 gap-4">
          <InputField label="City" icon={MapPin} name="city" value={formData.city} onChange={handleChange} placeholder="New York" />
          <InputField label="Country" icon={Globe} name="country" value={formData.country} onChange={handleChange} placeholder="USA" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300 ml-1">Additional Info</label>
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-500 text-sm resize-none h-20"
            placeholder="Tell us about your travel preferences..."
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-500 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300 ml-1">Confirm</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-500 text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed text-sm"
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          ) : (
            <>
              Create Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-medium hover:text-blue-300 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
