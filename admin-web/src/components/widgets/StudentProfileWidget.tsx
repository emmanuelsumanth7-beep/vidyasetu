'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function StudentProfileWidget() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const response = await api.get('/dashboard/parent-overview');
        setStudent(response.student || null);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, []);

  if (loading) {
    return (
      <div className="data-table-shell" style={{ padding: '24px', height: '100%' }}>
        <div className="skeleton" style={{ width: '100%', height: 24, marginBottom: 16 }}></div>
        <div className="skeleton" style={{ width: '100%', height: 100 }}></div>
      </div>
    );
  }

  if (error || !student) {
    return <div className="data-table-shell" style={{ padding: '24px', color: 'red' }}>Failed to load student profile.</div>;
  }

  return (
    <div className="data-table-shell" style={{ overflowX: 'auto', height: '100%' }}>
      <div className="table-toolbar">
        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Student Profile</h3>
      </div>
      <div style={{ padding: '24px' }}>
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Class:</strong> {student.className}</p>
        <p><strong>Roll Number:</strong> {student.rollNumber}</p>
      </div>
    </div>
  );
}
