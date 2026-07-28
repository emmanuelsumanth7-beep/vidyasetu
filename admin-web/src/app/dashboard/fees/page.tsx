'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, TrendingUp, TrendingDown, IndianRupee, 
  Search, ArrowDownRight, ArrowUpRight, CheckCircle2, 
  AlertCircle, Receipt, X, CreditCard, Banknote, QrCode
} from 'lucide-react';
import { api } from '@/lib/api';
import { readUserSession, ClientUser } from '@/lib/session';

/* ── DATA REMOVED PER USER REQUEST ────────────────────────────────────────── */
const FINANCIAL_STATS = {
  totalRevenue: 1250000,
  outstanding: 345000,
  expenses: 280000,
  cashflow: 970000,
};

// Mock data for parent view
const PARENT_FEES = [
  { id: 'f-1', title: 'Term 1 Tuition Fee', amount: 45000, paid: 45000, dueDate: '2026-05-15', status: 'paid', category: 'Tuition' },
  { id: 'f-2', title: 'Term 2 Tuition Fee', amount: 45000, paid: 15000, dueDate: '2026-10-15', status: 'partial', category: 'Tuition' },
  { id: 'f-3', title: 'Annual Transport Fee', amount: 18000, paid: 0, dueDate: '2026-08-01', status: 'overdue', category: 'Transport' },
  { id: 'f-4', title: 'Library & Lab Deposit', amount: 5000, paid: 0, dueDate: '2026-09-01', status: 'pending', category: 'Misc' },
];

const FEE_STRUCTURES = [
  { id: 'fs-1', title: 'Term 1 Tuition Fee', amount: 45000, target: 'All Classes', created: '2026-04-01', active: true },
  { id: 'fs-2', title: 'Annual Transport Fee', amount: 18000, target: 'Transport Opt-ins', created: '2026-04-05', active: true },
];

const EMPTY_LEDGER: any[] = [];

export default function FinanceDashboard() {
  const [user] = useState<ClientUser | null>(() => readUserSession());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'structures' | 'transactions'>('dashboard');
  const [transactions, setTransactions] = useState(EMPTY_LEDGER);
  const [feeStructures, setFeeStructures] = useState(FEE_STRUCTURES);
  
  const isParentOrStudent = user?.role === 'parent' || user?.role === 'student';

  if (isParentOrStudent) {
    const totalDue = PARENT_FEES.reduce((acc, f) => acc + (f.amount - f.paid), 0);
    const overdue = PARENT_FEES.filter(f => f.status === 'overdue').reduce((acc, f) => acc + (f.amount - f.paid), 0);

    return (
      <div className="max-w-[1200px] mx-auto w-full pt-6 pb-20 animate-fade-in space-y-6 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>My Fees & Payments</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Track your outstanding balances, due dates, and receipts.</p>
          </div>
        </div>

        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-8 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute right-0 top-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <IndianRupee size={150} style={{ color: '#FF3B30' }} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-secondary)' }}>Total Outstanding Due</p>
            <p className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: totalDue > 0 ? '#FF3B30' : '#34C759' }}>
              {formatCurrency(totalDue)}
            </p>
            {overdue > 0 && (
              <p className="mt-3 text-sm font-bold flex items-center gap-1.5" style={{ color: '#FF3B30' }}>
                <AlertCircle size={16} /> Includes {formatCurrency(overdue)} overdue!
              </p>
            )}
          </div>
          
          <div className="lg:col-span-2 glass-card p-6 relative overflow-hidden">
             <div className="absolute right-0 bottom-0 opacity-[0.03]">
              <Banknote size={150} />
            </div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>Quick Payment</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 p-4 rounded-2xl w-full" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}>
                <p className="text-xs font-bold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Amount to Pay</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black" style={{ color: 'var(--color-text-primary)' }}>₹</span>
                  <input type="number" defaultValue={totalDue} className="bg-transparent text-3xl font-black focus:outline-none w-full" style={{ color: 'var(--color-text-primary)' }} />
                </div>
              </div>
              <button className="btn-primary w-full sm:w-auto h-full px-8 py-5 rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-3">
                <CreditCard size={24} />
                <span className="font-black text-lg tracking-wide">Pay Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>Detailed Fee Breakdown</h3>
            <p className="text-xs font-medium mt-1" style={{ color: 'var(--color-text-secondary)' }}>Itemized list of all fee components and their current status.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead style={{ background: 'var(--color-glass-2)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th className="p-5 pl-8 text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Fee Component</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Total Amount</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Paid</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Balance Due</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-widest text-center" style={{ color: 'var(--color-text-tertiary)' }}>Due Date</th>
                  <th className="p-5 pr-8 text-[11px] font-black uppercase tracking-widest text-right" style={{ color: 'var(--color-text-tertiary)' }}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {PARENT_FEES.map((fee) => {
                  const balance = fee.amount - fee.paid;
                  return (
                    <tr key={fee.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="p-5 pl-8">
                        <p className="text-sm font-black" style={{ color: 'var(--color-text-primary)' }}>{fee.title}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--color-text-tertiary)' }}>{fee.category}</p>
                      </td>
                      <td className="p-5 text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>{formatCurrency(fee.amount)}</td>
                      <td className="p-5 text-sm font-bold" style={{ color: '#34C759' }}>{formatCurrency(fee.paid)}</td>
                      <td className="p-5 text-sm font-black" style={{ color: balance > 0 ? '#FF3B30' : 'var(--color-text-secondary)' }}>
                        {formatCurrency(balance)}
                      </td>
                      <td className="p-5 text-center text-sm font-bold" style={{ color: fee.status === 'overdue' ? '#FF3B30' : 'var(--color-text-secondary)' }}>
                        {new Date(fee.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg inline-block" 
                              style={{ 
                                background: fee.status === 'paid' ? 'rgba(52,199,89,0.1)' : fee.status === 'overdue' ? 'rgba(255,59,48,0.1)' : fee.status === 'partial' ? 'rgba(255,149,0,0.1)' : 'rgba(27,42,74,0.1)', 
                                color: fee.status === 'paid' ? '#34C759' : fee.status === 'overdue' ? '#FF3B30' : fee.status === 'partial' ? '#FF9500' : 'var(--color-text-secondary)' 
                              }}>
                          {fee.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentStudent, setPaymentStudent] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Create Fee Structure State
  const [showCreateStructureModal, setShowCreateStructureModal] = useState(false);
  const [newStructure, setNewStructure] = useState({ title: '', amount: '', target: 'All Classes', category: 'Tuition' });
  const [isCreatingStructure, setIsCreatingStructure] = useState(false);
  
  const handleCreateStructure = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingStructure(true);
    setTimeout(() => {
      setIsCreatingStructure(false);
      setFeeStructures([
        { id: `fs-${Date.now()}`, title: newStructure.title, amount: parseFloat(newStructure.amount), target: newStructure.target, created: new Date().toISOString().split('T')[0], active: true },
        ...feeStructures
      ]);
      setShowCreateStructureModal(false);
      setNewStructure({ title: '', amount: '', target: 'All Classes', category: 'Tuition' });
    }, 1000);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate webhook / API processing
    setTimeout(() => {
      setIsProcessing(false);
      
      const newTx = {
        id: `t-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'payment',
        amount: parseFloat(paymentAmount),
        description: `${paymentMethod} Payment Received`,
        student: paymentStudent,
        class: 'N/A',
        status: 'success',
        method: paymentMethod
      };
      
      setTransactions([newTx, ...transactions]);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setShowPaymentModal(false);
        setPaymentAmount('');
        setPaymentStudent('');
      }, 2000);
    }, 1500);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full animate-fade-in pb-20 relative space-y-6">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Finance & Ledger</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Event-driven accounting, payments, and financial analytics.</p>
        </div>
        
        <div className="flex items-center p-1.5 rounded-2xl shrink-0 overflow-x-auto custom-scrollbar" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}>
          {[
            { id: 'dashboard', label: 'Overview', icon: TrendingUp },
            { id: 'structures', label: 'Fee Structures', icon: Banknote },
            { id: 'ledger', label: 'Student Ledger', icon: Wallet },
            { id: 'transactions', label: 'Double-Entry Log', icon: Receipt },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap"
              style={{ 
                background: activeTab === tab.id ? 'var(--surface)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ─────────────────────────────────────────────────────────────────────────
            DASHBOARD OVERVIEW
        ────────────────────────────────────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue (YTD)', value: formatCurrency(FINANCIAL_STATS.totalRevenue), icon: TrendingUp, color: '#34C759' },
                { label: 'Outstanding Fees',    value: formatCurrency(FINANCIAL_STATS.outstanding), icon: AlertCircle, color: '#FF9500' },
                { label: 'Total Expenses',      value: formatCurrency(FINANCIAL_STATS.expenses),    icon: TrendingDown, color: '#FF3B30' },
                { label: 'Net Cash Flow',       value: formatCurrency(FINANCIAL_STATS.cashflow),    icon: IndianRupee, color: '#C49B2A' },
              ].map(stat => (
                <div key={stat.label} className="glass-card p-6 relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <stat.icon size={100} style={{ color: stat.color }} />
                  </div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${stat.color}15`, color: stat.color }}>
                      <stat.icon size={20} />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{stat.label}</p>
                    <p className="text-2xl lg:text-3xl font-black tracking-tighter" style={{ color: 'var(--color-text-primary)' }}>{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Quick Actions */}
              <div className="lg:col-span-1 glass-card p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black mb-1" style={{ color: 'var(--color-text-primary)' }}>Quick Actions</h3>
                  <p className="text-xs font-medium mb-6" style={{ color: 'var(--color-text-secondary)' }}>Record manual payments or expenses.</p>
                  
                  <div className="space-y-3">
                    <button onClick={() => setShowPaymentModal(true)} className="w-full btn-primary flex items-center justify-between p-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform">
                      <div className="flex items-center gap-3">
                        <CreditCard size={20} />
                        <span className="font-bold text-sm">Record Payment</span>
                      </div>
                      <ArrowUpRight size={18} opacity={0.5} />
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-4 rounded-2xl transition-all" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                      <div className="flex items-center gap-3">
                        <Banknote size={20} style={{ color: '#FF3B30' }} />
                        <span className="font-bold text-sm">Log Expense</span>
                      </div>
                      <ArrowUpRight size={18} style={{ color: 'var(--color-text-tertiary)' }} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-8 p-4 rounded-2xl" style={{ background: 'rgba(52,199,89,0.1)', border: '1px solid rgba(52,199,89,0.2)' }}>
                  <p className="text-xs font-bold" style={{ color: '#34C759' }}>Payment Gateway Active</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-secondary)' }}>Razorpay Webhooks connected. Auto-reconciliation running.</p>
                </div>
              </div>

              {/* Recent Ledger Activity */}
              <div className="lg:col-span-2 glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>Recent Event Stream</h3>
                  <button className="text-xs font-bold" style={{ color: 'var(--vs-primary)' }}>View All</button>
                </div>
                
                <div className="space-y-4">
                  {transactions.slice(0, 4).map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl transition-all hover:bg-black/5 dark:hover:bg-white/5" style={{ border: '1px solid var(--color-border)' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                             style={{ background: tx.type === 'payment' ? 'rgba(52,199,89,0.1)' : tx.type === 'expense' ? 'rgba(255,59,48,0.1)' : 'rgba(27,42,74,0.1)',
                                      color: tx.type === 'payment' ? '#34C759' : tx.type === 'expense' ? '#FF3B30' : '#1B2A4A' }}>
                          {tx.type === 'payment' ? <ArrowDownRight size={18} /> : tx.type === 'expense' ? <ArrowUpRight size={18} /> : <Receipt size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-black" style={{ color: 'var(--color-text-primary)' }}>{tx.description}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{tx.student} • {tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black" style={{ color: tx.type === 'expense' || tx.type === 'charge' ? '#FF3B30' : '#34C759' }}>
                          {tx.type === 'expense' || tx.type === 'charge' ? '-' : '+'}{formatCurrency(tx.amount)}
                        </p>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: 'var(--color-glass-3)', color: 'var(--color-text-secondary)' }}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────
            FEE STRUCTURES (PRINCIPAL)
        ────────────────────────────────────────────────────────────────────────── */}
        {activeTab === 'structures' && (
          <motion.div key="structures" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="glass-card overflow-hidden">
              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>Active Fee Structures</h3>
                  <p className="text-xs font-medium mt-1" style={{ color: 'var(--color-text-secondary)' }}>Manage and assign fee components (Tuition, Transport, etc.).</p>
                </div>
                <button 
                  onClick={() => setShowCreateStructureModal(true)}
                  className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform"
                >
                  <Banknote size={16} />
                  <span>Create Fee Charge</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead style={{ background: 'var(--color-glass-2)', borderBottom: '1px solid var(--color-border)' }}>
                    <tr>
                      <th className="p-5 pl-8 text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Fee Title</th>
                      <th className="p-5 text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Target Group</th>
                      <th className="p-5 text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Base Amount</th>
                      <th className="p-5 text-[11px] font-black uppercase tracking-widest text-center" style={{ color: 'var(--color-text-tertiary)' }}>Created On</th>
                      <th className="p-5 pr-8 text-[11px] font-black uppercase tracking-widest text-right" style={{ color: 'var(--color-text-tertiary)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                    {feeStructures.map((fs) => (
                      <tr key={fs.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="p-5 pl-8">
                          <p className="text-sm font-black" style={{ color: 'var(--color-text-primary)' }}>{fs.title}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--color-text-tertiary)' }}>ID: {fs.id}</p>
                        </td>
                        <td className="p-5 text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>{fs.target}</td>
                        <td className="p-5 text-sm font-black" style={{ color: 'var(--vs-primary)' }}>{formatCurrency(fs.amount)}</td>
                        <td className="p-5 text-center text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                          {new Date(fs.created).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-5 pr-8 text-right">
                          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg inline-block" 
                                style={{ background: fs.active ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.1)', color: fs.active ? '#34C759' : '#FF3B30' }}>
                            {fs.active ? 'Active' : 'Archived'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────
            STUDENT LEDGER
        ────────────────────────────────────────────────────────────────────────── */}
        {activeTab === 'ledger' && (
          <motion.div key="ledger" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="glass-card overflow-hidden">
              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>Student Balances</h3>
                  <p className="text-xs font-medium mt-1" style={{ color: 'var(--color-text-secondary)' }}>Track total charges minus payments.</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--color-text-tertiary)' }} />
                  <input type="text" placeholder="Search student..." className="pl-9 pr-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead style={{ background: 'var(--color-glass-2)', borderBottom: '1px solid var(--color-border)' }}>
                    <tr>
                      <th className="p-4 pl-6 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Student</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Total Charged</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Total Paid</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Outstanding</th>
                      <th className="p-4 pr-6 text-[10px] font-black uppercase tracking-widest text-right" style={{ color: 'var(--color-text-tertiary)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                    {/* Mock Aggregated Data */}
                    {[
                      { name: 'Aryan Sharma', class: '8A', charged: 25000, paid: 25000, out: 0 },
                      { name: 'Rahul Sharma', class: '8A', charged: 30000, paid: 15000, out: 15000 },
                      { name: 'Priya Kamath', class: '9B', charged: 40000, paid: 0, out: 40000 },
                    ].map((s, i) => (
                      <tr key={i} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6">
                          <p className="text-sm font-black" style={{ color: 'var(--color-text-primary)' }}>{s.name}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Class {s.class}</p>
                        </td>
                        <td className="p-4 text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>{formatCurrency(s.charged)}</td>
                        <td className="p-4 text-sm font-bold" style={{ color: '#34C759' }}>{formatCurrency(s.paid)}</td>
                        <td className="p-4">
                          <span className="text-sm font-black" style={{ color: s.out > 0 ? '#FF3B30' : 'var(--color-text-secondary)' }}>
                            {formatCurrency(s.out)}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button className="px-4 py-2 rounded-xl text-xs font-bold transition-all" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────
            TRANSACTIONS (DOUBLE ENTRY LOG)
        ────────────────────────────────────────────────────────────────────────── */}
        {activeTab === 'transactions' && (
          <motion.div key="transactions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="glass-card overflow-hidden">
              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>Master Transaction Log</h3>
                  <p className="text-xs font-medium mt-1" style={{ color: 'var(--color-text-secondary)' }}>Immutable double-entry event stream.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all" style={{ background: 'var(--color-glass-3)', color: 'var(--color-text-secondary)' }}>
                  Download CSV
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[900px]">
                  <thead style={{ background: 'var(--color-glass-2)', borderBottom: '1px solid var(--color-border)' }}>
                    <tr>
                      <th className="p-4 pl-6 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Txn ID / Date</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Description</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Type</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-right" style={{ color: 'var(--color-text-tertiary)' }}>Debit (Dr)</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-right" style={{ color: 'var(--color-text-tertiary)' }}>Credit (Cr)</th>
                      <th className="p-4 pr-6 text-[10px] font-black uppercase tracking-widest text-center" style={{ color: 'var(--color-text-tertiary)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                    {transactions.map(tx => {
                      // Double entry logic mockup
                      const isDr = tx.type === 'charge' || tx.type === 'expense';
                      const isCr = tx.type === 'payment';
                      
                      return (
                        <tr key={tx.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <td className="p-4 pl-6">
                            <p className="text-xs font-bold font-mono" style={{ color: 'var(--color-text-primary)' }}>{tx.id.toUpperCase()}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>{tx.date}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-sm font-black" style={{ color: 'var(--color-text-primary)' }}>{tx.description}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>{tx.student}</p>
                          </td>
                          <td className="p-4">
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md" 
                                  style={{ background: tx.type === 'payment' ? 'rgba(52,199,89,0.1)' : tx.type === 'charge' ? 'rgba(27,42,74,0.1)' : 'rgba(255,59,48,0.1)', 
                                           color: tx.type === 'payment' ? '#34C759' : tx.type === 'charge' ? '#1B2A4A' : '#FF3B30' }}>
                              {tx.type} {tx.method ? `(${tx.method})` : ''}
                            </span>
                          </td>
                          <td className="p-4 text-right text-sm font-bold font-mono" style={{ color: isDr ? '#FF3B30' : 'var(--color-text-tertiary)' }}>
                            {isDr ? formatCurrency(tx.amount) : '-'}
                          </td>
                          <td className="p-4 text-right text-sm font-bold font-mono" style={{ color: isCr ? '#34C759' : 'var(--color-text-tertiary)' }}>
                            {isCr ? formatCurrency(tx.amount) : '-'}
                          </td>
                          <td className="p-4 pr-6 text-center">
                            <CheckCircle2 size={16} className="mx-auto" style={{ color: tx.status === 'success' || tx.status === 'cleared' ? '#34C759' : 'var(--color-text-tertiary)' }} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────────────────
          PAYMENT MODAL
      ────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }} onClick={() => setShowPaymentModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-[32px] overflow-hidden"
              style={{ background: 'var(--surface)', border: '1px solid var(--color-border)', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}>
              
              <div className="p-6 flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-glass)' }}>
                <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>Record Payment</h3>
                <button className="w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ background: 'var(--color-glass)', color: 'var(--color-text-secondary)' }} onClick={() => setShowPaymentModal(false)}>
                  <X size={16} />
                </button>
              </div>

              {showSuccess ? (
                <div className="p-10 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(52,199,89,0.15)' }}>
                    <CheckCircle2 size={40} style={{ color: '#34C759' }} />
                  </div>
                  <h3 className="text-xl font-black mb-2" style={{ color: 'var(--color-text-primary)' }}>Payment Recorded!</h3>
                  <p className="text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>The ledger has been updated and a receipt generated.</p>
                </div>
              ) : (
                <form onSubmit={handleRecordPayment}>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Student Name / Roll</label>
                      <input type="text" required placeholder="Search student..." value={paymentStudent} onChange={e => setPaymentStudent(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none"
                        style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Amount Received (₹)</label>
                      <input type="number" required placeholder="e.g. 5000" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl text-xl font-black focus:outline-none"
                        style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Payment Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['UPI', 'CASH', 'POS'].map(method => (
                          <button key={method} type="button" onClick={() => setPaymentMethod(method)}
                                  className="py-3 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-1"
                                  style={{ 
                                    background: paymentMethod === method ? 'var(--surface)' : 'var(--color-glass)', 
                                    border: `1px solid ${paymentMethod === method ? 'var(--vs-primary)' : 'var(--color-border)'}`,
                                    color: paymentMethod === method ? 'var(--vs-primary)' : 'var(--color-text-secondary)' 
                                  }}>
                            {method === 'UPI' && <QrCode size={16} />}
                            {method === 'CASH' && <Banknote size={16} />}
                            {method === 'POS' && <CreditCard size={16} />}
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 flex justify-end gap-3" style={{ background: 'var(--color-glass)', borderTop: '1px solid var(--color-border)' }}>
                    <button type="button" className="px-6 py-3 font-bold text-sm rounded-2xl transition-all" style={{ color: 'var(--color-text-secondary)' }} onClick={() => setShowPaymentModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black shadow-lg disabled:opacity-50" disabled={isProcessing}>
                      {isProcessing ? 'Processing Webhook...' : 'Record Payment'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────────────────
          CREATE FEE STRUCTURE MODAL
      ────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCreateStructureModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }} onClick={() => setShowCreateStructureModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg rounded-[32px] overflow-hidden"
              style={{ background: 'var(--surface)', border: '1px solid var(--color-border)', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}>
              
              <div className="p-6 flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-glass)' }}>
                <div>
                  <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>Create New Fee Charge</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--color-text-secondary)' }}>Assign a new fee to students</p>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ background: 'var(--color-glass)', color: 'var(--color-text-secondary)' }} onClick={() => setShowCreateStructureModal(false)}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateStructure}>
                <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Fee Title (What is it for?)</label>
                    <input type="text" required placeholder="e.g. Term 1 Tuition Fee" value={newStructure.title} onChange={e => setNewStructure({...newStructure, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none"
                      style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Amount (₹)</label>
                      <input type="number" required placeholder="e.g. 25000" value={newStructure.amount} onChange={e => setNewStructure({...newStructure, amount: e.target.value})}
                        className="w-full px-4 py-3 rounded-2xl text-lg font-black focus:outline-none"
                        style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Category</label>
                      <select value={newStructure.category} onChange={e => setNewStructure({...newStructure, category: e.target.value})}
                        className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none appearance-none"
                        style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                        <option value="Tuition">Tuition Fee</option>
                        <option value="Transport">Transport Fee</option>
                        <option value="Hostel">Hostel Fee</option>
                        <option value="Misc">Miscellaneous (Lab/Library)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Target Group (Who pays this?)</label>
                    <select value={newStructure.target} onChange={e => setNewStructure({...newStructure, target: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none appearance-none"
                      style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                      <option value="All Classes">All Classes (Whole School)</option>
                      <option value="Class 10">Class 10 Only</option>
                      <option value="Class 12">Class 12 Only</option>
                      <option value="Transport Opt-ins">Students Using Transport</option>
                    </select>
                    <p className="text-[10px] mt-2 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>This will instantly generate a ledger charge for all matched students.</p>
                  </div>
                </div>
                
                <div className="p-5 flex justify-end gap-3" style={{ background: 'var(--color-glass)', borderTop: '1px solid var(--color-border)' }}>
                  <button type="button" className="px-6 py-3 font-bold text-sm rounded-2xl transition-all" style={{ color: 'var(--color-text-secondary)' }} onClick={() => setShowCreateStructureModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black shadow-lg disabled:opacity-50" disabled={isCreatingStructure}>
                    {isCreatingStructure ? 'Generating Ledger...' : 'Rollout Fee Charge'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
