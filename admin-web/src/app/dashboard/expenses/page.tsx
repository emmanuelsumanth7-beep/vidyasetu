'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { TrendingUp, Plus, X, Receipt, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  recordedBy: { name: string };
}

export default function ExpensesDashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Maintenance');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await api.get('/expenses');
      setExpenses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newExpense = await api.post('/expenses', {
        title,
        amount,
        category
      });
      setExpenses(prev => [newExpense, ...prev]);
      setShowModal(false);
      setTitle('');
      setAmount('');
      setToast('Expense recorded successfully!');
      setTimeout(() => setToast(''), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-fade-in pb-20">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-display text-ink-primary tracking-tight">Accounts & Expenses</h1>
          <p className="text-sm font-medium text-ink-secondary mt-1">
            Track school maintenance, events, and utility costs.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-6 py-3 flex items-center gap-2 rounded-full font-bold shadow-lg shadow-emerald-600/30 hover:-translate-y-0.5 transition-all"
        >
          <Plus strokeWidth={3} size={20} /> Record Expense
        </button>
      </header>

      {loading ? (
        <div className="h-64 bg-white rounded-[24px] shadow-sm border border-gray-100 animate-pulse" />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex items-center gap-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-secondary uppercase tracking-widest">Total Expenses (All Time)</p>
              <h2 className="text-5xl font-black font-display text-ink-primary mt-1 tracking-tight">₹{totalExpenses.toLocaleString()}</h2>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
            {expenses.length === 0 ? (
              <div className="p-12 text-center text-ink-secondary">No expenses recorded yet.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-bold text-ink-secondary uppercase tracking-wider">Date</th>
                    <th className="p-4 text-xs font-bold text-ink-secondary uppercase tracking-wider">Details</th>
                    <th className="p-4 text-xs font-bold text-ink-secondary uppercase tracking-wider">Category</th>
                    <th className="p-4 text-xs font-bold text-ink-secondary uppercase tracking-wider text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {expenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-ink-secondary">
                        {new Date(exp.date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-sm text-ink-primary">{exp.title}</p>
                        <p className="text-xs text-ink-secondary">By {exp.recordedBy.name}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-black text-red-600 text-right">
                        -₹{exp.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Record Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-ink-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
                <div>
                  <h3 className="text-xl font-bold font-display text-ink-primary">Record Expense</h3>
                  <p className="text-sm font-medium text-ink-secondary mt-1">Log a new school expense</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-ink-secondary hover:text-ink-primary hover:bg-gray-50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleRecord} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 flex flex-col gap-5 overflow-y-auto">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-ink-secondary uppercase tracking-widest">Description / Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Plumbing Repair in Block A"
                      className="w-full bg-canvas border-2 border-border-draft rounded-2xl px-5 py-3 text-sm font-medium text-ink-primary focus:outline-none focus:border-emerald-400 transition-colors"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-ink-secondary uppercase tracking-widest">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="0"
                      className="w-full bg-canvas border-2 border-border-draft rounded-2xl px-5 py-3 text-sm font-bold text-red-600 focus:outline-none focus:border-emerald-400 transition-colors"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-ink-secondary uppercase tracking-widest">Category</label>
                    <select
                      className="w-full bg-canvas border-2 border-border-draft rounded-2xl px-5 py-3 text-sm font-medium text-ink-primary focus:outline-none focus:border-emerald-400 transition-colors appearance-none"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option>Maintenance & Repairs</option>
                      <option>Utilities & Bills</option>
                      <option>Events & Functions</option>
                      <option>Transport & Fuel</option>
                      <option>Office Supplies</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 mt-auto">
                  <button 
                    type="button" 
                    className="px-6 py-3 rounded-full text-sm font-bold text-ink-secondary hover:text-ink-primary hover:bg-gray-200 transition-colors"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-full text-sm font-bold bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 transition-all"
                  >
                    {isSubmitting ? 'Recording...' : 'Record'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
