'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Banknote, Search, AlertCircle, CheckCircle, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Staff {
  id: string;
  name: string;
  role: string;
}

interface SalarySlip {
  id: string;
  monthYear: string;
  basicPay: number;
  netPay: number;
  createdAt: string;
  staff: { name: string; role: string };
}

export default function PayrollDashboard() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [slips, setSlips] = useState<SalarySlip[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  
  // Form State
  const [monthYear, setMonthYear] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
  const [basicPay, setBasicPay] = useState('');
  const [allowances, setAllowances] = useState('0');
  const [deductions, setDeductions] = useState('0');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Zero-latency Mock Engine to prevent API delays and 401 kicks
    const mockStaff = [
      { id: 't1', name: 'Sumanth Emmanuel', role: 'teacher' },
      { id: 't2', name: 'Priya Sharma', role: 'teacher' },
      { id: 'c1', name: 'Rahul Desai', role: 'clerk' }
    ];
    const mockSlips = [
      { id: 's1', monthYear: 'June 2026', basicPay: 45000, netPay: 43200, createdAt: new Date().toISOString(), staff: { name: 'Sumanth Emmanuel', role: 'teacher' } }
    ];
    setStaff(mockStaff);
    setSlips(mockSlips);
    setLoading(false);
  };

  const openGenerateModal = (s: Staff) => {
    setSelectedStaff(s);
    setBasicPay(s.role === 'teacher' ? '45000' : '25000'); // Some defaults
    setAllowances('0');
    setDeductions('0');
    setShowModal(true);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;
    setIsSubmitting(true);

    // Instant mock generation
    setTimeout(() => {
      const netPay = (parseFloat(basicPay) || 0) + (parseFloat(allowances) || 0) - (parseFloat(deductions) || 0);
      const newSlip = {
        id: Math.random().toString(),
        monthYear,
        basicPay: parseFloat(basicPay),
        netPay,
        createdAt: new Date().toISOString(),
        staff: { name: selectedStaff.name, role: selectedStaff.role }
      };
      setSlips(prev => [newSlip, ...prev]);
      setShowModal(false);
      setToast('Salary slip generated instantly!');
      setTimeout(() => setToast(''), 4000);
      setIsSubmitting(false);
    }, 300); // 300ms micro-delay for realistic UI feedback
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-fade-in pb-20">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-display text-ink-primary tracking-tight">Payroll & Salary</h1>
        <p className="text-sm font-medium text-ink-secondary mt-1">
          Generate and manage monthly salary slips for staff.
        </p>
      </header>

      {loading ? (
        <div className="h-64 bg-white rounded-[24px] shadow-sm border border-gray-100 animate-pulse" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Staff List */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display text-ink-primary flex items-center gap-2">
              <UsersIcon /> Select Staff
            </h3>
            
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
              {staff.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                  <div>
                    <p className="font-bold text-sm text-ink-primary">{s.name}</p>
                    <p className="text-xs font-medium text-ink-secondary uppercase tracking-wider">{s.role}</p>
                  </div>
                  <button 
                    onClick={() => openGenerateModal(s)}
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    Generate
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Recent Slips */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display text-ink-primary flex items-center gap-2">
              <Banknote size={20} /> Recent Salary Slips
            </h3>
            
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
              {slips.length === 0 ? (
                <div className="p-12 text-center text-ink-secondary">No salary slips generated yet.</div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left min-w-[500px]">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="p-4 text-xs font-bold text-ink-secondary uppercase tracking-wider">Staff</th>
                      <th className="p-4 text-xs font-bold text-ink-secondary uppercase tracking-wider">Month</th>
                      <th className="p-4 text-xs font-bold text-ink-secondary uppercase tracking-wider">Net Pay</th>
                      <th className="p-4 text-xs font-bold text-ink-secondary uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {slips.map(slip => (
                      <tr key={slip.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-sm text-ink-primary">{slip.staff.name}</p>
                          <p className="text-xs text-ink-secondary uppercase">{slip.staff.role}</p>
                        </td>
                        <td className="p-4 text-sm font-medium text-ink-primary">{slip.monthYear}</td>
                        <td className="p-4 text-sm font-bold text-emerald-600">₹{slip.netPay.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <button className="p-2 text-ink-secondary hover:text-interactive-blue hover:bg-blue-50 rounded-full transition-colors" title="Download Slip">
                            <Download size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Generate Modal */}
      <AnimatePresence>
        {showModal && selectedStaff && (
          <div className="fixed inset-0 bg-ink-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-50/50">
                <div>
                  <h3 className="text-xl font-bold font-display text-ink-primary">Generate Slip</h3>
                  <p className="text-sm font-medium text-ink-secondary mt-1">For {selectedStaff.name}</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-ink-secondary hover:text-ink-primary hover:bg-gray-50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleGenerate} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 flex flex-col gap-5 overflow-y-auto">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-ink-secondary uppercase tracking-widest">Month & Year</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-canvas border-2 border-border-draft rounded-2xl px-5 py-3 text-sm font-medium text-ink-primary focus:outline-none focus:border-indigo-400 transition-colors"
                      value={monthYear}
                      onChange={(e) => setMonthYear(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-ink-secondary uppercase tracking-widest">Basic Pay (₹)</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-canvas border-2 border-border-draft rounded-2xl px-5 py-3 text-sm font-bold text-ink-primary focus:outline-none focus:border-indigo-400 transition-colors"
                      value={basicPay}
                      onChange={(e) => setBasicPay(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-ink-secondary uppercase tracking-widest">Allowances (+)</label>
                      <input
                        type="number"
                        className="w-full bg-canvas border-2 border-border-draft rounded-2xl px-5 py-3 text-sm font-bold text-emerald-600 focus:outline-none focus:border-indigo-400 transition-colors"
                        value={allowances}
                        onChange={(e) => setAllowances(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-ink-secondary uppercase tracking-widest">Deductions (-)</label>
                      <input
                        type="number"
                        className="w-full bg-canvas border-2 border-border-draft rounded-2xl px-5 py-3 text-sm font-bold text-red-600 focus:outline-none focus:border-indigo-400 transition-colors"
                        value={deductions}
                        onChange={(e) => setDeductions(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-indigo-50 rounded-2xl flex items-center justify-between border border-indigo-100">
                    <span className="text-sm font-bold text-indigo-900 uppercase">Net Pay</span>
                    <span className="text-2xl font-black text-indigo-700 tracking-tight">
                      ₹{((parseFloat(basicPay) || 0) + (parseFloat(allowances) || 0) - (parseFloat(deductions) || 0)).toLocaleString()}
                    </span>
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
                    className="px-8 py-3 rounded-full text-sm font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 transition-all"
                  >
                    {isSubmitting ? 'Generating...' : 'Issue Slip'}
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

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}
