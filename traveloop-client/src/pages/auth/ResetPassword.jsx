import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuLock, LuEye, LuEyeOff, LuArrowRight } from 'react-icons/lu';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AuthLayout from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword) {
      return toast.error('Please fill in all fields');
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Passwords don't match");
    }
    
    setIsSubmitting(true);
    try {
      await api.post('/auth/reset-password', { 
        token, 
        newPassword: formData.newPassword 
      });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="Secure Your Account" 
      subtitle="Create a new, strong password for your TripLoop account."
    >
      <div className="mb-10">
        <h2 className="text-3xl font-heading font-bold mb-2 text-secondary-bg tracking-tight">Create New Password</h2>
        <p className="text-neutral-text">Please enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              name="newPassword"
              icon={LuLock}
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              icon={LuLock}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-8 group"
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-primary-bg/20 border-t-primary-bg rounded-full animate-spin"></span>
          ) : (
            <>
              Reset Password
              <LuArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
