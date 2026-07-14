import { useState } from 'react';
import {
  BadgeIndianRupee,
  Bell,
  Bus,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Star,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../../i18n.jsx';
import { BottomNav } from '../BottomNav.jsx';
import { child, attendanceDays, diaryEntries, gradeCards, notifications, parentTabs, quickReplies } from '../data.js';
import { GlassCard } from '../GlassCard.jsx';
import { IconButton } from '../IconButton.jsx';

export function ParentPortal({ onBack }) {
  const [active, setActive] = useState('home');
  const { t } = useLanguage();

  const screens = {
    home: <ParentHome setActive={setActive} />,
    attendance: <AttendanceView />,
    diary: <ParentDiaryView />,
    grades: <GradesView />,
    fees: <FeesView />,
    transport: <TransportView />,
    messages: <MessagesView />,
  };

  return (
    <main className="app-shell parent-shell">
      <PortalHeader title={t('parent')} onBack={onBack} />
      <section className="parent-content">
        <div key={active} className="fade-in-up active-view-wrapper">
          {screens[active]}
        </div>
      </section>
      <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
        <BottomNav active={active} setActive={setActive} />
      </div>
    </main>
  );
}

function PortalHeader({ title, onBack }) {
  const { t } = useLanguage();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('goodMorning') : hour < 18 ? t('goodAfternoon') : t('goodEvening');

  return (
    <header className="portal-header fade-in-down">
      <button className="ghost-button" type="button" onClick={onBack}>{t('back')}</button>
      <div className="header-greeting">
        <span>{greeting}, {title}</span>
        <h2>Vidya Setu</h2>
      </div>
      <div className="header-actions">
        <button className="notification-btn animate-pulse-soft" type="button">
          <Bell size={22} className="animate-ring" />
          <span className="notification-badge" />
        </button>
        <img src={child.photo} alt="" className="avatar-img" />
      </div>
    </header>
  );
}

function ParentHome({ setActive }) {
  const { t } = useLanguage();
  return (
    <div className="parent-grid">
      <section className="mobile-greeting fade-in-up" style={{ animationDelay: '0.05s' }}>
        <span>{t('today')}</span>
        <h1>{child.name}</h1>
        <p>{child.className} · Vidya Setu</p>
      </section>

      <GlassCard className="child-card fade-in-up" style={{ animationDelay: '0.1s' }}>
        <img src={child.photo} alt="" />
        <div>
          <span>{child.className}</span>
          <h3>{child.name}</h3>
          <p><CheckCircle2 size={20} /> {t('today')}: {t('present')}</p>
        </div>
      </GlassCard>

      <div className="status-deck fade-in-up" style={{ animationDelay: '0.2s' }}>
        <button className="status-pill success" type="button" onClick={() => setActive('attendance')}>
          <CheckCircle2 size={24} />
          <span>{t('attendance')}</span>
          <strong>{t('present')}</strong>
        </button>
        <button className="status-pill warning" type="button" onClick={() => setActive('transport')}>
          <Bus size={24} />
          <span>{t('transport')}</span>
          <strong>12 min</strong>
        </button>
        <button className="status-pill danger" type="button" onClick={() => setActive('fees')}>
          <BadgeIndianRupee size={24} />
          <span>{t('fees')}</span>
          <strong>₹8,500</strong>
        </button>
      </div>

      <div className="section-heading fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div>
          <span>{t('oneTap')}</span>
          <h2>{t('parentActions')}</h2>
        </div>
      </div>

      <div className="parent-actions fade-in-up" style={{ animationDelay: '0.35s' }}>
        {parentTabs.slice(1).map((tab) => (
          <IconButton key={tab.id} icon={tab.icon} label={tab.label} sublabel={tab.kn} onClick={() => setActive(tab.id)} />
        ))}
      </div>

      <GlassCard className="notice-strip fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h3>{t('notices')}</h3>
        {notifications.map((item) => (
          <article key={item.title} className={`notice-item ${item.type}`}>
            <Bell size={22} />
            <div>
              <strong>{item.title}</strong>
              <small>{item.kn}</small>
            </div>
          </article>
        ))}
      </GlassCard>

      <GlassCard className="event-card fade-in-up" style={{ animationDelay: '0.5s' }}>
        <CalendarCheck size={38} />
        <div>
          <span>{t('events')}</span>
          <h3>Kannada Rajyotsava</h3>
          <p>{t('eventTime')}</p>
        </div>
      </GlassCard>
    </div>
  );
}

function ParentDiaryView() {
  const { language, t } = useLanguage();
  const isKannada = language === 'kn';

  return (
    <div className="diary-parent-view">
      <GlassCard className="diary-parent-hero fade-in-up" style={{ animationDelay: '0.05s' }}>
        <span>{t('dailyDiary')}</span>
        <h2>{child.name}</h2>
        <p>{t('signDiary')} · {t('today')}</p>
      </GlassCard>
      <div className="parent-diary-list">
        {diaryEntries.slice(0, 2).map((entry, index) => (
          <GlassCard key={`${entry.className}-${entry.subject}`} className="parent-diary-card fade-in-up" style={{ animationDelay: `${0.12 + index * 0.08}s` }}>
            <div className="diary-subject-row">
              <div>
                <span>{entry.className}</span>
                <h3>{entry.subject}</h3>
              </div>
              <strong>{t('diarySigned')}</strong>
            </div>
            <section>
              <span>{t('activityDone')}</span>
              <p>{isKannada ? entry.activityKn : entry.activity}</p>
            </section>
            <section>
              <span>{t('homeworkGiven')}</span>
              <p>{isKannada ? entry.homeworkKn : entry.homework}</p>
            </section>
            <section className="teacher-note">
              <span>{t('teacherRemark')}</span>
              <p>{isKannada ? entry.remarkKn : entry.remark}</p>
            </section>
            <button className="primary-action" type="button">{t('signDiary')}</button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function AttendanceView() {
  const { t } = useLanguage();
  return (
    <div className="screen-stack">
      <GlassCard className="attendance-summary fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="progress-ring"><span>90%</span></div>
        <div>
          <h3>{t('attendance')}</h3>
          <p>{t('totalDays')}: 30 · {t('present')}: 25 · {t('absent')}: 3</p>
          <div className="legend-row">
            <span className="present-dot">{t('present')}</span>
            <span className="absent-dot">{t('absent')}</span>
            <span className="half-dot">{t('halfDay')}</span>
          </div>
        </div>
      </GlassCard>
      <GlassCard className="calendar-card fade-in-up" style={{ animationDelay: '0.2s' }}>
        {attendanceDays.map((item) => (
          <span key={item.day} className={item.state}>{item.day}</span>
        ))}
      </GlassCard>
    </div>
  );
}

function GradesView() {
  const { t } = useLanguage();
  return (
    <div className="grade-grid">
      {gradeCards.map((grade, i) => (
        <GlassCard key={grade.subject} className="grade-card fade-in-up" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
          <div className="grade-top">
            <h3>{grade.subject}</h3>
            <strong>{grade.score}%</strong>
          </div>
          <div className="stars">{'★'.repeat(grade.stars)}{'☆'.repeat(5 - grade.stars)}</div>
          <div className="mini-meter"><span style={{ width: `${grade.score}%` }} /></div>
          <p>{t('classAverage')}: {grade.average}%</p>
          <small className={grade.trend}>{grade.trend === 'improving' ? <TrendingUp size={16} /> : grade.trend === 'needsCare' ? <TrendingDown size={16} /> : <Star size={16} />} {t(grade.trend)}</small>
        </GlassCard>
      ))}
    </div>
  );
}

function FeesView() {
  const { t } = useLanguage();
  return (
    <div className="screen-stack">
      <GlassCard className="fee-hero fade-in-up" style={{ animationDelay: '0.1s' }}>
        <BadgeIndianRupee size={48} />
        <span>{t('partial')}</span>
        <h3>₹ 8,500</h3>
        <p>{t('dueDate')}: 15 July · 4 days left</p>
        <button type="button">{t('payNow')}</button>
      </GlassCard>
      <GlassCard className="timeline-card fade-in-up" style={{ animationDelay: '0.2s' }}>
        {['Admission fee paid', 'Term 1 paid', 'Transport pending'].map((item, index) => (
          <p key={item}><CheckCircle2 size={18} /> {item} <small>{index + 1} Jun</small></p>
        ))}
        <button className="secondary-action" type="button"><Download size={18} /> {t('receipt')}</button>
      </GlassCard>
    </div>
  );
}

function TransportView() {
  const { t } = useLanguage();
  return (
    <div className="screen-stack">
      <GlassCard className="bus-card fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Bus size={58} />
        <div>
          <span>Route 7 · KA 05 AB 7788</span>
          <h3>{t('onTheWay')}</h3>
          <p><Clock size={18} /> {t('arrivesIn')}: 12 min</p>
        </div>
      </GlassCard>
      <GlassCard className="map-card fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="map-path">
          <span className="pin home"><MapPin size={16} /></span>
          <span className="pin live"><Bus size={18} /></span>
          <span className="pin school"><MapPin size={16} /></span>
        </div>
        <div>
          <strong>{t('routePreview')}</strong>
          <span>{t('simpleTracker')}</span>
        </div>
      </GlassCard>
      <GlassCard className="driver-card fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div>
          <span>{t('driver')}</span>
          <h3>Manjunath K.</h3>
          <p>{t('pickup')} 7:42 AM · {t('drop')} 3:48 PM</p>
        </div>
        <button type="button"><Phone size={20} /> {t('call')}</button>
      </GlassCard>
      <div className="route-track fade-in-up" style={{ animationDelay: '0.4s' }}>
        <span className="done">{t('homeStop')}</span>
        <span className="live">{t('marketStop')}</span>
        <span>{t('schoolStop')}</span>
      </div>
    </div>
  );
}

function MessagesView() {
  const { t } = useLanguage();
  return (
    <div className="chat-view">
      <GlassCard className="chat-card fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="chat-header"><MessageCircle size={24} /> <strong>Meera Teacher</strong></div>
        <p className="bubble teacher">Ananya did well in Kannada reading today.</p>
        <p className="bubble parent">{t('thankYouTeacher')}</p>
        <div className="quick-replies">
          {quickReplies.map((reply) => <button key={reply} type="button">{reply}</button>)}
        </div>
        <label className="chat-input">
          <input placeholder={t('quickReply')} />
          <button type="button"><Send size={18} /></button>
        </label>
      </GlassCard>
    </div>
  );
}
