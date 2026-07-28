'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, TrendingUp, TrendingDown, IndianRupee, 
  Search, ArrowDownRight, ArrowUpRight, CheckCircle2, 
  AlertCircle, Receipt, X, CreditCard, Banknote, QrCode
} from 'lucide-react';
import { api } from '@/lib/api';

/* ── MOCK DATA ────────────────────────────────────────────────────────────── */
const FINANCIAL_STATS = {
  totalRevenue: 4250000,
  outstanding: 850000,
  expenses: 1200000,
  cashflow: 3050000,
};

const MOCK_LEDGER = [
  { id: 't1', date: '2026-07-10', type: 'charge',  amount: 25000, description: 'Term 1 Tuition Fee', student: 'Aryan Sharma', class: '8A', status: 'posted' },
  { id: 't2', date: '2026-07-12', type: 'payment', amount: 25000, description: 'Razorpay Online Payment', student: 'Aryan Sharma', class: '8A', status: 'success', method: 'UPI' },
  { id: 't3', date: '2026-07-15', type: 'charge',  amount: 25000, description: 'Term 1 Tuition Fee', student: 'Rahul Sharma', class: '8A', status: 'posted' },
  { id: 't4', date: '2026-07-18', type: 'charge',  amount: 5000,  description: 'Transport Fee',      student: 'Rahul Sharma', class: '8A', status: 'posted' },
  { id: 't5', date: '2026-07-19', type: 'payment', amount: 15000, description: 'Cash at Counter',    student: 'Rahul Sharma', class: '8A', status: 'success', method: 'CASH' },
  { id: 't6', date: '2026-07-20', type: 'expense', amount: 45000, description: 'Electricity Bill',   student: '--', class: '--', status: 'cleared', method: 'BANK_TRANSFER' },
];

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'transactions'>('dashboard');
  const [transactions, setTransactions] = useState(MOCK_LEDGER);
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentStudent, setPaymentStudent] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
                { label: 'Net Cash Flow',       value: formatCurrency(FINANCIAL_STATS.cashflow),    icon: IndianRupee, color: '#5856D6' },
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
                             style={{ background: tx.type === 'payment' ? 'rgba(52,199,89,0.1)' : tx.type === 'expense' ? 'rgba(255,59,48,0.1)' : 'rgba(0,122,255,0.1)',
                                      color: tx.type === 'payment' ? '#34C759' : tx.type === 'expense' ? '#FF3B30' : '#007AFF' }}>
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
                                  style={{ background: tx.type === 'payment' ? 'rgba(52,199,89,0.1)' : tx.type === 'charge' ? 'rgba(0,122,255,0.1)' : 'rgba(255,59,48,0.1)', 
                                           color: tx.type === 'payment' ? '#34C759' : tx.type === 'charge' ? '#007AFF' : '#FF3B30' }}>
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

    </div>
  );
}
