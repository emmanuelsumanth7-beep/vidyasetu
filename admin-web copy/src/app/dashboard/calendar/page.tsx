'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, FileText, ChevronLeft, ChevronRight, Plus, CalendarDays, BookOpen, Clock, Users, X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { readUserSession, type ClientUser } from '@/lib/session';
import { useSocket } from '@/components/SocketProvider';

/* ── DATA & TYPES ─────────────────────────────────────────────────────────── */
type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'holiday' | 'exam' | 'event' | 'term';
};

const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Summer Break Starts', date: '2026-06-01', type: 'holiday' },
  { id: '2', title: 'School Reopens', date: '2026-07-15', type: 'term' },
  { id: '3', title: 'Unit Test 1', date: '2026-08-10', type: 'exam' },
  { id: '4', title: 'Unit Test 1', date: '2026-08-11', type: 'exam' },
  { id: '5', title: 'Unit Test 1', date: '2026-08-12', type: 'exam' },
  { id: '6', title: 'Independence Day', date: '2026-08-15', type: 'holiday' },
  { id: '7', title: 'Science Exhibition', date: '2026-08-25', type: 'event' },
];

const MOCK_EXAM_SCHEDULES = [
  { 
    id: 'e1', name: 'Unit Test 1', status: 'published', classes: ['8A', '9B', '10A'],
    timeline: 'Aug 10 - Aug 12, 2026',
    subjects: [
      { date: 'Aug 10', time: '09:00 AM', subject: 'Mathematics' },
      { date: 'Aug 11', time: '09:00 AM', subject: 'Science' },
      { date: 'Aug 12', time: '09:00 AM', subject: 'English' },
    ]
  }
];

export default function CalendarDashboard() {
  const [user] = useState<ClientUser | null>(() => readUserSession());
  const canEditCalendar = user?.role === 'principal' || user?.role === 'admin' || user?.role === 'clerk';
  const socket = useSocket();
  
  const [activeTab, setActiveTab] = useState<'academic' | 'exams'>('academic');
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // Aug 2026 for demo
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);

  // Initialize from LocalStorage for Prototype Persistence
  useEffect(() => {
    const saved = localStorage.getItem('vidyasetu_calendar_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCalendarEvents([...MOCK_EVENTS, ...parsed]);
      } catch (e) {
        console.error('Failed to parse saved calendar events', e);
      }
    }
  }, []);

  // Listen for real-time WebSocket updates (simulated cross-client sync)
  useEffect(() => {
    if (!socket) return;
    const handleNewEvent = (evt: CalendarEvent) => {
      setCalendarEvents(prev => {
        // Prevent duplicates
        if (prev.find(e => e.id === evt.id)) return prev;
        return [...prev, evt];
      });
    };
    socket.on('calendar_event_added', handleNewEvent);
    return () => {
      socket.off('calendar_event_added', handleNewEvent);
    };
  }, [socket]);
  
  // Add Event Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [newEvent, setNewEvent] = useState({ title: '', type: 'event' as CalendarEvent['type'] });
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [showEventSuccess, setShowEventSuccess] = useState(false);
  
  // Exam Planner State
  const [examSchedules, setExamSchedules] = useState(MOCK_EXAM_SCHEDULES);
  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ name: '', timeline: '', classes: '' });
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- CALENDAR LOGIC ---
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentDate.getMonth() + 1, 1));

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditCalendar) return;
    
    // Data Integrity Validation
    if (!newEvent.title.trim() || !newEvent.type || !selectedDateStr) {
      alert("Invalid event data. Please fill all fields.");
      return;
    }
    
    setIsSavingEvent(true);
    // Simulate secure API call and sync to maintain data integrity
    setTimeout(() => {
      setIsSavingEvent(false);
      const newEvt: CalendarEvent = {
        id: `ev-${Date.now()}`,
        title: newEvent.title.trim(),
        date: selectedDateStr,
        type: newEvent.type
      };
      
      setCalendarEvents(prev => {
        const updated = [...prev, newEvt];
        // Persist only user-added events (exclude MOCK_EVENTS from local storage)
        const customEvents = updated.filter(evt => !MOCK_EVENTS.some(m => m.id === evt.id));
        localStorage.setItem('vidyasetu_calendar_events', JSON.stringify(customEvents));
        return updated;
      });
      
      setShowEventSuccess(true);
      
      // Emit websocket event for immediate sync to everyone in the same school room
      if (socket) {
        socket.emit('add_calendar_event', newEvt);
      }
      
      setTimeout(() => {
        setShowEventSuccess(false);
        setShowEventModal(false);
      }, 1500);
    }, 600);
  };

  // --- EXAM PLANNER LOGIC ---
  const handlePublishSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      const schedule = {
        id: `e-${Date.now()}`,
        name: newSchedule.name,
        status: 'published',
        classes: newSchedule.classes.split(',').map(s => s.trim()),
        timeline: newSchedule.timeline,
        subjects: [] // empty for mockup
      };
      setExamSchedules([schedule, ...examSchedules]);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowPlannerModal(false);
        setNewSchedule({ name: '', timeline: '', classes: '' });
      }, 2000);
    }, 1000);
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-fade-in pb-20 relative space-y-6">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Calendar & Exams</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Manage the academic year timeline and exam schedules.</p>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex items-center p-1.5 rounded-2xl shrink-0" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}>
          <button 
            onClick={() => setActiveTab('academic')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ 
              background: activeTab === 'academic' ? 'var(--surface)' : 'transparent',
              color: activeTab === 'academic' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
              boxShadow: activeTab === 'academic' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            <CalendarDays size={16} /> Academic Calendar
          </button>
          <button 
            onClick={() => setActiveTab('exams')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ 
              background: activeTab === 'exams' ? 'var(--surface)' : 'transparent',
              color: activeTab === 'exams' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
              boxShadow: activeTab === 'exams' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            <FileText size={16} /> Exam Planner
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ─────────────────────────────────────────────────────────────────────────
            ACADEMIC CALENDAR VIEW
        ────────────────────────────────────────────────────────────────────────── */}
        {activeTab === 'academic' && (
          <motion.div key="academic" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            <div className="glass-card overflow-hidden">
              {/* Calendar Header */}
              <div className="p-5 md:p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-black" style={{ color: 'var(--color-text-primary)' }}>
                    {currentMonthName} <span style={{ color: 'var(--color-text-tertiary)' }}>{currentYear}</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handlePrevMonth} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={handleNextMonth} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-6">
                <div className="grid grid-cols-7 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2 md:gap-3">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square rounded-2xl opacity-20" style={{ background: 'var(--color-glass)' }} />
                  ))}
                  
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dateNum = i + 1;
                    const dateStr = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
                    const dayEvents = calendarEvents.filter(e => e.date === dateStr);
                    
                    return (
                      <div key={dateNum} 
                           onClick={() => {
                             if (canEditCalendar) {
                               setSelectedDateStr(dateStr);
                               setNewEvent({ title: '', type: 'event' });
                               setShowEventModal(true);
                             }
                           }}
                           className={`aspect-square rounded-2xl p-2 md:p-3 relative group transition-all ${canEditCalendar ? 'cursor-pointer hover:scale-[1.02] hover:shadow-lg' : ''}`}
                           style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}>
                        <span className="text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>{dateNum}</span>
                        
                        <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-1">
                          {dayEvents.map(event => {
                            let bg = '', color = '';
                            if (event.type === 'holiday') { bg = 'rgba(52,199,89,0.15)'; color = '#34C759'; }
                            if (event.type === 'exam')    { bg = 'rgba(255,59,48,0.15)'; color = '#FF3B30'; }
                            if (event.type === 'event')   { bg = 'rgba(0,122,255,0.15)'; color = '#007AFF'; }
                            if (event.type === 'term')    { bg = 'rgba(175,82,222,0.15)'; color = '#AF52DE'; }
                            
                            return (
                              <div key={event.id} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate w-full" style={{ background: bg, color: color }}>
                                {event.title}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 px-2">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: '#34C759' }} /> <span className="text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>Holidays</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: '#FF3B30' }} /> <span className="text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>Exams</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: '#007AFF' }} /> <span className="text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>Events</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: '#AF52DE' }} /> <span className="text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>Terms</span></div>
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────
            EXAM PLANNER VIEW
        ────────────────────────────────────────────────────────────────────────── */}
        {activeTab === 'exams' && (
          <motion.div key="exams" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black" style={{ color: 'var(--color-text-primary)' }}>Scheduled Exams</h2>
              <button onClick={() => setShowPlannerModal(true)} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black shadow-lg">
                <Plus size={16} /> Plan New Exam
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {examSchedules.map(schedule => (
                <div key={schedule.id} className="glass-card overflow-hidden">
                  <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'rgba(52,199,89,0.1)', color: '#34C759' }}>
                          {schedule.status}
                        </span>
                        <span className="text-xs font-bold" style={{ color: 'var(--color-text-tertiary)' }}>
                          {schedule.classes.map(c => `Class ${c}`).join(', ')}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black" style={{ color: 'var(--color-text-primary)' }}>{schedule.name}</h3>
                      <p className="text-sm font-medium mt-1 flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <CalendarIcon size={14} /> {schedule.timeline}
                      </p>
                    </div>
                    
                    <button className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all" style={{ background: 'var(--color-glass-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                      Edit Timetable
                    </button>
                  </div>

                  {/* Subject breakdown */}
                  <div className="p-5 md:p-6 bg-black/5 dark:bg-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Subject Timetable</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {schedule.subjects.map((sub, i) => (
                        <div key={i} className="p-4 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--color-border)' }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>{sub.date}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--color-glass-3)', color: 'var(--color-text-tertiary)' }}>
                              <Clock size={10} className="inline mr-1"/> {sub.time}
                            </span>
                          </div>
                          <p className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>{sub.subject}</p>
                        </div>
                      ))}
                      {schedule.subjects.length === 0 && (
                        <p className="text-sm font-bold" style={{ color: 'var(--color-text-tertiary)' }}>No subjects mapped yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────────────────
          PLAN EXAM MODAL
      ────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPlannerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }} onClick={() => setShowPlannerModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-[32px] overflow-hidden"
              style={{ background: 'var(--surface)', border: '1px solid var(--color-border)', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}>
              
              <div className="p-6 flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-glass)' }}>
                <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>Plan New Exam</h3>
                <button className="w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ background: 'var(--color-glass)', color: 'var(--color-text-secondary)' }} onClick={() => setShowPlannerModal(false)}>
                  <X size={16} />
                </button>
              </div>

              {showSuccess ? (
                <div className="p-10 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(52,199,89,0.15)' }}>
                    <CheckCircle2 size={40} style={{ color: '#34C759' }} />
                  </div>
                  <h3 className="text-xl font-black mb-2" style={{ color: 'var(--color-text-primary)' }}>Exam Planned!</h3>
                  <p className="text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>The exam schedule block has been created.</p>
                </div>
              ) : (
                <form onSubmit={handlePublishSchedule}>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Exam Name</label>
                      <input type="text" required placeholder="e.g. Mid-Term Examination" value={newSchedule.name} onChange={e => setNewSchedule({...newSchedule, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none"
                        style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Timeline</label>
                      <input type="text" required placeholder="e.g. Oct 10 - Oct 25, 2026" value={newSchedule.timeline} onChange={e => setNewSchedule({...newSchedule, timeline: e.target.value})}
                        className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none"
                        style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Applicable Classes</label>
                      <input type="text" required placeholder="e.g. 8A, 9B, 10A" value={newSchedule.classes} onChange={e => setNewSchedule({...newSchedule, classes: e.target.value})}
                        className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none"
                        style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                      <p className="text-[10px] mt-1.5" style={{ color: 'var(--color-text-tertiary)' }}>Comma separated list of classes.</p>
                    </div>
                  </div>
                  
                  <div className="p-5 flex justify-end gap-3" style={{ background: 'var(--color-glass)', borderTop: '1px solid var(--color-border)' }}>
                    <button type="button" className="px-6 py-3 font-bold text-sm rounded-2xl transition-all" style={{ color: 'var(--color-text-secondary)' }} onClick={() => setShowPlannerModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black shadow-lg disabled:opacity-50" disabled={isPublishing}>
                      {isPublishing ? 'Creating...' : 'Create Block'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────────────────
          ADD EVENT MODAL
      ────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }} onClick={() => setShowEventModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm rounded-[32px] overflow-hidden"
              style={{ background: 'var(--surface)', border: '1px solid var(--color-border)', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}>
              
              <div className="p-6 flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-glass)' }}>
                <div>
                  <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>Add Event</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--color-text-secondary)' }}>{selectedDateStr}</p>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ background: 'var(--color-glass)', color: 'var(--color-text-secondary)' }} onClick={() => setShowEventModal(false)}>
                  <X size={16} />
                </button>
              </div>

              {showEventSuccess ? (
                <div className="p-10 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(52,199,89,0.15)' }}>
                    <CheckCircle2 size={32} style={{ color: '#34C759' }} />
                  </div>
                  <h3 className="text-lg font-black mb-1" style={{ color: 'var(--color-text-primary)' }}>Event Synced!</h3>
                  <p className="text-xs text-center" style={{ color: 'var(--color-text-secondary)' }}>Securely verified and synced across the grid.</p>
                </div>
              ) : (
                <form onSubmit={handleSaveEvent}>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Event Title</label>
                      <input type="text" required placeholder="e.g. Staff Meeting" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                        className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none"
                        style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Event Type</label>
                      <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value as CalendarEvent['type']})}
                        className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none appearance-none"
                        style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                        <option value="event">General Event</option>
                        <option value="holiday">Holiday</option>
                        <option value="exam">Exam</option>
                        <option value="term">Term Start/End</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-5 flex justify-end gap-3" style={{ background: 'var(--color-glass)', borderTop: '1px solid var(--color-border)' }}>
                    <button type="button" className="px-6 py-3 font-bold text-sm rounded-2xl transition-all" style={{ color: 'var(--color-text-secondary)' }} onClick={() => setShowEventModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black shadow-lg disabled:opacity-50" disabled={isSavingEvent}>
                      {isSavingEvent ? 'Syncing...' : 'Add & Sync'}
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
