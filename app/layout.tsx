import type { Metadata } from 'next';
import { Outfit, Manrope } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeContext';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'ECO360 - Sustainable Future',
  description: 'AI-powered environmental insights and sustainability tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${manrope.variable} font-sans antialiased text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
        <ThemeProvider>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-28 relative z-10">
            {/* Background Animations */}
             <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
              <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-[600px] h-[600px] bg-purple-100/40 dark:bg-purple-900/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob animation-delay-4000"></div>
            </div>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
