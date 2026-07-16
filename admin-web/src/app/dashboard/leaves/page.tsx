'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Calendar, CheckCircle, XCircle, Clock, Check, X } from 'lucide-react';
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

export default function LeavesDashboard() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await api.get('/leaves');
      setLeaves(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-fade-in pb-20">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-display text-ink-primary tracking-tight">Staff Leaves</h1>
        <p className="text-sm font-medium text-ink-secondary mt-1">
          Review and approve staff leave requests.
        </p>
      </header>

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
