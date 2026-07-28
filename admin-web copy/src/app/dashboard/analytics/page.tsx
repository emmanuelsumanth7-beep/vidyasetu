'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, AlertTriangle, BrainCircuit, 
  ChevronRight, Calendar, UserCheck, ShieldAlert
} from 'lucide-react';

/* ── MOCK AI INSIGHTS ─────────────────────────────────────────────────────── */
const AI_INSIGHTS = [
  { 
    id: 1, 
    type: 'critical', 
    title: 'High Dropout Risk Detected', 
    desc: '3 students in Grade 9 have attendance below 70% and unpaid fees > 60 days.',
    students: ['Rahul S.', 'Amit V.', 'Priya K.'],
    action: 'Schedule Counseling'
  },
  { 
    id: 2, 
    type: 'warning', 
    title: 'Revenue Anomaly', 
    desc: 'Transport fee collection is down 15% compared to Q1 last year.',
    action: 'View Ledger'
  },
  { 
    id: 3, 
    type: 'positive', 
    title: 'Academic Trend Upwards', 
    desc: 'Grade 10 Mock Exam scores improved by 8% on average after AI homework grading was introduced.',
    action: 'View Report'
  }
];

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'at_risk' | 'revenue'>('overview');

  return (
    <div className="max-w-[1400px] mx-auto w-full animate-fade-in pb-20 relative space-y-6">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3" style={{ color: 'var(--color-text-primary)' }}>
            <BrainCircuit className="text-indigo-500" size={32} />
            AI Principal's Command Center
          </h1>
          <p className="text-sm mt-1 font-bold" style={{ color: 'var(--color-text-secondary)' }}>Predictive analytics, revenue forecasting, and at-risk student tracking.</p>
        </div>
        
        <div className="flex items-center p-1.5 rounded-2xl shrink-0 overflow-x-auto custom-scrollbar" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}>
          {[
            { id: 'overview', label: 'AI Overview', icon: BrainCircuit },
            { id: 'at_risk', label: 'At-Risk Students', icon: ShieldAlert },
            { id: 'revenue', label: 'Revenue Forecast', icon: TrendingUp },
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

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: AI Insights Feed */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>Real-Time AI Insights</h3>
            
            <div className="space-y-4">
              {AI_INSIGHTS.map(insight => (
                <div key={insight.id} className="glass-card p-6 border-l-4 relative overflow-hidden" 
                     style={{ borderLeftColor: insight.type === 'critical' ? '#FF3B30' : insight.type === 'warning' ? '#FF9500' : '#34C759' }}>
                  
                  <div className="absolute right-0 top-0 w-32 h-32 rounded-bl-full opacity-[0.03] pointer-events-none" 
                       style={{ background: insight.type === 'critical' ? '#FF3B30' : insight.type === 'warning' ? '#FF9500' : '#34C759' }}></div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {insight.type === 'critical' ? <AlertTriangle size={18} style={{ color: '#FF3B30' }} /> : 
                         insight.type === 'warning' ? <AlertTriangle size={18} style={{ color: '#FF9500' }} /> : 
                         <TrendingUp size={18} style={{ color: '#34C759' }} />}
                        <h4 className="font-black text-sm" style={{ color: 'var(--color-text-primary)' }}>{insight.title}</h4>
                      </div>
                      <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{insight.desc}</p>
                      
                      {insight.students && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {insight.students.map(s => (
                            <span key={s} className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(255,59,48,0.1)', color: '#FF3B30' }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <button className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 hover:scale-105" 
                            style={{ background: 'var(--color-glass-3)', color: 'var(--color-text-primary)' }}>
                      {insight.action} <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Quick Stats Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>School Health</h3>
            
            <div className="glass-card p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Total Enrollment</p>
                <p className="text-3xl font-black mt-1" style={{ color: 'var(--color-text-primary)' }}>1,248</p>
                <p className="text-xs font-bold mt-1 flex items-center gap-1" style={{ color: '#34C759' }}>
                  <TrendingUp size={12} /> +4% this year
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(52,199,89,0.1)', color: '#34C759' }}>
                <Users size={24} />
              </div>
            </div>

            <div className="glass-card p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Avg Daily Attendance</p>
                <p className="text-3xl font-black mt-1" style={{ color: 'var(--color-text-primary)' }}>92.4%</p>
                <p className="text-xs font-bold mt-1 flex items-center gap-1" style={{ color: '#FF9500' }}>
                  <TrendingUp size={12} className="rotate-180" /> -1.2% this week
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,149,0,0.1)', color: '#FF9500' }}>
                <UserCheck size={24} />
              </div>
            </div>

            <div className="glass-card p-6">
              <h4 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Admission Forecast</h4>
              {/* Fake Graph */}
              <div className="h-24 flex items-end justify-between gap-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
                {[40, 55, 30, 80, 65, 90, 75].map((h, i) => (
                  <div key={i} className="w-full bg-indigo-500 rounded-t-md opacity-80" style={{ height: h + '%' }}></div>
                ))}
              </div>
              <p className="text-[10px] text-center mt-2 font-bold" style={{ color: 'var(--color-text-secondary)' }}>Predicted 120 new leads next month</p>
            </div>
            
          </div>
        </motion.div>
      )}

      {/* AT-RISK TAB (MOCKUP) */}
      {activeTab === 'at_risk' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 flex flex-col items-center justify-center text-center">
          <ShieldAlert size={64} style={{ color: '#FF3B30' }} className="mb-6 opacity-80" />
          <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--color-text-primary)' }}>At-Risk Student Matrix</h2>
          <p className="text-sm max-w-md font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            The AI engine continuously correlates homework completion, attendance drops, and delayed fee payments to flag students who might drop out or fail.
          </p>
          <div className="mt-8 px-6 py-3 rounded-2xl font-bold text-sm bg-red-500 text-white shadow-lg shadow-red-500/20">
            3 High-Risk Profiles Identified (See Overview)
          </div>
        </motion.div>
      )}

    </div>
  );
}
