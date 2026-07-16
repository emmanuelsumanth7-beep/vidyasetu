'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { useSocket } from '@/components/SocketProvider';
import { Search, Plus, X, AlertCircle, CheckCircle, Receipt, Bell, Trash2, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PrintableLetterhead from '@/components/PrintableLetterhead';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: {
    name: string;
  };
}

interface FeeReceipt {
  id: string;
  receiptNumber: string;
  student: Student;
  feeHead: string;
  amount: number;
  paymentMode: string;
  createdAt: string;
}

export default function FeesDashboard() {
  const [user, setUser] = useState<any>(null);
  const [receipts, setReceipts] = useState<FeeReceipt[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<FeeReceipt | null>(null);
  const [liveNotification, setLiveNotification] = useState<string>('');

  // Form State
  const [studentId, setStudentId] = useState('');
  const [feeHead, setFeeHead] = useState('Tuition Fee');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('online');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const socket = useSocket();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (!socket || !user) return;
    const handleFeeCollected = (receipt: FeeReceipt) => {
      setReceipts((prev) => [receipt, ...prev]);
      if (user.role !== 'parent') {
        setLiveNotification(`New Payment Received: ₹${receipt.amount.toLocaleString()} from ${receipt.student?.name || 'Student'}`);
        setTimeout(() => setLiveNotification(''), 5000);
      }
    };
    const handleFeeDeleted = ({ id }: { id: string }) => {
      setReceipts((prev) => prev.filter(r => r.id !== id));
      setLiveNotification(`A fee receipt was reversed.`);
      setTimeout(() => setLiveNotification(''), 5000);
    };
    
    socket.on('feeCollected', handleFeeCollected);
    socket.on('feeDeleted', handleFeeDeleted);
    return () => {
      socket.off('feeCollected', handleFeeCollected);
      socket.off('feeDeleted', handleFeeDeleted);
    };
  }, [socket, user]);

  const fetchData = async () => {
    try {
      const [feesRes, studentsRes] = await Promise.all([
        api.get('/fees'),
        api.get('/students'),
      ]);
      setReceipts(feesRes);
      setStudents(studentsRes);
      
      if (user?.role === 'parent' && studentsRes.length > 0) {
        setStudentId(studentsRes[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredReceipts = useMemo(() => {
    if (!searchQuery.trim()) return receipts;
    const q = searchQuery.toLowerCase();
    return receipts.filter(
      (r) =>
        r.student?.name.toLowerCase().includes(q) ||
        r.receiptNumber.toLowerCase().includes(q)
    );
  }, [receipts, searchQuery]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      const res = await api.post('/fees/pay', {
        studentId,
        feeHead,
        amount: parseFloat(amount),
        paymentMode,
      });
      setLastReceipt(res);
      setShowSuccess(true);
      setAmount('');
      if (user?.role !== 'parent') {
        setStudentId('');
        setFeeHead('Tuition Fee');
        setPaymentMode('online');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment failed';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowSuccess(false);
    setLastReceipt(null);
    setFormError('');
  };

  const handleDeleteFee = async (id: string) => {
    if (!window.confirm("Are you sure you want to reverse this fee receipt? This action will notify the parents.")) return;
    try {
      await api.delete(`/fees/${id}`);
      // socket event will remove it from the list
    } catch (err: unknown) {
      alert("Failed to delete fee: " + (err instanceof Error ? err.message : 'Unknown error'));
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
          <h1 className="text-4xl font-bold font-display text-gray-900 tracking-tight">{user?.role === 'parent' ? 'My Fee Receipts' : 'Fee Collection'}</h1>
          <p className="text-sm font-medium text-gray-600 mt-1">
            {user?.role === 'parent' ? 'View and securely pay your school fees online.' : 'Process payments and view transaction history.'}
          </p>
        </div>
        <div className="flex items-center gap-3 no-print">
          <button 
            onClick={() => window.print()}
            className="bg-white text-gray-700 px-6 py-3 flex items-center gap-2 rounded-2xl font-bold uppercase tracking-widest shadow-xl border border-gray-100 hover:shadow-2xl hover:bg-gray-50 hover:-translate-y-1 transition-all"
          >
            <Printer strokeWidth={3} size={20} /> Print
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 flex items-center gap-2 rounded-2xl font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all"
          >
            <Plus strokeWidth={3} size={20} /> {user?.role === 'parent' ? 'Pay Fees' : 'Record Payment'}
          </button>
        </div>
      </header>

      <div className="print-area print:mb-8">
        <PrintableLetterhead />
      </div>

      {loading ? (
        <div className="h-64 bg-white/20 backdrop-blur-md rounded-[32px] shadow-sm border border-white/40 animate-pulse" />
      ) : (
        <div className="flex flex-col gap-6">
          {user?.role !== 'parent' && (
            <div className="bg-white/40 backdrop-blur-2xl rounded-[24px] p-4 border border-white/50 shadow-[0_4px_24px_0_rgba(31,38,135,0.1)] flex items-center gap-3 transition-all focus-within:bg-white/60">
              <Search className="text-gray-500 shrink-0 ml-2" size={20} />
              <input
                type="text"
                className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-gray-800 placeholder:text-gray-400"
                placeholder="Search receipt # or student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          <div className="bg-white/40 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] overflow-hidden">
            {filteredReceipts.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <Receipt size={32} />
                </div>
                <h3 className="text-xl font-bold font-display text-ink-primary">No receipts found</h3>
                <p className="text-ink-secondary mt-2">
                  {searchQuery ? `No receipts match "${searchQuery}".` : 'No payments have been recorded yet.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-white/50 border-b border-white/50">
                  <tr>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Receipt #</th>
                    {user?.role !== 'parent' && <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Student</th>}
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Fee Head</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Mode</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Date</th>
                    {user?.role === 'principal' && <th className="p-5 text-xs font-bold text-red-500 uppercase tracking-widest text-right">Delete</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {filteredReceipts.map(r => (
                    <tr key={r.id} className="hover:bg-white/40 transition-colors">
                      <td className="p-5 text-sm font-bold text-gray-800">{r.receiptNumber}</td>
                      {user?.role !== 'parent' && (
                        <td className="p-5">
                          <p className="font-bold text-sm text-gray-900">{r.student?.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{r.student?.class?.name || 'Class N/A'}</p>
                        </td>
                      )}
                      <td className="p-5 text-sm font-bold text-gray-600">{r.feeHead}</td>
                      <td className="p-5 text-lg font-black text-emerald-600">₹{r.amount.toLocaleString()}</td>
                      <td className="p-5">
                        <span className={`px-4 py-1.5 text-xs font-bold rounded-xl uppercase tracking-widest ${r.paymentMode === 'online' ? 'bg-blue-100/50 text-blue-700 border border-blue-200/50' : 'bg-amber-100/50 text-amber-700 border border-amber-200/50'}`}>
                          {r.paymentMode}
                        </span>
                      </td>
                      <td className="p-5 text-sm font-bold text-gray-500 text-right">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      {user?.role === 'principal' && (
                        <td className="p-5 text-right">
                          <button onClick={() => handleDeleteFee(r.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Record Modal - Liquid Glass */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-indigo-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white/80 backdrop-blur-3xl border border-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-[32px] w-full max-w-md overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/50 flex items-center justify-between bg-white/40">
                <div>
                  <h3 className="text-xl font-bold font-display text-indigo-900 tracking-tight">
                    {showSuccess ? 'Payment Successful' : (user?.role === 'parent' ? 'Secure Online Payment' : 'Record Payment')}
                  </h3>
                </div>
                <button 
                  onClick={handleCloseModal}
                  className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/50 border border-white/50 text-gray-500 hover:text-gray-800 hover:bg-white shadow-sm transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              
              {showSuccess && lastReceipt ? (
                <div className="p-8 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-[32px] bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 shadow-inner border border-emerald-100">
                    <CheckCircle size={48} strokeWidth={2.5} />
                  </div>
                  <h4 className="text-2xl font-bold font-display text-gray-900 mb-2 tracking-tight">Receipt Generated</h4>
                  <p className="text-sm font-medium text-gray-600 mb-8">
                    Receipt <strong>{lastReceipt.receiptNumber}</strong> for <strong className="text-emerald-600 text-lg">₹{lastReceipt.amount.toLocaleString()}</strong> has been saved.
                  </p>
                  <div className="flex gap-3 w-full">
                    <button className="flex-1 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold text-gray-600 bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors" onClick={handleCloseModal}>Close</button>
                    <button className="flex-1 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 hover:-translate-y-1 transition-all" onClick={() => { setShowSuccess(false); setLastReceipt(null); }}>Record Another</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePayment} className="flex flex-col flex-1 overflow-hidden">
                  <div className="p-6 flex flex-col gap-5 overflow-y-auto">
                    {formError && (
                      <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2">
                        <AlertCircle size={18} /> {formError}
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{user?.role === 'parent' ? 'Paying For' : 'Select Student'}</label>
                      <select
                        required
                        className="w-full bg-white/50 backdrop-blur-md border border-white/50 rounded-2xl px-5 py-4 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all appearance-none shadow-sm"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        disabled={user?.role === 'parent' && students.length === 1}
                      >
                        <option value="">-- Choose a Student --</option>
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Fee Head</label>
                        <select
                          required
                          className="w-full bg-white/50 backdrop-blur-md border border-white/50 rounded-2xl px-5 py-4 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all appearance-none shadow-sm"
                          value={feeHead}
                          onChange={(e) => setFeeHead(e.target.value)}
                        >
                          <option>Tuition Fee</option>
                          <option>Transport Fee</option>
                          <option>Library Fee</option>
                          <option>Miscellaneous</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Amount (₹)</label>
                        <input
                          type="number"
                          required min="1" step="0.01"
                          className="w-full bg-white/50 backdrop-blur-md border border-white/50 rounded-2xl px-5 py-4 text-lg font-black text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-sm placeholder:text-gray-400 placeholder:font-medium placeholder:text-sm"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="e.g. 5000"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Payment Mode</label>
                      {user?.role === 'parent' ? (
                        <div className="w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl px-5 py-4 text-sm font-bold text-indigo-700 shadow-inner">
                          Credit/Debit Card (Online Gateway)
                        </div>
                      ) : (
                        <select
                          required
                          className="w-full bg-white/50 backdrop-blur-md border border-white/50 rounded-2xl px-5 py-4 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all appearance-none shadow-sm"
                          value={paymentMode}
                          onChange={(e) => setPaymentMode(e.target.value)}
                        >
                          <option value="online">Online / UPI</option>
                          <option value="cash">Cash</option>
                          <option value="cheque">Cheque</option>
                          <option value="card">Credit/Debit Card</option>
                        </select>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-white/50 flex items-center justify-end gap-3 bg-white/40 mt-auto backdrop-blur-sm">
                    <button type="button" className="px-6 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm border border-transparent hover:border-gray-200 transition-all" onClick={handleCloseModal}>Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="px-8 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 transition-all">
                      {isSubmitting ? 'Processing...' : (user?.role === 'parent' ? 'Proceed to Pay' : 'Process Payment')}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {liveNotification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-10 right-10 bg-interactive-blue text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm z-50"
          >
            <Bell size={20} className="text-white animate-pulse" /> 
            {liveNotification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
