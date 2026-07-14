import { useState } from 'react';
import { Bell, CalendarDays, Megaphone, Plus, Send } from 'lucide-react';
import { useLanguage } from '../../i18n.jsx';
import { adminStats, faculty, principalNav, students } from '../data.js';
import { DataTable } from '../DataTable.jsx';
import { GlassCard } from '../GlassCard.jsx';
import { MiniChart } from '../MiniChart.jsx';
import { StatCard } from '../StatCard.jsx';

export function PrincipalDashboard({ onBack }) {
  const [active, setActive] = useState('overview');
  const { t } = useLanguage();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('goodMorning') : hour < 18 ? t('goodAfternoon') : t('goodEvening');

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span>VS</span><strong>Vidya Setu</strong></div>
        {principalNav.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={active === item.id ? 'active' : ''} type="button" onClick={() => setActive(item.id)}>
              <Icon size={19} /> {t(item.id)}
            </button>
          );
        })}
        <button className="ghost-button" type="button" onClick={onBack}>{t('backToRoles')}</button>
      </aside>
      <section className="admin-main">
        <header className="admin-header fade-in-down">
          <button className="ghost-button admin-back-mobile" type="button" onClick={onBack}>{t('back')}</button>
          <div className="header-greeting">
            <span>{greeting}, {t('principal')}</span>
            <h2>{t('principalControlRoom')}</h2>
          </div>
          <div className="header-actions">
            <button className="notification-btn animate-pulse-soft" type="button">
              <Bell size={22} className="animate-ring" />
              <span className="notification-badge" />
            </button>
            <button type="button" className="primary-action"><Plus size={18} /> {t('add')}</button>
          </div>
        </header>
        <div className="admin-mobile-nav-wrap">
          <span>{t('managementSections')}</span>
          <nav className="admin-mobile-nav" aria-label="Principal sections">
            {principalNav.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} className={active === item.id ? 'active' : ''} type="button" onClick={() => setActive(item.id)}>
                  <Icon size={18} />
                  <span>{t(item.id)}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div key={active} className="fade-in-up active-view-wrapper">
          {active === 'overview' && <OverviewPanel />}
          {active === 'students' && <StudentManagement />}
          {active === 'faculty' && <FacultyManagement />}
          {active === 'finance' && <FeeManagement />}
          {active === 'academics' && <AcademicsPanel />}
          {active === 'communication' && <CommunicationPanel />}
          {active === 'calendar' && <SimplePanel icon={CalendarDays} title={t('calendar')} lines={[t('calendarMidterm'), t('calendarRajyotsava'), t('calendarPtm')]} />}
          {active === 'transport' && <SimplePanel title={t('transport')} lines={[t('routesActive'), t('busesOnTime'), t('vehiclesService')]} />}
          {active === 'settings' && <SimplePanel title={t('settings')} lines={[t('schoolProfile'), t('rolePermissions'), t('languageDefaults'), t('academicYearSetup')]} />}
        </div>
      </section>
    </main>
  );
}

function OverviewPanel() {
  const { t } = useLanguage();
  return (
    <div className="admin-grid">
      <GlassCard className="principal-hero-card fade-in-up" style={{ animationDelay: '0.02s' }}>
        <span>{t('todaySnapshot')}</span>
        <h1>95.2%</h1>
        <p>{t('presentToday')} · {t('feeCollection')} 86% · {t('pendingFees')} 142</p>
      </GlassCard>
      <div className="stats-grid fade-in-up" style={{ animationDelay: '0.05s' }}>
        {adminStats.map((stat) => <StatCard key={stat.key} {...stat} label={t(stat.key)} />)}
      </div>
      <GlassCard className="wide-panel fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="panel-title"><h3>{t('attendanceTrend')}</h3><span>{t('last30Days')}</span></div>
        <MiniChart />
      </GlassCard>
      <GlassCard className="fade-in-up" style={{ animationDelay: '0.15s' }}>
        <div className="panel-title"><h3>{t('classStrength')}</h3><span>{t('live')}</span></div>
        <MiniChart type="donut" />
      </GlassCard>
      <GlassCard className="activity-panel fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="panel-title"><h3>{t('recentActivity')}</h3><span>{t('quickReview')}</span></div>
        {['admissionApproved', 'feeReceiptIssued', 'broadcastSent', 'busDelayed'].map((item) => <p key={item}><Bell size={16} /> {t(item)}</p>)}
      </GlassCard>
    </div>
  );
}

function StudentManagement() {
  const { t } = useLanguage();
  const columns = [t('name'), t('class'), t('attendance'), t('fees'), t('guardian')];
  const rows = students.map((student) => ({
    [columns[0]]: student.name,
    [columns[1]]: student.className,
    [columns[2]]: student.attendance,
    [columns[3]]: student.fees,
    [columns[4]]: student.guardian,
  }));
  return (
    <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}

function FacultyManagement() {
  const { t } = useLanguage();
  const columns = [t('name'), t('role'), t('load'), t('status')];
  const rows = faculty.map((member) => ({
    [columns[0]]: member.name,
    [columns[1]]: member.role,
    [columns[2]]: member.load,
    [columns[3]]: member.status,
  }));
  return (
    <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}

function FeeManagement() {
  const { t } = useLanguage();
  return (
    <div className="admin-grid">
      <GlassCard className="wide-panel fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="panel-title"><h3>{t('classWiseCollection')}</h3><span>86% {t('collected')}</span></div>
        <MiniChart type="bar" />
      </GlassCard>
      <GlassCard className="defaulter-list fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3>{t('priorityFollowUp')}</h3>
        {students.filter((student) => student.fees !== 'Paid').map((student) => (
          <p key={student.name}><strong>{student.name}</strong><span>{student.className} · {student.fees}</span></p>
        ))}
      </GlassCard>
    </div>
  );
}

function AcademicsPanel() {
  const { t } = useLanguage();
  return (
    <div className="admin-grid">
      <GlassCard className="wide-panel fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="panel-title"><h3>{t('examPerformance')}</h3><span>Unit Test 2</span></div>
        <MiniChart />
      </GlassCard>
      <SimplePanel title={t('topPerformers')} lines={['Ananya Rao · 96%', 'Diya Gowda · 94%', 'Meera Shetty · 92%']} />
    </div>
  );
}

function CommunicationPanel() {
  const { t } = useLanguage();
  return (
    <div className="admin-grid">
      <GlassCard className="compose-panel wide-panel fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="panel-title"><h3>{t('broadcast')}</h3><span>{t('targetAudience')}</span></div>
        <div className="form-row">
          <select><option>{t('allParents')}</option><option>{t('class')} 5A</option><option>{t('faculty')}</option></select>
          <select><option>English + Kannada</option></select>
        </div>
        <textarea defaultValue={t('regularSchoolDay')} />
        <button className="primary-action" type="button"><Send size={18} /> {t('broadcast')}</button>
      </GlassCard>
      <GlassCard className="fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3>{t('messageHistory')}</h3>
        {['holidayCircular', 'feeReminder', 'sportsDayUpdate'].map((item) => <p key={item}><Megaphone size={16} /> {t(item)}</p>)}
      </GlassCard>
    </div>
  );
}

function SimplePanel({ icon: Icon, title, lines }) {
  return (
    <GlassCard className="simple-panel fade-in-up" style={{ animationDelay: '0.15s' }}>
      {Icon ? <Icon size={32} /> : null}
      <h3>{title}</h3>
      {lines.map((line) => <p key={line}>{line}</p>)}
    </GlassCard>
  );
}
