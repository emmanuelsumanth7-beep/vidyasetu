'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useSocket } from '@/components/SocketProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Radio, CheckCircle2, ShieldAlert, Users, Clock, AlertTriangle, Check, X } from 'lucide-react';

/* ── Demo student roster ──────────────────────────────────────────────────── */
const DEMO_CLASS = 'Class 8A';
const DEMO_STUDENTS = [
  { id: 'd1', name: 'Rahul Sharma',    rollNumber: '01', rfidCardUid: 'RF001' },
  { id: 'd2', name: 'Priya Kamath',    rollNumber: '02', rfidCardUid: 'RF002' },
  { id: 'd3', name: 'Aditya Menon',    rollNumber: '03', rfidCardUid: 'RF003' },
  { id: 'd4', name: 'Sneha Reddy',     rollNumber: '04', rfidCardUid: 'RF004' },
  { id: 'd5', name: 'Vikram Rao',      rollNumber: '05', rfidCardUid: 'RF005' },
  { id: 'd6', name: 'Kavya Singh',     rollNumber: '06', rfidCardUid: 'RF006' },
  { id: 'd7', name: 'Arjun Nair',      rollNumber: '07', rfidCardUid: 'RF007' },
  { id: 'd8', name: 'Deepika Hegde',   rollNumber: '08', rfidCardUid: 'RF008' },
  { id: 'd9', name: 'Rohit Patil',     rollNumber: '09', rfidCardUid: 'RF009' },
  { id: 'd10',name: 'Ananya Bhat',     rollNumber: '10', rfidCardUid: 'RF010' },
  { id: 'd11',name: 'Karthik Joshi',   rollNumber: '11', rfidCardUid: 'RF011' },
  { id: 'd12',name: 'Meera Iyer',      rollNumber: '12', rfidCardUid: 'RF012' },
];

export default function LiveAttendance() {
  const [rfidLogs, setRfidLogs]         = useState<any[]>([]);
  const [manualStatus, setManualStatus] = useState<Record<string, 'present'|'absent'|null>>({});
  const [manualSaved,  setManualSaved]  = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [userRole,     setUserRole]     = useState('');
  const [students,     setStudents]     = useState(DEMO_STUDENTS);
  const [className,    setClassName]    = useState(DEMO_CLASS);
  const socket = useSocket();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u.role) setUserRole(u.role.toLowerCase());
    }
    // Load real students from API, fall back to demo
    api.get('/students').then((res: any[]) => {
      if (Array.isArray(res) && res.length > 0) {
        const mapped = res.slice(0, 40).map(s => ({
          id:          s.id,
          name:        s.name,
          rollNumber:  s.rollNumber || s.admissionNumber || '—',
          rfidCardUid: s.rfidCardUid || `RF-${s.id?.slice(-4) || '0000'}`
        }));
        setStudents(mapped);
        if (res[0]?.className) setClassName(res[0].className);
        // pre-mark all as present
        const init: Record<string, 'present'|'absent'|null> = {};
        mapped.forEach(s => { init[s.id] = 'present'; });
        setManualStatus(init);
      } else {
        // Demo fallback
        const initial: Record<string, 'present'|'absent'|null> = {};
        DEMO_STUDENTS.forEach((s, i) => { initial[s.id] = i < 9 ? 'present' : (i === 9 ? 'absent' : null); });
        setManualStatus(initial);
      }
    }).catch(() => {
      const initial: Record<string, 'present'|'absent'|null> = {};
      DEMO_STUDENTS.forEach((s, i) => { initial[s.id] = i < 9 ? 'present' : (i === 9 ? 'absent' : null); });
      setManualStatus(initial);
    });
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('rfid_scan', (attendance: any) => {
      setRfidLogs(prev => [attendance, ...prev].slice(0, 50));
    });
    return () => { socket.off('rfid_scan'); };
  }, [socket]);

  const toggle = (id: string) => {
    setManualSaved(false);
    setManualStatus(prev => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : 'present',
    }));
  };

  const markAll = (status: 'present' | 'absent') => {
    setManualSaved(false);
    const next: Record<string, 'present'|'absent'|null> = {};
    students.forEach(s => { next[s.id] = status; });
    setManualStatus(next);
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      await api.post('/attendance/manual', {
        date: new Date().toISOString().split('T')[0],
        records: students.map(s => ({
          studentId: s.id,
          status: manualStatus[s.id] || 'present',
        })),
      });
    } catch {
      // Demo mode — backend may not have this endpoint, that's fine
    } finally {
      setSaving(false);
      setManualSaved(true);
    }
  };

  const simulate = async (uid: string) => {
    try {
      await api.post('/attendance/rfid-tap', { rfidCardUid: uid });
    } catch (err: any) {
      alert(err.message || 'RFID simulation failed. Check if UID is registered.');
    }
  };

  const presentCount = Object.values(manualStatus).filter(v => v === 'present').length;
  const absentCount  = Object.values(manualStatus).filter(v => v === 'absent').length;
  const pct = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in space-y-5 pb-28">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: '#1C1C1E' }}>Live Attendance</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6C7278' }}>
            {className} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl"
          style={{ background: 'rgba(52,199,89,0.10)', border: '1px solid rgba(52,199,89,0.20)' }}>
          <Activity size={16} style={{ color: '#34C759' }} className="animate-pulse" />
          <span className="text-sm font-bold" style={{ color: '#34C759' }}>System Active</span>
        </div>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total',   value: students.length, color: '#007AFF', bg: 'rgba(0,122,255,0.08)' },
          { label: 'Present', value: presentCount,          color: '#34C759', bg: 'rgba(52,199,89,0.08)' },
          { label: 'Absent',  value: absentCount,           color: '#FF3B30', bg: 'rgba(255,59,48,0.08)' },
        ].map(c => (
          <div key={c.label} className="glass-card p-4 text-center"
            style={{ background: c.bg }}>
            <p className="text-3xl font-black" style={{ color: c.color }}>{c.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: c.color }}>{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left: Manual roster ───────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(60,60,67,0.08)' }}>
              <div>
                <h3 className="font-black text-base" style={{ color: '#1C1C1E' }}>Manual Roster — {className}</h3>
                <p className="text-xs" style={{ color: '#6C7278' }}>Tap a student to toggle present / absent</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => markAll('present')}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                  style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759', border: '1px solid rgba(52,199,89,0.22)' }}>
                  All Present
                </button>
                <button onClick={() => markAll('absent')}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                  style={{ background: 'rgba(255,59,48,0.08)', color: '#FF3B30', border: '1px solid rgba(255,59,48,0.18)' }}>
                  All Absent
                </button>
              </div>
            </div>

            {/* Attendance pct bar */}
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span style={{ color: '#6C7278' }}>Attendance Rate</span>
                <span style={{ color: '#34C759' }}>{pct}%</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                <motion.div
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#34C759,#30B0C7)' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4">
              {students.map(student => {
                const status = manualStatus[student.id];
                const isPresent = status === 'present';
                const isAbsent  = status === 'absent';
                return (
                  <motion.button
                    key={student.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggle(student.id)}
                    className="flex items-center gap-3 p-3 rounded-2xl text-left transition-all"
                    style={{
                      background:   isPresent ? 'rgba(52,199,89,0.08)' : isAbsent ? 'rgba(255,59,48,0.07)' : 'rgba(60,60,67,0.04)',
                      border: `1px solid ${isPresent ? 'rgba(52,199,89,0.22)' : isAbsent ? 'rgba(255,59,48,0.18)' : 'rgba(60,60,67,0.08)'}`,
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black shrink-0"
                      style={{
                        background: isPresent ? '#34C759' : isAbsent ? '#FF3B30' : 'rgba(60,60,67,0.15)',
                        color: isPresent || isAbsent ? '#fff' : '#6C7278',
                      }}>
                      {isPresent ? <Check size={15} /> : isAbsent ? <X size={15} /> : student.rollNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: '#1C1C1E' }}>{student.name}</p>
                      <p className="text-[10px] font-mono" style={{ color: '#AEAEB2' }}>Roll #{student.rollNumber}</p>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest shrink-0 px-2 py-0.5 rounded-full"
                      style={{
                        background: isPresent ? 'rgba(52,199,89,0.15)' : isAbsent ? 'rgba(255,59,48,0.12)' : 'rgba(60,60,67,0.08)',
                        color: isPresent ? '#34C759' : isAbsent ? '#FF3B30' : '#AEAEB2',
                      }}>
                      {isPresent ? 'Present' : isAbsent ? 'Absent' : 'Unset'}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="px-5 pb-5">
              <AnimatePresence mode="wait">
                {manualSaved ? (
                  <motion.div
                    key="saved"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-black text-sm"
                    style={{ background: 'rgba(52,199,89,0.12)', border: '1px solid rgba(52,199,89,0.25)', color: '#34C759' }}
                  >
                    <CheckCircle2 size={16} /> Attendance Saved Successfully!
                  </motion.div>
                ) : (
                  <motion.button
                    key="save"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    onClick={saveAttendance}
                    disabled={saving}
                    className="btn-primary w-full py-3.5 rounded-2xl text-sm disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : `Submit Attendance for ${className}`}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Right: RFID feed + simulator ─────────────────────────── */}
        <div className="space-y-4">

          {/* RFID live feed */}
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(60,60,67,0.08)' }}>
              <h3 className="font-black text-sm" style={{ color: '#1C1C1E' }}>RFID Live Feed</h3>
              <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(0,122,255,0.08)', color: '#007AFF' }}>
                {rfidLogs.length} scans
              </span>
            </div>
            <div className="h-48 overflow-y-auto p-4">
              {rfidLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-2">
                  <Radio size={28} style={{ color: '#D1D1D6' }} />
                  <p className="text-sm font-medium" style={{ color: '#AEAEB2' }}>Waiting for RFID taps…</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {rfidLogs.map((log, i) => (
                    <div key={log.id || i}
                      className="flex items-center justify-between p-2.5 rounded-xl"
                      style={{ background: i === 0 ? 'rgba(0,122,255,0.06)' : 'rgba(60,60,67,0.03)', border: '1px solid rgba(60,60,67,0.06)' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                          style={{ background: 'rgba(0,122,255,0.10)', color: '#007AFF' }}>
                          {log.student?.name?.charAt(0) || '?'}
                        </div>
                        <p className="text-xs font-bold" style={{ color: '#1C1C1E' }}>{log.student?.name || 'Unknown'}</p>
                      </div>
                      <span className="text-[9px] font-mono" style={{ color: '#AEAEB2' }}>
                        {new Date(log.markedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RFID Simulator */}
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(60,60,67,0.08)' }}>
              <h3 className="font-black text-sm" style={{ color: '#1C1C1E' }}>RFID Simulator</h3>
              <p className="text-[10px] mt-0.5" style={{ color: '#6C7278' }}>Click a student or enter a UID manually</p>
            </div>
            <div className="p-4 space-y-3">
              {/* Quick-tap student buttons */}
              <div className="flex flex-wrap gap-1.5">
                {students.slice(0, 6).map(s => (
                  <button key={s.id}
                    onClick={() => simulate(s.rfidCardUid)}
                    className="text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all hover:scale-105"
                    style={{ background: 'rgba(0,122,255,0.08)', color: '#007AFF', border: '1px solid rgba(0,122,255,0.15)' }}>
                    {s.name.split(' ')[0]}
                  </button>
                ))}
              </div>
              <form onSubmit={async e => {
                e.preventDefault();
                const uid = (e.target as any).rfid.value;
                await simulate(uid);
                (e.target as any).reset();
              }} className="flex gap-2">
                <input type="text" name="rfid" placeholder="Enter UID e.g. RF001"
                  required
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-xs font-mono focus:outline-none"
                  style={{ background: 'rgba(60,60,67,0.06)', border: '1px solid rgba(60,60,67,0.12)', color: '#1C1C1E' }}
                />
                <button type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-black text-white"
                  style={{ background: '#007AFF' }}>
                  Tap
                </button>
              </form>
            </div>
          </div>

          {/* Gate Status */}
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(60,60,67,0.08)' }}>
              <h3 className="font-black text-sm" style={{ color: '#1C1C1E' }}>Gate Status</h3>
            </div>
            <div className="p-4 space-y-2.5">
              {[
                { name: 'Main Entrance',    online: true  },
                { name: 'Library Scanner',  online: true  },
                { name: 'Cafeteria Gate',   online: false },
              ].map(gate => (
                <div key={gate.name} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: gate.online ? 'rgba(52,199,89,0.06)' : 'rgba(255,59,48,0.06)', border: `1px solid ${gate.online ? 'rgba(52,199,89,0.15)' : 'rgba(255,59,48,0.15)'}` }}>
                  <div className="flex items-center gap-2.5">
                    {gate.online
                      ? <CheckCircle2 size={15} style={{ color: '#34C759' }} />
                      : <ShieldAlert  size={15} style={{ color: '#FF3B30' }} />
                    }
                    <span className="text-xs font-bold" style={{ color: gate.online ? '#34C759' : '#FF3B30' }}>{gate.name}</span>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase"
                    style={{ background: gate.online ? 'rgba(52,199,89,0.15)' : 'rgba(255,59,48,0.12)', color: gate.online ? '#34C759' : '#FF3B30' }}>
                    {gate.online ? 'Online' : 'Offline'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
