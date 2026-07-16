'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useSocket } from '@/components/SocketProvider';
import { Bell, Plus, X, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notice {
  id: string;
  title: string;
  body: string;
  audience: string;
  postedBy: { name: string };
  createdAt: string;
}

export default function NoticesDashboard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  // Form State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const socket = useSocket();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleNoticePublished = (notice: Notice) => {
      setNotices((prev) => [notice, ...prev]);
    };
    socket.on('noticePublished', handleNoticePublished);
    return () => {
      socket.off('noticePublished', handleNoticePublished);
    };
  }, [socket]);

  const fetchData = async () => {
    try {
      const res = await api.get('/notices');
      setNotices(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      await api.post('/notices', { title, body, audience });
      setShowModal(false);
      setTitle('');
      setBody('');
      setAudience('all');
      setToastMessage('Notice published successfully.');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Publish failed';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredNotices = notices.filter(
    (n) => activeTab === 'all' || n.audience === activeTab || n.audience === 'all'
  );

  return (
    <div className="max-w-[1000px] mx-auto w-full animate-fade-in font-body relative pb-20">
      {/* Liquid Abstract Orbs */}
      <div className="fixed top-[0%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob pointer-events-none -z-10"></div>
      <div className="fixed top-[40%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000 pointer-events-none -z-10"></div>

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold font-display text-gray-900 tracking-tight">Notice Board</h1>
          <p className="text-sm font-medium text-gray-600 mt-1">
            Publish circulars and announcements instantly.
          </p>
        </div>
        <div>
          {user?.role !== 'parent' && (
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest hover:-translate-y-1 hover:shadow-2xl shadow-xl transition-all"
            >
              <Plus size={18} strokeWidth={3} /> Publish Notice
            </button>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-white/40 backdrop-blur-xl p-2 rounded-[20px] shadow-[0_4px_16px_0_rgba(31,38,135,0.05)] border border-white/50 w-fit overflow-x-auto max-w-full">
        {['all', 'parents', 'staff'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-white shadow-md text-indigo-900 border border-white/60' 
                : 'text-gray-500 hover:text-gray-800 hover:bg-white/50 border border-transparent'
            }`}
          >
            {tab === 'all' ? 'All Notices' : tab === 'parents' ? 'For Parents' : 'For Staff'}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-32 bg-white/20 backdrop-blur-md rounded-[24px] shadow-sm border border-white/40 animate-pulse" />
          ))}
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-2xl rounded-[32px] p-12 flex flex-col items-center justify-center text-center border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
          <div className="w-24 h-24 bg-blue-50/50 rounded-[24px] flex items-center justify-center text-indigo-500 mb-6 shadow-inner border border-blue-100/50">
            <MessageSquare size={40} strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-bold font-display text-gray-900 tracking-tight">No notices found</h3>
          <p className="text-gray-600 mt-2 font-medium">There are no announcements for this category yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <AnimatePresence>
              {filteredNotices.map((notice) => (
                <motion.div 
                  key={notice.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/40 backdrop-blur-2xl p-6 rounded-[32px] shadow-[0_4px_24px_0_rgba(31,38,135,0.05)] border border-white/60 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] transition-all group hover:-translate-y-0.5"
                >
                  <div className="flex gap-5">
                    <div className="w-16 h-16 rounded-[20px] bg-white border border-white/80 shadow-sm flex items-center justify-center shrink-0 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Bell size={28} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                        <h3 className="text-xl font-bold font-display text-gray-900 tracking-tight">
                          {notice.title}
                        </h3>
                        <span className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm ${
                          notice.audience === 'staff' ? 'bg-amber-100/80 text-amber-700 border border-amber-200/50' : 'bg-blue-100/80 text-blue-700 border border-blue-200/50'
                        }`}>
                          {notice.audience}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap font-medium">
                        {notice.body}
                      </p>
                      
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Posted by <span className="text-gray-700">{notice.postedBy?.name}</span> on {new Date(notice.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}

      {/* Publish Modal - Liquid Glass */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-indigo-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white/80 backdrop-blur-3xl border border-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-[32px] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/50 flex items-center justify-between bg-white/40">
                <h3 className="text-xl font-bold font-display text-indigo-900 tracking-tight">Publish New Notice</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/50 border border-white/50 text-gray-500 hover:text-gray-800 hover:bg-white shadow-sm transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handlePublish} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 flex flex-col gap-6 overflow-y-auto">
                  {formError && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2">
                      <AlertCircle size={18} />
                      {formError}
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Notice Title</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white/50 backdrop-blur-md border border-white/50 rounded-2xl px-5 py-4 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all appearance-none shadow-sm placeholder:text-gray-400 placeholder:font-medium"
                      placeholder="e.g. Tomorrow is a Holiday"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Message Body</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full bg-white/50 backdrop-blur-md border border-white/50 rounded-2xl px-5 py-4 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all appearance-none shadow-sm resize-none placeholder:text-gray-400 placeholder:font-medium"
                      placeholder="Enter the announcement details here..."
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Target Audience</label>
                    <div className="relative">
                      <select
                        className="w-full bg-white/50 backdrop-blur-md border border-white/50 rounded-2xl px-5 py-4 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all appearance-none shadow-sm"
                        required
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                      >
                        <option value="all">Everyone (Staff & Parents)</option>
                        <option value="parents">Parents / Students Only</option>
                        <option value="staff">Staff Only</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-t border-white/50 flex items-center justify-end gap-3 bg-white/40 mt-auto backdrop-blur-sm">
                  <button 
                    type="button" 
                    className="px-6 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm border border-transparent hover:border-gray-200 transition-all"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-8 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:hover:translate-y-0 transition-all"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Notice'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 md:bottom-10 right-1/2 translate-x-1/2 md:translate-x-0 md:right-10 bg-ink-primary text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm z-50 whitespace-nowrap"
          >
            <CheckCircle size={20} className="text-emerald-400" /> 
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
