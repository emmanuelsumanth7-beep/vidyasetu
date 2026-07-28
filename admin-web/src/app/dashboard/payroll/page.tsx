'use client';

import { useState, useEffect } from 'react';
import { Banknote, Users, AlertCircle, CheckCircle, X, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { readUserSession } from '@/lib/session';
import { PrintableLetterhead } from '@/components/PrintableLetterhead';
import { SchoolConfig } from '@/config/school.config';

interface Staff {
  id: string;
  name: string;
  role: string;
}

interface SalarySlip {
  id: string;
  monthYear: string;
  basicPay: number;
  allowances: number;
  deductions: number;
  netPay: number;
  createdAt: string;
  staff: { name: string; role: string };
}

export default function PayrollDashboard() {
  const [user] = useState(() => readUserSession());
  const canGenerate = user?.role === 'principal' || user?.role === 'admin';

  const [staff, setStaff] = useState<Staff[]>([]);
  const [slips, setSlips] = useState<SalarySlip[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  
  // Print State
  const [printSlipId, setPrintSlipId] = useState<string | null>(null);
  const slipToPrint = slips.find(s => s.id === printSlipId);
  
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
    // Zero-latency Mock Engine Removed Per User Request
    const mockStaff: Staff[] = [];
    const mockSlips: SalarySlip[] = [];
    setStaff(mockStaff);
    setSlips(mockSlips);
    setLoading(false);
  };

  const openGenerateModal = (s: Staff) => {
    if (!canGenerate) return;
    setSelectedStaff(s);
    setBasicPay(s.role === 'teacher' ? '45000' : '25000');
    setAllowances('0');
    setDeductions('0');
    setShowModal(true);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff || !canGenerate) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const parsedBasic = parseFloat(basicPay) || 0;
      const parsedAllow = parseFloat(allowances) || 0;
      const parsedDed = parseFloat(deductions) || 0;
      const netPay = parsedBasic + parsedAllow - parsedDed;
      const newSlip: SalarySlip = {
        id: Math.random().toString(),
        monthYear,
        basicPay: parsedBasic,
        allowances: parsedAllow,
        deductions: parsedDed,
        netPay,
        createdAt: new Date().toISOString(),
        staff: { name: selectedStaff.name, role: selectedStaff.role }
      };
      setSlips(prev => [newSlip, ...prev]);
      setShowModal(false);
      setToast('Salary slip generated successfully!');
      setTimeout(() => setToast(''), 4000);
      setIsSubmitting(false);
    }, 300);
  };

  const renderPrintModal = () => {
    if (!printSlipId || !slipToPrint) return null;

    return (
      <div className="fixed inset-0 z-[100] bg-[var(--color-glass)] backdrop-blur-md overflow-y-auto flex flex-col items-center py-10 print:static print:bg-transparent print:p-0 print:m-0 print:block">
        <div className="print:hidden flex w-full max-w-[800px] justify-end mb-6 gap-4 px-4">
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 bg-indigo-600 text-[#ffffff] px-6 py-2 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-colors"
          >
            <Printer size={18} /> Print
          </button>
          <button 
            onClick={() => setPrintSlipId(null)} 
            className="flex items-center gap-2 glass-card border border-[var(--color-border)] text-[var(--color-text-primary)] px-6 py-2 rounded-full font-bold hover:bg-black/5 dark:hover:bg-[#ffffff]/5 transition-colors"
          >
            <X size={18} /> Close
          </button>
        </div>

        <div className="w-full max-w-[800px] shadow-2xl print:shadow-none print:w-full rounded-xl overflow-hidden border border-gray-300" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
          <PrintableLetterhead title="SALARY SLIP" />
          
          <div className="p-10 bg-[#ffffff]">
            <h2 className="text-2xl font-bold mb-6 text-center underline uppercase">Salary Slip</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div><span className="font-bold">Employee Name:</span> {slipToPrint.staff.name}</div>
              <div><span className="font-bold">Role:</span> {slipToPrint.staff.role.toUpperCase()}</div>
              <div><span className="font-bold">Month & Year:</span> {slipToPrint.monthYear}</div>
              <div><span className="font-bold">Date of Issue:</span> {new Date(slipToPrint.createdAt).toLocaleDateString()}</div>
              <div className="col-span-2"><span className="font-bold">School:</span> {SchoolConfig.name}</div>
            </div>
            
            <table className="w-full mb-8 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left font-bold">Earnings</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Amount (₹)</th>
                  <th className="border border-gray-300 p-2 text-left font-bold">Deductions</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">Basic Pay</td>
                  <td className="border border-gray-300 p-2 text-right">{slipToPrint.basicPay.toLocaleString()}</td>
                  <td className="border border-gray-300 p-2">Standard Deductions</td>
                  <td className="border border-gray-300 p-2 text-right">{slipToPrint.deductions.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Allowances</td>
                  <td className="border border-gray-300 p-2 text-right">{slipToPrint.allowances.toLocaleString()}</td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2 text-right"></td>
                </tr>
                <tr className="font-bold bg-gray-50">
                  <td className="border border-gray-300 p-2">Total Earnings</td>
                  <td className="border border-gray-300 p-2 text-right">{(slipToPrint.basicPay + slipToPrint.allowances).toLocaleString()}</td>
                  <td className="border border-gray-300 p-2">Total Deductions</td>
                  <td className="border border-gray-300 p-2 text-right">{slipToPrint.deductions.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between items-center bg-gray-100 p-4 font-bold text-lg border border-gray-300">
              <span>Net Payable:</span>
              <span>₹{slipToPrint.netPay.toLocaleString()}</span>
            </div>
            
            <div className="mt-24 flex justify-between">
              <div className="text-center">
                <div className="border-b border-black w-48 mb-2"></div>
                <div className="font-bold text-sm uppercase">Principal / Authorized Signatory</div>
              </div>
              <div className="text-center">
                <div className="border-b border-black w-48 mb-2"></div>
                <div className="font-bold text-sm uppercase">{slipToPrint.staff.name}</div>
                <div className="text-xs">Employee Signature</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`max-w-[1200px] mx-auto w-full animate-fade-in pb-20 ${printSlipId ? 'print:hidden hidden' : ''}`}>
        <header className="mb-8">
          <h1 className="text-4xl font-bold font-display text-[var(--color-text-primary)] tracking-tight">Payroll & Salary</h1>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">
            Generate and manage monthly salary slips for staff.
          </p>
        </header>

        {!canGenerate && (
          <div className="mb-8 p-4 glass-card rounded-2xl border-l-4 border-l-amber-500 bg-amber-500/10 flex items-start gap-3">
            <AlertCircle className="text-amber-500 shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-[var(--color-text-primary)]">Read-only View</h4>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Only the Principal can generate salary slips. You can view and print previously generated slips below.
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="h-64 glass-card rounded-[24px] shadow-sm border border-[var(--color-border)] animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {canGenerate && (
              <div className="lg:col-span-1 flex flex-col gap-4">
                <h3 className="text-lg font-bold font-display text-[var(--color-text-primary)] flex items-center gap-2">
                  <Users size={20} /> Select Staff
                </h3>
                
                <div className="glass-card rounded-[24px] border border-[var(--color-border)] shadow-sm p-4 flex flex-col gap-3">
                  {staff.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-[#ffffff]/5 border border-transparent hover:border-[var(--color-border)] transition-all">
                      <div>
                        <p className="font-bold text-sm text-[var(--color-text-primary)]">{s.name}</p>
                        <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">{s.role}</p>
                      </div>
                      <button 
                        onClick={() => openGenerateModal(s)}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-full text-xs font-bold hover:bg-indigo-600 hover:text-[#ffffff] transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={`flex flex-col gap-4 ${canGenerate ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <h3 className="text-lg font-bold font-display text-[var(--color-text-primary)] flex items-center gap-2">
                <Banknote size={20} /> Recent Salary Slips
              </h3>
              
              <div className="glass-card rounded-[24px] border border-[var(--color-border)] shadow-sm overflow-hidden">
                {slips.length === 0 ? (
                  <div className="p-12 text-center text-[var(--color-text-secondary)]">No salary slips generated yet.</div>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left min-w-[600px]">
                      <thead className="bg-black/5 dark:bg-[#ffffff]/5 border-b border-[var(--color-border)]">
                      <tr>
                        <th className="p-4 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Staff</th>
                        <th className="p-4 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Month</th>
                        <th className="p-4 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Net Pay</th>
                        <th className="p-4 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                      {slips.map(slip => (
                        <tr key={slip.id} className="hover:bg-black/5 dark:hover:bg-[#ffffff]/5 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-sm text-[var(--color-text-primary)]">{slip.staff.name}</p>
                            <p className="text-xs text-[var(--color-text-secondary)] uppercase">{slip.staff.role}</p>
                          </td>
                          <td className="p-4 text-sm font-medium text-[var(--color-text-primary)]">{slip.monthYear}</td>
                          <td className="p-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{slip.netPay.toLocaleString()}</td>
                          <td className="p-4 flex items-center justify-end">
                            <button 
                              onClick={() => setPrintSlipId(slip.id)}
                              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--color-text-secondary)] hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-300 dark:hover:bg-indigo-500/20 rounded-full transition-colors" 
                            >
                              <Printer size={16} /> Print Slip
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

        <AnimatePresence>
          {showModal && selectedStaff && canGenerate && (
            <div className="fixed inset-0 bg-ink-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="glass-card rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-500/10">
                  <div>
                    <h3 className="text-xl font-bold font-display text-[var(--color-text-primary)]">Generate Slip</h3>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">For {selectedStaff.name}</p>
                  </div>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full glass-card border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-[#ffffff]/5 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleGenerate} className="flex flex-col flex-1 overflow-hidden">
                  <div className="p-6 flex flex-col gap-5 overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Month & Year</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-transparent border-2 border-[var(--color-border)] rounded-2xl px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] focus:outline-none focus:border-indigo-400 transition-colors"
                        value={monthYear}
                        onChange={(e) => setMonthYear(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Basic Pay (₹)</label>
                      <input
                        type="number"
                        required
                        className="w-full bg-transparent border-2 border-[var(--color-border)] rounded-2xl px-5 py-3 text-sm font-bold text-[var(--color-text-primary)] focus:outline-none focus:border-indigo-400 transition-colors"
                        value={basicPay}
                        onChange={(e) => setBasicPay(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Allowances (+)</label>
                        <input
                          type="number"
                          className="w-full bg-transparent border-2 border-[var(--color-border)] rounded-2xl px-5 py-3 text-sm font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-indigo-400 transition-colors"
                          value={allowances}
                          onChange={(e) => setAllowances(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Deductions (-)</label>
                        <input
                          type="number"
                          className="w-full bg-transparent border-2 border-[var(--color-border)] rounded-2xl px-5 py-3 text-sm font-bold text-red-600 dark:text-red-400 focus:outline-none focus:border-indigo-400 transition-colors"
                          value={deductions}
                          onChange={(e) => setDeductions(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-between border border-indigo-100 dark:border-indigo-500/20">
                      <span className="text-sm font-bold text-indigo-900 dark:text-indigo-200 uppercase">Net Pay</span>
                      <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300 tracking-tight">
                        ₹{((parseFloat(basicPay) || 0) + (parseFloat(allowances) || 0) - (parseFloat(deductions) || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-[var(--color-border)] flex items-center justify-end gap-3 bg-black/5 dark:bg-[#ffffff]/5 mt-auto">
                    <button 
                      type="button" 
                      className="px-6 py-3 rounded-full text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/10 dark:hover:bg-[#ffffff]/10 transition-colors"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-8 py-3 rounded-full text-sm font-bold bg-indigo-600 text-[#ffffff] shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 transition-all"
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
              className="fixed bottom-10 right-10 glass-card bg-ink-primary text-[#ffffff] px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm z-50 border border-[var(--color-border)]"
            >
              <CheckCircle size={20} className="text-emerald-400" /> 
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {renderPrintModal()}
    </>
  );
}
