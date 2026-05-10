import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAdminUsers, blockAdminUser, deleteAdminUser } from '../../api/admin';
import { AuthContext } from '../../context/AuthContext';

const AdminUsers = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminUsers();
        setUsers(res.data.data.users || []);
      } catch {
        toast.error('Failed to load users');
      }
    };
    load();
  }, []);

  const handleBlockToggle = async (userId, isBlocked) => {
    try {
      await blockAdminUser(userId, !isBlocked);
      setUsers(prev => prev.map(item => item.id === userId ? { ...item, isBlocked: !isBlocked } : item));
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteAdminUser(userId);
      setUsers(prev => prev.filter(item => item.id !== userId));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold">Users</h1>
      <div className="bg-white/5 border border-white/10 rounded-[16px] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-neutral-text">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-white/10">
                <td className="p-3">{user.firstName} {user.lastName}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.isBlocked ? 'Blocked' : 'Active'}</td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleBlockToggle(user.id, user.isBlocked)}
                      className="text-xs text-accent-blue"
                      disabled={user.id === currentUser?.id}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-xs text-red-300"
                      disabled={user.id === currentUser?.id}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
