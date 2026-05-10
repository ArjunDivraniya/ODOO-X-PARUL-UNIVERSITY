import React, { useState } from 'react';
import { LuHeart } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export const CityCard = ({ city, onToggle }) => {
  const [favorited, setFavorited] = useState(city.isFavorited || false);
  const image = city.image || city.heroImage || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop';

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const next = !favorited;
      if (next) {
        const res = await api.post('/favorites', { cityId: city.id });
        onToggle?.(city.id, next, res.data.data.favorite);
      } else if (city.favoriteId) {
        await api.delete(`/favorites/${city.favoriteId}`);
        onToggle?.(city.id, next);
      } else {
        return toast.error('Open Saved Places to remove this favorite');
      }
      setFavorited(next);
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to update favorite');
    }
  };

  return (
    <Link to={`/dashboard/explore/city/${city.id}`} className="group">
      <div className="bg-[#0A1622] border border-white/5 rounded-[20px] overflow-hidden hover:border-white/10 transition-colors">
        <div className="relative h-40 bg-white/5">
          <img
            src={image}
            alt={city.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <button
            onClick={handleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${favorited ? 'bg-red-500 text-white' : 'bg-[#0A1622]/70 text-white'}`}
          >
            <LuHeart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-heading font-bold text-secondary-bg">{city.name}</h3>
          <p className="text-xs text-neutral-text mt-1">{city.country}</p>
          {city.activityCount !== undefined && (
            <p className="text-xs text-neutral-text mt-2">{city.activityCount} activities</p>
          )}
        </div>
      </div>
    </Link>
  );
};
