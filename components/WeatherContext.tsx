'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getGeminiInsight } from '@/app/actions/getGeminiInsight';

interface LocationData {
  name: string;
  lat: number;
  lon: number;
}

interface WeatherContextType {
  weatherData: any;
  aqiData: any;
  aiInsight: any;
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  fetchWeather: (lat: number, lon: number, name: string) => Promise<void>;
  locationError: string;
  setLocationError: (error: string) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [aqiData, setAqiData] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState('');

  const fetchWeather = async (lat: number, lon: number, name: string) => {
    setLoading(true);
    setError(null);
    setLocation({ lat, lon, name });

    try {
      // 1. Fetch Weather from Open-Meteo
      // Added AQI integration is separate, but we fetch weather first
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,apparent_temperature,pressure_msl,precipitation&daily=uv_index_max,sunrise,sunset&timezone=auto&temperature_unit=celsius&wind_speed_unit=kmh`
      );
      
      if (!weatherRes.ok) throw new Error('Weather data fetch failed');
      const weatherJson = await weatherRes.json();
      setWeatherData(weatherJson);

      // 2. Fetch AQI from Open-Meteo Air Quality API
      const aqiRes = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`
      );
      
      if (aqiRes.ok) {
        const aqiJson = await aqiRes.json();
        setAqiData(aqiJson);
      }

      // 3. Get Gemini Insight
      const insight = await getGeminiInsight(weatherJson);
      if (insight) {
        setAiInsight(insight);
      }
      
    } catch (err) {
      console.error(err);
      setError('Failed to fetch weather data.');
      setLocationError('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        aqiData,
        aiInsight,
        location,
        loading,
        error,
        fetchWeather,
        locationError,
        setLocationError
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
