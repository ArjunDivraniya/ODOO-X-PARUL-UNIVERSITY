import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../api/notifications';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getNotifications();
        setItems(res.data.data.notifications || []);
      } catch (err) {
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      setItems(prev => prev.map(item => item.id === notificationId ? { ...item, read: true } : item));
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems(prev => prev.map(item => ({ ...item, read: true })));
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-secondary-bg">Notifications</h1>
          <p className="text-neutral-text text-sm">Stay updated with your travel activity.</p>
        </div>
        <button
          onClick={handleReadAll}
          className="px-4 py-2 bg-accent-blue text-[#0A1622] rounded-[12px] text-xs font-semibold"
        >
          Mark all read
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-neutral-text">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-neutral-text">No notifications yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => handleRead(item.id)}
              className={`p-4 rounded-[16px] border ${item.read ? 'bg-white/5 border-white/10' : 'bg-accent-blue/10 border-accent-blue/30'} cursor-pointer`}
            >
              <div className="text-sm text-secondary-bg font-semibold">{item.title || 'Notification'}</div>
              <div className="text-xs text-neutral-text mt-1">{item.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
