'use client';

import React, { useState, useEffect } from 'react';
import { readUserSession } from '@/lib/session';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, Calendar, User, Shield, Clock, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

const MOCK_LOGS = [
  { id: '1', createdAt: new Date().toISOString(), action: 'ATTENDANCE_SUBMITTED', targetTable: 'Attendance', details: '{"class":"8A","date":"2026-07-25","present":28,"absent":2}', ipAddress: '192.168.1.45', user: { name: 'Mr. Ravi Kumar', role: 'TEACHER' } },
  { id: '2', createdAt: new Date(Date.now() - 3600000).toISOString(), action: 'STAFF_CREATED', targetTable: 'User', details: '{"name":"Mrs. Lakshmi","role":"CLERK"}', ipAddress: '192.168.1.10', user: { name: 'Dr. Anjali Rao', role: 'PRINCIPAL' } },
  { id: '3', createdAt: new Date(Date.now() - 7200000).toISOString(), action: 'FEE_COLLECTED', targetTable: 'FeePayment', details: '{"student":"Aarav Kumar","amount":15000,"receipt":"RCP-2026-001"}', ipAddress: '192.168.1.22', user: { name: 'Ms. Anita Desai', role: 'CLERK' } },
  { id: '4', createdAt: new Date(Date.now() - 10800000).toISOString(), action: 'NOTICE_PUBLISHED', targetTable: 'Notice', details: '{"title":"Annual Day Celebration","audience":"ALL"}', ipAddress: '192.168.1.10', user: { name: 'Dr. Anjali Rao', role: 'PRINCIPAL' } },
  { id: '5', createdAt: new Date(Date.now() - 14400000).toISOString(), action: 'LEAVE_APPROVED', targetTable: 'Leave', details: '{"teacher":"Mr. Ravi Kumar","type":"CASUAL","days":2}', ipAddress: '192.168.1.10', user: { name: 'Dr. Anjali Rao', role: 'PRINCIPAL' } },
  { id: '6', createdAt: new Date(Date.now() - 18000000).toISOString(), action: 'CERTIFICATE_GENERATED', targetTable: 'Certificate', details: '{"type":"Transfer Certificate","student":"Rohit Sharma"}', ipAddress: '192.168.1.22', user: { name: 'Ms. Anita Desai', role: 'CLERK' } },
  { id: '7', createdAt: new Date(Date.now() - 21600000).toISOString(), action: 'STUDENT_ENROLLED', targetTable: 'Enrollment', details: '{"student":"Ananya Verma","class":"9B"}', ipAddress: '192.168.1.22', user: { name: 'Ms. Anita Desai', role: 'CLERK' } },
  { id: '8', createdAt: new Date(Date.now() - 86400000).toISOString(), action: 'WHATSAPP_ALERT_SENT', targetTable: 'Notification', details: '{"parent":"Mr. Rajesh Kumar","student":"Aarav Kumar","type":"ABSENCE"}', ipAddress: 'system', user: { name: 'System', role: 'SYSTEM' } },
];

export default function AuditLogPage() {
  const [accessDenied, setAccessDenied] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  
  useEffect(() => {
    const session = readUserSession();
    if (!session || !['principal', 'admin'].includes(session.role.toLowerCase())) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    async function fetchLogs() {
      try {
        const response = await api.get('/audit-log?page=1&limit=50');
        if (response && response.data) {
          setLogs(Array.isArray(response.data) ? response.data : response.data.logs || []);
        } else {
          setLogs(MOCK_LOGS);
        }
      } catch (error) {
        setLogs(MOCK_LOGS);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <div style={{ color: 'var(--color-text-primary)' }} className="text-lg">Loading Audit Logs...</div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-8">
        <AlertTriangle className="h-16 w-16 mb-4 text-red-500" />
        <h1 style={{ color: 'var(--color-text-primary)' }} className="text-3xl font-bold mb-2">Access Restricted</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>You do not have permission to view the audit logs.</p>
      </div>
    );
  }

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const getActionColor = (action: string) => {
    if (action.includes('ATTENDANCE')) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (action.includes('STAFF') || action.includes('STUDENT')) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    if (action.includes('FEE')) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    if (action.includes('NOTICE') || action.includes('ALERT')) return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  };

  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'PRINCIPAL': return 'text-rose-500';
      case 'ADMIN': return 'text-rose-500';
      case 'TEACHER': return 'text-emerald-500';
      case 'CLERK': return 'text-blue-500';
      case 'SYSTEM': return 'text-slate-500';
      default: return 'text-gray-400';
    }
  };

  const parseDetails = (detailsStr: string) => {
    try {
      const obj = JSON.parse(detailsStr);
      return Object.entries(obj).map(([k, v]) => (
        <span key={k} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-1 mb-1" style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
          <span className="opacity-70 mr-1">{k}:</span> {String(v)}
        </span>
      ));
    } catch {
      return <span style={{ color: 'var(--color-text-secondary)' }}>{detailsStr}</span>;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user?.name?.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'All' || log.action.includes(actionFilter.toUpperCase());
    return matchesSearch && matchesAction;
  });

  const totalEvents = logs.length;
  const todaysEvents = logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length;
  const uniqueUsers = new Set(logs.map(l => l.user?.name)).size;
  const criticalActions = logs.filter(l => l.action.includes('CREATED') || l.action.includes('APPROVED')).length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-6"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--color-text-primary)' }}>
          <FileText className="h-8 w-8 text-blue-500" />
          Audit Trail
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Complete activity log for your institution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: totalEvents, icon: <FileText className="h-5 w-5 opacity-70" /> },
          { label: "Today's Events", value: todaysEvents, icon: <Clock className="h-5 w-5 opacity-70" /> },
          { label: 'Users Active', value: uniqueUsers, icon: <User className="h-5 w-5 opacity-70" /> },
          { label: 'Critical Actions', value: criticalActions, icon: <Shield className="h-5 w-5 opacity-70" /> },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 rounded-xl flex items-center justify-between" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}>
            <div className="flex flex-col">
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</span>
              <span className="text-2xl font-bold mt-1" style={{ color: 'var(--color-text-primary)' }}>{stat.value}</span>
            </div>
            <div style={{ color: 'var(--color-text-primary)' }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}>
        <div className="flex flex-1 items-center gap-4 w-full">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" style={{ color: 'var(--color-text-primary)' }} />
            <input 
              type="text" 
              placeholder="Search user or action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              style={{ color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 opacity-50" style={{ color: 'var(--color-text-primary)' }} />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-transparent rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}
            >
              <option value="All" style={{ background: 'var(--color-background)' }}>All Actions</option>
              <option value="Attendance" style={{ background: 'var(--color-background)' }}>Attendance</option>
              <option value="Staff" style={{ background: 'var(--color-background)' }}>Staff</option>
              <option value="Fee" style={{ background: 'var(--color-background)' }}>Fee</option>
              <option value="Notice" style={{ background: 'var(--color-background)' }}>Notice</option>
              <option value="Leave" style={{ background: 'var(--color-background)' }}>Leave</option>
              <option value="Certificate" style={{ background: 'var(--color-background)' }}>Certificate</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 opacity-50" style={{ color: 'var(--color-text-primary)' }} />
          <input type="date" className="bg-transparent rounded-lg px-3 py-1.5 text-sm" style={{ color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>to</span>
          <input type="date" className="bg-transparent rounded-lg px-3 py-1.5 text-sm" style={{ color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }} />
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden overflow-x-auto" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Time</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>User</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Action</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Details</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, idx) => (
              <tr key={log.id} style={{ borderBottom: idx === filteredLogs.length - 1 ? 'none' : '1px solid var(--color-border)' }} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 text-sm whitespace-nowrap" style={{ color: 'var(--color-text-primary)' }}>
                  {new Date(log.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{log.user?.name || 'Unknown'}</span>
                    <span className={`text-xs font-semibold ${getRoleColor(log.user?.role)}`}>{log.user?.role || 'N/A'}</span>
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                    {formatAction(log.action)}
                  </span>
                </td>
                <td className="p-4 min-w-[200px]">
                  <div className="flex flex-wrap gap-1">
                    {parseDetails(log.details)}
                  </div>
                </td>
                <td className="p-4 text-sm whitespace-nowrap font-mono" style={{ color: 'var(--color-text-secondary)' }}>
                  {log.ipAddress}
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
                  No audit logs found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Showing 1 to {filteredLogs.length} of {filteredLogs.length} entries</span>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50" style={{ color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }} disabled>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 font-medium text-sm" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
            1
          </button>
          <button className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50" style={{ color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }} disabled>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
