import React, { useEffect, useState } from 'react';
import { LuCloud } from 'react-icons/lu';
import { getWeather } from '../../api/explore';

export const WeatherWidget = ({ city }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!city) return;
    const load = async () => {
      try {
        const res = await getWeather(city);
        setWeather(res.data.data.weather);
      } catch {
        setWeather(null);
      }
    };
    load();
  }, [city]);

  if (!weather) return null;

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-[14px] px-4 py-2 text-xs text-neutral-text">
      <LuCloud className="w-4 h-4" />
      <span>{weather.temp}°C · {weather.description}</span>
      <span className="text-white/40">Humidity {weather.humidity}%</span>
    </div>
  );
};
