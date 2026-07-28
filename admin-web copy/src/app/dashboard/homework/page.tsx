'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Plus, FileText, CheckCircle2, 
  Clock, Sparkles, UploadCloud, MessageSquare
} from 'lucide-react';

/* ── MOCK DATA ────────────────────────────────────────────────────────────── */
const ACTIVE_HOMEWORKS = [
  { id: 'hw-1', title: 'Algebra Equations Set 4', subject: 'Mathematics', class: '8A', due: 'Tomorrow, 5:00 PM', submissions: 28, total: 35 },
  { id: 'hw-2', title: 'Photosynthesis Essay', subject: 'Biology', class: '9B', due: 'In 2 days', submissions: 12, total: 40 },
];

const SUBMISSIONS = [
  { id: 1, student: 'Aryan Sharma', status: 'submitted', time: '10 mins ago', aiScore: 85, aiNotes: 'Good understanding of formulas. Minor calculation error in Q3.' },
  { id: 2, student: 'Priya Kamath', status: 'submitted', time: '1 hour ago', aiScore: 92, aiNotes: 'Excellent work. Perfect step-by-step breakdown.' },
  { id: 3, student: 'Rahul V.', status: 'pending', time: '--', aiScore: null, aiNotes: null },
];

export default function HomeworkDashboard() {
  const [activeTab, setActiveTab] = useState<'create' | 'queue'>('queue');
  const [selectedHw, setSelectedHw] = useState(ACTIVE_HOMEWORKS[0]);

  return (
    <div className="max-w-[1400px] mx-auto w-full animate-fade-in pb-20 space-y-6">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3" style={{ color: 'var(--color-text-primary)' }}>
            <BookOpen className="text-indigo-500" size={32} />
            Homework & Submissions
          </h1>
          <p className="text-sm mt-1 font-bold" style={{ color: 'var(--color-text-secondary)' }}>Digital assignments and AI-assisted grading queues.</p>
        </div>
        
        <div className="flex items-center p-1.5 rounded-2xl shrink-0 overflow-x-auto custom-scrollbar" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}>
          {[
            { id: 'queue', label: 'Grading Queue', icon: FileText },
            { id: 'create', label: 'Create Assignment', icon: Plus },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap"
              style={{ 
                background: activeTab === tab.id ? 'var(--surface)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRADING QUEUE TAB */}
      {activeTab === 'queue' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* LEFT: Homework List */}
          <div className="xl:col-span-1 space-y-4">
            <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>Active Assignments</h3>
            
            <div className="space-y-3">
              {ACTIVE_HOMEWORKS.map(hw => {
                const active = selectedHw.id === hw.id;
                return (
                  <div key={hw.id} onClick={() => setSelectedHw(hw)}
                       className="glass-card p-5 cursor-pointer transition-all border-l-4"
                       style={{ 
                         borderLeftColor: active ? 'var(--vs-primary)' : 'transparent',
                         background: active ? 'var(--surface)' : 'var(--color-glass)',
                       }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md" 
                            style={{ background: 'var(--color-glass-3)', color: 'var(--color-text-secondary)' }}>
                        {hw.class} • {hw.subject}
                      </span>
                    </div>
                    <h4 className="font-black text-sm mb-3" style={{ color: 'var(--color-text-primary)' }}>{hw.title}</h4>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full overflow-hidden mb-2" style={{ background: 'var(--color-glass-3)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: ((hw.submissions/hw.total)*100) + '%', background: 'var(--vs-primary)' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                      <span className="flex items-center gap-1"><Clock size={12} /> {hw.due}</span>
                      <span>{hw.submissions}/{hw.total} Submitted</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Submissions for Selected Homework */}
          <div className="xl:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6 border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>{selectedHw.title}</h3>
                  <p className="text-xs font-bold mt-1" style={{ color: 'var(--color-text-secondary)' }}>Submission Review Queue</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black" 
                        style={{ background: 'rgba(175,82,222,0.1)', color: '#AF52DE' }}>
                  <Sparkles size={14} /> Auto-Grade All with AI
                </button>
              </div>
              
              <div className="space-y-4">
                {SUBMISSIONS.map(sub => (
                  <div key={sub.id} className="p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: 'var(--surface)', borderColor: 'var(--color-border)' }}>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                           style={{ background: sub.status === 'submitted' ? 'rgba(52,199,89,0.1)' : 'rgba(255,149,0,0.1)', color: sub.status === 'submitted' ? '#34C759' : '#FF9500' }}>
                        {sub.status === 'submitted' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-black" style={{ color: 'var(--color-text-primary)' }}>{sub.student}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                          {sub.status === 'submitted' ? 'Submitted ' + sub.time : 'Pending'}
                        </p>
                      </div>
                    </div>
                    
                    {sub.status === 'submitted' ? (
                      <div className="flex-1 max-w-sm p-3 rounded-xl flex items-start gap-3 border" style={{ background: 'rgba(175,82,222,0.02)', borderColor: 'rgba(175,82,222,0.2)' }}>
                        <Sparkles size={16} color="#AF52DE" className="shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold mb-1" style={{ color: '#AF52DE' }}>AI Suggested Score: {sub.aiScore}/100</p>
                          <p className="text-[10px] font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{sub.aiNotes}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 max-w-sm p-3 rounded-xl border border-dashed flex items-center justify-center" style={{ borderColor: 'var(--color-border)' }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Waiting for student upload</p>
                      </div>
                    )}
                    
                    <button className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50" 
                            disabled={sub.status === 'pending'}
                            style={{ background: 'var(--vs-primary)', color: 'white' }}>
                      Review
                    </button>
                    
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* CREATE TAB (MOCKUP) */}
      {activeTab === 'create' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto glass-card p-8">
          <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--color-text-primary)' }}>Create Assignment</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Assignment Title</label>
              <input type="text" placeholder="e.g. Chapter 4 Quiz" className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Instructions / Prompt</label>
              <textarea placeholder="Write instructions here..." className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none h-32 resize-none" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>

            <div className="p-6 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--color-border)' }}>
              <UploadCloud size={32} className="mb-2" style={{ color: 'var(--color-text-tertiary)' }} />
              <p className="text-sm font-black" style={{ color: 'var(--color-text-primary)' }}>Attach PDF or Worksheets</p>
              <p className="text-[10px] font-bold mt-1" style={{ color: 'var(--color-text-secondary)' }}>Students will download this and submit their answers.</p>
            </div>
            
            <button className="w-full btn-primary py-4 rounded-2xl font-black shadow-xl mt-4">
              Publish Assignment
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
