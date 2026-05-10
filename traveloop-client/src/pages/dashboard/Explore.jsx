import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LuSearch } from 'react-icons/lu';
import { searchGlobal, getRecommendations } from '../../api/explore';
import api from '../../api/axios';
import { CityCard } from '../../components/explore/CityCard';
import { WeatherWidget } from '../../components/explore/WeatherWidget';
import { EmptyState } from '../../components/ui/EmptyState';

const Explore = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sections, setSections] = useState({ trending: [], budget: [], gems: [], popular: [] });
  const [favoriteMap, setFavoriteMap] = useState({});
  const [loading, setLoading] = useState(true);

  const withFavoriteState = (cities = [], favorites = favoriteMap) => {
    return cities.map(city => {
      const favorite = favorites[city.id];
      return {
        ...city,
        isFavorited: !!favorite,
        favoriteId: favorite?.id
      };
    });
  };

  const handleFavoriteToggle = (cityId, favorited, favorite) => {
    setFavoriteMap(prev => {
      const next = { ...prev };
      if (favorited) {
        next[cityId] = favorite || { cityId };
      } else {
        delete next[cityId];
      }
      return next;
    });
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [trending, budget, gems, popular, favorites] = await Promise.all([
          getRecommendations('trending'),
          getRecommendations('budget-friendly'),
          getRecommendations('hidden-gems'),
          getRecommendations('popular-destinations'),
          api.get('/favorites').catch(() => ({ data: { data: { favorites: [] } } }))
        ]);
        const favoriteLookup = (favorites.data.data.favorites || []).reduce((acc, favorite) => {
          acc[favorite.cityId] = favorite;
          return acc;
        }, {});
        setFavoriteMap(favoriteLookup);
        setSections({
          trending: withFavoriteState(trending.data.data.cities || [], favoriteLookup),
          budget: withFavoriteState(budget.data.data.cities || [], favoriteLookup),
          gems: withFavoriteState(gems.data.data.cities || [], favoriteLookup),
          popular: withFavoriteState(popular.data.data.cities || [], favoriteLookup)
        });
      } catch {
        setSections({ trending: [], budget: [], gems: [], popular: [] });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await searchGlobal(query);
        setSearchResults(res.data.data.results?.cities || []);
      } catch {
        setSearchResults([]);
      }
    };

    const timer = setTimeout(handleSearch, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#0A1622] border border-white/5 rounded-[28px] p-8 space-y-4"
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-secondary-bg">Explore the world</h1>
        <p className="text-neutral-text text-sm">Discover trending destinations, hidden gems, and travel inspiration.</p>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-[16px] px-4 py-3">
          <LuSearch className="w-5 h-5 text-neutral-text" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cities, trips, activities..."
            className="bg-transparent outline-none text-sm text-secondary-bg w-full"
          />
        </div>
        <WeatherWidget city={query} />
      </motion.div>

      {query.trim() && (
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-bold text-secondary-bg">Search Results</h2>
          {searchResults.length === 0 ? (
            <EmptyState title="No results" description="Try another destination or keyword." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {searchResults.map(city => (
                <CityCard key={city.id} city={city} onToggle={handleFavoriteToggle} />
              ))}
            </div>
          )}
        </div>
      )}

      {!query.trim() && (
        <div className="space-y-10">
          {[{ title: 'Trending', data: sections.trending }, { title: 'Budget Friendly', data: sections.budget }, { title: 'Hidden Gems', data: sections.gems }, { title: 'Popular Destinations', data: sections.popular }].map((section) => (
            <div key={section.title} className="space-y-4">
              <h2 className="text-xl font-heading font-bold text-secondary-bg">{section.title}</h2>
              {loading ? (
                <div className="text-sm text-neutral-text">Loading...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {section.data.map(city => (
                    <CityCard key={city.id} city={city} onToggle={handleFavoriteToggle} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
