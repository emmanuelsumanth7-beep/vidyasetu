'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Send, CheckCircle2, XCircle, ChevronDown, User, FileText, AlertCircle } from 'lucide-react';
import { readUserSession } from '@/lib/session';
import { SchoolConfig } from '@/config/school.config';

// --- MOCK DATA ---
const MOCK_TEACHER_HISTORY = [
  { id: 1, date: '2026-07-25', type: 'Early Exit', reason: 'Doctor appointment', status: 'Pending' },
  { id: 2, date: '2026-07-20', type: 'Late Entry', reason: 'Stuck in traffic jam on highway', status: 'Approved' },
  { id: 3, date: '2026-07-15', type: 'Half Day', reason: 'Bank work that requires physical presence', status: 'Rejected' },
  { id: 4, date: '2026-07-10', type: 'Full Day', reason: 'Sick leave due to viral fever', status: 'Approved' },
];

const MOCK_PRINCIPAL_PENDING = [
  { id: 101, name: 'Alice Smith', type: 'Half Day', date: '2026-07-26', time: '', reason: 'Family emergency' },
  { id: 102, name: 'Bob Johnson', type: 'Late Entry', date: '2026-07-26', time: '09:00 - 10:30', reason: 'Dentist appointment' },
  { id: 103, name: 'Charlie Brown', type: 'Full Day', date: '2026-07-27', time: '', reason: 'Attending a seminar in another city' },
];

const MOCK_PRINCIPAL_PROCESSED = [
  { id: 104, name: 'Diana Prince', type: 'Early Exit', date: '2026-07-24', status: 'Approved' },
  { id: 105, name: 'Eve Adams', type: 'Full Day', date: '2026-07-22', status: 'Rejected' },
];

export default function PermissionsPage() {
  const [user] = useState(() => readUserSession());
  const isStaff = user?.role === 'teacher' || user?.role === 'staff';
  const isPrincipal = user?.role === 'principal' || user?.role === 'admin';

  // State for Teacher Form
  const [permissionType, setPermissionType] = useState('Half Day');
  const [date, setDate] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // State for Principal View
  const [pendingRequests, setPendingRequests] = useState(MOCK_PRINCIPAL_PENDING);
  const [processedRequests, setProcessedRequests] = useState(MOCK_PRINCIPAL_PROCESSED);
  const [confirmAction, setConfirmAction] = useState<{ id: number; action: 'Approve' | 'Reject' } | null>(null);

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setPermissionType('Half Day');
      setDate('');
      setTimeFrom('');
      setTimeTo('');
      setReason('');
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const handlePrincipalAction = (id: number, action: 'Approve' | 'Reject') => {
    const req = pendingRequests.find(r => r.id === id);
    if (req) {
      setPendingRequests(prev => prev.filter(r => r.id !== id));
      setProcessedRequests(prev => [{ ...req, status: action === 'Approve' ? 'Approved' : 'Rejected' }, ...prev]);
    }
    setConfirmAction(null);
  };

  const showTimeInputs = permissionType === 'Late Entry' || permissionType === 'Early Exit';

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      Pending: '#eab308', // yellow-500
      Approved: '#22c55e', // green-500
      Rejected: '#ef4444', // red-500
    };
    return (
      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${colors[status]}20`, color: colors[status] }}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ color: 'var(--color-text-primary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-[700px] mx-auto space-y-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Permissions</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {isPrincipal ? 'Manage staff permission requests' : 'Apply for leaves and short permissions'}
          </p>
        </div>

        {/* TEACHER VIEW */}
        {isStaff && (
          <div className="space-y-8">
            {/* Form */}
            <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5" style={{ color: SchoolConfig.theme.primary }} />
                New Request
              </h2>
              
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-md rounded-3xl"
                    style={{ background: 'var(--color-glass)' }}
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Request Submitted</h3>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Your permission request has been sent for approval.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleTeacherSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Permission Type</label>
                  <div className="relative">
                    <select
                      value={permissionType}
                      onChange={(e) => setPermissionType(e.target.value)}
                      className="w-full appearance-none bg-transparent rounded-2xl px-4 py-3 outline-none transition-all"
                      style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                      onFocus={(e) => (e.target.style.borderColor = SchoolConfig.theme.primaryLight)}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                    >
                      <option value="Half Day" style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>Half Day</option>
                      <option value="Full Day" style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>Full Day</option>
                      <option value="Late Entry" style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>Late Entry</option>
                      <option value="Early Exit" style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>Early Exit</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--color-text-secondary)' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-transparent rounded-2xl px-4 py-3 outline-none transition-all"
                      style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                      onFocus={(e) => (e.target.style.borderColor = SchoolConfig.theme.primaryLight)}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {showTimeInputs && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-4 overflow-hidden"
                    >
                      <div className="flex-1 space-y-1.5">
                        <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Time From</label>
                        <input
                          type="time"
                          required={showTimeInputs}
                          value={timeFrom}
                          onChange={(e) => setTimeFrom(e.target.value)}
                          className="w-full bg-transparent rounded-2xl px-4 py-3 outline-none transition-all"
                          style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                          onFocus={(e) => (e.target.style.borderColor = SchoolConfig.theme.primaryLight)}
                          onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                        />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Time To</label>
                        <input
                          type="time"
                          required={showTimeInputs}
                          value={timeTo}
                          onChange={(e) => setTimeTo(e.target.value)}
                          className="w-full bg-transparent rounded-2xl px-4 py-3 outline-none transition-all"
                          style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                          onFocus={(e) => (e.target.style.borderColor = SchoolConfig.theme.primaryLight)}
                          onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Reason</label>
                    <span className="text-xs" style={{ color: reason.length > 250 ? '#ef4444' : 'var(--color-text-secondary)' }}>
                      {reason.length}/250
                    </span>
                  </div>
                  <textarea
                    required
                    maxLength={250}
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly explain your reason..."
                    className="w-full bg-transparent rounded-2xl px-4 py-3 outline-none transition-all resize-none"
                    style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                    onFocus={(e) => (e.target.style.borderColor = SchoolConfig.theme.primaryLight)}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || reason.length > 250}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white transition-opacity disabled:opacity-70 mt-6"
                  style={{ background: SchoolConfig.theme.primary }}
                >
                  {isSubmitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Clock className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* History */}
            <div>
              <h2 className="text-xl font-semibold mb-4 px-1">My Permission History</h2>
              <div className="space-y-3">
                {MOCK_TEACHER_HISTORY.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold">{item.type}</span>
                        <StatusBadge status={item.status} />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                        <span className="truncate max-w-[200px] sm:max-w-[300px]">"{item.reason}"</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRINCIPAL VIEW */}
        {isPrincipal && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 px-1 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Pending Approvals ({pendingRequests.length})
              </h2>
              {pendingRequests.length === 0 ? (
                <div className="glass-card p-8 rounded-3xl text-center" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}>
                  <p style={{ color: 'var(--color-text-secondary)' }}>No pending permission requests.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {pendingRequests.map((req) => (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                        className="glass-card p-5 rounded-3xl overflow-hidden"
                        style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="w-5 h-5" style={{ color: SchoolConfig.theme.primary }} />
                              <span className="font-semibold text-lg">{req.name}</span>
                              <span className="text-sm px-2 py-0.5 rounded-full" style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}>
                                {req.type}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {req.date}</span>
                              {req.time && <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {req.time}</span>}
                            </div>
                            <div className="text-sm pt-1">
                              <span style={{ color: 'var(--color-text-secondary)' }}>Reason: </span>
                              "{req.reason}"
                            </div>
                          </div>
                          
                          {confirmAction?.id === req.id ? (
                            <div className="flex flex-col gap-2 justify-center bg-black/5 dark:bg-white/5 p-3 rounded-2xl">
                              <p className="text-sm text-center mb-1">Confirm {confirmAction.action}?</p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handlePrincipalAction(req.id, confirmAction.action)}
                                  className="px-4 py-2 rounded-xl text-sm font-medium text-white flex-1"
                                  style={{ background: confirmAction.action === 'Approve' ? '#22c55e' : '#ef4444' }}
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setConfirmAction(null)}
                                  className="px-4 py-2 rounded-xl text-sm font-medium"
                                  style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
                                >
                                  No
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex md:flex-col gap-2 justify-center">
                              <button
                                onClick={() => setConfirmAction({ id: req.id, action: 'Approve' })}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 flex-1"
                                style={{ background: '#22c55e15', color: '#22c55e' }}
                              >
                                <CheckCircle2 className="w-4 h-4" /> Approve
                              </button>
                              <button
                                onClick={() => setConfirmAction({ id: req.id, action: 'Reject' })}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 flex-1"
                                style={{ background: '#ef444415', color: '#ef4444' }}
                              >
                                <XCircle className="w-4 h-4" /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 px-1">Recently Processed</h2>
              <div className="space-y-3">
                {processedRequests.map((req) => (
                  <div
                    key={req.id}
                    className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <span className="font-medium">{req.name}</span>
                      <span className="text-sm px-2 py-0.5 rounded-full" style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}>
                        {req.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span style={{ color: 'var(--color-text-secondary)' }}>{req.date}</span>
                      <StatusBadge status={req.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
