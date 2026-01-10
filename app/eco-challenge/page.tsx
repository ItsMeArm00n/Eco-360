'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Trophy, Star, CheckCircle2, Flame, Target, Camera, Upload, X, Loader2, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyChallenge } from '@/app/actions/verifyChallenge';

export default function EcoChallenge() {
    const [points, setPoints] = useState(0); 
    const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'analyzing' | 'success' | 'failed'>('idle');
    const [verificationReason, setVerificationReason] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const challenges = [
      { 
        title: "Meat-Free Meal", 
        points: 500, 
        desc: "Eat a purely vegetarian meal. No meat, just delicious plants!",
        difficulty: "Medium",
        color: "from-green-500 to-emerald-500",
        bg: "bg-green-50 dark:bg-green-900/10",
        icon: Star
      },
      { 
        title: "Reusable Legend", 
        points: 200, 
        desc: "Use a reusable water bottle or coffee cup instead of single-use plastic.",
        difficulty: "Easy",
        color: "from-blue-500 to-cyan-500",
        bg: "bg-blue-50 dark:bg-blue-900/10",
        icon: CheckCircle2
      },
      { 
        title: "Public Transport Hero", 
        points: 300, 
        desc: "Take the bus, train, or ride your bike instead of driving.",
        difficulty: "Hard",
        color: "from-amber-500 to-orange-500",
        bg: "bg-amber-50 dark:bg-amber-900/10",
        icon: Flame
      },
      { 
        title: "Recycling Master", 
        points: 100, 
        desc: "Sort your waste correctly. Show us your recycling bin!",
        difficulty: "Easy",
        color: "from-purple-500 to-indigo-500",
        bg: "bg-purple-50 dark:bg-purple-900/10",
        icon: Target
      },
    ];

    const handleAcceptChallenge = (challenge: any) => {
        setSelectedChallenge(challenge);
        setVerificationStatus('idle');
        setVerificationReason('');
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !selectedChallenge) return;

        setVerificationStatus('analyzing');
        
        // Helper to resize image before sending to avoid server payload limits
        const resizeImage = (file: File): Promise<string> => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 800;
                        const scaleSize = MAX_WIDTH / img.width;
                        canvas.width = MAX_WIDTH;
                        canvas.height = img.height * scaleSize;
                        
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality
                    };
                    img.src = e.target?.result as string;
                };
                reader.readAsDataURL(file);
            });
        };

        try {
            const base64String = await resizeImage(file);
            
            // Call Server Action with specific Verification API Key
            const result = await verifyChallenge(base64String, selectedChallenge.title, selectedChallenge.desc);
            
            if (result.verified) {
                setVerificationStatus('success');
                setPoints((prev) => prev + selectedChallenge.points);
                setVerificationReason(result.reason || "Great job! Challenge verified.");
            } else {
                setVerificationStatus('failed');
                setVerificationReason(result.reason || "Could not verify the activity in this image.");
            }
        } catch (error: any) {
            console.error("Verification error:", error);
            setVerificationStatus('failed');
            setVerificationReason(error.message || "Something went wrong with the AI verification.");
        }
    };

  return (
    <div className="space-y-10 relative">
      
      {/* Verification Modal */}
      <AnimatePresence>
        {selectedChallenge && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                >
                    <button 
                        onClick={() => setSelectedChallenge(null)}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>

                    <div className="text-center space-y-6">
                        {verificationStatus === 'idle' && (
                            <>
                                <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${selectedChallenge.color} flex items-center justify-center text-white shadow-xl`}>
                                    <Camera size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{selectedChallenge.title}</h2>
                                    <p className="text-slate-500">Upload a photo to prove you completed this challenge!</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-4 flex flex-col items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold"
                                    >
                                        <Upload size={24} />
                                        <span>Tap to Upload Proof</span>
                                    </button>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            </>
                        )}

                        {verificationStatus === 'analyzing' && (
                            <div className="py-10 space-y-4">
                                <Loader2 size={48} className="animate-spin text-primary mx-auto" />
                                <p className="font-bold text-slate-700 dark:text-slate-300">Gemini AI is analyzing your proof...</p>
                            </div>
                        )}

                        {verificationStatus === 'success' && (
                            <div className="py-6 space-y-6">
                                <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                    <PartyPopper size={40} className="animate-bounce" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Verified!</h2>
                                    <p className="text-green-600 dark:text-green-400 font-bold">+{selectedChallenge.points} XP Earned</p>
                                    <p className="text-sm text-slate-500 mt-2">"{verificationReason}"</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedChallenge(null)}
                                    className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform"
                                >
                                    Awesome!
                                </button>
                            </div>
                        )}

                        {verificationStatus === 'failed' && (
                            <div className="py-6 space-y-6">
                                <div className="w-24 h-24 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500">
                                    <X size={40} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Not Verified</h2>
                                    <p className="text-slate-500 font-medium">We couldn't confirm the challenge.</p>
                                    <p className="text-sm text-red-500 mt-2 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">"{verificationReason}"</p>
                                </div>
                                <button 
                                    onClick={() => setVerificationStatus('idle')}
                                    className="w-full py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

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
                <div className="text-4xl font-black text-slate-900 dark:text-white group-hover:scale-110 transition-transform">1</div>
            </div>
            <div className="h-12 w-px bg-slate-200 dark:bg-slate-700"></div>
             <div className="text-center group cursor-default">
                <div className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1 group-hover:text-primary transition-colors">Points</div>
                <div className="text-4xl font-black text-primary group-hover:scale-110 transition-transform">{points}</div>
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
            <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-xs mx-auto">You've saved <b>12kg of CO2</b> this week! That's equivalent to planting 2 trees.</p>
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
                    
                    <button 
                        onClick={() => handleAcceptChallenge(challenge)}
                        className="mt-8 relative overflow-hidden flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold group-hover:bg-primary group-hover:text-white transition-all duration-300"
                    >
                        <span className="relative z-10 flex items-center gap-2">Accept Challenge</span>
                    </button>
                </Card>
            ))}
         </div>
      </div>
    </div>
  );
}