'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useSocket } from '@/components/SocketProvider';
import { Activity, Radio, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function LiveAttendance() {
  const [logs, setLogs] = useState<any[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    
    // Listen for real-time RFID scans
    socket.on('rfid_scan', (attendance) => {
      setLogs((prevLogs) => [attendance, ...prevLogs].slice(0, 50)); // keep last 50
    });

    return () => {
      socket.off('rfid_scan');
    };
  }, [socket]);

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink-primary font-display tracking-tight">Live Attendance</h1>
          <p className="text-ink-secondary mt-1">Real-time student tap-ins from RFID turnstiles</p>
        </div>
        <div className="bg-interactive-blue/10 text-interactive-blue px-4 py-2 rounded-lg font-medium flex items-center gap-2 w-fit">
          <Activity size={18} className="animate-pulse" />
          <span>System Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg text-ink-primary font-display">Today's Scans</h3>
              <span className="text-sm font-semibold text-ink-secondary bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                {logs.length} Total
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 bg-white">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Radio size={36} className="text-blue-300" />
                  </div>
                  <h3 className="text-xl font-bold text-ink-primary mb-2">Waiting for live RFID taps...</h3>
                  <p className="text-ink-secondary max-w-sm">Students entering through gates will appear here instantly.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log, i) => (
                    <div 
                      key={log.id || i} 
                      className={`flex justify-between items-center p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all ${i === 0 ? 'border-l-4 border-l-interactive-blue bg-blue-50/30' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                          {log.student?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-bold text-ink-primary">{log.student?.name || 'Unknown Student'}</div>
                          <div className="text-xs text-ink-secondary font-data mt-0.5">RFID: {log.student?.rfidCardUid}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Present</div>
                        <div className="text-xs text-ink-secondary font-data mt-1.5">
                          {new Date(log.markedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Simulator & Status */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-ink-primary font-display">Simulator</h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-ink-secondary mb-4">
                Use this form to simulate a hardware RFID scan hitting the backend API.
              </p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const uid = (e.target as any).rfid.value;
                try {
                  await api.post('/attendance/rfid-tap', { rfidCardUid: uid });
                  (e.target as any).reset();
                } catch (err: any) {
                  alert(err.message || 'Simulation failed. Check if RFID is registered.');
                }
              }}>
                <input 
                  type="text" 
                  name="rfid" 
                  placeholder="Enter UID (e.g. A1B2C3D4)" 
                  required 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue font-data mb-3"
                />
                <button 
                  type="submit" 
                  className="w-full bg-ink-primary hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm"
                >
                  Simulate Tap
                </button>
              </form>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-ink-primary font-display">Gate Status</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-green-600" />
                  <span className="font-medium text-green-900">Main Entrance</span>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-0.5 rounded-full uppercase tracking-wider">Online</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-green-600" />
                  <span className="font-medium text-green-900">Library Scanner</span>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-0.5 rounded-full uppercase tracking-wider">Online</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="flex items-center gap-3">
                  <ShieldAlert size={18} className="text-red-600" />
                  <span className="font-medium text-red-900">Cafeteria Gate</span>
                </div>
                <span className="text-xs font-bold text-red-700 bg-red-200 px-2 py-0.5 rounded-full uppercase tracking-wider">Offline</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
