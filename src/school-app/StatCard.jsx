import { useEffect, useState } from 'react';

export function StatCard({ icon: Icon, label, value, suffix = '', delta, tone = 'default' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseInt(value, 10);
  const isNumeric = !isNaN(numericValue) && numericValue > 0;

  useEffect(() => {
    if (!isNumeric) return;
    let start = 0;
    const end = numericValue;
    const duration = 1000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [numericValue, isNumeric]);

  return (
    <article className={`stat-card ${tone} interactive-hover animate-slide-up`}>
      <div className="stat-icon">{Icon ? <Icon size={24} className="icon-bounce" /> : null}</div>
      <div>
        <p>{label}</p>
        <strong>
          {isNumeric ? displayValue : value}
          {suffix}
        </strong>
        {delta ? <span className="delta-badge animate-fade-in">{delta}</span> : null}
      </div>
    </article>
  );
}
