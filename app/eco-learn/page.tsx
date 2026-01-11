'use client';

import { useState } from 'react';
import { Sparkles, Clock, Play, BookOpen, CheckCircle2, XCircle, ArrowRight, RefreshCw, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGeminiLesson } from '@/app/actions/getGeminiLesson';
import { useWeather } from '@/components/WeatherContext';
import { Card } from '@/components/ui/Card';

export default function EcoLearn() {
  const [view, setView] = useState<'start' | 'loading' | 'lesson'>('start');
  const [lesson, setLesson] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const { weatherData, location } = useWeather();

  const handleStartLearning = async () => {
    setView('loading');
    // Pass minimal weather context to avoid large payloads
    const weatherContext = weatherData ? {
        temp: weatherData.current?.temperature_2m,
        condition: weatherData.current?.weather_code
    } : null;

    const data = await getGeminiLesson(weatherContext, location?.name);
    setLesson(data);
    setView('lesson');
    // Reset quiz state
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const handleQuizOption = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
  };

  const getImageUrl = (keyword: string) => {
    // source.unsplash.com is often slow or deprecated. 
    // LoremFlickr provides reliable Creative Commons photos (NOT AI generated).
    // We append 'nature' to ensure context.
    return `https://loremflickr.com/800/600/nature,${encodeURIComponent(keyword)}`;
  };

  return (
    <div className="max-w-6xl mx-auto min-h-[60vh] relative px-4">
      <AnimatePresence mode="wait">
        
        {/* START VIEW */}
        {view === 'start' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8"
          >
            <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold text-sm uppercase tracking-wider">
                    <Sparkles size={16} /> Daily Micro-Learning
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
                   Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Sustainability</span> <br/> in 60 Seconds
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                    Short, high-impact lessons adapted to your day.
                </p>
            </div>

            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartLearning}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-lg shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 dark:hover:bg-slate-100"
            >
                <Play size={24} className="fill-current" />
                Start Today's Lesson
            </motion.button>

          </motion.div>
        )}

        {/* LOADING VIEW */}
        {view === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 text-center"
          >
             <div className="relative w-24 h-24">
                 <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
                 <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                     <Sparkles className="text-emerald-500 animate-pulse" size={32} />
                 </div>
             </div>
             <div className="space-y-2">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Curating content...</h2>
                 <p className="text-slate-500">Gemini is finding the perfect sustainability tip for you.</p>
             </div>
          </motion.div>
        )}

        {/* LESSON VIEW */}
        {view === 'lesson' && lesson && (
          <motion.div 
            key="lesson"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pb-20"
          >
            {/* Nav */}
            <button 
                onClick={() => setView('start')}
                className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
                <ArrowRight className="rotate-180" size={16} /> Back
            </button>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:grid-rows-2 tablet-grid">
                
                {/* Header Card (Spans 2 cols) */}
                <div className="md:col-span-2 bg-slate-100 dark:bg-slate-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden h-full min-h-[300px]">
                     <div className="relative z-10">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-xs mb-2 block">Today's Lesson</span>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{lesson.title}</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 font-medium max-w-md">{lesson.subtitle}</p>
                     </div>
                     <img 
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
                        alt="Header"
                        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay hover:opacity-30 transition-opacity duration-700"
                    />
                </div>

                {/* Main Insight Card */}
                <Card className="bg-white dark:bg-slate-900 border-none md:row-span-2 flex flex-col custom-scrollbar overflow-y-auto">
                    <div className="flex items-center gap-2 mb-4 text-indigo-500 font-bold uppercase text-xs tracking-wider">
                        <BookOpen size={16} /> The Insight
                    </div>
                    <div className="prose dark:prose-invert prose-sm">
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                            {lesson.content.intro}
                        </p>
                    </div>
                    
                    <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                         <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-xs">
                            <Sparkles size={14} /> Did You Know?
                        </div>
                        <p className="font-bold text-slate-800 dark:text-indigo-100 text-lg">
                            "{lesson.content.fact}"
                        </p>
                    </div>
                </Card>

                {/* Action Card with Image Background */}
                <div className="group relative bg-black rounded-3xl overflow-hidden min-h-[250px] flex items-end p-6">
                    <img 
                        src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80"
                        alt="Action"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div className="relative z-10 w-full">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                             <Leaf size={12} /> Action Item
                        </div>
                        <p className="text-xl font-bold text-white leading-snug">
                            {lesson.content.action}
                        </p>
                    </div>
                </div>

                {/* Quiz Card */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden min-h-[300px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
                    
                    {selectedOption === null ? (
                        <>
                            <h4 className="relative z-10 font-bold mb-4 flex items-center gap-2 text-purple-300 text-sm uppercase tracking-wide">
                                Pop Quiz
                            </h4>
                            <p className="relative z-10 text-xl font-bold mb-6">
                                {lesson.quiz.question}
                            </p>
                            <div className="relative z-10 grid gap-2">
                                {lesson.quiz.options.map((option: string, i: number) => (
                                    <button 
                                        key={i}
                                        onClick={() => handleQuizOption(i)}
                                        className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-medium"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative z-10 h-full flex flex-col justify-center"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                {selectedOption === lesson.quiz.correctIndex ? (
                                    <CheckCircle2 size={32} className="text-emerald-400" />
                                ) : (
                                    <XCircle size={32} className="text-red-400" />
                                )}
                                <span className="font-bold text-lg">
                                    {selectedOption === lesson.quiz.correctIndex ? 'Correct!' : 'Not quite.'}
                                </span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                {lesson.quiz.explanation}
                            </p>
                             <button 
                                onClick={handleStartLearning}
                                className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={16} /> Next Lesson
                            </button>
                        </motion.div>
                    )}
                </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

