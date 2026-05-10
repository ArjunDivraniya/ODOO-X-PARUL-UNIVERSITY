import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAdminTrips } from '../../api/admin';

const AdminTrips = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminTrips();
        setTrips(res.data.data.trips || []);
      } catch {
        toast.error('Failed to load trips');
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold">Trips</h1>
      <div className="bg-white/5 border border-white/10 rounded-[16px] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-neutral-text">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Owner</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {trips.map(trip => (
              <tr key={trip.id} className="border-t border-white/10">
                <td className="p-3">{trip.title}</td>
                <td className="p-3">{trip.owner?.email}</td>
                <td className="p-3">{trip.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTrips;
