import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { CityCard } from '../../components/explore/CityCard';
import { EmptyState } from '../../components/ui/EmptyState';

const Saved = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/favorites');
        const favorites = res.data.data.favorites || [];
        setCities(favorites.map(favorite => ({
          ...favorite.city,
          image: favorite.city.heroImage,
          favoriteId: favorite.id,
          isFavorited: true
        })));
      } catch (err) {
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-secondary-bg">Saved Places</h1>
        <p className="text-neutral-text text-sm">Your favorited destinations.</p>
      </div>

      {loading ? (
        <div className="text-sm text-neutral-text">Loading...</div>
      ) : cities.length === 0 ? (
        <EmptyState title="No favorites yet" description="Explore cities and save your favorites." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cities.map(city => (
            <CityCard
              key={city.id}
              city={city}
              onToggle={(cityId, favorited) => {
                if (!favorited) {
                  setCities(prev => prev.filter(item => item.id !== cityId));
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
