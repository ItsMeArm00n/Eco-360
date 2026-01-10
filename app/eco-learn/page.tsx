'use client';

import { Sparkles, Clock, Play, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function EcoLearn() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between px-2">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Daily Insight</h1>
            <p className="text-slate-500 font-medium">Your AI-curated micro-lesson.</p>
          </div>
          <Link 
            href="/eco-learn/library" 
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
              <BookOpen size={16} className="text-primary" />
              Library
          </Link>
      </div>

      {/* Main Daily Lesson Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 dark:bg-black aspect-[4/5] md:aspect-[2.4/1] shadow-2xl group cursor-pointer ring-1 ring-white/10">
            {/* Artistic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-slate-900/60 to-slate-900 z-10" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] -mr-20 -mt-20 mix-blend-screen opacity-50 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -ml-20 -mb-20 mix-blend-screen opacity-50"></div>
            
            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-end p-10 md:p-16">
                <div className="space-y-6 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md text-emerald-400 text-xs font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/10">
                            <Sparkles size={12} />
                            Daily AI Learning
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-slate-300 text-xs font-bold uppercase tracking-widest">
                            <Clock size={12} />
                            &lt; 60 Seconds
                        </span>
                    </div>
                    
                    <div>
                        <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-4">
                            The Hidden Cost of <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Fast Fashion</span>
                        </h2>
                        <p className="text-xl text-slate-300 line-clamp-2 max-w-xl font-light leading-relaxed">
                            Discover how your clothing choices impact global water supplies and carbon emissions.
                        </p>
                    </div>
                    
                    <div className="pt-6 flex gap-4">
                        <button className="flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-200 transition-all hover:scale-105 shadow-xl shadow-white/5">
                            <Play size={20} className="fill-slate-900" />
                            Start Interactive Lesson
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>

      {/* Contextual Info / Why this lesson? */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
               <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                   <Sparkles size={20} />
               </div>
               <h3 className="font-bold text-slate-900 dark:text-white mb-2">Why this topic?</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">AI detected a spike in textile waste discussions in your region. This lesson is timely.</p>
           </div>
           
           <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
               <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                   <Clock size={20} />
               </div>
               <h3 className="font-bold text-slate-900 dark:text-white mb-2">Micro-Format</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Designed to be completed during your coffee break. Low effort, high impact.</p>
           </div>

           <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
               <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                   <BookOpen size={20} />
               </div>
               <h3 className="font-bold text-slate-900 dark:text-white mb-2">Streak</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">You've completed 0 lessons this week. Start today to build your eco-streak!</p>
           </div>
      </div>

    </div>
  );
}
