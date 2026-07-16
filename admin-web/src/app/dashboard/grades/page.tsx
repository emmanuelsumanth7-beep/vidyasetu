'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Award, FileText } from 'lucide-react';

export default function GradesDashboard() {
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/marks');
      setMarks(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="max-w-[1200px] mx-auto w-full p-8 animate-fade-in pb-20">
      <div className="h-64 bg-white/20 backdrop-blur-md rounded-[32px] shadow-sm border border-white/40 animate-pulse" />
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-fade-in pb-20 font-body relative">
      {/* Liquid Abstract Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none -z-10"></div>
      <div className="fixed top-[20%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none -z-10"></div>

      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-display text-gray-900 tracking-tight">{user?.role === 'parent' ? 'Report Card' : 'Student Grades'}</h1>
          <p className="text-sm font-medium text-gray-600 mt-1">
            {user?.role === 'parent' ? 'Academic performance and test scores.' : 'Manage student academic records.'}
          </p>
        </div>
      </header>

      <div className="bg-white/40 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] overflow-hidden">
        <div className="p-6 border-b border-white/50 flex justify-between items-center bg-white/30">
          <h3 className="text-xl font-bold text-gray-900 font-display flex items-center gap-2">
            <Award className="text-indigo-600" size={24} /> Academic Record
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/50 border-b border-white/50">
              <tr>
                {user?.role !== 'parent' && <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Student</th>}
                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Exam</th>
                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Subject</th>
                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Score</th>
                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {marks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-gray-500 font-medium">No grades available yet.</td>
                </tr>
              ) : marks.map((m: any) => {
                const percentage = (m.marksObtained / m.maxMarks) * 100;
                let letter = 'F';
                if (percentage >= 90) letter = 'A+';
                else if (percentage >= 80) letter = 'A';
                else if (percentage >= 70) letter = 'B';
                else if (percentage >= 60) letter = 'C';
                else if (percentage >= 50) letter = 'D';

                return (
                  <tr key={m.id} className="hover:bg-white/40 transition-colors">
                    {user?.role !== 'parent' && <td className="p-5 font-bold text-sm text-gray-900">{m.student?.name}</td>}
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                        <FileText size={16} className="text-indigo-500" />
                        {m.examName} {m.term ? <span className="text-gray-500 font-medium">({m.term})</span> : ''}
                      </div>
                    </td>
                    <td className="p-5 text-sm font-bold text-gray-600">{m.subject}</td>
                    <td className="p-5 text-lg font-black text-gray-900">{m.marksObtained} <span className="text-sm font-medium text-gray-400">/ {m.maxMarks}</span></td>
                    <td className="p-5">
                      <span className={`px-4 py-1.5 text-xs font-bold rounded-xl uppercase tracking-widest ${letter.includes('A') ? 'bg-emerald-100/50 text-emerald-700 border border-emerald-200/50' : letter.includes('B') ? 'bg-blue-100/50 text-blue-700 border border-blue-200/50' : letter.includes('F') ? 'bg-red-100/50 text-red-700 border border-red-200/50' : 'bg-amber-100/50 text-amber-700 border border-amber-200/50'}`}>
                        {letter}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
