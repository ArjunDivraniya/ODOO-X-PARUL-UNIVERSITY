import React, { useState } from 'react';
import { LuHeart } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export const CityCard = ({ city, onToggle }) => {
  const [favorited, setFavorited] = useState(city.isFavorited || false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.post(`/favorites/${city.id}`);
      const next = !favorited;
      setFavorited(next);
      onToggle?.(city.id, next);
    } catch (err) {
      toast.error('Failed to update favorite');
    }
  };

  return (
    <Link to={`/dashboard/explore/city/${city.id}`} className="group">
      <div className="bg-[#0A1622] border border-white/5 rounded-[20px] overflow-hidden hover:border-white/10 transition-colors">
        <div className="relative h-40 bg-white/5">
          <img
            src={city.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop'}
            alt={city.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <button
            onClick={handleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full ${favorited ? 'bg-accent-orange text-[#0A1622]' : 'bg-[#0A1622]/70 text-white'}`}
          >
            <LuHeart className="w-4 h-4" />
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
