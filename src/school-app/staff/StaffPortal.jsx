import { useState } from 'react';
import { Bell, CheckCircle2, ClipboardCheck, FileBadge, FileText, Printer, ReceiptText, Search, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../i18n.jsx';
import { officeModules, officeTasks, receiptQueue } from '../data.js';
import { GlassCard } from '../GlassCard.jsx';

export function StaffPortal({ onBack }) {
  const [active, setActive] = useState('receipts');
  const { t } = useLanguage();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('goodMorning') : hour < 18 ? t('goodAfternoon') : t('goodEvening');

  const tabs = [
    ['receipts', ReceiptText],
    ['admissions', ClipboardCheck],
    ['certificates', FileBadge],
    ['records', FileText],
    ['visitorPass', ShieldCheck],
    ['officeWorks', Bell],
  ];

  return (
    <main className="app-shell staff-shell">
      <header className="portal-header fade-in-down">
        <button className="ghost-button" type="button" onClick={onBack}>{t('back')}</button>
        <div className="header-greeting">
          <span>{greeting}, {t('staffOffice')}</span>
          <h2>Vidya Setu</h2>
        </div>
        <div className="header-actions">
          <button className="notification-btn animate-pulse-soft" type="button">
            <Bell size={22} className="animate-ring" />
            <span className="notification-badge" />
          </button>
          <div className="teacher-avatar">SK</div>
        </div>
      </header>

      <section className="staff-layout">
        <GlassCard className="staff-hero fade-in-up" style={{ animationDelay: '0.05s' }}>
          <span>{t('clerkDesk')}</span>
          <h1>{t('feeCounter')}</h1>
          <p>{t('todayReceipts')}: 42 · {t('pendingTasks')}: 11</p>
        </GlassCard>

        <nav className="staff-tabs fade-in-up" style={{ animationDelay: '0.1s' }} aria-label={t('staffOffice')}>
          {tabs.map(([id, Icon]) => (
            <button key={id} className={active === id ? 'active' : ''} type="button" onClick={() => setActive(id)}>
              <Icon size={19} />
              <span>{t(id)}</span>
            </button>
          ))}
        </nav>

        <div className="office-module-grid fade-in-up" style={{ animationDelay: '0.15s' }}>
          {officeModules.map((module) => {
            const Icon = module.icon;
            return (
              <button key={module.key} className={`office-module ${module.tone}`} type="button" onClick={() => setActive(module.key)}>
                <Icon size={28} />
                <span>{t(module.key)}</span>
                <strong>{module.count}</strong>
              </button>
            );
          })}
        </div>

        <div key={active} className="fade-in-up active-view-wrapper" style={{ animationDelay: '0.2s' }}>
          {active === 'receipts' && <ReceiptDesk />}
          {active !== 'receipts' && <OfficeWorkPanel active={active} />}
        </div>
      </section>
    </main>
  );
}

function ReceiptDesk() {
  const { t } = useLanguage();

  return (
    <div className="receipt-layout">
      <GlassCard className="receipt-printer fade-in-up" style={{ animationDelay: '0.1s' }}>
        <ReceiptText size={44} />
        <span>{t('receipts')}</span>
        <h2>VS-2026-1043</h2>
        <p>Aarav Hegde · {t('class')} 5A · ₹ 8,500</p>
        <button type="button" onClick={() => window.print()}><Printer size={18} /> {t('printReceipt')}</button>
      </GlassCard>

      <GlassCard className="receipt-queue fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="panel-title">
          <h3>{t('todayReceipts')}</h3>
          <label className="mini-search"><Search size={16} /><input placeholder={t('search')} /></label>
        </div>
        {receiptQueue.map((receipt) => (
          <article key={receipt.receiptNo}>
            <div>
              <strong>{receipt.student}</strong>
              <span>{receipt.receiptNo} · {receipt.className}</span>
            </div>
            <div>
              <strong>{receipt.amount}</strong>
              <span>{receipt.mode === 'UPI' ? 'UPI' : t(receipt.mode)}</span>
            </div>
            <button type="button"><Printer size={16} /> {t(receipt.status)}</button>
          </article>
        ))}
      </GlassCard>
    </div>
  );
}

function OfficeWorkPanel({ active }) {
  const { t } = useLanguage();

  return (
    <div className="office-work-layout">
      <GlassCard className="office-work-card fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="panel-title">
          <h3>{t(active)}</h3>
          <button type="button"><CheckCircle2 size={18} /> {t('save')}</button>
        </div>
        <div className="office-form-grid">
          <label><span>{t('studentName')}</span><input defaultValue="Ananya Rao" /></label>
          <label><span>{t('class')}</span><input defaultValue="5A" /></label>
          <label><span>{t('requestType')}</span><input defaultValue={t(active)} /></label>
          <label><span>{t('status')}</span><input defaultValue={t('readyForApproval')} /></label>
        </div>
        <textarea defaultValue={t('officeNote')} />
      </GlassCard>

      <GlassCard className="office-task-list fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3>{t('pendingTasks')}</h3>
        {officeTasks.map((task) => (
          <p key={task}><CheckCircle2 size={17} /> {task}</p>
        ))}
      </GlassCard>
    </div>
  );
}
