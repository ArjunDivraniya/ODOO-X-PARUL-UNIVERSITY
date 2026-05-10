import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAdminUsers } from '../../api/admin';

const AdminUsers = () => {
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
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-white/10">
                <td className="p-3">{user.firstName} {user.lastName}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
