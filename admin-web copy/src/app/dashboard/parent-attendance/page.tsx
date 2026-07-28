'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';

// Demo data shown when API returns empty / no linked student
const DEMO_DATA = {
  student: { name: 'Aryan Sharma', rollNumber: 'ADM-001' },
  records: [
    { id:'a1', date: new Date(Date.now()-0*86400000).toISOString(), status:'PRESENT', source:'MANUAL' },
    { id:'a2', date: new Date(Date.now()-1*86400000).toISOString(), status:'PRESENT', source:'RFID' },
    { id:'a3', date: new Date(Date.now()-2*86400000).toISOString(), status:'ABSENT',  source:'MANUAL' },
    { id:'a4', date: new Date(Date.now()-3*86400000).toISOString(), status:'PRESENT', source:'RFID' },
    { id:'a5', date: new Date(Date.now()-4*86400000).toISOString(), status:'PRESENT', source:'MANUAL' },
    { id:'a6', date: new Date(Date.now()-5*86400000).toISOString(), status:'PRESENT', source:'RFID' },
    { id:'a7', date: new Date(Date.now()-7*86400000).toISOString(), status:'PRESENT', source:'MANUAL' },
    { id:'a8', date: new Date(Date.now()-8*86400000).toISOString(), status:'LATE',    source:'RFID' },
    { id:'a9', date: new Date(Date.now()-9*86400000).toISOString(), status:'ABSENT',  source:'MANUAL' },
    { id:'a10',date: new Date(Date.now()-10*86400000).toISOString(),status:'PRESENT', source:'RFID' },
  ]
};

export default function ParentAttendancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/attendance/parent');
      setData(res?.records ? res : DEMO_DATA);
    } catch (e) {
      setData(DEMO_DATA);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto w-full p-8 animate-fade-in pb-20">
        <div className="h-64 bg-white/20 backdrop-blur-md rounded-[32px] shadow-sm border border-white/40 animate-pulse" />
      </div>
    );
  }

  const { student, records } = data || DEMO_DATA;
  const presentCount = records.filter((r: any) => r.status === 'PRESENT' || r.status === 'present').length;
  const pct = records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0;


  return (
    <div className="max-w-[1200px] mx-auto w-full animate-fade-in pb-20 font-body relative">
      {/* Liquid Abstract Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none -z-10"></div>
      <div className="fixed top-[20%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none -z-10"></div>

      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-display text-gray-900 tracking-tight">Attendance Record</h1>
          <p className="text-sm font-medium text-gray-600 mt-1">
            Viewing attendance for {student.name} ({student.rollNumber})
          </p>
        </div>
      </header>

      <div className="bg-white/40 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] overflow-hidden">
        <div className="p-6 border-b border-white/50 flex justify-between items-center bg-white/30">
          <h3 className="text-xl font-bold text-gray-900 font-display flex items-center gap-2">
            <Calendar className="text-indigo-600" size={24} /> Recent Records
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/50 border-b border-white/50">
              <tr>
                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-16 text-center text-gray-500 font-medium">No records available.</td>
                </tr>
              ) : records.map((record: any) => (
                <tr key={record.id} className="hover:bg-white/40 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-800">
                      <Calendar size={16} className="text-indigo-500" />
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-5">
                    {record.status === 'present' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100/50 text-emerald-700 border border-emerald-200/50 text-xs font-bold rounded-lg uppercase tracking-widest">
                        <CheckCircle2 size={14} /> Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100/50 text-red-700 border border-red-200/50 text-xs font-bold rounded-lg uppercase tracking-widest">
                        <XCircle size={14} /> Absent
                      </span>
                    )}
                  </td>
                  <td className="p-5 capitalize font-medium text-gray-600 text-sm">{record.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
