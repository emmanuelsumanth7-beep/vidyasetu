'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { useSocket } from '@/components/SocketProvider';
import { BookOpen, Search, Plus, X, AlertCircle, CheckCircle } from 'lucide-react';

interface SchoolClass {
  id: string;
  name: string;
}

interface DiaryEntry {
  id: string;
  class: SchoolClass;
  subject: string;
  content: string;
  date: string;
  teacher: { name: string };
}

export default function DiaryDashboard() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  // Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('all');

  // Modal & Form
  const [showModal, setShowModal] = useState(false);
  const [classId, setClassId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const socket = useSocket();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleDiaryUpdated = (entry: DiaryEntry) => {
      setEntries((prev) => [entry, ...prev]);
    };
    socket.on('diaryUpdated', handleDiaryUpdated);
    return () => {
      socket.off('diaryUpdated', handleDiaryUpdated);
    };
  }, [socket]);

  const fetchData = async () => {
    try {
      const [diaryRes, classesRes] = await Promise.all([
        api.get('/diary'),
        api.get('/classes')
      ]);
      setEntries(diaryRes);
      setClasses(classesRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = useMemo(() => {
    let result = entries;
    if (selectedClassId !== 'all') {
      result = result.filter((e) => e.class?.id === selectedClassId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.content.toLowerCase().includes(q) ||
          e.teacher?.name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [entries, searchQuery, selectedClassId]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      await api.post('/diary', { classId, subject, content });
      setShowModal(false);
      setClassId('');
      setSubject('');
      setContent('');
      setToastMessage('Diary entry posted successfully.');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to post diary entry';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-fade-in pb-20 font-body relative">
      {/* Liquid Abstract Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none -z-10"></div>
      <div className="fixed top-[20%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none -z-10"></div>

      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-display text-gray-900 tracking-tight">School Diary</h1>
          <p className="text-sm font-medium text-gray-600 mt-1">
            Monitor daily logs, homework, and teacher notes across all classes.
          </p>
        </div>
        {user?.role !== 'parent' && (
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-6 py-3 flex items-center gap-2 rounded-2xl font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all">
            <Plus size={20} strokeWidth={3} /> Add Entry
          </button>
        )}
      </header>

      <div className="flex flex-col gap-6">
        <div className="bg-white/40 backdrop-blur-2xl rounded-[24px] p-4 border border-white/50 shadow-[0_4px_24px_0_rgba(31,38,135,0.1)] flex flex-wrap items-center gap-4 transition-all focus-within:bg-white/60">
          <div className="flex-1 flex items-center gap-3">
            <Search className="text-gray-500 shrink-0 ml-2" size={20} />
            <input
              type="text"
              className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-gray-800 placeholder:text-gray-400"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="bg-white/50 border border-gray-200/50 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="all">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          {loading ? (
            <div className="h-64 bg-white/20 backdrop-blur-md rounded-[32px] shadow-sm border border-white/40 animate-pulse" />
          ) : filteredEntries.length === 0 ? (
            <div className="bg-white/40 backdrop-blur-2xl rounded-[32px] border border-white/50 p-16 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold font-display text-gray-900">No diary entries found</h3>
              <p className="text-gray-500 mt-2">
                {searchQuery || selectedClassId !== 'all'
                  ? 'No entries match your filters.'
                  : 'No diary entries have been posted yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredEntries.map((entry) => (
                <article
                  key={entry.id}
                  className="bg-white/60 backdrop-blur-xl rounded-[24px] border border-white/50 shadow-sm hover:shadow-md transition-all flex overflow-hidden animate-slide-up"
                >
                  <div className="p-6 flex flex-col items-center justify-center bg-indigo-50/50 border-r border-indigo-100/50 min-w-[100px]">
                    <div className="text-4xl font-black text-indigo-600 font-display leading-none">
                      {new Date(entry.date).getDate()}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 mt-2">
                      {new Date(entry.date).toLocaleString('default', { month: 'short' })}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg uppercase tracking-widest mb-2 border border-amber-200">
                          {entry.class?.name || 'Class'}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">{entry.subject}</h3>
                      </div>
                      <span className="text-xs font-bold text-gray-400">
                        {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {entry.content}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        {entry.teacher?.name?.charAt(0) || 'T'}
                      </div>
                      Posted by <span className="text-gray-900">{entry.teacher?.name}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-2xl w-full max-w-lg overflow-hidden animate-modal-scale" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/50 flex justify-between items-center bg-white/40">
              <h3 className="text-xl font-bold text-gray-900 font-display">Add Diary Entry</h3>
              <button className="text-gray-500 hover:text-gray-900 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-all" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePost}>
              <div className="p-8 space-y-6">
                {formError && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-2 text-sm font-bold">
                    <AlertCircle size={18} />
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Class</label>
                  <select
                    className="w-full bg-white/50 border border-gray-200/50 rounded-2xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                    required
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                  >
                    <option value="">-- Select a class --</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Subject</label>
                  <input
                    type="text"
                    className="w-full bg-white/50 border border-gray-200/50 rounded-2xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-400 font-bold"
                    required
                    placeholder="e.g. Mathematics, Science"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Content / Homework</label>
                  <textarea
                    className="w-full bg-white/50 border border-gray-200/50 rounded-2xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-400 min-h-[120px] resize-y"
                    required
                    placeholder="What was covered today? Any homework?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="p-6 bg-white/40 border-t border-white/50 flex justify-end gap-3">
                <button type="button" className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 rounded-2xl transition-all" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl hover:bg-indigo-700 transition-all disabled:opacity-50" disabled={isSubmitting}>
                  {isSubmitting ? 'Posting...' : 'Post Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="toast animate-slide-up">
          <CheckCircle size={16} /> {toastMessage}
        </div>
      )}
    </div>
  );
}
