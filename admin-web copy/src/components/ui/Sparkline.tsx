'use client';
import { motion } from 'framer-motion';

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

export function Sparkline({ data, color = '#007AFF', width = 120, height = 32, strokeWidth = 2.5 }: SparklineProps) {
  if (data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = strokeWidth; // Prevents clipping at the top/bottom

  // Calculate points
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    // Invert Y axis because SVG 0,0 is top-left
    const y = height - padding - ((d - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;

  return (
    <svg width={width} height={height} className="overflow-visible" viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      
      {/* Area under the line */}
      <motion.path
        d={`${pathD} L ${width} ${height} L 0 ${height} Z`}
        fill={`url(#gradient-${color.replace('#', '')})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      />
      
      {/* The line itself */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
      />
    </svg>
  );
}
