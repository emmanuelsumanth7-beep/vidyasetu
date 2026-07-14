import { Search } from 'lucide-react';
import { useLanguage } from '../i18n.jsx';

export function DataTable({ columns, rows }) {
  const { t } = useLanguage();

  return (
    <div className="data-table-shell">
      <div className="table-toolbar">
        <label>
          <Search size={18} />
          <input placeholder={t('search')} className="interactive-input" />
        </label>
        <button type="button" className="interactive-hover">{t('filter')}</button>
        <button type="button" className="interactive-hover">{t('export')}</button>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr 
                key={row.Name || row.name || rowIndex} 
                className="interactive-row animate-fade-in" 
                style={{ animationDelay: `${rowIndex * 50}ms` }}
              >
                {columns.map((column) => (
                  <td key={`${row.Name || row.name || rowIndex}-${column}`}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mobile-record-list">
        {rows.map((row, rowIndex) => (
          <article key={`mobile-${row.Name || row.name || rowIndex}`} className="mobile-record-card">
            {columns.map((column, columnIndex) => (
              <div key={`${column}-${rowIndex}`} className={columnIndex === 0 ? 'record-primary' : ''}>
                <span>{column}</span>
                <strong>{row[column]}</strong>
              </div>
            ))}
          </article>
        ))}
      </div>
    </div>
  );
}
