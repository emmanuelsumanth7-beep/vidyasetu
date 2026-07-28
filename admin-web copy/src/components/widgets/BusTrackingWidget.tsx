'use client';

export default function BusTrackingWidget() {
  return (
    <div className="glass-card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ background: 'var(--accent-light)', width: 64, height: 64, borderRadius: '50%', display: 'grid', placeItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: '24px' }}>🚌</span>
      </div>
      <h3>Live Bus Tracking</h3>
      <p style={{ color: 'var(--text-secondary)' }}>Track your assigned school buses in real-time.</p>
      <button className="primary-action" style={{ marginTop: 16 }}>Setup First Route</button>
    </div>
  );
}
