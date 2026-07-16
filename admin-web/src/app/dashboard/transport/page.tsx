'use client';
import { Bus } from 'lucide-react';
export default function TransportDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-fade-in">
      <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-6">
        <Bus size={48} strokeWidth={1.5} />
      </div>
      <h1 className="text-4xl font-bold font-display text-ink-primary tracking-tight">Transport Fleet</h1>
      <p className="text-ink-secondary mt-2 max-w-md">GPS integration for live tracking of the school bus fleet is currently being provisioned by the vendor.</p>
    </div>
  );
}
