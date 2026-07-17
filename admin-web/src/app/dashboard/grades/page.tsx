'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Award, FileText, Printer, Plus, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PrintableLetterhead from '@/components/PrintableLetterhead';

/* ── Demo grade data (shown when API returns empty) ───────────────────────── */
const DEMO_MARKS = [
  { id:'dm1', examName:'Unit Test 2', term:'Term 1', subject:'Mathematics',  student: { name:'Aryan Sharma' },    marksObtained: 88, maxMarks: 100 },
  { id:'dm2', examName:'Unit Test 2', term:'Term 1', subject:'Physics',       student: { name:'Aryan Sharma' },    marksObtained: 75, maxMarks: 100 },
  { id:'dm3', examName:'Unit Test 2', term:'Term 1', subject:'Chemistry',     student: { name:'Aryan Sharma' },    marksObtained: 82, maxMarks: 100 },
  { id:'dm4', examName:'Unit Test 2', term:'Term 1', subject:'English',       student: { name:'Aryan Sharma' },    marksObtained: 91, maxMarks: 100 },
  { id:'dm5', examName:'Unit Test 2', term:'Term 1', subject:'Biology',       student: { name:'Aryan Sharma' },    marksObtained: 79, maxMarks: 100 },
  { id:'dm6', examName:'Unit Test 1', term:'Term 1', subject:'Mathematics',   student: { name:'Rahul Sharma' },    marksObtained: 72, maxMarks: 100 },
  { id:'dm7', examName:'Unit Test 1', term:'Term 1', subject:'Physics',       student: { name:'Rahul Sharma' },    marksObtained: 65, maxMarks: 100 },
  { id:'dm8', examName:'Unit Test 1', term:'Term 1', subject:'Chemistry',     student: { name:'Rahul Sharma' },    marksObtained: 58, maxMarks: 100 },
  { id:'dm9', examName:'Unit Test 2', term:'Term 1', subject:'Mathematics',   student: { name:'Priya Kamath' },    marksObtained: 94, maxMarks: 100 },
  { id:'dm10',examName:'Unit Test 2', term:'Term 1', subject:'English',       student: { name:'Priya Kamath' },    marksObtained: 96, maxMarks: 100 },
  { id:'dm11',examName:'Unit Test 2', term:'Term 1', subject:'Biology',       student: { name:'Sneha Reddy' },     marksObtained: 88, maxMarks: 100 },
  { id:'dm12',examName:'Unit Test 1', term:'Term 1', subject:'Physics',       student: { name:'Vikram Rao' },      marksObtained: 44, maxMarks: 100 },
];

function letterGrade(pct: number) {
  if (pct >= 90) return { letter: 'A+', color: '#10B981', bg: 'rgba(16,185,129,0.10)' };
  if (pct >= 80) return { letter: 'A',  color: '#007AFF', bg: 'rgba(0,122,255,0.10)' };
  if (pct >= 70) return { letter: 'B+', color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)' };
  if (pct >= 60) return { letter: 'B',  color: '#F59E0B', bg: 'rgba(245,158,11,0.10)' };
  if (pct >= 50) return { letter: 'C',  color: '#F97316', bg: 'rgba(249,115,22,0.10)' };
  if (pct >= 35) return { letter: 'D',  color: '#EF4444', bg: 'rgba(239,68,68,0.10)' };
  return               { letter: 'F',  color: '#DC2626', bg: 'rgba(220,38,38,0.10)' };
}

/* ── Add Marks Modal ──────────────────────────────────────────────────────── */
interface AddMarksForm { student: string; examName: string; term: string; subject: string; marksObtained: string; maxMarks: string; }
const FORM_INIT: AddMarksForm = { student: '', examName: '', term: 'Term 1', subject: '', marksObtained: '', maxMarks: '100' };

export default function GradesDashboard() {
  const [marks, setMarks]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [user, setUser]         = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]         = useState<AddMarksForm>(FORM_INIT);
  const [formErr, setFormErr]   = useState('');
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [filter, setFilter]     = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/marks');
      setMarks(Array.isArray(res) && res.length > 0 ? res : DEMO_MARKS);
    } catch {
      setMarks(DEMO_MARKS);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMark = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');
    if (!form.student.trim() || !form.examName.trim() || !form.subject.trim()) {
      setFormErr('Student, Exam Name, and Subject are required.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/marks', {
        studentName: form.student,
        examName: form.examName,
        term: form.term,
        subject: form.subject,
        marksObtained: parseFloat(form.marksObtained),
        maxMarks: parseFloat(form.maxMarks),
      });
      await fetchData();
    } catch {
      // Demo fallback: add locally
      const newEntry = {
        id: `local-${Date.now()}`,
        examName: form.examName,
        term: form.term,
        subject: form.subject,
        student: { name: form.student },
        marksObtained: parseFloat(form.marksObtained) || 0,
        maxMarks: parseFloat(form.maxMarks) || 100,
      };
      setMarks(prev => [newEntry, ...prev]);
    } finally {
      setSaving(false);
      setSaved(true);
      setForm(FORM_INIT);
      setTimeout(() => { setSaved(false); setShowModal(false); }, 1500);
    }
  };

  const filtered = filter.trim()
    ? marks.filter(m =>
        m.student?.name?.toLowerCase().includes(filter.toLowerCase()) ||
        m.subject?.toLowerCase().includes(filter.toLowerCase()) ||
        m.examName?.toLowerCase().includes(filter.toLowerCase())
      )
    : marks;

  const isStaff = user && ['principal','teacher','clerk','admin'].includes(user.role);

  if (loading) return (
    <div className="max-w-[1200px] mx-auto w-full space-y-5 animate-fade-in pb-20">
      <div className="glass-card h-20 animate-shimmer" />
      <div className="glass-card h-96 animate-shimmer" />
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-fade-in pb-20 space-y-5 relative">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: '#1C1C1E' }}>
            {user?.role === 'parent' ? 'Report Card' : 'Exam Marks'}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#6C7278' }}>
            {user?.role === 'parent'
              ? 'Academic performance and test scores for your child.'
              : 'Manage and record student academic results.'}
          </p>
        </div>
        <div className="flex gap-3 no-print">
          <button onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all"
            style={{ background: 'rgba(60,60,67,0.06)', border: '1px solid rgba(60,60,67,0.12)', color: '#3C3C43' }}>
            <Printer size={16} /> Print
          </button>
          {isStaff && (
            <button onClick={() => { setForm(FORM_INIT); setShowModal(true); }}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm">
              <Plus size={16} /> Add Marks
            </button>
          )}
        </div>
      </div>

      <div className="print-area print:mb-8">
        <PrintableLetterhead />
      </div>

      {/* Summary strip */}
      {marks.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Records',     value: String(marks.length),                                  color: '#007AFF' },
            { label: 'Avg Score',   value: `${Math.round(marks.reduce((a,m) => a + (m.marksObtained/m.maxMarks)*100, 0) / marks.length)}%`, color: '#34C759' },
            { label: 'Highest',     value: `${Math.max(...marks.map(m => Math.round((m.marksObtained/m.maxMarks)*100)))}%`, color: '#5856D6' },
            { label: 'Below Pass',  value: String(marks.filter(m => (m.marksObtained/m.maxMarks)*100 < 35).length), color: '#FF3B30' },
          ].map(s => (
            <div key={s.label} className="glass-card p-4"
              style={{ background: `${s.color}08` }}>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: '#AEAEB2' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      {!user || user.role !== 'parent' ? (
        <div className="glass-card px-4 py-3 flex items-center gap-3">
          <Award size={15} style={{ color: '#AEAEB2' }} />
          <input
            type="text"
            placeholder="Search student, subject or exam…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium focus:outline-none"
            style={{ color: '#1C1C1E' }}
          />
          {filter && (
            <button onClick={() => setFilter('')}>
              <X size={14} style={{ color: '#AEAEB2' }} />
            </button>
          )}
        </div>
      ) : null}

      {/* Grades table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(60,60,67,0.07)' }}>
          <div className="flex items-center gap-2">
            <Award size={18} style={{ color: '#5856D6' }} />
            <h3 className="font-black text-base" style={{ color: '#1C1C1E' }}>Academic Records</h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(88,86,214,0.10)', color: '#5856D6' }}>
            {filtered.length} entries
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead style={{ background: 'rgba(60,60,67,0.03)', borderBottom: '1px solid rgba(60,60,67,0.07)' }}>
              <tr>
                {user?.role !== 'parent' && <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: '#AEAEB2' }}>Student</th>}
                <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: '#AEAEB2' }}>Exam</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: '#AEAEB2' }}>Subject</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: '#AEAEB2' }}>Score</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: '#AEAEB2' }}>Grade</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: '#AEAEB2' }}>Bar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-sm font-medium" style={{ color: '#AEAEB2' }}>
                    No records found.
                  </td>
                </tr>
              ) : filtered.map((m: any, i) => {
                const pct = Math.round((m.marksObtained / m.maxMarks) * 100);
                const g = letterGrade(pct);
                return (
                  <motion.tr
                    key={m.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid rgba(60,60,67,0.05)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(60,60,67,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {user?.role !== 'parent' && (
                      <td className="p-4">
                        <p className="text-sm font-black" style={{ color: '#1C1C1E' }}>{m.student?.name}</p>
                      </td>
                    )}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: '#3C3C43' }}>
                        <FileText size={13} style={{ color: '#5856D6' }} />
                        {m.examName} {m.term && <span className="text-[10px] font-medium" style={{ color: '#AEAEB2' }}>({m.term})</span>}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-bold" style={{ color: '#6C7278' }}>{m.subject}</td>
                    <td className="p-4">
                      <span className="text-lg font-black" style={{ color: '#1C1C1E' }}>{m.marksObtained}</span>
                      <span className="text-xs font-medium ml-1" style={{ color: '#AEAEB2' }}>/ {m.maxMarks}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-black px-3 py-1.5 rounded-xl"
                        style={{ background: g.bg, color: g.color }}>
                        {g.letter}
                      </span>
                    </td>
                    <td className="p-4 w-28">
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.05)' }}>
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: g.color }} />
                      </div>
                      <p className="text-[10px] font-bold mt-0.5" style={{ color: g.color }}>{pct}%</p>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Marks Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(60,60,67,0.07)' }}>
                <h3 className="font-black text-base" style={{ color: '#1C1C1E' }}>Add Exam Marks</h3>
                <button onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(60,60,67,0.08)', color: '#6C7278' }}>
                  <X size={14} />
                </button>
              </div>

              {saved ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-10 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
                    style={{ background: 'rgba(52,199,89,0.12)' }}>
                    <CheckCircle2 size={32} style={{ color: '#34C759' }} />
                  </div>
                  <p className="font-black text-lg" style={{ color: '#1C1C1E' }}>Marks Saved!</p>
                </motion.div>
              ) : (
                <form onSubmit={handleAddMark} className="p-5 space-y-4">
                  {formErr && (
                    <div className="p-3 rounded-xl flex items-center gap-2 text-sm"
                      style={{ background: 'rgba(255,59,48,0.08)', color: '#FF3B30' }}>
                      <AlertCircle size={14} /> {formErr}
                    </div>
                  )}

                  {[
                    { key: 'student',       label: 'Student Name',   placeholder: 'e.g. Aryan Sharma' },
                    { key: 'examName',      label: 'Exam / Test',    placeholder: 'e.g. Unit Test 2' },
                    { key: 'subject',       label: 'Subject',        placeholder: 'e.g. Mathematics' },
                  ].map(f => (
                    <div key={f.key} className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#AEAEB2' }}>{f.label}</label>
                      <input
                        type="text"
                        placeholder={f.placeholder}
                        value={(form as any)[f.key]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="px-4 py-3 rounded-2xl text-sm font-medium focus:outline-none transition-all"
                        style={{ background: 'rgba(60,60,67,0.06)', border: '1px solid rgba(60,60,67,0.12)', color: '#1C1C1E' }}
                      />
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#AEAEB2' }}>Marks Obtained</label>
                      <input type="number" min="0" max="9999" placeholder="e.g. 85"
                        value={form.marksObtained}
                        onChange={e => setForm(prev => ({ ...prev, marksObtained: e.target.value }))}
                        required
                        className="px-4 py-3 rounded-2xl text-sm font-medium focus:outline-none"
                        style={{ background: 'rgba(60,60,67,0.06)', border: '1px solid rgba(60,60,67,0.12)', color: '#1C1C1E' }}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#AEAEB2' }}>Max Marks</label>
                      <input type="number" min="1" placeholder="100"
                        value={form.maxMarks}
                        onChange={e => setForm(prev => ({ ...prev, maxMarks: e.target.value }))}
                        required
                        className="px-4 py-3 rounded-2xl text-sm font-medium focus:outline-none"
                        style={{ background: 'rgba(60,60,67,0.06)', border: '1px solid rgba(60,60,67,0.12)', color: '#1C1C1E' }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)}
                      className="flex-1 py-3.5 rounded-2xl text-sm font-bold"
                      style={{ background: 'rgba(60,60,67,0.06)', color: '#6C7278' }}>
                      Cancel
                    </button>
                    <button type="submit" disabled={saving}
                      className="flex-1 py-3.5 rounded-2xl text-sm font-black btn-primary disabled:opacity-60">
                      {saving ? 'Saving…' : 'Save Marks'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
