'use client';

import { Card } from '@/components/ui/Card';
import { BookOpen, Video, Lightbulb, Search, ArrowRight, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const categories = ["All", "Energy", "Waste", "Water", "Lifestyle"];

const articles = [
  {
    title: "Understanding Carbon Footprint",
    category: "Energy",
    readTime: "5 min read",
    image: "from-blue-500 to-indigo-600",
    icon: BookOpen,
    date: "12 May"
  },
  {
    title: "10 Easy Ways to Reduce Plastic",
    category: "Waste",
    readTime: "3 min read",
    image: "from-emerald-400 to-teal-500",
    icon: Lightbulb,
    date: "10 May"
  },
  {
    title: "The Future of Solar Energy",
    category: "Energy",
    readTime: "8 min watch",
    image: "from-amber-400 to-orange-500",
    icon: Video,
    date: "08 May"
  },
  {
    title: "Water Conservation Basics",
    category: "Water",
    readTime: "4 min read",
    image: "from-cyan-400 to-blue-500",
    icon: BookOpen,
    date: "05 May"
  },
  {
    title: "Minimalist Living Guide",
    category: "Lifestyle",
    readTime: "6 min read",
    image: "from-purple-400 to-pink-500",
    icon: BookOpen,
    date: "01 May"
  },
  {
    title: "Composting 101",
    category: "Waste",
    readTime: "7 min watch",
    image: "from-lime-400 to-green-500",
    icon: Video,
    date: "28 Apr"
  }
];

export default function ResourceLibrary() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles = activeCategory === "All" 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
              <Link href="/eco-learn" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-4 transition-colors font-medium text-sm">
                  <ArrowLeft size={16} /> Back to Hub
              </Link>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">Resource Library</h1>
              <p className="text-slate-500 font-medium">Browse our full collection of sustainability guides and videos.</p>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                  <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                          activeCategory === cat 
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' 
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
      </div>

      {/* Article Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
        {filteredArticles.map((article, i) => (
             <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={article.title}
             >
                <Card className="h-full group cursor-pointer hover:-translate-y-2 transition-transform duration-500 p-0 overflow-hidden border-0 shadow-lg hover:shadow-2xl dark:shadow-black/50" delay={0}>
                    <div className={`h-48 bg-gradient-to-br ${article.image} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-50 group-hover:scale-100">
                             <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
                                {article.icon === Video ? <PlayCircle size={32} className="text-white" /> : <ArrowRight size={32} className="text-white" />}
                             </div>
                        </div>
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm text-slate-900 dark:text-white">
                                {article.category}
                            </span>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
                             <span className="flex items-center gap-1"><article.icon size={12} /> {article.readTime}</span>
                             <span>{article.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-primary transition-colors">
                            {article.title}
                        </h3>
                        <div className="flex items-center text-sm font-bold text-primary mt-auto opacity-60 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                            Read Now <ArrowRight size={16} className="ml-2" />
                        </div>
                    </div>
                </Card>
             </motion.div>
        ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}