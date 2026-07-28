'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useTheme } from 'next-themes';

export function AppBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<{ width: number; height: number; left: string; top: string; opacity: number; duration: number }[]>([]);

  const isDark = theme === 'dark';

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    setStars(
      Array.from({ length: 30 }).map(() => ({
        width: Math.random() * 2 + 0.5,
        height: Math.random() * 2 + 0.5,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 4 + 2,
      }))
    );
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    if (isDark && mounted) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDark, mounted, mouseX, mouseY]);

  const bgGradient = useMotionTemplate`radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(196,155,42,0.12) 0%, transparent 60%)`;

  if (!mounted) return null;

  if (!isDark) {
    return (
      <div className="fixed inset-0 overflow-hidden bg-[#F8FAFC] -z-50 pointer-events-none">
        {/* Soft elegant mesh for light mode */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(196,155,42,0.06)_0%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(27,42,74,0.04)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(52,199,89,0.03)_0%,transparent_50%)]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#03050B] -z-50 pointer-events-none">
      {/* Deep space base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(27,42,74,0.4)_0%,transparent_100%)]" />
      {/* Mouse follow glow */}
      <motion.div className="absolute inset-0 z-0 hidden md:block" style={{ background: bgGradient }} />
      {/* Aurora Orbs */}
      <motion.div
        className="absolute rounded-full mix-blend-screen"
        style={{
          width: '80vw', height: '80vw', maxWidth: 800, maxHeight: 800,
          top: '-20%', left: '-10%',
          background: 'radial-gradient(circle, rgba(27,42,74,0.4) 0%, rgba(27,42,74,0) 70%)',
          filter: 'blur(90px)',
        }}
        animate={{ x: [0, 50, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full mix-blend-screen"
        style={{
          width: '60vw', height: '60vw', maxWidth: 600, maxHeight: 600,
          bottom: '-10%', right: '-10%',
          background: 'radial-gradient(circle, rgba(196,155,42,0.15) 0%, rgba(196,155,42,0) 70%)',
          filter: 'blur(80px)',
        }}
        animate={{ x: [0, -40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Micro-stars */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: star.width, height: star.height,
              left: star.left, top: star.top,
              opacity: star.opacity,
            }}
            animate={{ opacity: [0.1, 0.9, 0.1] }}
            transition={{ duration: star.duration, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Cinematic noise overlay */}
      <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
    </div>
  );
}
