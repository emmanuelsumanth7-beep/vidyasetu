'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/5 animate-pulse" />;
  }

  const isDark = theme === 'dark';

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors relative overflow-hidden"
      style={{
        background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
        border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
        color: isDark ? '#FFF' : '#1C1C1E'
      }}
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        initial={false}
        animate={{
          y: isDark ? -30 : 0,
          opacity: isDark ? 0 : 1
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="absolute"
      >
        <Sun size={20} />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          y: isDark ? 0 : 30,
          opacity: isDark ? 1 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="absolute"
      >
        <Moon size={20} />
      </motion.div>
    </motion.button>
  );
}
