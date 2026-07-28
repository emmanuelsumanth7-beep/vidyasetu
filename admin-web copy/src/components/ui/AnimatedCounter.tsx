'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, prefix = '', suffix = '', decimals = 0, duration = 1.5, className = '' }: AnimatedCounterProps) {
  const [mounted, setMounted] = useState(false);
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const displayValue = useTransform(springValue, (current) => {
    // Determine formatting based on the target value's type/magnitude if needed
    // E.g., formatting 124000 as "1.24L" is best handled by passing the raw number here
    // but the component is simple and just does raw formatting with decimals.
    if (value >= 100000 && suffix === 'L') {
       return prefix + (current / 100000).toFixed(decimals) + suffix;
    }
    return prefix + current.toFixed(decimals) + suffix;
  });

  useEffect(() => {
    setMounted(true);
    // Add a tiny delay to allow page transition before animating
    setTimeout(() => springValue.set(value), 150);
  }, [value, springValue]);

  if (!mounted) {
    return <span className={className}>{prefix}{(0).toFixed(decimals)}{suffix}</span>;
  }

  return <motion.span className={className}>{displayValue}</motion.span>;
}
