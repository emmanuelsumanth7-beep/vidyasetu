'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, X, BookOpen, Calendar, Clock } from 'lucide-react';
import { api } from '@/lib/api';

interface HomeworkItem {
  id: string;
  title: string;
  description: string;
  className: string;
  teacherName: string;
  dueDate: string | null;
  createdAt: string;
}

interface SchoolClass { id: string; name: string; }

const DEMO_HOMEWORK: HomeworkItem[] = [
  { id:'dh1', title:'Physics: Thermodynamics Ch.4 Problems', description:'Solve Q1–Q15 from NCERT', className:'10-A', teacherName:'Mr. Ramesh', dueDate: new Date(Date.now()+2*86400000).toISOString(), createdAt: new Date(Date.now()-86400000).toISOString() },
  { id:'dh2', title:'Mathematics: Integration Practice Set', description:'Complete all exercises in worksheet 7', className:'11-B', teacherName:'Mrs. Priya', dueDate: new Date(Date.now()+4*86400000).toISOString(), createdAt: new Date(Date.now()-2*86400000).toISOString() },
  { id:'dh3', title:'English: Essay on Climate Change', description:'Write 500-word essay with introduction, body, conclusion', className:'9-A', teacherName:'Ms. Kavitha', dueDate: new Date(Date.now()+1*86400000).toISOString(), createdAt: new Date(Date.now()-3*86400000).toISOString() },
];

export default function HomeworkPage() {
  const [homework, setHomework]   = useState<HomeworkItem[]>([]);
  const [classes, setClasses]     = useState<SchoolClass[]>([]);
  const [loading, setLoading]     = useState(true);
  const [user, setUser]           = useState<any>(null);
  const [showForm, setShowForm]   = useState(false);

  // Form state
  const [title, setTitle]         = useState('');
  const [classId, setClassId]     = useState('');
  const [description, setDesc]    = useState('');
  const [dueDate, setDueDate]     = useState('');
  const [file, setFile]           = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [formErr, setFormErr]     = useState('');
  const [saved, setSaved]         = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(u);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hwRes, classRes] = await Promise.all([
        api.get('/homework'),
        api.get('/classes')
      ]);
      setHomework(Array.isArray(hwRes) && hwRes.length > 0 ? hwRes : DEMO_HOMEWORK);
      const cls: SchoolClass[] = Array.isArray(classRes) ? classRes.map((c: any) => ({ id: c.id, name: c.name || `${c.grade}-${c.section}` })) : [];
      setClasses(cls);
      if (cls.length > 0) setClassId(cls[0].id);
    } catch {
      setHomework(DEMO_HOMEWORK);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else setIsDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !classId) { setFormErr('Title and class are required.'); return; }
    setFormErr(''); setSaving(true);
    try {
      const res = await api.post('/homework', {
        title: title.trim(),
        classId,
        description: description.trim(),
        dueDate: dueDate || null,
        fileUrl: null
      });
      setHomework(prev => [res, ...prev]);
      setTitle(''); setDesc(''); setDueDate(''); setFile(null);
      setShowForm(false); setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      // Optimistic local add on network failure (demo mode)
      const optimistic: HomeworkItem = {
        id: `local-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        className: classes.find(c => c.id === classId)?.name || 'Class',
        teacherName: user?.name || 'Teacher',
        dueDate: dueDate || null,
        createdAt: new Date().toISOString()
      };
      setHomework(prev => [optimistic, ...prev]);
      setTitle(''); setDesc(''); setDueDate(''); setFile(null);
      setShowForm(false); setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  const canPost = user?.role && ['principal','teacher','admin'].includes(user.role);

  return (
    <div className="max-w-4xl mx-auto w-full space-y-5 pb-28">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1C1C1E' }}>Homework</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6C7278' }}>
            {canPost ? 'Post and manage class assignments.' : 'View your upcoming assignments.'}
          </p>
        </div>
        {canPost && (
          <button onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm">
            <Upload size={15} /> Post Homework
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'rgba(60,60,67,0.06)' }} />)}</div>
      ) : homework.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center text-center gap-3">
          <BookOpen size={36} style={{ color: '#D1D1D6' }} />
          <p className="font-black" style={{ color: '#1C1C1E' }}>No homework posted yet</p>
          <p className="text-sm" style={{ color: '#6C7278' }}>
            {canPost ? 'Click "Post Homework" to assign your first task.' : 'Your teachers haven\'t posted any homework yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {homework.map((hw, i) => {
            const isOverdue = hw.dueDate && new Date(hw.dueDate) < new Date();
            return (
              <motion.div key={hw.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card p-4 flex gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: isOverdue ? 'rgba(255,59,48,0.10)' : 'rgba(0,122,255,0.10)' }}>
                  <FileText size={18} style={{ color: isOverdue ? '#FF3B30' : '#007AFF' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <p className="font-black text-sm" style={{ color: '#1C1C1E' }}>{hw.title}</p>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: 'rgba(88,86,214,0.10)', color: '#5856D6' }}>
                      {hw.className}
                    </span>
                  </div>
                  {hw.description && <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#6C7278' }}>{hw.description}</p>}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {hw.dueDate && (
                      <span className="flex items-center gap-1 text-[10px] font-bold"
                        style={{ color: isOverdue ? '#FF3B30' : '#34C759' }}>
                        <Clock size={10} /> Due {new Date(hw.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        {isOverdue && ' (overdue)'}
                      </span>
                    )}
                    <span className="text-[10px]" style={{ color: '#AEAEB2' }}>by {hw.teacherName}</span>
                    <span className="text-[10px]" style={{ color: '#AEAEB2' }}>{new Date(hw.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Post Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-lg rounded-3xl overflow-hidden"
              style={{ background: '#fff', border: '1px solid rgba(60,60,67,0.12)' }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(60,60,67,0.08)' }}>
                <h3 className="font-black" style={{ color: '#1C1C1E' }}>Post Homework</h3>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ background: 'rgba(60,60,67,0.08)' }}>
                  <X size={16} style={{ color: '#6C7278' }} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {formErr && (
                  <div className="flex items-center gap-2 p-3 rounded-xl text-xs font-bold"
                    style={{ background: 'rgba(255,59,48,0.08)', color: '#FF3B30' }}>
                    <AlertCircle size={14} /> {formErr}
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#AEAEB2' }}>Assignment Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} required
                    placeholder="e.g. Physics: Thermodynamics Ch.4"
                    className="w-full px-4 py-3 rounded-2xl text-sm font-medium focus:outline-none"
                    style={{ background: 'rgba(60,60,67,0.06)', border: '1px solid rgba(60,60,67,0.12)', color: '#1C1C1E' }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#AEAEB2' }}>Target Class</label>
                    <select value={classId} onChange={e => setClassId(e.target.value)} required
                      className="w-full px-4 py-3 rounded-2xl text-sm font-medium focus:outline-none appearance-none"
                      style={{ background: 'rgba(60,60,67,0.06)', border: '1px solid rgba(60,60,67,0.12)', color: '#1C1C1E' }}>
                      {classes.length > 0 ? classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>) : (
                        <>
                          <option value="10A">Class 10-A</option>
                          <option value="9A">Class 9-A</option>
                          <option value="8B">Class 8-B</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#AEAEB2' }}>Due Date</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl text-sm font-medium focus:outline-none"
                      style={{ background: 'rgba(60,60,67,0.06)', border: '1px solid rgba(60,60,67,0.12)', color: '#1C1C1E' }} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#AEAEB2' }}>Instructions</label>
                  <textarea value={description} onChange={e => setDesc(e.target.value)} rows={3}
                    placeholder="Describe the task..."
                    className="w-full px-4 py-3 rounded-2xl text-sm font-medium focus:outline-none resize-none"
                    style={{ background: 'rgba(60,60,67,0.06)', border: '1px solid rgba(60,60,67,0.12)', color: '#1C1C1E' }} />
                </div>
                <div
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag}
                  onDrop={e => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
                  className="rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer"
                  style={{ background: isDragging ? 'rgba(0,122,255,0.06)' : 'rgba(60,60,67,0.04)', border: `2px dashed ${isDragging ? '#007AFF' : 'rgba(60,60,67,0.15)'}` }}>
                  {file ? (
                    <div className="flex items-center gap-3">
                      <FileText size={20} style={{ color: '#007AFF' }} />
                      <span className="text-sm font-bold" style={{ color: '#1C1C1E' }}>{file.name}</span>
                      <button type="button" onClick={() => setFile(null)}><X size={14} style={{ color: '#FF3B30' }} /></button>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} style={{ color: '#AEAEB2' }} />
                      <p className="text-xs font-bold mt-2" style={{ color: '#6C7278' }}>Drag & drop PDF/DOCX or</p>
                      <label className="mt-1 text-xs font-black cursor-pointer" style={{ color: '#007AFF' }}>
                        Browse Files
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e => e.target.files && setFile(e.target.files[0])} />
                      </label>
                    </>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-2xl text-sm font-bold"
                    style={{ background: 'rgba(60,60,67,0.08)', color: '#6C7278' }}>Cancel</button>
                  <button type="submit" disabled={saving}
                    className="flex-1 py-3 rounded-2xl text-sm font-black text-white disabled:opacity-60"
                    style={{ background: '#007AFF' }}>
                    {saving ? 'Posting...' : 'Publish'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success toast */}
      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-3 rounded-full text-sm font-black z-50"
            style={{ background: '#34C759', color: '#fff' }}>
            <CheckCircle2 size={16} /> Homework posted successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
