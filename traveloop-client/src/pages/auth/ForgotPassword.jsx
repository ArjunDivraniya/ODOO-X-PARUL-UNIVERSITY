import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuMail, LuArrowRight, LuArrowLeft } from 'react-icons/lu';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AuthLayout from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error('Please enter your email address');
    }
    
    setIsSubmitting(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setIsSent(true);
      toast.success('Password reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reset link');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Don't worry, we'll help you get back to planning your trips."
    >
      <div className="mb-10">
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-neutral-text hover:text-secondary-bg transition-colors mb-6 group">
          <LuArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to login
        </Link>
        <h2 className="text-3xl font-heading font-bold mb-2 text-secondary-bg tracking-tight">Forgot Password</h2>
        <p className="text-neutral-text">
          {isSent 
            ? "We've sent a password reset link to your email." 
            : "Enter your email address and we'll send you a link to reset your password."}
        </p>
      </div>

      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              icon={LuMail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
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
                Send Reset Link
                <LuArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>
      ) : (
        <div className="p-6 rounded-[24px] bg-white/5 border border-white/10 text-center">
          <div className="w-16 h-16 rounded-full bg-accent-mint/20 text-accent-mint flex items-center justify-center mx-auto mb-4">
            <LuMail className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-heading font-bold mb-2 text-secondary-bg">Check your inbox</h3>
          <p className="text-neutral-text text-sm mb-6">
            Click the link we sent to <strong>{email}</strong> to reset your password.
          </p>
          <Button
            variant="outline"
            onClick={() => setIsSent(false)}
            className="w-full"
          >
            Try another email
          </Button>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
