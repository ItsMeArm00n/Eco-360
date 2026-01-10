'use client';

import { Sparkles } from 'lucide-react';

export default function EcoPredict() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
       <div className="p-6 bg-secondary/10 rounded-full animate-float">
         <Sparkles className="w-12 h-12 text-secondary" />
       </div>
       <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white">
          Eco Predict
       </h1>
       <p className="text-xl text-slate-500 max-w-lg mx-auto font-sans">
          Our AI prediction models are currently retraining for better accuracy. <br/> Check back soon for forecasted data.
       </p>
    </div>
  );
}
