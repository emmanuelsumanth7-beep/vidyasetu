'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Award, FileText, Printer, Plus, X, CheckCircle2, AlertCircle, Users, BookOpen, Send, ArrowLeft, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrintableLetterhead } from '@/components/PrintableLetterhead';

/* ── Demo Data ────────────────────────────────────────────────────────────── */
const DEMO_MARKS = [
  { id:'dm1', examName:'Unit Test 2', term:'Term 1', subject:'Mathematics',  student: { name:'Aryan Sharma' },    marksObtained: 88, maxMarks: 100 },
  { id:'dm2', examName:'Unit Test 2', term:'Term 1', subject:'Physics',       student: { name:'Aryan Sharma' },    marksObtained: 75, maxMarks: 100 },
  { id:'dm3', examName:'Unit Test 2', term:'Term 1', subject:'Chemistry',     student: { name:'Aryan Sharma' },    marksObtained: 82, maxMarks: 100 },
  { id:'dm4', examName:'Unit Test 2', term:'Term 1', subject:'English',       student: { name:'Aryan Sharma' },    marksObtained: 91, maxMarks: 100 },
];

const MOCK_CLASSES: Record<string, any[]> = {
  '8A': [
    { id: 's1', name: 'Aryan Sharma', roll: 1 },
    { id: 's2', name: 'Rahul Sharma', roll: 2 },
    { id: 's3', name: 'Priya Kamath', roll: 3 },
    { id: 's4', name: 'Sneha Reddy',  roll: 4 },
    { id: 's5', name: 'Aditya M.',    roll: 5 },
    { id: 's6', name: 'Vikram Rao',   roll: 6 },
    { id: 's7', name: 'Neha Gupta',   roll: 7 },
    { id: 's8', name: 'Rohan Verma',  roll: 8 },
  ],
  '9B': [
    { id: 's9',  name: 'Meera Patel',  roll: 1 },
    { id: 's10', name: 'Karan Singh',  roll: 2 },
    { id: 's11', name: 'Anita Desai',  roll: 3 },
    { id: 's12', name: 'Sanjay Dutt',  roll: 4 },
  ],
  '10A': [
    { id: 's13', name: 'Ravi Kumar',   roll: 1 },
    { id: 's14', name: 'Pooja Hegde',  roll: 2 },
  ]
};

function letterGrade(pct: number) {
  if (pct >= 90) return { letter: 'A+', color: '#10B981', bg: 'rgba(16,185,129,0.10)' };
  if (pct >= 80) return { letter: 'A',  color: '#007AFF', bg: 'rgba(0,122,255,0.10)' };
  if (pct >= 70) return { letter: 'B+', color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)' };
  if (pct >= 60) return { letter: 'B',  color: '#F59E0B', bg: 'rgba(245,158,11,0.10)' };
  if (pct >= 50) return { letter: 'C',  color: '#F97316', bg: 'rgba(249,115,22,0.10)' };
  if (pct >= 35) return { letter: 'D',  color: '#EF4444', bg: 'rgba(239,68,68,0.10)' };
  return               { letter: 'F',  color: '#DC2626', bg: 'rgba(220,38,38,0.10)' };
}

/* ── Component ────────────────────────────────────────────────────────────── */
export default function GradesDashboard() {
  const [user, setUser] = useState<any>(null);
  const [marks, setMarks] = useState<any[]>(DEMO_MARKS);
  const [loading, setLoading] = useState(true);

  // Workflow states: 'view' | 'setup' | 'marking' | 'success' | 'print-all'
  const [mode, setMode] = useState<'view'|'setup'|'marking'|'success'|'print-all'>('view');
  
  // Setup state
  const [examDetails, setExamDetails] = useState({
    className: '8A',
    subject: 'Mathematics',
    examName: 'Unit Test 3',
    topic: 'Algebra & Geometry',
    maxMarks: '100'
  });
  const [setupErr, setSetupErr] = useState('');

  // Marking state
  const [students, setStudents] = useState<any[]>([]);
  const [marksEntry, setMarksEntry] = useState<Record<string, string>>({});
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const isTeacher = user && ['principal', 'teacher', 'admin'].includes(user.role);

  // --- Handlers ---
  const handleStartMarking = (e: React.FormEvent) => {
    e.preventDefault();
    setSetupErr('');
    if (!examDetails.className || !examDetails.subject || !examDetails.examName) {
      setSetupErr('Class, Subject, and Exam Name are required.');
      return;
    }
    const classStudents = MOCK_CLASSES[examDetails.className] || [];
    if (classStudents.length === 0) {
      setSetupErr('No students found in this class.');
      return;
    }
    setStudents(classStudents);
    setMarksEntry({});
    setMode('marking');
  };

  const handleMarkChange = (studentId: string, val: string) => {
    setMarksEntry(prev => ({ ...prev, [studentId]: val }));
  };

  const handlePublish = () => {
    setPublishing(true);
    // Simulate API call and push notifications
    setTimeout(() => {
      setPublishing(false);
      setMode('success');
    }, 1500);
  };

  const handleBackToDashboard = () => {
    setMode('view');
    setExamDetails({ className: '8A', subject: 'Mathematics', examName: 'Unit Test 3', topic: 'Algebra & Geometry', maxMarks: '100' });
    setMarksEntry({});
  };

  // --- Renders ---
  if (loading) return <div className="p-10 text-center">Loading...</div>;

  /* ─────────────────────────────────────────────────────────────────────────
     SUCCESS VIEW
  ────────────────────────────────────────────────────────────────────────── */
  if (mode === 'success') {
    return (
      <div className="max-w-[800px] mx-auto w-full animate-fade-in flex flex-col items-center justify-center pt-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(52,199,89,0.15)', boxShadow: '0 8px 32px rgba(52,199,89,0.2)' }}
        >
          <CheckCircle2 size={48} style={{ color: '#34C759' }} />
        </motion.div>
        
        <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--color-text-primary)' }}>Marks Published!</h2>
        <p className="text-center text-lg max-w-[400px] mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Grades for <strong>{examDetails.subject} ({examDetails.className})</strong> have been securely saved and notifications have been dispatched to all parents.
        </p>

        <div className="flex gap-4">
          <button onClick={handleBackToDashboard} className="btn-primary px-8 py-3.5 rounded-2xl font-bold text-sm">
            Return to Dashboard
          </button>
          <button onClick={() => setMode('print-all')} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-sm" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
            <Printer size={18} /> Print All Marks Cards
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────────
     PRINT ALL VIEW
  ────────────────────────────────────────────────────────────────────────── */
  if (mode === 'print-all') {
    const maxM = parseFloat(examDetails.maxMarks) || 100;
    return (
      <div className="bg-white text-black min-h-screen pb-20 print:p-0">
        <div className="fixed top-4 left-4 no-print flex gap-4 z-50">
          <button onClick={() => setMode('success')} className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={() => window.print()} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg">
            <Printer size={16} /> Print Now
          </button>
        </div>
        
        <div className="max-w-4xl mx-auto pt-20 print:pt-0">
          <style>{`
            @media print { 
              .page-break { page-break-after: always; } 
              @page { margin: 15mm; }
              body { background: white !important; }
            }
          `}</style>
          
          {students.map((student, idx) => {
            const rawVal = marksEntry[student.id];
            const markNum = parseFloat(rawVal);
            const hasMark = !isNaN(markNum);
            const marksObtained = hasMark ? markNum : 0;
            const pct = hasMark ? Math.round((marksObtained / maxM) * 100) : 0;
            const g = letterGrade(pct);
            
            return (
              <div key={student.id} className={`page-break p-8 ${idx < students.length - 1 ? 'mb-16 border-b-2 border-dashed border-gray-300 print:border-none print:mb-0' : ''}`}>
                <PrintableLetterhead />
                
                <h1 className="text-2xl font-black text-center mt-8 mb-10 uppercase tracking-widest text-gray-900">{examDetails.examName} - Marks Card</h1>
                
                <div className="flex justify-between mb-8 border-2 border-gray-200 p-6 rounded-2xl bg-gray-50">
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-wider font-bold text-gray-500">Student Name</p>
                    <p className="text-xl font-black text-gray-900">{student.name}</p>
                    <p className="text-sm font-bold text-gray-600 mt-2">Class: {examDetails.className}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-sm uppercase tracking-wider font-bold text-gray-500">Roll Number</p>
                    <p className="text-xl font-black text-gray-900">{String(student.roll).padStart(2, '0')}</p>
                    <p className="text-sm font-bold text-gray-600 mt-2">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                
                <table className="w-full text-left border-collapse border-2 border-gray-200 mb-12 rounded-xl overflow-hidden hidden md:table">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4 border-2 border-gray-200 font-black uppercase text-xs tracking-widest text-gray-700">Subject</th>
                      <th className="p-4 border-2 border-gray-200 font-black uppercase text-xs tracking-widest text-center text-gray-700">Max Marks</th>
                      <th className="p-4 border-2 border-gray-200 font-black uppercase text-xs tracking-widest text-center text-gray-700">Marks Obtained</th>
                      <th className="p-4 border-2 border-gray-200 font-black uppercase text-xs tracking-widest text-center text-gray-700">Percentage</th>
                      <th className="p-4 border-2 border-gray-200 font-black uppercase text-xs tracking-widest text-center text-gray-700">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 border-2 border-gray-200 font-bold text-gray-900">{examDetails.subject}</td>
                      <td className="p-4 border-2 border-gray-200 text-center font-medium text-gray-700">{maxM}</td>
                      <td className="p-4 border-2 border-gray-200 text-center font-black text-gray-900 text-lg">{hasMark ? marksObtained : '-'}</td>
                      <td className="p-4 border-2 border-gray-200 text-center font-bold text-gray-900">{hasMark ? `${pct}%` : '-'}</td>
                      <td className="p-4 border-2 border-gray-200 text-center font-black text-gray-900">{hasMark ? g.letter : '-'}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="p-4 border-2 border-gray-200 font-black text-right text-gray-900">OVERALL RESULT</td>
                      <td className="p-4 border-2 border-gray-200 font-black text-center text-gray-900">{maxM}</td>
                      <td className="p-4 border-2 border-gray-200 font-black text-center text-gray-900">{hasMark ? marksObtained : '-'}</td>
                      <td className="p-4 border-2 border-gray-200 font-black text-center text-gray-900">{hasMark ? `${pct}%` : '-'}</td>
                      <td className="p-4 border-2 border-gray-200 font-black text-center text-gray-900">{hasMark ? g.letter : '-'}</td>
                    </tr>
                  </tfoot>
                </table>
                
                <div className="flex justify-between mt-32 px-12">
                  <div className="text-center">
                    <div className="w-56 border-t-2 border-gray-400 pt-3 font-bold text-gray-700 uppercase tracking-wider text-sm">Class Teacher</div>
                  </div>
                  <div className="text-center">
                    <div className="w-56 border-t-2 border-gray-400 pt-3 font-bold text-gray-700 uppercase tracking-wider text-sm">Principal</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────────
     MARKING VIEW
  ────────────────────────────────────────────────────────────────────────── */
  if (mode === 'marking') {
    const maxM = parseFloat(examDetails.maxMarks) || 100;
    const completedCount = Object.keys(marksEntry).filter(k => marksEntry[k] !== '').length;
    const totalCount = students.length;
    
    return (
      <div className="max-w-[1000px] mx-auto w-full animate-fade-in pb-32">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 p-4 md:p-6 mb-6 rounded-3xl"
             style={{ 
               background: 'var(--nav-bg)', backdropFilter: 'blur(32px)', 
               border: '1px solid var(--nav-border)',
               boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
             }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setMode('setup')}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{ background: 'var(--color-glass)', color: 'var(--color-text-secondary)' }}>
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-black" style={{ color: 'var(--color-text-primary)' }}>
                  {examDetails.examName} — {examDetails.subject}
                </h1>
                <p className="text-xs font-bold uppercase tracking-wider mt-1 flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <Users size={12}/> Class {examDetails.className} 
                  <span className="opacity-50">|</span> 
                  <BookOpen size={12}/> {examDetails.topic || 'General'}
                  <span className="opacity-50">|</span> 
                  Max Marks: {maxM}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-black" style={{ color: 'var(--color-text-primary)' }}>{completedCount} / {totalCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Students Graded</p>
              </div>
              <button 
                onClick={handlePublish}
                disabled={publishing}
                className="btn-primary flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold shadow-lg"
              >
                {publishing ? 'Publishing...' : <><Send size={16} /> Publish Marks</>}
              </button>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left">
            <thead style={{ background: 'var(--color-glass)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest w-20" style={{ color: 'var(--color-text-tertiary)' }}>Roll No.</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Student Name</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest w-48" style={{ color: 'var(--color-text-tertiary)' }}>Marks Obtained</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest w-32" style={{ color: 'var(--color-text-tertiary)' }}>Grade & %</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const rawVal = marksEntry[student.id];
                const markNum = parseFloat(rawVal);
                const hasMark = !isNaN(markNum);
                const pct = hasMark ? Math.round((markNum / maxM) * 100) : null;
                const g = pct !== null ? letterGrade(pct) : null;

                return (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--color-border)' }} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                    <td className="p-4 text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                      {String(student.roll).padStart(2, '0')}
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-black" style={{ color: 'var(--color-text-primary)' }}>{student.name}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input 
                          type="number"
                          min="0" max={maxM} step="0.5"
                          value={rawVal || ''}
                          onChange={e => handleMarkChange(student.id, e.target.value)}
                          placeholder="—"
                          className="w-20 text-center font-black text-lg py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          style={{ 
                            background: 'var(--color-glass)', 
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-primary)'
                          }}
                        />
                        <span className="text-xs font-bold" style={{ color: 'var(--color-text-tertiary)' }}>/ {maxM}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {g ? (
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black px-3 py-1.5 rounded-xl w-10 text-center"
                            style={{ background: g.bg, color: g.color }}>
                            {g.letter}
                          </span>
                          <span className="text-xs font-bold" style={{ color: g.color }}>{pct}%</span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────────
     SETUP VIEW
  ────────────────────────────────────────────────────────────────────────── */
  if (mode === 'setup') {
    return (
      <div className="max-w-[600px] mx-auto w-full animate-fade-in pb-20">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => setMode('view')}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'var(--color-glass)', color: 'var(--color-text-secondary)' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Bulk Exam Entry</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Define the test parameters before grading.</p>
          </div>
        </div>

        <form onSubmit={handleStartMarking} className="glass-card p-6 md:p-8 space-y-6">
          {setupErr && (
            <div className="p-4 rounded-2xl flex items-center gap-3 text-sm font-bold"
              style={{ background: 'rgba(255,59,48,0.1)', color: '#FF3B30' }}>
              <AlertCircle size={18} /> {setupErr}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Select Class</label>
              <select 
                value={examDetails.className}
                onChange={e => setExamDetails(prev => ({...prev, className: e.target.value}))}
                className="px-4 py-3.5 rounded-2xl text-sm font-black focus:outline-none appearance-none"
                style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
              >
                <option value="8A">Class 8A</option>
                <option value="9B">Class 9B</option>
                <option value="10A">Class 10A</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Subject</label>
              <select 
                value={examDetails.subject}
                onChange={e => setExamDetails(prev => ({...prev, subject: e.target.value}))}
                className="px-4 py-3.5 rounded-2xl text-sm font-black focus:outline-none appearance-none"
                style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Test / Exam Name</label>
            <input 
              type="text" placeholder="e.g. Unit Test 3, Mid-Term Exam"
              value={examDetails.examName}
              onChange={e => setExamDetails(prev => ({...prev, examName: e.target.value}))}
              className="px-4 py-3.5 rounded-2xl text-sm font-bold focus:outline-none"
              style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Lesson / Topic Covered (Optional)</label>
            <input 
              type="text" placeholder="e.g. Algebra & Geometry"
              value={examDetails.topic}
              onChange={e => setExamDetails(prev => ({...prev, topic: e.target.value}))}
              className="px-4 py-3.5 rounded-2xl text-sm font-bold focus:outline-none"
              style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
            />
          </div>

          <div className="flex flex-col gap-2 w-1/2">
            <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Maximum Marks</label>
            <input 
              type="number" min="1" placeholder="100"
              value={examDetails.maxMarks}
              onChange={e => setExamDetails(prev => ({...prev, maxMarks: e.target.value}))}
              className="px-4 py-3.5 rounded-2xl text-sm font-black focus:outline-none"
              style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
            />
          </div>

          <button type="submit" className="w-full btn-primary py-4 rounded-2xl text-sm font-black mt-4 flex items-center justify-center gap-2 shadow-lg">
            Fetch Student List <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </form>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────────
     VIEW DEFAULT DASHBOARD
  ────────────────────────────────────────────────────────────────────────── */
  return (
    <div className="max-w-[1200px] mx-auto w-full animate-fade-in pb-20 space-y-6 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            {user?.role === 'parent' ? 'Report Card' : 'Exam Marks'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {user?.role === 'parent'
              ? 'Academic performance and test scores for your child.'
              : 'Manage and review student academic results.'}
          </p>
        </div>
        
        <div className="flex gap-3 no-print">
          <button onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all"
            style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
            <Printer size={16} /> Print
          </button>
          {isTeacher && (
            <button onClick={() => setMode('setup')}
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black shadow-lg">
              <Plus size={18} /> Bulk Marks Entry
            </button>
          )}
        </div>
      </div>

      <div className="print-area print:mb-8">
        <PrintableLetterhead />
      </div>

      {/* Summary strip */}
      {marks.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Records', value: String(marks.length), color: '#007AFF', icon: FileText },
            { label: 'Avg Class Score', value: '82%', color: '#34C759', icon: TrendingUp },
            { label: 'Highest Score', value: '96%', color: '#5856D6', icon: Award },
            { label: 'Attention Needed', value: '2 Students', color: '#FF3B30', icon: AlertCircle },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-card p-5 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icon size={80} style={{ color: s.color }} />
                </div>
                <div className="relative z-10">
                  <p className="text-3xl font-black tracking-tighter" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: 'var(--color-text-secondary)' }}>{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Historical Grades Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 md:px-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(88,86,214,0.1)', color: '#5856D6' }}>
              <Award size={16} />
            </div>
            <h3 className="font-black text-base" style={{ color: 'var(--color-text-primary)' }}>Historical Records</h3>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full" 
            style={{ background: 'var(--color-glass)', color: 'var(--color-text-tertiary)' }}>
            {marks.length} entries
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead style={{ background: 'var(--color-glass-2)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                {user?.role !== 'parent' && <th className="p-4 pl-6 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Student</th>}
                <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Exam</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Subject</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Score</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Grade</th>
                <th className="p-4 pr-6 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Bar</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m: any, i) => {
                const pct = Math.round((m.marksObtained / m.maxMarks) * 100);
                const g = letterGrade(pct);
                return (
                  <motion.tr
                    key={m.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                    className="transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    {user?.role !== 'parent' && (
                      <td className="p-4 pl-6">
                        <p className="text-sm font-black" style={{ color: 'var(--color-text-primary)' }}>{m.student?.name}</p>
                      </td>
                    )}
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        <FileText size={14} style={{ color: '#5856D6' }} />
                        {m.examName}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>{m.subject}</td>
                    <td className="p-4">
                      <span className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>{m.marksObtained}</span>
                      <span className="text-xs font-bold ml-1" style={{ color: 'var(--color-text-tertiary)' }}>/ {m.maxMarks}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-black px-3 py-1.5 rounded-xl inline-block text-center min-w-[40px]"
                        style={{ background: g.bg, color: g.color }}>
                        {g.letter}
                      </span>
                    </td>
                    <td className="p-4 pr-6 w-32">
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-glass)' }}>
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: g.color }} />
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
