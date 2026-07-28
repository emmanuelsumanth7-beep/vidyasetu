'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { useSocket } from '@/components/SocketProvider';
import { BookOpen, Search, Plus, X, AlertCircle, CheckCircle2, Clock, Send, Bell, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendNotification } from '@/lib/notifications';
import { readUserSession } from '@/lib/session';

interface DiaryEntry {
  id: string;
  class: { id: string, name: string };
  subject: string;
  content: string;
  date: string;
  teacher: { name: string };
}

/* ── DATA REMOVED PER USER REQUEST ────────────────────────────────────────── */
const MOCK_PENDING: any[] = [];

const DEMO_ENTRIES: DiaryEntry[] = [];

export default function DiaryDashboard() {
  const [entries, setEntries] = useState<DiaryEntry[]>(DEMO_ENTRIES);
  const [pendingLogs, setPendingLogs] = useState(MOCK_PENDING);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('all');

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [activePendingId, setActivePendingId] = useState<string | null>(null);
  
  const [classId, setClassId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const socket = useSocket();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    // Simulate API fetch
    setTimeout(() => setLoading(false), 600);
  }, []);

  const filteredEntries = useMemo(() => {
    let result = entries;
    if (selectedClassId !== 'all') {
      result = result.filter((e) => e.class.id === selectedClassId || e.class.name === selectedClassId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.content.toLowerCase().includes(q) ||
          e.teacher.name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [entries, searchQuery, selectedClassId]);

  const isTeacher = user && ['principal', 'teacher', 'admin'].includes(user.role);

  // Handlers
  const handleOpenPending = (pending: any) => {
    setActivePendingId(pending.id);
    setClassId(pending.className);
    setSubject(pending.subject);
    setContent('');
    setShowModal(true);
  };

  const handleOpenManual = () => {
    setActivePendingId(null);
    setClassId('8A');
    setSubject('');
    setContent('');
    setShowModal(true);
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      // Simulate API Call
      await new Promise(r => setTimeout(r, 800));
      
      const newEntry: DiaryEntry = {
        id: `de-${Date.now()}`,
        class: { id: classId, name: classId },
        subject,
        content,
        date: new Date().toISOString(),
        teacher: { name: user?.name || 'Teacher' }
      };
      
      setEntries([newEntry, ...entries]);
      
      if (activePendingId) {
        setPendingLogs(prev => prev.filter(p => p.id !== activePendingId));
      }
      
      setShowModal(false);
      setToastMessage(`Diary logged and sent to parents of ${classId}!`);

      const user = readUserSession();
      if (user?.schoolId) {
        sendNotification({
          type: 'diary_posted',
          title: 'New Diary Entry',
          body: `${newEntry.subject} diary for Class ${newEntry.class?.name || 'your child'} has been posted.`,
          metadata: { subject: newEntry.subject, className: newEntry.class?.name },
          createdBy: user.name || 'Teacher',
          schoolId: user.schoolId,
          targetAudience: 'parents',
        }).catch(console.error);
      }

      setTimeout(() => setToastMessage(''), 4000);
    } catch (err: any) {
      setFormError('Failed to post diary entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-fade-in pb-20 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>School Diary</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Monitor daily logs, homework, and teacher notes across all classes.
          </p>
        </div>
        {isTeacher && (
          <button onClick={handleOpenManual} className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black shadow-lg transition-all hover:scale-105 active:scale-95">
            <Plus size={18} /> New Manual Log
          </button>
        )}
      </div>

      {/* Teacher Pending Logs Notification Area */}
      {isTeacher && pendingLogs.length > 0 && (
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-2">
            <Bell size={16} style={{ color: '#FF9500' }} className="animate-bounce" />
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#FF9500' }}>Action Required</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingLogs.map(log => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-3xl relative overflow-hidden group cursor-pointer"
                style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}
                onClick={() => handleOpenPending(log)}
              >
                <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: '#FF9500' }} />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md" style={{ background: 'rgba(255,149,0,0.15)', color: '#FF9500' }}>Class Just Ended</span>
                  <Clock size={14} style={{ color: 'var(--color-text-tertiary)' }} />
                </div>
                <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>{log.subject}</h3>
                <p className="text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>Class {log.className} • {log.time}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>Waiting for diary log...</p>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:scale-110" style={{ background: 'var(--vs-primary)', color: '#fff' }}>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="glass-card p-3 mb-6 flex flex-wrap items-center gap-3">
        <div className="flex-1 flex items-center gap-3 px-3">
          <Search size={18} style={{ color: 'var(--color-text-tertiary)' }} />
          <input
            type="text"
            className="w-full bg-transparent border-none focus:outline-none text-sm font-bold"
            placeholder="Search subjects, notes, or teachers..."
            style={{ color: 'var(--color-text-primary)' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-[1px] h-6" style={{ background: 'var(--color-border)' }} />
        <select
          className="bg-transparent border-none px-4 py-2 text-sm font-bold focus:outline-none cursor-pointer appearance-none"
          style={{ color: 'var(--color-text-secondary)' }}
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
        >
          <option value="all">All Classes</option>
          <option value="8A">Class 8A</option>
          <option value="9B">Class 9B</option>
          <option value="10A">Class 10A</option>
        </select>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="glass-card h-64 animate-shimmer" />
      ) : filteredEntries.length === 0 ? (
        <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--color-glass)' }}>
            <BookOpen size={24} style={{ color: 'var(--color-text-tertiary)' }} />
          </div>
          <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>No diary entries found</h3>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Check back later for class updates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden flex flex-col sm:flex-row"
            >
              <div className="sm:w-32 p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r" style={{ borderColor: 'var(--color-border)', background: 'var(--color-glass)' }}>
                <div className="text-3xl font-black leading-none" style={{ color: 'var(--vs-primary)' }}>
                  {new Date(entry.date).getDate()}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {new Date(entry.date).toLocaleString('default', { month: 'short' })}
                </div>
              </div>
              
              <div className="p-6 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="inline-block px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg mb-2"
                          style={{ background: 'var(--color-glass-3)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                      Class {entry.class.name}
                    </span>
                    <h3 className="text-xl font-black" style={{ color: 'var(--color-text-primary)' }}>{entry.subject}</h3>
                  </div>
                  <span className="text-xs font-bold" style={{ color: 'var(--color-text-tertiary)' }}>
                    {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <p className="text-sm font-medium leading-relaxed mb-5" style={{ color: 'var(--color-text-primary)' }}>
                  {entry.content}
                </p>
                
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white" style={{ background: 'var(--vs-primary)' }}>
                    {entry.teacher.name.charAt(0)}
                  </div>
                  Posted by <span style={{ color: 'var(--color-text-secondary)' }}>{entry.teacher.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ADD ENTRY MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
               style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
               onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg rounded-[32px] overflow-hidden"
              style={{ background: 'var(--surface)', border: '1px solid var(--color-border)', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-glass)' }}>
                <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>
                  {activePendingId ? 'Log Today\'s Class' : 'New Diary Entry'}
                </h3>
                <button className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        style={{ background: 'var(--color-glass)', color: 'var(--color-text-secondary)' }}
                        onClick={() => setShowModal(false)}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handlePost}>
                <div className="p-6 space-y-5">
                  {formError && (
                    <div className="p-3 rounded-2xl flex items-center gap-2 text-sm font-bold" style={{ background: 'rgba(255,59,48,0.1)', color: '#FF3B30' }}>
                      <AlertCircle size={16} /> {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Class</label>
                      <select
                        className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none appearance-none"
                        style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                        required
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        disabled={!!activePendingId} // Lock if coming from pending
                      >
                        <option value="8A">8A</option>
                        <option value="9B">9B</option>
                        <option value="10A">10A</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Subject</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none placeholder-opacity-50"
                        style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                        required
                        placeholder="e.g. Mathematics"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        disabled={!!activePendingId} // Lock if coming from pending
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>What was covered? & Homework</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-2xl text-sm font-medium focus:outline-none min-h-[120px] resize-y"
                      style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                      required
                      placeholder="Type the class summary and assignments here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="p-5 flex justify-end gap-3" style={{ background: 'var(--color-glass)', borderTop: '1px solid var(--color-border)' }}>
                  <button type="button" className="px-6 py-3 font-bold text-sm rounded-2xl transition-all" style={{ color: 'var(--color-text-secondary)' }} onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black shadow-lg transition-all disabled:opacity-50" disabled={isSubmitting}>
                    {isSubmitting ? 'Posting...' : <><Send size={16} /> Send to Parents</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl"
            style={{ background: 'rgba(52,199,89,0.95)', backdropFilter: 'blur(16px)', color: '#fff' }}
          >
            <CheckCircle2 size={20} /> 
            <span className="font-bold text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
