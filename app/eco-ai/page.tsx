'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { CloudSun, Wind, Droplets, Thermometer, Send, User, Bot, Sparkles, Zap, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EcoAIDashboard() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Eco AI Assistant. How can I help you make sustainable choices today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: "This is a placeholder response. In a real application, I would connect to the Gemini API to answer your question about sustainability!" }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between mb-8"
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
        <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Connection
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Data */}
        <div className="lg:col-span-2 space-y-6">
             {/* Card 1: Current Environmental Conditions */}
            <Card className="p-0 overflow-visible" delay={0.1}>
                 <div className="flex items-center justify-between mb-6">
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white">Current Conditions</h3>
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">San Francisco, CA</span>
                 </div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-default">
                        <CloudSun className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform" />
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">72°F</div>
                            <div className="text-xs text-slate-500 font-medium">Partly Cloudy</div>
                        </div>
                    </div>
                     <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors cursor-default">
                         <div className="relative">
                            <div className="absolute inset-0 bg-green-400 blur-lg opacity-20"></div>
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400 relative z-10">45</span>
                         </div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">AQI Good</div>
                    </div>
                     <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default">
                        <Wind className="h-6 w-6 text-slate-400 group-hover:rotate-180 transition-transform duration-700" />
                        <div>
                            <div className="text-xl font-bold text-slate-900 dark:text-white">8 <span className="text-sm font-normal text-slate-500">mph</span></div>
                            <div className="text-xs text-slate-500 font-medium">North West</div>
                        </div>
                    </div>
                    <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default">
                        <Droplets className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
                        <div>
                            <div className="text-xl font-bold text-slate-900 dark:text-white">42%</div>
                            <div className="text-xs text-slate-500 font-medium">Humidity</div>
                        </div>
                    </div>
                 </div>
            </Card>

            {/* Card 2: AI Insight Engine */}
            <Card title="Daily Insight" delay={0.2} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <div className="flex gap-4 mb-6">
                    <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                            <Sparkles size={20} />
                        </div>
                    </div>
                    <div>
                         <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                            "Excellent conditions today! <span className="font-semibold text-primary">Solar potential is at 95%</span>. Consider running high-energy appliances before 4 PM to maximize renewable usage."
                         </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl hover:border-emerald-200 transition-colors">
                        <h4 className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 mb-3 text-sm uppercase tracking-wide">
                            <ArrowUpRight className="w-4 h-4" /> Recommended
                        </h4>
                        <ul className="space-y-3">
                             <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-emerald-100">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                                 Open windows for natural ventilation
                             </li>
                             <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-emerald-100">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                                 Walk or cycle for short commutes
                             </li>
                        </ul>
                    </div>
                    
                    <div className="p-5 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl hover:border-amber-200 transition-colors">
                        <h4 className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400 mb-3 text-sm uppercase tracking-wide">
                             <AlertTriangle className="w-4 h-4" /> Avoid
                        </h4>
                         <ul className="space-y-3">
                             <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-amber-100">
                                 <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div>
                                 Idling car engine unnecessarily
                             </li>
                             <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-amber-100">
                                 <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div>
                                 AC usage below 74°F
                             </li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>

        {/* Right Column: Chatbot */}
        <div className="lg:col-span-1">
             <Card title="Eco Assistant" className="h-[600px] flex flex-col p-0 overflow-hidden border-0 shadow-2xl" delay={0.3}>
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
             </Card>
        </div>
      </div>
    </div>
  );
}
