'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, HTMLMotionProps } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  title?: string;
  description?: string;
  delay?: number;
  children?: React.ReactNode;
}

export function Card({ className, title, description, children, delay = 0, ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, type: "spring", bounce: 0.3 }}
      className={cn(
        "glass-card rounded-3xl overflow-hidden",
        "shadow-lg dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-primary/5 dark:hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="flex flex-col space-y-1.5 p-8 border-b border-black/5 dark:border-white/5">
          {title && <h3 className="text-2xl font-bold leading-none tracking-tight text-slate-900 dark:text-white font-display">{title}</h3>}
          {description && <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{description}</p>}
        </div>
      )}
      <div className="p-8">{children}</div>
    </motion.div>
  );
}
