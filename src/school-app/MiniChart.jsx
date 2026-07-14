import { useState } from 'react';

export function MiniChart({ type = 'line' }) {
  if (type === 'donut') {
    return (
      <div className="donut-chart animate-scale-in" aria-label="Class strength chart">
        <svg viewBox="0 0 36 36" className="circular-chart interactive-hover">
          <path className="circle-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path className="circle-path animate-draw"
            strokeDasharray="75, 100"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span className="donut-label">5A</span>
      </div>
    );
  }

  if (type === 'bar') {
    return (
      <div className="bar-chart" aria-label="Collection chart">
        {[82, 74, 91, 64, 88, 76].map((height, index) => (
          <span 
            key={index} 
            className="animate-grow-up interactive-hover tooltip-trigger"
            style={{ '--height': `${height}%`, animationDelay: `${index * 100}ms` }} 
            title={`${height}%`}
          />
        ))}
      </div>
    );
  }

  return (
    <svg className="line-chart interactive-hover" viewBox="0 0 320 140" role="img" aria-label="Attendance trend">
      <defs>
        <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-glow)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path className="animate-draw-line" d="M8 118 C 52 84, 70 92, 104 72 S 160 48, 198 64 S 256 82, 312 28" fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" />
      <path className="animate-fade-in" style={{ animationDelay: '500ms' }} d="M8 118 C 52 84, 70 92, 104 72 S 160 48, 198 64 S 256 82, 312 28 L312 138 L8 138 Z" fill="url(#lineFill)" />
    </svg>
  );
}
