import { useState } from 'react';
import { Bell, BookOpen, CalendarDays, Check, ClipboardCheck, Edit3, Megaphone, NotebookPen, Save, Send, Timer, Users } from 'lucide-react';
import { useLanguage } from '../../i18n.jsx';
import { diaryEntries, parentMessageThreads, teacherStudents, timetable } from '../data.js';
import { GlassCard } from '../GlassCard.jsx';
import { IconButton } from '../IconButton.jsx';

export function TeacherPortal({ onBack }) {
  const [view, setView] = useState('home');
  const { t } = useLanguage();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('goodMorning') : hour < 18 ? t('goodAfternoon') : t('goodEvening');

  return (
    <main className="app-shell teacher-shell">
      <header className="portal-header fade-in-down">
        <button className="ghost-button" type="button" onClick={onBack}>{t('back')}</button>
        <div className="header-greeting">
          <span>{greeting}, {t('teacher')}</span>
          <h2>Vidya Setu Faculty</h2>
        </div>
        <div className="header-actions">
          <button className="notification-btn animate-pulse-soft" type="button">
            <Bell size={22} className="animate-ring" />
            <span className="notification-badge" />
          </button>
          <div className="teacher-avatar">MI</div>
        </div>
      </header>
      <section className="teacher-layout fade-in-up" style={{ animationDelay: '0.1s' }}>
        <aside className="teacher-tabs">
          {[
            ['home', BookOpen, t('today')],
            ['attendance', ClipboardCheck, t('markAttendance')],
            ['grades', Edit3, t('enterMarks')],
            ['messages', Send, t('messageParents')],
            ['diary', NotebookPen, t('dailyDiary')],
            ['timetable', CalendarDays, t('timetable')],
          ].map(([id, Icon, label]) => (
            <button key={id} className={view === id ? 'active' : ''} type="button" onClick={() => setView(id)}>
              <Icon size={20} /> {label}
            </button>
          ))}
        </aside>
        <div className="teacher-main">
          <div key={view} className="fade-in-up active-view-wrapper">
            {view === 'home' && <TeacherHome setView={setView} />}
            {view === 'attendance' && <MarkAttendance />}
            {view === 'grades' && <EnterGrades />}
            {view === 'messages' && <TeacherMessages />}
            {view === 'diary' && <DailyDiary />}
            {view === 'timetable' && <Timetable />}
          </div>
        </div>
      </section>
    </main>
  );
}

function TeacherHome({ setView }) {
  const { t } = useLanguage();
  return (
    <div className="teacher-home">
      <GlassCard className="teacher-hero-card fade-in-up" style={{ animationDelay: '0.05s' }}>
        <span>{t('nextPeriod')}</span>
        <h2>Kannada · Class 5A</h2>
        <p><Timer size={18} /> {t('startsIn')} 8 min</p>
      </GlassCard>
      <GlassCard className="schedule-card fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h3>{t('schedule')}</h3>
        {['09:00 Kannada 5A', '10:00 Math 5A', '11:15 Science 6B', '02:00 Parent meeting'].map((item) => (
          <p key={item}>{item}</p>
        ))}
      </GlassCard>
      <div className="teacher-actions fade-in-up" style={{ animationDelay: '0.15s' }}>
        <IconButton icon={ClipboardCheck} label={t('markAttendance')} onClick={() => setView('attendance')} />
        <IconButton icon={Edit3} label={t('enterMarks')} onClick={() => setView('grades')} />
        <IconButton icon={Send} label={t('messageParents')} onClick={() => setView('messages')} />
        <IconButton icon={NotebookPen} label={t('dailyDiary')} onClick={() => setView('diary')} />
        <IconButton icon={Megaphone} label={t('postNotice')} />
      </div>
      <GlassCard className="class-counts fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3>{t('class')}</h3>
        {['5A · 38 students', '6B · 41 students', '7C · 36 students'].map((item) => <span key={item}><Users size={18} /> {item}</span>)}
      </GlassCard>
      <GlassCard className="teacher-insights fade-in-up" style={{ animationDelay: '0.25s' }}>
        <h3>{t('classPulse')}</h3>
        <div><strong>96%</strong><span>{t('attendanceReady')}</span></div>
        <div><strong>14</strong><span>{t('pendingNotebooks')}</span></div>
      </GlassCard>
    </div>
  );
}

function TeacherMessages() {
  const { language, t } = useLanguage();
  const isKannada = language === 'kn';
  return (
    <div className="teacher-message-grid">
      <GlassCard className="message-compose fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="panel-title"><h3>{t('messageParents')}</h3><button type="button"><Send size={18} /> {t('sendMessage')}</button></div>
        <div className="form-row">
          <select><option>{t('classParents')}</option><option>{t('absentParents')}</option><option>{t('feePendingParents')}</option></select>
          <select><option>English + Kannada</option><option>{t('kannadaOnly')}</option></select>
        </div>
        <textarea defaultValue={t('teacherMessageDraft')} />
      </GlassCard>
      <GlassCard className="message-thread-list fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3>{t('parentMessages')}</h3>
        {parentMessageThreads.map((thread) => (
          <article key={thread.name}>
            <div>
              <strong>{thread.name}</strong>
              <span>{thread.child}</span>
            </div>
            <p>{isKannada ? thread.messageKn : thread.message}</p>
            <small>{isKannada ? thread.statusKn : thread.status}</small>
          </article>
        ))}
      </GlassCard>
    </div>
  );
}

function DailyDiary() {
  const { language, t } = useLanguage();
  const isKannada = language === 'kn';
  return (
    <div className="diary-layout">
      <GlassCard className="diary-compose fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="panel-title"><h3>{t('addDiary')}</h3><button type="button"><Save size={18} /> {t('save')}</button></div>
        <div className="form-row">
          <select><option>Class 5A</option><option>Class 6B</option><option>Class 7C</option></select>
          <select><option>Kannada</option><option>Math</option><option>Science</option></select>
        </div>
        <label>
          <span>{t('dayActivity')}</span>
          <textarea defaultValue={isKannada ? 'ಪಾಠ 4 ಓದಿದೆವು, ಕನ್ನಡ ಕೈ ಬರಹ ಪ್ರಾಕ್ಟೀಸ್ ಮಾಡಿದೆವು.' : 'Read lesson 4, practiced Kannada handwriting, and completed oral reading.'} />
        </label>
        <label>
          <span>{t('homework')}</span>
          <textarea defaultValue={isKannada ? 'ಪುಟ 42 ರಿಂದ 10 ಸಾಲು ಬರೆಯಬೇಕು. ಪೋಷಕರಿಂದ ಡೈರಿ ಸೈನ್ ಮಾಡಿಸಬೇಕು.' : 'Write 10 lines from page 42 and ask parent to sign the diary.'} />
        </label>
      </GlassCard>
      <GlassCard className="diary-list fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3>{t('classDiary')}</h3>
        {diaryEntries.map((entry) => (
          <article key={`${entry.className}-${entry.subject}`}>
            <strong>{entry.className} · {entry.subject}</strong>
            <p>{isKannada ? entry.activityKn : entry.activity}</p>
            <small>{t('homework')}: {isKannada ? entry.homeworkKn : entry.homework}</small>
          </article>
        ))}
      </GlassCard>
    </div>
  );
}

function MarkAttendance() {
  const { t } = useLanguage();
  const [absent, setAbsent] = useState(new Set(['Nikhil Patil']));
  return (
    <GlassCard className="mark-card fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="panel-title"><h3>{t('markAttendance')}</h3><button type="button"><Check size={18} /> {t('allPresent')}</button></div>
      {teacherStudents.map((student) => (
        <button
          key={student}
          className={`student-row ${absent.has(student) ? 'absent' : 'present'}`}
          type="button"
          onClick={() => setAbsent((current) => {
            const next = new Set(current);
            next.has(student) ? next.delete(student) : next.add(student);
            return next;
          })}
        >
          <span>{student}</span>
          <strong>{absent.has(student) ? t('absent') : t('present')}</strong>
        </button>
      ))}
      <button className="primary-action" type="button">{t('submit')}</button>
    </GlassCard>
  );
}

function EnterGrades() {
  const { t } = useLanguage();
  return (
    <GlassCard className="grade-entry fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="panel-title"><h3>{t('enterMarks')}</h3><button type="button"><Save size={18} /> {t('save')}</button></div>
      <div className="form-row">
        <select><option>{t('subject')}: Kannada</option></select>
        <select><option>{t('exam')}: Unit Test 2</option></select>
      </div>
      {teacherStudents.map((student, index) => (
        <label key={student} className="marks-row">
          <span>{student}</span>
          <input type="number" defaultValue={88 - index * 3} aria-label={`${student} ${t('score')}`} />
        </label>
      ))}
    </GlassCard>
  );
}

function Timetable() {
  return (
    <GlassCard className="timetable-card fade-in-up" style={{ animationDelay: '0.1s' }}>
      {timetable.map((day, dayIndex) => (
        <div key={dayIndex} className="time-row">
          <strong>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][dayIndex]}</strong>
          {day.map((period) => <span key={`${dayIndex}-${period}`}>{period}</span>)}
        </div>
      ))}
    </GlassCard>
  );
}
