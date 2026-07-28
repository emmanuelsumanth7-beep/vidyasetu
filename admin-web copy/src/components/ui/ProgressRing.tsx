'use client';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function ProgressRing({ progress, size = 48, strokeWidth = 4, color = '#007AFF' }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-10"
          style={{ color }}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      {/* Inner Content Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black" style={{ color }}>
        {progress}%
      </div>
    </div>
  );
}
