import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LuSearch } from 'react-icons/lu';
import { searchGlobal, searchCities, searchActivities, searchTrips, searchCommunity } from '../../api/explore';
import { CityCard } from '../../components/explore/CityCard';
import { TripCard } from '../../components/dashboard/TripCard';
import { EmptyState } from '../../components/ui/EmptyState';

const FILTERS = ['All', 'Trips', 'Cities', 'Activities', 'Community'];

const ActivityResultCard = ({ activity }) => (
  <div className="bg-[#0A1622] border border-white/5 rounded-[18px] p-4">
    <div className="text-sm text-secondary-bg font-semibold">{activity.title}</div>
    <div className="text-xs text-neutral-text mt-1">{activity.category}</div>
    {activity.location && <div className="text-xs text-neutral-text mt-1">{activity.location}</div>}
  </div>
);

const Search = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [results, setResults] = useState({ trips: [], cities: [], activities: [], community: [] });

  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleSearch = async () => {
      if (!query.trim()) {
        setResults({ trips: [], cities: [], activities: [], community: [] });
        return;
      }

      try {
        if (filter === 'All') {
          const res = await searchGlobal(query);
          setResults(res.data.data.results || {});
        } else if (filter === 'Trips') {
          const res = await searchTrips(query);
          setResults({ trips: res.data.data.trips || [] });
        } else if (filter === 'Cities') {
          const res = await searchCities(query);
          setResults({ cities: res.data.data.cities || [] });
        } else if (filter === 'Activities') {
          const res = await searchActivities(query);
          setResults({ activities: res.data.data.activities || [] });
        } else if (filter === 'Community') {
          const res = await searchCommunity(query);
          setResults({ community: res.data.data.posts || [] });
        }
      } catch {
        setResults({ trips: [], cities: [], activities: [], community: [] });
      }
    };

    const timer = setTimeout(handleSearch, 400);
    return () => clearTimeout(timer);
  }, [query, filter]);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-6 space-y-4">
        <h1 className="text-2xl font-heading font-bold text-secondary-bg">Search</h1>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-[16px] px-4 py-3">
          <LuSearch className="w-5 h-5 text-neutral-text" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trips, cities, activities, posts..."
            className="bg-transparent outline-none text-sm text-secondary-bg w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-[12px] text-xs font-medium transition-all ${
                filter === item
                  ? 'bg-accent-blue text-[#0A1622]'
                  : 'bg-white/5 text-neutral-text hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {query.trim().length === 0 ? (
        <EmptyState title="Start typing to search" description="Search across trips, cities, activities, and community posts." />
      ) : (
        <div className="space-y-8">
          {results.trips?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-heading font-bold text-secondary-bg">Trips</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.trips.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </div>
          )}

          {results.cities?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-heading font-bold text-secondary-bg">Cities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.cities.map(city => (
                  <CityCard key={city.id} city={city} />
                ))}
              </div>
            </div>
          )}

          {results.activities?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-heading font-bold text-secondary-bg">Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.activities.map(activity => (
                  <ActivityResultCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          )}

          {results.community?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-heading font-bold text-secondary-bg">Community</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.community.map(post => (
                  <div key={post.id} className="bg-[#0A1622] border border-white/5 rounded-[20px] p-5">
                    <h3 className="text-lg font-heading font-bold text-secondary-bg">{post.title}</h3>
                    <p className="text-sm text-neutral-text mt-2 line-clamp-2">{post.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
