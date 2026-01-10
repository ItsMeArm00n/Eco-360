'use client';

import { Card } from '@/components/ui/Card';
import { Trophy, Star, CheckCircle2, Flame, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EcoChallenge() {
    const challenges = [
      { 
        title: "Zero Waste Weekend", 
        points: 500, 
        desc: "Don't generate any non-recyclable waste for 48 hours.",
        difficulty: "Hard",
        color: "from-rose-500 to-pink-500",
        bg: "bg-rose-50 dark:bg-rose-900/10",
        icon: Flame
      },
      { 
        title: "Meat-Free Monday", 
        points: 200, 
        desc: "Go vegetarian for the entire day to reduce carbon footprint.",
        difficulty: "Medium",
        color: "from-orange-500 to-amber-500",
        bg: "bg-orange-50 dark:bg-orange-900/10",
        icon: Star
      },
      { 
        title: "Cold Water Wash", 
        points: 100, 
        desc: "Wash your laundry in cold water to save energy.",
        difficulty: "Easy",
        color: "from-emerald-500 to-teal-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/10",
        icon: CheckCircle2
      },
      { 
        title: "Short Shower Power", 
        points: 50, 
        desc: "Keep your shower under 5 minutes.",
        difficulty: "Easy",
        color: "from-blue-500 to-cyan-500",
        bg: "bg-blue-50 dark:bg-blue-900/10",
        icon: Target
      },
    ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <motion.div 
             initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-4 shadow-sm"
           >
             <Trophy size={14} className="animate-bounce" /> Leaderboard Top 5%
           </motion.div>
           <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Eco Challenges</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg max-w-xl">Gamify your sustainability journey. Complete challenges to earn badges and unlock rewards.</p>
        </div>
        
        <Card className="flex items-center gap-8 p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200 dark:border-slate-700">
            <div className="text-center group cursor-default">
                <div className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1 group-hover:text-primary transition-colors">Level</div>
                <div className="text-4xl font-black text-slate-900 dark:text-white group-hover:scale-110 transition-transform">12</div>
            </div>
            <div className="h-12 w-px bg-slate-200 dark:bg-slate-700"></div>
             <div className="text-center group cursor-default">
                <div className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1 group-hover:text-primary transition-colors">Points</div>
                <div className="text-4xl font-black text-primary group-hover:scale-110 transition-transform">2,450</div>
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Sidebar: Progress */}
         <Card className="h-full flex flex-col justify-center items-center text-center p-10 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-xl" delay={0.1}>
            <div className="relative w-56 h-56 flex items-center justify-center mb-8">
                 <div className="absolute inset-0 border-[12px] border-slate-100 dark:border-slate-800 rounded-full"></div>
                 <motion.svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                     <motion.circle 
                       initial={{ strokeDashoffset: 290 }}
                       whileInView={{ strokeDashoffset: 72 }}
                       transition={{ duration: 2, ease: "easeOut" }}
                       cx="50" cy="50" r="44" 
                       stroke="url(#gradient)" strokeWidth="12" fill="none" 
                       strokeDasharray="276" strokeLinecap="round" 
                     />
                     <defs>
                       <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                         <stop offset="0%" stopColor="#34d399" />
                         <stop offset="100%" stopColor="#059669" />
                       </linearGradient>
                     </defs>
                 </motion.svg>
                 <div className="flex flex-col items-center z-10">
                     <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">75%</span>
                     <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Weekly Goal</span>
                 </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Keep it up!</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-xs mx-auto">You''ve saved <b>12kg of CO2</b> this week! That''s equivalent to planting 2 trees.</p>
            <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                View Detailed Report
            </button>
         </Card>

         {/* Challenge Grid */}
         <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {challenges.map((challenge, i) => (
                <Card key={i} className="flex flex-col justify-between group hover:border-transparent transition-all hover:shadow-2xl relative overflow-hidden border-0" delay={0.2 + (i * 0.1)}>
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${challenge.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>
                    
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${challenge.bg} text-slate-600 dark:text-slate-300`}>
                                {challenge.difficulty}
                            </span>
                            <div className={`flex items-center gap-1.5 font-black text-sm text-transparent bg-clip-text bg-gradient-to-r ${challenge.color}`}>
                                <challenge.icon size={16} className="text-amber-500" />
                                {challenge.points} XP
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:translate-x-1 transition-transform">{challenge.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{challenge.desc}</p>
                    </div>
                    
                    <button className="mt-8 relative overflow-hidden flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <span className="relative z-10 flex items-center gap-2">Accept Challenge</span>
                    </button>
                </Card>
            ))}
         </div>
      </div>
    </div>
  );
}
