import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LuLock, LuLoader } from 'react-icons/lu';
import api from '../../../api/axios';
import { AuthContext } from '../../../context/AuthContext';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';

const AccountSettings = () => {
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!password) {
      return toast.error('Password is required to delete your account.');
    }

    // Double confirmation
    const confirmDelete = window.confirm("Are you absolutely sure? This action cannot be undone.");
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await api.delete('/users/profile', { data: { password } });
      toast.success('Account deleted successfully.');
      logout();
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-red-500/10 border border-red-500/20 rounded-[24px] p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
            <LuLock className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-heading font-bold text-red-400">Danger Zone</h3>
        </div>
        
        <p className="text-neutral-text text-sm mb-6 max-w-2xl">
          Deleting your account is permanent. All your itineraries, travel history, and personal data will be wiped from our servers immediately.
        </p>

        <form onSubmit={handleDeleteAccount} className="max-w-md bg-[#0A1622] border border-red-500/10 rounded-[16px] p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="delete-password" className="text-red-400">Confirm Password to Delete</Label>
              <Input
                id="delete-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="focus:ring-red-500/50 focus:border-red-500 mt-2"
              />
            </div>
            
            <button
              type="submit"
              disabled={isDeleting || !password}
              className="w-full px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 font-semibold rounded-[12px] transition-colors border border-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isDeleting ? <LuLoader className="w-5 h-5 animate-spin" /> : 'Permanently Delete Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
