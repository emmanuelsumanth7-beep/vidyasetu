'use client';
import { useEffect, useState } from 'react';
import { Users, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';

function CountUp({ end, suffix = '', prefix = '' }: { end: number, suffix?: string, prefix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end]);

  return <>{prefix}{count.toLocaleString()}{suffix}</>;
}

export default function StatsWidget({ user }: { user: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const endpoint = user.role === 'parent' ? '/dashboard/parent-overview' : '/dashboard/overview';
        const response = await api.get(endpoint);
        setData(response.metrics);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="stats-grid">
        {[1,2,3,4].map((i) => (
          <div key={i} className="stat-card">
            <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '12px', marginBottom: 16 }}></div>
            <div className="skeleton" style={{ width: 100, height: 16, marginBottom: 8 }}></div>
            <div className="skeleton" style={{ width: 60, height: 28, marginBottom: 8 }}></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return <div className="stat-card" style={{ color: 'red' }}>Failed to load statistics.</div>;
  }

  const stats = user?.role === 'parent' ? [
    { label: 'Attendance Rate', value: data.attendanceRate, prefix: '', suffix: '%', trend: 'Child Average', icon: CheckCircle2 },
    { label: 'Pending Fees', value: data.totalFeesPending, prefix: '₹', suffix: '', trend: 'Due soon', icon: TrendingUp },
  ] : [
    { label: 'Total Students', value: data.totalStudents, prefix: '', suffix: '', trend: 'Live from DB', icon: Users },
    { label: "Today's Attendance", value: data.attendanceRate, prefix: '', suffix: '%', trend: 'Based on RFID scans', icon: CheckCircle2 },
    { label: 'Pending Leaves', value: data.pendingLeaves, prefix: '', suffix: '', trend: 'Requires review', icon: AlertCircle },
    { label: 'Fees Collected', value: data.totalFees, prefix: '₹', suffix: '', trend: 'Total volume', icon: TrendingUp },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="stat-card interactive-hover">
            <div className="stat-icon">
              <Icon size={24} />
            </div>
            <div>
              <p>{stat.label}</p>
              <strong>
                <CountUp end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </strong>
              <span className="text-green animate-pulse-slow" style={{ display: 'block', marginTop: '4px' }}>{stat.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
