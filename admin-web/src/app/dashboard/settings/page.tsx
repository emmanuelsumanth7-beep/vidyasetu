'use client';
import { Settings } from 'lucide-react';
export default function SettingsDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-fade-in">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mb-6">
        <Settings size={48} strokeWidth={1.5} />
      </div>
      <h1 className="text-4xl font-bold font-display text-ink-primary tracking-tight">System Settings</h1>
      <p className="text-ink-secondary mt-2 max-w-md">Global configuration for academic years, fee structures, and school details are locked for the current session.</p>
    </div>
  );
}
