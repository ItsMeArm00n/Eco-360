'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { CloudSun, Wind, Droplets, Thermometer, Send, User, Bot, Sparkles, Zap, AlertTriangle, ArrowUpRight, MapPin, Loader2, X, Sun, Gauge, Umbrella, ThermometerSun, Cloud, MessageSquare, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithGemini } from '@/app/actions/getGeminiInsight';
import { useWeather } from '@/components/WeatherContext';

export default function EcoAIDashboard() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Eco AI Assistant. How can I help you make sustainable choices today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Use Weather Context
  const { 
    weatherData, 
    aqiData, 
    aiInsight, 
    location,
    loading: loadingWeather, 
    fetchWeather, 
    locationError,
    setLocationError
  } = useWeather();
  
  // Local UI State for Modals
  const [locationName, setLocationName] = useState('Select Location'); // Local display override if needed, or use context location
  
  useEffect(() => {
    if (location?.name) {
      setLocationName(location.name);
    }
  }, [location]);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<{lat: number, lon: number, name: string} | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Only prompt for location if we don't have data yet
    if (!weatherData) {
        handleGetLocation();
    } else if (weatherData) {
       // If data exists (persisted), ensure local location name matches context if we stored it
       // For now, we update the local state to match the context if available
       // (Note: To do this perfectly, we'd need location info in weatherData or separate context field)
    }
  }, []);

  const confirmLocation = () => {
      if (pendingLocation) {
          fetchWeather(pendingLocation.lat, pendingLocation.lon, pendingLocation.name);
          setLocationName(pendingLocation.name); 
          setShowLocationModal(false);
          setPendingLocation(null);
      }
  };

  const cancelLocation = () => {
      setShowLocationModal(false);
      setPendingLocation(null);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
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
        setLocationError(''); // clear error if successful
        setShowLocationModal(true);
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Location access is required to use Eco AI.');
      }
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
        const context = {
            weather: weatherData,
            insight: aiInsight,
            history: messages
        };

        const responseText = await chatWithGemini(userMsg.content, context);
        
        setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't connect to the server." }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)]">
      {/* Confirmation Modal */}
      <AnimatePresence>
        {showLocationModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    onClick={cancelLocation}
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
                            We found coordinates for:
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

      {/* Chat Bot Modal */}
      <AnimatePresence>
        {showChatModal && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setShowChatModal(false)}
                />
                <motion.div 
                    initial={{ y: "100%", opacity: 0, scale: 0.95 }} 
                    animate={{ y: 0, opacity: 1, scale: 1 }} 
                    exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col border border-slate-200 dark:border-slate-800 z-50 overflow-hidden"
                >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Eco Assistant</h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setShowChatModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 dark:bg-slate-900/50 scroll-smooth">
                        {messages.map((m, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            key={i} 
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-end gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${m.role === 'user' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-purple-600 border border-slate-100 dark:border-slate-700'}`}>
                                    {m.role === 'user' ? <User size={14} /> : <Bot size={16} />}
                                </div>
                                <div className={`px-4 py-3 rounded-2xl text-sm shadow-sm leading-relaxed ${
                                    m.role === 'user' 
                                    ? 'bg-primary text-white rounded-br-none' 
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none'
                                }`}>
                                    {m.content}
                                </div>
                            </div>
                        </motion.div>
                        ))}
                        {isTyping && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-100 dark:border-slate-700 flex gap-1 items-center">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide mask-fade">
                            {["Is it safe to run?", "Reduce plastic ideas?", "Solar forecast?"].map((prompt, i) => (
                            <button 
                                key={i}
                                onClick={() => setInput(prompt)}
                                className="whitespace-nowrap px-4 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all"
                            >
                                {prompt}
                            </button>
                            ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="relative">
                            <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Eco AI..."
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 dark:bg-slate-800 dark:text-white transition-all"
                            />
                            <button
                            type="submit"
                            disabled={!input.trim()}
                            className="absolute right-2 top-2 p-1.5 bg-primary text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-primary/20"
                            >
                            <Send size={16} />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <div className={`space-y-8 transition-all duration-300 ${showLocationModal || showChatModal ? 'blur-sm pointer-events-none select-none' : ''}`}>
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4"
      >
        <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary">
                <Zap className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Eco Intelligence</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time insights tailored for you.</p>
            </div>
        </div>

        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
             <button type="button" onClick={handleGetLocation} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Use My Location">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Detect Location</span>
             </button>
             {loadingWeather && <span className="text-xs text-slate-400 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Updating weather...</span>}
             {locationError && <span className="text-xs text-red-400">{locationError}</span>}
        </div>
      </motion.div>

      <div className="space-y-6">
        
        {/* Row 1: Current Environmental Conditions */}
        <Card className="p-0 overflow-visible" delay={0.1}>
                 <div className="flex items-center justify-between mb-6">
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white">Current Conditions</h3>
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{locationName}</span>
                 </div>
                 
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 1. Temperature */}
                    <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-default">
                        <Thermometer className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform" />
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {weatherData?.current ? `${weatherData.current.temperature_2m}°C` : '--'}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">{weatherData?.current ? 'Temp' : 'Loading...'}</div>
                        </div>
                    </div>

                    {/* 2. Feels Like */}
                    <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors cursor-default">
                        <ThermometerSun className="h-8 w-8 text-orange-500 group-hover:scale-110 transition-transform" />
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {weatherData?.current ? `${weatherData.current.apparent_temperature}°C` : '--'}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">Feels Like</div>
                        </div>
                    </div>

                    {/* 3. Precipitation */}
                    <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors cursor-default">
                        <Umbrella className="h-8 w-8 text-indigo-500 group-hover:scale-110 transition-transform" />
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {weatherData?.current ? `${weatherData.current.precipitation}mm` : '--'}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">Precipitation</div>
                        </div>
                    </div>

                    {/* 4. Humidity */}
                    <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-default">
                        <Droplets className="h-8 w-8 text-blue-400 group-hover:scale-110 transition-transform" />
                        <div>
                            <div className="text-xl font-bold text-slate-900 dark:text-white">
                                {weatherData?.current ? `${weatherData.current.relative_humidity_2m}%` : '--'}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">Humidity</div>
                        </div>
                    </div>

                    {/* 5. Wind Speed */}
                    <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default">
                        <Wind className="h-8 w-8 text-slate-400 group-hover:rotate-180 transition-transform duration-700" />
                        <div>
                            <div className="text-xl font-bold text-slate-900 dark:text-white">
                                {weatherData?.current ? weatherData.current.wind_speed_10m : '--'} <span className="text-sm font-normal text-slate-500">km/h</span>
                            </div>
                            <div className="text-xs text-slate-500 font-medium">Wind Speed</div>
                        </div>
                    </div>

                    {/* 6. Cloud Cover */}
                    <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default">
                        <Cloud className="h-8 w-8 text-slate-400 group-hover:scale-110 transition-transform" />
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {weatherData?.current ? `${weatherData.current.cloud_cover}%` : '--'}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">Cloud Cover</div>
                        </div>
                    </div>

                     {/* 7. Air Quality */}
                     <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors cursor-default">
                        <Gauge className="h-8 w-8 text-emerald-500 group-hover:rotate-12 transition-transform duration-500" />
                        <div>
                            <div className="text-xl font-bold text-slate-900 dark:text-white">
                                {aqiData?.current ? `${aqiData.current.us_aqi}` : '--'} <span className="text-sm font-normal text-slate-500">US AQI</span>
                            </div>
                            <div className="text-xs text-slate-500 font-medium">Air Quality</div>
                        </div>
                    </div>

                    {/* 8. UV Index (Daily Max) */}
                    <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors cursor-default">
                         <div className="relative">
                            <div className="absolute inset-0 bg-yellow-400 blur-lg opacity-20"></div>
                            <Sun className="h-8 w-8 text-yellow-500 relative z-10 group-hover:rotate-180 transition-transform duration-700" />
                         </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {weatherData?.daily?.uv_index_max ? `${weatherData.daily.uv_index_max[0]}` : '--'}
                            </div>
                             <div className="text-xs text-slate-500 font-medium">Max UV Index</div>
                        </div>
                    </div>
                 </div>
        </Card>

        {/* Row 2: Insights & Chat CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Daily Insight Engine - Spans 2 cols */}
            <div className="lg:col-span-2 contents lg:block space-y-6 lg:space-y-0">
                <Card title="Daily Insight" delay={0.2} className="relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    
                    <div className="flex gap-4 mb-6">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                                <Sparkles size={20} />
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                                {aiInsight ? (
                                    aiInsight.summary
                                ) : (
                                    <span className="animate-pulse">Connecting to Gemini AI for your daily forecast...</span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl hover:border-emerald-200 transition-colors">
                            <h4 className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 mb-3 text-sm uppercase tracking-wide">
                                <ArrowUpRight className="w-4 h-4" /> Recommended
                            </h4>
                            <ul className="space-y-3">
                                {aiInsight?.recommended ? (
                                    aiInsight.recommended.map((rec: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-emerald-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                                            {rec}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-slate-400 italic">Gathering data...</li>
                                )}
                            </ul>
                        </div>
                        
                        <div className="p-5 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl hover:border-amber-200 transition-colors">
                            <h4 className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400 mb-3 text-sm uppercase tracking-wide">
                                <AlertTriangle className="w-4 h-4" /> Avoid
                            </h4>
                            <ul className="space-y-3">
                                {aiInsight?.avoid ? (
                                    aiInsight.avoid.map((avo: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-amber-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div>
                                            {avo}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-slate-400 italic">Gathering data...</li>
                                )}
                            </ul>
                        </div>
                    </div>
                    
                    {/* Historical Trends */}
                    {aiInsight?.history && (
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <h4 className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-400 mb-2 text-xs uppercase tracking-wide">
                                Historical Context
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {aiInsight.history}
                            </p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Chatbot CTA - Spans 1 col */}
            <div className="lg:col-span-1">
                 <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowChatModal(true)}
                    className="h-full min-h-[300px] cursor-pointer"
                 >
                     <Card className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-primary/5 to-blue-500/5 border-dashed border-2 border-primary/20 hover:border-primary transition-all group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-primary/10">
                            <MessageSquare className="w-10 h-10" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Have Questions?</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto leading-relaxed">
                            Ask Eco AI about your local environment, specific sustainability tips, or analyze your energy usage.
                        </p>
                        
                        <div className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 group-hover:shadow-primary/40 group-hover:-translate-y-1 transition-all flex items-center gap-2">
                             Start Chatting <ArrowUpRight size={18} />
                        </div>
                     </Card>
                 </motion.div>
            </div>
        </div>

      </div>
    </div>
    </div>
  );
}
