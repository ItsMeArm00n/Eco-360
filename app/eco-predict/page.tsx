'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { useWeather } from '@/components/WeatherContext';
import { predictDisruption } from '@/app/actions/predictDisruption';
import { Cloud, Wind, Droplets, Sun, Activity, ThermometerSun, Brain, Loader2, AlertTriangle, CheckCircle, Sparkles, MapPin, X, ArrowRight, Gauge, Umbrella, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EcoPredict() {
  const { weatherData, aqiData, loading: weatherLoading, fetchWeather, location } = useWeather();
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // Location Modal State
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<{lat: number, lon: number, name: string} | null>(null);
  
  // Input State
  const [formData, setFormData] = useState({
    temperature: 0,
    feels_like: 0,
    humidity: 0,
    wind_speed: 0,
    precipitation: 0,
    uv_index: 0,
    AQI: 0,
    heat_index: 0,
    time_of_day: 'morning',
    day_type: 'weekday',
    commute_mode: 'public_transport',
    routine_sensitivity: 'medium'
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let displayName = "Current Location";
        
        try {
            // Reverse Geocoding via Nominatim (Free)
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.village || data.address.hamlet;
                const country = data.address.country;
                if (city && country) displayName = `${city}, ${country}`;
                else if (country) displayName = country;
            }
        } catch (e) {
            console.error("Reverse geocoding failed", e);
        }

        setPendingLocation({ lat: latitude, lon: longitude, name: displayName });
        setShowLocationModal(true);
      },
      (error) => {
         console.error('Unable to retrieve your location.', error);
      }
    );
  };

  const confirmLocation = () => {
      if (pendingLocation) {
          fetchWeather(pendingLocation.lat, pendingLocation.lon, pendingLocation.name);
          setShowLocationModal(false);
          setPendingLocation(null);
      }
  };

  const cancelLocation = () => {
      setShowLocationModal(false);
      setPendingLocation(null);
  };


  // Hydrate form with Weather Data
  useEffect(() => {
    // If no weather data and no active request, prompt for location
    if (!weatherData && !weatherLoading) {
       handleGetLocation();
       return;
    }

    if (weatherData) {
        const current = weatherData.current || {};
        const daily = weatherData.daily || {};
        const aqi = aqiData?.current?.us_aqi || 50;

        // Helpers
        const tempC = current.temperature_2m || 0;
        const rh = current.relative_humidity_2m || 0;
        
        // Calculate Heat Index (Approximation) using standard NOAA formula (Fahrenheit based)
        const T_F = (tempC * 9/5) + 32;
        const HI_F = -42.379 + 2.04901523*T_F + 10.14333127*rh - 0.22475541*T_F*rh - 0.00683783*T_F*T_F - 0.05481717*rh*rh + 0.00122874*T_F*T_F*rh + 0.00085282*T_F*rh*rh - 0.00000199*T_F*T_F*rh*rh;
        const HI_C = (HI_F - 32) * 5/9;
        
        // Only update if HI_C is a valid number, else fallback to temp
        const finalHeatIndex = isNaN(HI_C) ? tempC : HI_C;

        setFormData(prev => ({
            ...prev,
            temperature: tempC,
            feels_like: current.apparent_temperature || tempC,
            humidity: rh,
            wind_speed: current.wind_speed_10m || 0,
            precipitation: current.precipitation || 0,
            uv_index: daily.uv_index_max?.[0] || 0,
            AQI: aqi,
            heat_index: parseFloat(finalHeatIndex.toFixed(1))
        }));
    }

  }, [weatherData, aqiData]);

  const handlePredict = async () => {
    setLoading(true);
    setPrediction(null);
    try {
        const result: any = await predictDisruption(formData);
        if (result.error) {
            console.error(result.details);
            // Show error in UI
            setPrediction({ error: true, details: result.details });
            setShowResultModal(true);
        } else {
            setPrediction(result);
            setShowResultModal(true);
        }
    } catch (e) {
        console.error(e);
        setPrediction({ error: true, details: "Unknown client error" });
        setShowResultModal(true);
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // UI Components
  const WeatherStat = ({ label, value, unit, icon: Icon, color }: any) => (
      <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <Icon className={`mb-2 ${color}`} size={20} />
          <span className="text-2xl font-black text-slate-800 dark:text-slate-200">{value}<span className="text-sm text-slate-400 font-medium ml-1">{unit}</span></span>
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{label}</span>
      </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 relative px-4">
       
       {/* Header */}
       <div className="text-center space-y-6 mb-12 pt-10">
            <motion.div 
               initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold text-sm uppercase tracking-wider"
            >
                <Brain size={16} /> Behavior Forecasting
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                Predict Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Impact</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Our AI analyzes 12 environmental and behavioral factors to predict if your sustainable routine is at risk today.
            </p>
       </div>

       <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Live Data & Form */}
            <div className="space-y-8">
                {/* 1. Live Weather Card */}
                <Card className="p-6 md:p-8 border-0 bg-white dark:bg-slate-900 shadow-xl overflow-visible">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Cloud className="text-sky-500" /> Live Conditions
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">Real-time data from <span className="font-semibold text-slate-700 dark:text-slate-300">{location?.name || 'Loading...'}</span></p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 rounded-lg text-xs font-bold uppercase tracking-wider cursor-default self-start md:self-auto">
                            <Activity size={14} className="animate-pulse" /> Live Feed Active
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <WeatherStat label="Temp" value={formData.temperature} unit="°C" icon={ThermometerSun} color="text-orange-500" />
                        <WeatherStat label="Feels Like" value={formData.feels_like} unit="°C" icon={Activity} color="text-orange-400" />
                        <WeatherStat label="Humidity" value={formData.humidity} unit="%" icon={Droplets} color="text-blue-500" />
                        <WeatherStat label="Heat Index" value={formData.heat_index} unit="°C" icon={Sun} color="text-red-500" />
                        <WeatherStat label="Wind" value={formData.wind_speed} unit="km/h" icon={Wind} color="text-slate-500" />
                        <WeatherStat label="Precip" value={formData.precipitation} unit="mm" icon={Umbrella} color="text-indigo-500" />
                        <WeatherStat label="UV Index" value={formData.uv_index} unit="" icon={Sun} color="text-amber-500" />
                        <WeatherStat label="Air Quality" value={formData.AQI} unit="AQI" icon={Gauge} color="text-emerald-500" />
                    </div>
                </Card>

                {/* 2. User Context Card */}
                <Card className="p-6 md:p-8 border-0 bg-white dark:bg-slate-900 shadow-xl">
                    <div className="flex items-center gap-3 mb-8">
                         <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                             <User size={20} />
                         </div>
                         <div>
                             <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Context</h3>
                             <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Customize for accuracy</p>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Current Time</label>
                            <div className="relative">
                                <select 
                                    name="time_of_day" 
                                    value={formData.time_of_day} 
                                    onChange={handleChange}
                                    className="w-full appearance-none p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-purple-500 focus:ring-0 outline-none transition-all font-medium text-slate-700 dark:text-slate-200"
                                >
                                    <option value="morning">Morning</option>
                                    <option value="afternoon">Afternoon</option>
                                    <option value="evening">Evening</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Day Type</label>
                            <select 
                                name="day_type" 
                                value={formData.day_type} 
                                onChange={handleChange}
                                className="w-full appearance-none p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-purple-500 focus:ring-0 outline-none transition-all font-medium text-slate-700 dark:text-slate-200"
                            >
                                <option value="weekday">Weekday</option>
                                <option value="weekend">Weekend</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Planned Commute</label>
                            <select 
                                name="commute_mode" 
                                value={formData.commute_mode} 
                                onChange={handleChange}
                                className="w-full appearance-none p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-purple-500 focus:ring-0 outline-none transition-all font-medium text-slate-700 dark:text-slate-200"
                            >
                                <option value="public_transport">Public Transport</option>
                                <option value="car">Car / Ride Share</option>
                                <option value="walk">Walk / Bike</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Routine Sensitivity</label>
                            <select 
                                name="routine_sensitivity" 
                                value={formData.routine_sensitivity} 
                                onChange={handleChange}
                                className="w-full appearance-none p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-purple-500 focus:ring-0 outline-none transition-all font-medium text-slate-700 dark:text-slate-200"
                            >
                                <option value="low">Low (Resilient)</option>
                                <option value="medium">Medium</option>
                                <option value="high">High (Easily Disrupted)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={handlePredict}
                            disabled={loading}
                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-lg shadow-xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative z-10 flex items-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="fill-current" />}
                                Analyze Impact
                            </span>
                        </button>
                    </div>

                    {prediction && !showResultModal && (
                        <div className="mt-4 flex justify-end">
                             <button
                                onClick={() => setShowResultModal(true)}
                                className="text-sm font-bold text-indigo-500 hover:text-indigo-600 underline decoration-2 underline-offset-4"
                             >
                                 View Last Prediction
                             </button>
                        </div>
                    )}
                </Card>
            </div>
       </div>

      {/* Results Modal */}
       <AnimatePresence>
          {showResultModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={() => setShowResultModal(false)}
                    className="absolute inset-0"
                />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }} 
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg"
                >
                    <button 
                        onClick={() => setShowResultModal(false)}
                        className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-white/10 rounded-full hover:bg-white/20 transition-all"
                    >
                        <X size={24} />
                    </button>

                    {prediction && !prediction.error && (
                         <div className="space-y-6">
                            <Card className={`p-8 border-0 shadow-2xl overflow-hidden relative ${
                                prediction.prediction === 1 
                                ? 'bg-gradient-to-br from-rose-500 to-pink-600' 
                                : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                            } text-white`}>
                                 <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                 
                                 <div className="relative z-10 text-center">
                                     <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/20">
                                        {prediction.prediction === 1 ? <AlertTriangle size={40} /> : <CheckCircle size={40} />}
                                     </div>
                                     <div className="inline-block px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-3">
                                         AI Forecast
                                     </div>
                                     <h2 className="text-3xl font-black mb-2 leading-tight">
                                        {prediction.prediction === 1 ? 'Disruption Likely' : 'Stable Routine'}
                                     </h2>
                                     <p className="text-white/90 font-medium text-lg">
                                        {prediction.prediction === 1 
                                            ? "High risk of unsustainable choices." 
                                            : "Optimal for green habits."}
                                     </p>
                                 </div>
                            </Card>

                             <Card className="p-6 border-0 bg-white dark:bg-slate-900 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Sparkles size={18} className="text-amber-500" /> AI Insight
                                </h4>
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                    {prediction.prediction === 1 
                                        ? "The combination of high heat index and your routine sensitivity suggests you're likely to opt for convenience (car, AC). Try strictly planning your commute now to avoid slipping." 
                                        : "Your environmental inputs align perfectly with a low-carbon lifestyle today. It's a great opportunity to walk or bike without discomfort."}
                                </p>
                            </Card>
                         </div>
                    )}

                    {prediction && prediction.error && (
                         <div className="w-full">
                              <Card className="p-8 border-2 border-rose-100 bg-white dark:bg-slate-900 shadow-xl text-center">
                                  <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                     <AlertTriangle size={32} />
                                  </div>
                                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Prediction Failed</h3>
                                  <p className="text-slate-500 mb-4">Something went wrong while communicating with the model.</p>
                                  <div className="inline-block max-w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400 break-all">
                                      {prediction.details}
                                  </div>
                              </Card>
                         </div>
                    )}
                </motion.div>
            </div>
          )}
       </AnimatePresence>

      {/* Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={cancelLocation}
                    className="absolute inset-0"
                />
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 z-50"
                >
                    <button onClick={cancelLocation} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                    
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <MapPin size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Confirm Location</h3>
                        <p className="text-slate-500 text-sm">
                            Use local weather data for accurate predictions?
                            <br/>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 text-lg mt-1 block">
                                {pendingLocation?.name}
                            </span>
                        </p>
                        
                        <div className="flex gap-3 w-full pt-2">
                             <button
                                onClick={cancelLocation}
                                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                             >
                                Cancel
                             </button>
                             <button
                                onClick={confirmLocation}
                                className="flex-1 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-lg shadow-primary/20"
                             >
                                Confirm
                             </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
}
