import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuMail, LuLock, LuEye, LuEyeOff, LuArrowRight } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error('Please fill in all fields');
    }
    
    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Your next great adventure is just a login away."
    >
      <div className="mb-10">
        <h2 className="text-3xl font-heading font-bold mb-2 text-secondary-bg tracking-tight">Sign In</h2>
        <p className="text-neutral-text">Enter your details to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            name="email"
            icon={LuMail}
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm font-medium text-accent-blue hover:text-[#5bc0ff] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              icon={LuLock}
              value={formData.password}
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
              Sign In
              <LuArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-neutral-text">
          Don't have an account?{' '}
          <Link to="/register" className="text-secondary-bg font-medium hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
