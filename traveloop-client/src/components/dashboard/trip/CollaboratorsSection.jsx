import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../../api/axios';
import { Avatar } from '../../ui/Avatar';

const PERMISSIONS = ['VIEW', 'EDIT', 'ADMIN'];

export const CollaboratorsSection = ({ tripId, collaborators }) => {
  const [items, setItems] = useState(collaborators);
  const [formData, setFormData] = useState({ userId: '', permission: 'VIEW' });
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.userId.trim()) return toast.error('User ID is required');
    setSubmitting(true);

    try {
      const res = await api.post('/collaborators', {
        tripId,
        userId: formData.userId,
        permission: formData.permission
      });
      setItems(prev => [res.data.data.collaborator, ...prev]);
      setFormData({ userId: '', permission: 'VIEW' });
      toast.success('Collaborator added');
    } catch (err) {
      toast.error('Failed to add collaborator');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Remove collaborator?')) return;
    try {
      await api.delete(`/collaborators/${id}`);
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Collaborator removed');
    } catch (err) {
      toast.error('Failed to remove collaborator');
    }
  };

  const handlePermission = async (id, permission) => {
    try {
      const res = await api.patch(`/collaborators/${id}`, { permission });
      setItems(prev => prev.map(item => item.id === id ? res.data.data.collaborator : item));
      toast.success('Permission updated');
    } catch (err) {
      toast.error('Failed to update permission');
    }
  };

  return (
    <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-6">
      <h3 className="text-lg font-heading font-bold text-secondary-bg mb-4">Collaborators</h3>

      {items.length === 0 && (
        <p className="text-sm text-neutral-text mb-4">No collaborators yet.</p>
      )}

      <div className="space-y-3 mb-6">
        {items.map((collab) => (
          <div key={collab.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/5 border border-white/5 rounded-[16px] p-4">
            <div className="flex items-center gap-3">
              <Avatar
                name={collab.user?.firstName || collab.user?.email}
                src={collab.user?.profileImage}
                size={36}
              />
              <div>
                <div className="text-sm text-secondary-bg font-medium">
                  {collab.user?.firstName} {collab.user?.lastName}
                </div>
                <div className="text-xs text-neutral-text">{collab.user?.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={collab.permission}
                onChange={(e) => handlePermission(collab.id, e.target.value)}
                className="flex rounded-[12px] border border-white/10 bg-white/5 px-3 py-2 text-xs text-secondary-bg shadow-sm transition-all focus:outline-none"
              >
                {PERMISSIONS.map(perm => (
                  <option key={perm} value={perm} className="bg-[#0A1622]">{perm}</option>
                ))}
              </select>
              <button onClick={() => handleRemove(collab.id)} className="text-xs text-red-300 hover:text-red-200">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          value={formData.userId}
          onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
          placeholder="User ID"
          className="rounded-[14px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-secondary-bg focus:outline-none"
        />
        <select
          value={formData.permission}
          onChange={(e) => setFormData(prev => ({ ...prev, permission: e.target.value }))}
          className="rounded-[14px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-secondary-bg focus:outline-none"
        >
          {PERMISSIONS.map(perm => (
            <option key={perm} value={perm} className="bg-[#0A1622]">{perm}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-accent-blue text-[#0A1622] rounded-[14px] font-semibold text-sm hover:bg-[#5bc0ff] transition-colors"
        >
          {submitting ? 'Adding...' : 'Add Collaborator'}
        </button>
      </form>
    </div>
  );
};
