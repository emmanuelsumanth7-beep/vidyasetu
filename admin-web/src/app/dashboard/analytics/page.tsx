'use client';
import { Activity } from 'lucide-react';
export default function AnalyticsDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-fade-in">
      <div className="w-24 h-24 bg-fuchsia-50 rounded-full flex items-center justify-center text-fuchsia-600 mb-6">
        <Activity size={48} strokeWidth={1.5} />
      </div>
      <h1 className="text-4xl font-bold font-display text-ink-primary tracking-tight">Analytics Dashboard</h1>
      <p className="text-ink-secondary mt-2 max-w-md">Detailed financial and academic analytics are being compiled. This module will be available in the next major update.</p>
    </div>
  );
}
