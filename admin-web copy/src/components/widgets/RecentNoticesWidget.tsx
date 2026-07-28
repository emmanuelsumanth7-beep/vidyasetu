'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function RecentNoticesWidget({ user }: { user: any }) {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const endpoint = user.role === 'parent' ? '/dashboard/parent-overview' : '/dashboard/overview';
        const response = await api.get(endpoint);
        setNotices(response.recentNotices || []);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, [user]);

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '24px', height: '100%' }}>
        <div className="skeleton" style={{ width: '100%', height: 24, marginBottom: 16 }}></div>
        <div className="skeleton" style={{ width: '100%', height: 100 }}></div>
      </div>
    );
  }

  if (error) {
    return <div className="glass-card" style={{ padding: '24px', color: 'red' }}>Failed to load recent notices.</div>;
  }

  return (
    <div className="glass-card" style={{ padding: '24px', height: '100%' }}>
      <div className="section-heading">
        <span>Live Feed</span>
        <h2>Recent Notices</h2>
      </div>
      
      <div style={{ display: 'grid', gap: '12px' }}>
        {notices.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No recent notices published.</p>
        ) : notices.map((notice: any) => (
          <div key={notice.id} className="simple-panel" style={{ padding: '16px' }}>
            <strong style={{ display: 'block', marginBottom: '4px' }}>{notice.title}</strong>
            <p style={{ fontSize: '0.85rem', marginBottom: '12px' }}>{notice.body}</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Posted by: {notice.author}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
