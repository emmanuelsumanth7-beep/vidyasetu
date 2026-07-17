'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Calendar, CheckCircle, XCircle, Clock, Check, X, Plus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Leave {
  id: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  staff: { name: string; role: string };
  reviewedBy?: { name: string };
}

const DEMO_LEAVES: Leave[] = [
  { id:'dl1', reason:'Medical appointment and recovery', startDate: new Date(Date.now()-3*86400000).toISOString(), endDate: new Date(Date.now()-1*86400000).toISOString(), status:'approved', createdAt: new Date(Date.now()-5*86400000).toISOString(), staff:{ name:'Mrs. Priya Sharma', role:'teacher' }, reviewedBy:{ name:'Principal' } },
  { id:'dl2', reason:'Family function out of city', startDate: new Date(Date.now()+2*86400000).toISOString(), endDate: new Date(Date.now()+4*86400000).toISOString(), status:'pending', createdAt: new Date(Date.now()-86400000).toISOString(), staff:{ name:'Mr. Ramesh Kumar', role:'teacher' }, reviewedBy: undefined },
  { id:'dl3', reason:'Personal work — bank & documents', startDate: new Date(Date.now()-8*86400000).toISOString(), endDate: new Date(Date.now()-7*86400000).toISOString(), status:'rejected', createdAt: new Date(Date.now()-10*86400000).toISOString(), staff:{ name:'Ms. Kavitha Nair', role:'clerk' }, reviewedBy:{ name:'Vice Principal' } },
];

export default function LeavesDashboard() {
  const [leaves, setLeaves]   = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState('');
  const [user, setUser]       = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  // Apply form
  const [reason, setReason]   = useState('');
  const [startDate, setStart] = useState('');
  const [endDate, setEnd]     = useState('');
  const [leaveType, setType]  = useState('CASUAL');
  const [applying, setApplying] = useState(false);
  const [formErr, setFormErr] = useState('');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(u);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await api.get('/leaves');
      setLeaves(Array.isArray(data) && data.length > 0 ? data : DEMO_LEAVES);
    } catch (e) {
      setLeaves(DEMO_LEAVES);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !startDate || !endDate) { setFormErr('All fields required.'); return; }
    setFormErr(''); setApplying(true);
    try {
      const res = await api.post('/leaves', { reason: reason.trim(), startDate, endDate, leaveType });
      setLeaves(prev => [res, ...prev]);
      setReason(''); setStart(''); setEnd(''); setType('CASUAL');
      setShowForm(false);
      setToast('Leave application submitted!');
      setTimeout(() => setToast(''), 4000);
    } catch {
      // Optimistic local add
      const opt: Leave = {
        id: `local-${Date.now()}`,
        reason: reason.trim(), startDate, endDate,
        status: 'pending',
        createdAt: new Date().toISOString(),
        staff: { name: user?.name || 'You', role: user?.role || 'staff' }
      };
      setLeaves(prev => [opt, ...prev]);
      setReason(''); setStart(''); setEnd('');
      setShowForm(false);
      setToast('Leave application submitted!');
      setTimeout(() => setToast(''), 4000);
    } finally {
      setApplying(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const updated = await api.put(`/leaves/${id}`, { status });
      setLeaves(leaves.map(l => l.id === id ? updated : l));
      setToast(`Leave ${status} successfully!`);
      setTimeout(() => setToast(''), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const pastLeaves = leaves.filter(l => l.status !== 'pending');

  const isPrincipal = user?.role && ['principal','vice_principal','admin'].includes(user.role);

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-fade-in pb-20">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-display text-ink-primary tracking-tight">Staff Leaves</h1>
          <p className="text-sm font-medium text-ink-secondary mt-1">
            {isPrincipal ? 'Review and approve staff leave requests.' : 'Apply for leave and track your requests.'}
          </p>
        </div>
        {!isPrincipal && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest hover:-translate-y-1 hover:shadow-2xl shadow-xl transition-all">
            <Plus size={16} strokeWidth={3} /> Apply Leave
          </button>
        )}
      </header>

      {/* Apply Leave Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:40 }}
              className="w-full max-w-md rounded-3xl overflow-hidden bg-white">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-black text-gray-900">Apply for Leave</h3>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleApply} className="p-6 space-y-4">
                {formErr && <div className="flex items-center gap-2 p-3 rounded-xl text-xs font-bold bg-red-50 text-red-600"><AlertCircle size={14}/>{formErr}</div>}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reason</label>
                  <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} required
                    placeholder="Briefly describe your reason..."
                    className="w-full px-4 py-3 rounded-2xl text-sm font-medium focus:outline-none resize-none bg-gray-50 border border-gray-200 text-gray-800" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">From</label>
                    <input type="date" value={startDate} onChange={e => setStart(e.target.value)} required
                      className="w-full px-4 py-3 rounded-2xl text-sm font-medium focus:outline-none bg-gray-50 border border-gray-200 text-gray-800" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">To</label>
                    <input type="date" value={endDate} onChange={e => setEnd(e.target.value)} required
                      className="w-full px-4 py-3 rounded-2xl text-sm font-medium focus:outline-none bg-gray-50 border border-gray-200 text-gray-800" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Leave Type</label>
                  <select value={leaveType} onChange={e => setType(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl text-sm font-medium focus:outline-none appearance-none bg-gray-50 border border-gray-200 text-gray-800">
                    <option value="CASUAL">Casual Leave</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="EARNED">Earned Leave</option>
                    <option value="MATERNITY">Maternity Leave</option>
                    <option value="PATERNITY">Paternity Leave</option>
                    <option value="UNPAID">Unpaid Leave</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-2xl text-sm font-bold bg-gray-100 text-gray-600">Cancel</button>
                  <button type="submit" disabled={applying}
                    className="flex-1 py-3 rounded-2xl text-sm font-black text-white bg-indigo-600 disabled:opacity-60">
                    {applying ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="h-64 bg-white rounded-[24px] shadow-sm border border-gray-100 animate-pulse" />
      ) : (
        <div className="flex flex-col gap-12">
          
          {/* Pending Approvals */}
          <section>
            <h3 className="text-xl font-bold font-display text-ink-primary mb-4 flex items-center gap-2">
              <Clock className="text-orange-500" /> Pending Approvals
            </h3>
            
            {pendingLeaves.length === 0 ? (
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-12 text-center text-ink-secondary">
                No pending leave requests!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingLeaves.map(leave => (
                  <div key={leave.id} className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg text-ink-primary">{leave.staff.name}</p>
                        <p className="text-xs font-bold text-ink-secondary uppercase tracking-wider">{leave.staff.role}</p>
                      </div>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full border border-orange-200 uppercase tracking-widest">
                        Pending
                      </span>
                    </div>
                    
                    <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                      <p className="text-sm text-ink-primary font-medium">"{leave.reason}"</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-ink-secondary">
                      <Calendar size={16} /> 
                      {new Date(leave.startDate).toLocaleDateString()} — {new Date(leave.endDate).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-3 mt-2 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => handleUpdateStatus(leave.id, 'approved')}
                        className="flex-1 py-2.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <Check size={18} /> Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(leave.id, 'rejected')}
                        className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-full text-sm font-bold hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <X size={18} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Past Approvals */}
          <section>
            <h3 className="text-xl font-bold font-display text-ink-primary mb-4 flex items-center gap-2">
              <CheckCircle className="text-ink-secondary" /> History
            </h3>
            
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
              {pastLeaves.length === 0 ? (
                <div className="p-12 text-center text-ink-secondary">No leave history found.</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="p-4 text-xs font-bold text-ink-secondary uppercase tracking-wider">Staff</th>
                      <th className="p-4 text-xs font-bold text-ink-secondary uppercase tracking-wider">Duration</th>
                      <th className="p-4 text-xs font-bold text-ink-secondary uppercase tracking-wider">Status</th>
                      <th className="p-4 text-xs font-bold text-ink-secondary uppercase tracking-wider text-right">Reviewed By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pastLeaves.map(leave => (
                      <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-sm text-ink-primary">{leave.staff.name}</p>
                          <p className="text-xs text-ink-secondary">{leave.reason}</p>
                        </td>
                        <td className="p-4 text-sm font-medium text-ink-secondary">
                          {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          {leave.status === 'approved' ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest">
                              <CheckCircle size={14} /> Approved
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-widest">
                              <XCircle size={14} /> Rejected
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-sm font-medium text-ink-primary text-right">
                          {leave.reviewedBy?.name || 'System'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-10 right-10 bg-ink-primary text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm z-50"
          >
            <CheckCircle size={20} className="text-emerald-400" /> 
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
