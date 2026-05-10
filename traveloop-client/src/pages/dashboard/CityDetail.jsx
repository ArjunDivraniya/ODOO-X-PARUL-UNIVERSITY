import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { getCity, getCityActivities, getWeatherForecast } from '../../api/explore';
const ActivityPreview = ({ activity }) => (
  <div className="bg-[#0A1622] border border-white/5 rounded-[18px] p-4">
    <div className="text-sm text-secondary-bg font-semibold">{activity.title}</div>
    <div className="text-xs text-neutral-text mt-1">{activity.category}</div>
    {activity.location && <div className="text-xs text-neutral-text mt-1">{activity.location}</div>}
  </div>
);

const CityDetail = () => {
  const { cityId } = useParams();
  const [city, setCity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [cityRes, activityRes] = await Promise.all([
          getCity(cityId),
          getCityActivities(cityId)
        ]);
        setCity(cityRes.data.data.city);
        setActivities(activityRes.data.data.activities || []);
      } catch (err) {
        toast.error('Failed to load city details');
      }
    };

    load();
  }, [cityId]);

  useEffect(() => {
    if (!city?.name) return;
    const loadForecast = async () => {
      try {
        const res = await getWeatherForecast(city.name);
        setForecast(res.data.data.forecast || []);
      } catch {
        setForecast([]);
      }
    };
    loadForecast();
  }, [city?.name]);

  if (!city) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="bg-[#0A1622] border border-white/5 rounded-[28px] overflow-hidden">
        <div className="h-56 bg-white/5">
          <img
            src={city.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop'}
            alt={city.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-heading font-bold text-secondary-bg">{city.name}</h1>
          <p className="text-neutral-text text-sm mt-2">{city.country}</p>
          {city.description && <p className="text-sm text-neutral-text mt-3">{city.description}</p>}
        </div>
      </div>

      {forecast.length > 0 && (
        <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-6">
          <h2 className="text-lg font-heading font-bold text-secondary-bg mb-4">Forecast</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-[14px] p-4 text-center">
                <div className="text-xs text-neutral-text">{day.date}</div>
                <div className="text-lg font-heading font-bold text-secondary-bg">{day.temp}°C</div>
                <div className="text-xs text-neutral-text">{day.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-heading font-bold text-secondary-bg">Activities in {city.name}</h2>
        {activities.length === 0 ? (
          <p className="text-sm text-neutral-text">No activities found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activities.map(activity => (
              <ActivityPreview key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CityDetail;
