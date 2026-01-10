'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, BarChart3, Trophy, GraduationCap, Zap, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { name: 'Home', href: '/', icon: Leaf },
  { name: 'Eco AI', href: '/eco-ai', icon: Zap },
  { name: 'Eco Predict', href: '/eco-predict', icon: BarChart3 },
  { name: 'Eco Challenge', href: '/eco-challenge', icon: Trophy },
  { name: 'Eco Learn', href: '/eco-learn', icon: GraduationCap },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 w-full z-50 flex justify-center pt-4 px-4 pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={clsx(
          "pointer-events-auto rounded-full transition-all duration-500 mx-auto border border-white/20 dark:border-slate-700/30",
          scrolled 
            ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl py-2 px-6 shadow-xl shadow-slate-200/20 dark:shadow-black/20 w-auto" 
            : "bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg py-3 px-8 shadow-lg w-full max-w-7xl"
        )}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="bg-primary p-1.5 rounded-xl shadow-lg shadow-primary/20"
              >
                <Leaf className="h-5 w-5 text-white" />
              </motion.div>
              <span className={clsx(
                "text-xl font-display font-bold tracking-tight text-slate-900 dark:text-white transition-all", 
                scrolled ? "hidden md:block" : "block"
              )}>
                ECO360
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      'relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full group font-sans',
                      isActive
                        ? 'text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                     {isActive && (
                      <motion.div
                        layoutId="navbar-pill"
                        className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/25"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                       {/* Icon is hidden on larger screens for cleaner look, shown on hover if desired, or kept simpler */}
                       <span className={clsx("transition-opacity", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 hidden lg:block")}>
                          <item.icon className="w-3.5 h-3.5" />
                       </span>
                       {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 dark:text-slate-400 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="pointer-events-auto absolute top-20 inset-x-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-4 shadow-2xl border border-white/20 dark:border-slate-700/30 flex flex-col gap-2 md:hidden z-50 origin-top"
          >
             {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                  >
                     <item.icon className="w-5 h-5" />
                     {item.name}
                  </Link>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
