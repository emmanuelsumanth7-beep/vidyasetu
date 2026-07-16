'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function RecentFeesWidget() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchFees() {
      try {
        const response = await api.get('/dashboard/overview');
        setFees(response.recentFees || []);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchFees();
  }, []);

  if (loading) {
    return (
      <div className="data-table-shell" style={{ overflowX: 'auto', padding: '24px' }}>
        <div className="skeleton" style={{ width: '100%', height: 24, marginBottom: 16 }}></div>
        <div className="skeleton" style={{ width: '100%', height: 100 }}></div>
      </div>
    );
  }

  if (error) {
    return <div className="data-table-shell" style={{ padding: '24px', color: 'red' }}>Failed to load recent fees.</div>;
  }

  return (
    <div className="data-table-shell" style={{ overflowX: 'auto', height: '100%' }}>
      <div className="table-toolbar">
        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Recent Fee Collections</h3>
        <button className="primary-action" style={{ marginLeft: 'auto' }}>View all receipts</button>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Class</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {fees.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '24px' }}>No recent fee collections.</td>
            </tr>
          ) : fees.map((row: any, i: number) => (
            <tr key={i}>
              <td style={{ fontWeight: 500 }}>{row.name}</td>
              <td>{row.class}</td>
              <td style={{ fontWeight: 600 }}>{row.amount}</td>
              <td>
                <span className={`badge ${row.status === 'Paid' ? 'badge-green' : 'badge-amber'}`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
