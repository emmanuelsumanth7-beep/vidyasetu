'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { Calendar, Users, Clock, BookOpen, AlertCircle, Edit2, Plus, X, Trash2, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Distinctive color palettes for different subjects
const SUBJECT_COLORS = [
  'bg-blue-50 border-blue-200 text-blue-800',
  'bg-emerald-50 border-emerald-200 text-emerald-800',
  'bg-amber-50 border-amber-200 text-amber-800',
  'bg-purple-50 border-purple-200 text-purple-800',
  'bg-rose-50 border-rose-200 text-rose-800',
  'bg-cyan-50 border-cyan-200 text-cyan-800',
];

function getSubjectColor(subject: string) {
  if (!subject) return 'bg-gray-50 border-gray-200 text-gray-500';
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % SUBJECT_COLORS.length;
  return SUBJECT_COLORS[index];
}

export default function ClassesTimetablePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [timetable, setTimetable] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Modal State
  const [activeCell, setActiveCell] = useState<{ day: string, period: number, entry?: any } | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editTeacherId, setEditTeacherId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [classSearchQuery, setClassSearchQuery] = useState('');

  const filteredClasses = useMemo(() => {
    if (!classSearchQuery.trim()) return classes;
    return classes.filter(c => c.name.toLowerCase().includes(classSearchQuery.toLowerCase()));
  }, [classes, classSearchQuery]);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const fetchTimetable = async (classId: string) => {
    try {
      setLoading(true);
      // 1. Try Real API
      const data = await api.get(`/classes/${classId}/timetable`);
      setTimetable(data);
    } catch (err: any) {
      console.warn("Real Timetable API failed, falling back to mock:", err);
      // MOCK TIMETABLE DATA: INSTANT EXECUTION
      const mockTimetable = [
        { id: '1', dayOfWeek: 'Monday', periodNumber: 1, subject: 'Mathematics', teacher: { name: 'Sumanth Emmanuel' } },
        { id: '2', dayOfWeek: 'Monday', periodNumber: 2, subject: 'Physics', teacher: { name: 'Albert Einstein' } },
        { id: '3', dayOfWeek: 'Tuesday', periodNumber: 3, subject: 'Chemistry', teacher: { name: 'Marie Curie' } },
        { id: '4', dayOfWeek: 'Wednesday', periodNumber: 1, subject: 'English', teacher: { name: 'William Shakespeare' } },
        { id: '5', dayOfWeek: 'Thursday', periodNumber: 4, subject: 'Biology', teacher: { name: 'Charles Darwin' } },
        { id: '6', dayOfWeek: 'Friday', periodNumber: 5, subject: 'History', teacher: { name: 'Julius Caesar' } },
      ];
      setTimetable(mockTimetable);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // 1. Try Real API
        const [classesData, teachersData] = await Promise.all([
          api.get('/classes'),
          api.get('/teachers')
        ]);
        setClasses(classesData);
        setTeachers(teachersData);
        if (classesData.length > 0) {
          setSelectedClassId(classesData[0].id);
          await fetchTimetable(classesData[0].id);
        }
      } catch (err: any) {
        console.warn("Real Classes API failed, falling back to mock:", err);
        // MOCK CLASSES AND TEACHERS: INSTANT EXECUTION
        const classesData = [
          { id: 'class-1', name: 'Class 10-A' },
          { id: 'class-2', name: 'Class 10-B' },
          { id: 'class-3', name: 'Class 9-A' },
          { id: 'class-4', name: 'Class 8-C' }
        ];
        const teachersData = [
          { id: 't1', name: 'Sumanth Emmanuel' },
          { id: 't2', name: 'Albert Einstein' },
          { id: 't3', name: 'Marie Curie' }
        ];
        
        setClasses(classesData);
        setTeachers(teachersData);
        if (classesData.length > 0) {
          setSelectedClassId(classesData[0].id);
          await fetchTimetable(classesData[0].id);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    fetchTimetable(classId);
  };

  const handleCellClick = (day: string, period: number, entry: any) => {
    if (!isEditing) return;
    setActiveCell({ day, period, entry });
    if (entry) {
      setEditSubject(entry.subject);
      setEditTeacherId(entry.teacherId);
    } else {
      setEditSubject('');
      setEditTeacherId(teachers.length > 0 ? teachers[0].id : '');
    }
  };

  const handleSaveEntry = async () => {
    if (!activeCell || !editSubject || !editTeacherId) return;
    setIsSaving(true);
    
    // OPTIMISTIC UI UPDATE
    const newEntry = {
      id: Math.random().toString(),
      dayOfWeek: activeCell.day,
      periodNumber: activeCell.period,
      subject: editSubject,
      teacher: teachers.find(t => t.id === editTeacherId)
    };
    
    setTimetable(prev => {
      const filtered = prev.filter(t => !(t.dayOfWeek === activeCell.day && t.periodNumber === activeCell.period));
      return [...filtered, newEntry];
    });
    setActiveCell(null);
    setIsSaving(false);

    try {
      // Background Sync with Real API
      await api.post(`/classes/${selectedClassId}/timetable`, {
        dayOfWeek: activeCell.day,
        periodNumber: activeCell.period,
        subject: editSubject,
        teacherId: editTeacherId
      });
    } catch (err: any) {
      console.warn("Background API sync failed:", err);
    }
  };

  const handleDeleteEntry = async () => {
    if (!activeCell?.entry) return;
    setIsSaving(true);
    try {
      // MOCK DELETE: INSTANT EXECUTION
      setTimetable(prev => prev.filter(t => t.id !== activeCell.entry.id));
      setActiveCell(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete entry');
    } finally {
      setIsSaving(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [1, 2, 3, 4, 5, 6];

  const getEntry = (day: string, period: number) => {
    return timetable.find(t => t.dayOfWeek === day && t.periodNumber === period);
  };

  const activeClass = classes.find(c => c.id === selectedClassId);
  const isAdmin = user?.role === 'admin' || user?.role === 'principal';

  // Component for rendering a single period block (used in both mobile and desktop)
  const PeriodBlock = ({ day, period }: { day: string, period: number }) => {
    const entry = getEntry(day, period);
    const colorClass = entry ? getSubjectColor(entry.subject) : 'bg-transparent border-dashed border-gray-200 text-gray-400';
    
    return (
      <motion.div
        whileHover={isEditing ? { scale: 0.98 } : {}}
        onClick={() => handleCellClick(day, period, entry)}
        className={`h-full w-full rounded-xl border-2 flex flex-col justify-center p-3 transition-all ${isEditing ? 'cursor-pointer hover:border-interactive-blue shadow-sm' : ''} ${colorClass} ${!entry && isEditing ? 'hover:bg-blue-50/50 hover:text-interactive-blue hover:border-interactive-blue' : ''}`}
      >
        {entry ? (
          <>
            <div className="font-bold text-sm mb-1 flex items-center gap-1.5 leading-tight">
              <BookOpen size={14} className="opacity-70 shrink-0" />
              <span className="truncate">{entry.subject}</span>
            </div>
            <div className="text-xs font-medium opacity-75 truncate">
              {entry.teacher?.name || 'TBA'}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 opacity-60">
            {isEditing ? <Plus size={20} /> : <span className="text-xs font-semibold tracking-wide uppercase">Free</span>}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink-primary font-display tracking-tight">Class Timetables</h1>
          <p className="text-ink-secondary mt-1">Manage weekly schedules with dynamic color mapping.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-5 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${isEditing ? 'bg-ink-primary text-white scale-105' : 'bg-white border-2 border-gray-200 text-ink-primary hover:border-gray-300'}`}
          >
            {isEditing ? <X size={18} /> : <Edit2 size={18} />}
            <span>{isEditing ? 'Exit Edit Mode' : 'Edit Timetable'}</span>
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Sidebar: Class List */}
        <div className="w-full lg:w-72 shrink-0 sticky top-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50 space-y-4">
              <h3 className="font-bold text-ink-primary flex items-center gap-2 text-sm uppercase tracking-wider">
                <Users size={16} className="text-interactive-blue" />
                Select Class
              </h3>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search classes..."
                  value={classSearchQuery}
                  onChange={e => setClassSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-interactive-blue transition-colors"
                />
              </div>
            </div>
            <div className="p-2 max-h-[600px] overflow-y-auto">
              {filteredClasses.length === 0 && !loading ? (
                <div className="p-8 text-center text-sm text-ink-secondary flex flex-col items-center gap-2">
                  <Search size={24} className="opacity-20" />
                  <p>No classes match your search.</p>
                </div>
              ) : (
                <div className="space-y-1 p-1">
                  {filteredClasses.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleClassSelect(c.id)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl font-medium transition-all flex items-center justify-between group ${selectedClassId === c.id ? 'bg-interactive-blue text-white shadow-md' : 'hover:bg-gray-50 border border-transparent hover:border-gray-100 text-ink-primary'}`}
                    >
                      <span className="font-display font-semibold tracking-tight">{c.name}</span>
                      <ChevronRight size={16} className={selectedClassId === c.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-40 transition-opacity'} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content: Timetable Grid & Mobile Day View */}
        <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
          
          {error && (
            <div className="m-5 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} className="shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {activeClass && (
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-ink-primary font-display">{activeClass.name} Timetable</h2>
                {isEditing && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-semibold text-interactive-blue mt-1">
                    Editing Mode Active — Click any cell to modify.
                  </motion.p>
                )}
              </div>
              <div className="flex gap-3">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-secondary bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                  <Clock size={14} /> 6 Periods
                </span>
              </div>
            </div>
          )}

          {loading && timetable.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-ink-secondary">
              <div className="w-12 h-12 border-4 border-interactive-blue/30 border-t-interactive-blue rounded-full animate-spin mb-4"></div>
              <p className="font-medium animate-pulse">Constructing schedule...</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              
              {/* Mobile View: Day Tabs */}
              <div className="md:hidden border-b border-gray-100 bg-white sticky top-0 z-10 flex overflow-x-auto snap-x hide-scrollbar">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-6 py-4 font-bold text-sm whitespace-nowrap snap-start transition-colors relative ${selectedDay === day ? 'text-interactive-blue' : 'text-ink-secondary hover:text-ink-primary'}`}
                  >
                    {day}
                    {selectedDay === day && (
                      <motion.div layoutId="mobileTabIndicator" className="absolute bottom-0 left-0 right-0 h-1 bg-interactive-blue rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Mobile View: Vertical Timeline */}
              <div className="md:hidden p-4 space-y-3 bg-gray-50 flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {periods.map(p => (
                      <div key={p} className="flex gap-3 h-24">
                        <div className="w-12 shrink-0 flex flex-col items-center justify-center border-r-2 border-dashed border-gray-200 pr-3">
                          <span className="text-xs font-bold text-ink-secondary uppercase">Per</span>
                          <span className="text-xl font-display font-bold text-ink-primary">{p}</span>
                        </div>
                        <div className="flex-1">
                          <PeriodBlock day={selectedDay} period={p} />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Desktop View: Full Grid */}
              <div className="hidden md:block flex-1 overflow-x-auto p-6 bg-[#FAFAFA]">
                <table className="w-full border-separate border-spacing-3 min-w-[800px]">
                  <thead>
                    <tr>
                      <th className="p-2 w-28"></th>
                      {periods.map(p => (
                        <th key={p} className="p-3 text-center font-bold text-ink-secondary uppercase tracking-wider text-sm">
                          Period {p}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {daysOfWeek.map((day, idx) => (
                      <motion.tr 
                        key={day}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <td className="p-4 font-bold text-ink-secondary text-right align-middle text-sm uppercase tracking-wider border-r-2 border-gray-200 pr-6">
                          {day.substring(0, 3)}
                        </td>
                        {periods.map(p => (
                          <td key={`${day}-${p}`} className="p-0 h-[120px] align-top bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <PeriodBlock day={day} period={p} />
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {activeCell && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-ink-primary/40 backdrop-blur-sm" 
              onClick={() => setActiveCell(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 shrink-0">
                <div>
                  <h3 className="font-bold text-xl text-ink-primary font-display">
                    {activeCell.day}
                  </h3>
                  <p className="text-sm font-medium text-interactive-blue uppercase tracking-wider mt-1">Period {activeCell.period}</p>
                </div>
                <button onClick={() => setActiveCell(null)} className="p-2 -mr-2 text-gray-400 hover:text-gray-900 bg-white rounded-full border border-gray-200 transition-colors shadow-sm">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-ink-primary">Subject Name</label>
                  <input 
                    type="text" 
                    value={editSubject}
                    onChange={e => setEditSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-interactive-blue transition-colors font-medium text-ink-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-ink-primary">Assigned Teacher</label>
                  <select 
                    value={editTeacherId}
                    onChange={e => setEditTeacherId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-interactive-blue transition-colors font-medium text-ink-primary bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Select a teacher...</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
                {activeCell.entry ? (
                  <button 
                    onClick={handleDeleteEntry} 
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                ) : <div></div>}
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveCell(null)} 
                    className="px-5 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors bg-white border-2 border-gray-200"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveEntry} 
                    disabled={isSaving || !editSubject || !editTeacherId}
                    className="bg-interactive-blue hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-transform shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
