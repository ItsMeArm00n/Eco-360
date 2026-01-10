'use client';

import Link from 'next/link';
import { ArrowRight, Leaf, Globe, Zap, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        stiffness: 70, 
        damping: 20,
        duration: 0.8
      } 
    }
  };

  return (
    <div className="relative isolate min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-pulse-slow delay-700 pointer-events-none" />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto px-4 sm:px-6 relative z-10 py-20"
      >
        <motion.div variants={item} className="mb-8">
           <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md transition-all cursor-default">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Eco 360 Platform
            </span>
        </motion.div>

        <motion.h1 
          variants={item} 
          className="font-display font-medium text-5xl sm:text-7xl md:text-8xl tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-8"
        >
          Sustainability, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-secondary">Reimagined.</span>
        </motion.h1>
        
        <motion.p 
          variants={item} 
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-sans mb-12"
        >
          The all-in-one platform leveraging artificial intelligence to transform environmental data into actionable insights for a greener future.
        </motion.p>
        
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/eco-ai"
            className="group relative w-full sm:w-auto overflow-hidden rounded-2xl bg-slate-900 dark:bg-emerald-600 px-8 py-4 text-white hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all duration-300 shadow-xl shadow-slate-900/10 dark:shadow-emerald-900/20"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-base font-medium">
              Launch Dashboard
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link
            href="/eco-learn"
            className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
          >
             <span className="flex items-center justify-center gap-2">
              Explore Features
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
            </span>
          </Link>
        </motion.div>

        {/* Floating cards animation - Refined */}
        <motion.div 
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-24 w-full"
        >
           {[
             { title: "Global Intelligence", desc: "Real-time data aggregation from worldwide sensors.", icon: Globe, color: "bg-blue-500" },
             { title: "Predictive AI", desc: "Forecast environmental trends with 94% accuracy.", icon: Zap, color: "bg-amber-500" },
             { title: "Impact Tracking", desc: "Measure and visualize your carbon footprint reduction.", icon: Leaf, color: "bg-emerald-500" },
           ].map((feature, i) => (
             <motion.div 
               key={i} 
               variants={item}
               whileHover={{ y: -5 }}
               className="group relative p-8 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 text-left overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all duration-500"
             >
                <div className={`absolute top-0 right-0 w-32 h-32 ${feature.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-500`} />
               
               <div className="relative bg-white dark:bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                 <feature.icon className="w-6 h-6 text-slate-900 dark:text-white" />
               </div>
               
               <h3 className="text-xl font-display font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
               <p className="text-slate-500 dark:text-slate-400 font-sans text-sm leading-relaxed">{feature.desc}</p>
             </motion.div>
           ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
