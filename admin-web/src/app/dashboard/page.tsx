'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  Users, UserSquare2, CalendarCheck, UserMinus, 
  CheckSquare, Award, BookOpen, FileText, 
  BellRing, Lightbulb, Banknote, CheckCircle, 
  MessageCircle, Fingerprint, CalendarClock,
  Search, ShieldAlert, Sparkles, X, ChevronRight, Activity, TrendingUp, Clock, Lock, BrainCircuit, Upload, Globe
} from 'lucide-react';
import { 
  FeePaymentIcon, ProfileIcon, RemarksIcon, AbsentInfoIcon, 
  StudyMaterialIcon, LateComerIcon, NotificationIcon, CalendarIcon, 
  CetRegistrationIcon, UpcomingEventsIcon, BiometricsIcon, GradesIcon, 
  TransportIcon, DiaryIcon, AnalyticsIcon, SettingsIcon, 
  LogoutIcon, AttendanceIcon, SuggestionIcon, NightModeIcon, 
  BellIcon, StaffIcon, CalculatorIcon, SystemIcon, DocumentIcon, SunIcon 
} from '@/components/GridIcons';

interface Module {
  id: string;
  title: string;
  icon: any;
  color: string;
  bgHex: string;
  href: string;
  category: 'admin' | 'academics' | 'ecosystem' | 'communication';
  allowedRoles: string[];
}

// Category-Coded Accent System
const DASHBOARD_MODULES: Module[] = [
  // Administration & HR (Violet/Indigo)
  { id: 'students', title: 'Students Info', icon: ProfileIcon, color: '', bgHex: '', category: 'admin', href: '/dashboard/students', allowedRoles: ['principal', 'teacher', 'clerk'] },
  { id: 'staff', title: 'Staff Info', icon: StaffIcon, color: '', bgHex: '', category: 'admin', href: '/dashboard/staff', allowedRoles: ['principal', 'clerk'] },
  { id: 'salary', title: 'My Salary Slip', icon: FeePaymentIcon, color: '', bgHex: '', category: 'admin', href: '/dashboard/payroll', allowedRoles: ['principal', 'teacher', 'clerk', 'counselor'] },
  { id: 'ai_insights', title: 'AI Command Center', icon: SystemIcon, color: '', bgHex: '', category: 'admin', href: '/dashboard/ai-insights', allowedRoles: ['principal'] },
  { id: 'staff_attendance', title: 'Staff Attendance', icon: BiometricsIcon, color: '', bgHex: '', category: 'admin', href: '#', allowedRoles: ['principal', 'clerk'] },

  // Academic Operations (Emerald/Teal)
  { id: 'attendance', title: 'Take Attendance', icon: AttendanceIcon, color: '', bgHex: '', category: 'academics', href: '/dashboard/attendance', allowedRoles: ['principal', 'teacher'] },
  { id: 'absent', title: 'Absent Info', icon: AbsentInfoIcon, color: '', bgHex: '', category: 'academics', href: '/dashboard/attendance', allowedRoles: ['principal', 'teacher'] },
  { id: 'classes', title: 'Classes & Timetable', icon: CalendarIcon, color: '', bgHex: '', category: 'academics', href: '/dashboard/classes', allowedRoles: ['principal', 'teacher', 'student', 'parent'] },
  { id: 'work_done', title: 'Work Done', icon: DocumentIcon, color: '', bgHex: '', category: 'academics', href: '#', allowedRoles: ['teacher'] },
  { id: 'homework', title: 'Homework Upload', icon: Upload, color: '', bgHex: '', category: 'academics', href: '/dashboard/homework', allowedRoles: ['teacher', 'principal'] },
  { id: 'study_material', title: 'Study Material Upload', icon: StudyMaterialIcon, color: '', bgHex: '', category: 'academics', href: '/dashboard/study-material', allowedRoles: ['principal', 'teacher'] },

  // Student Ecosystem (Amber/Cyan)
  { id: 'exam_marks', title: 'Exam Marks', icon: GradesIcon, color: '', bgHex: '', category: 'ecosystem', href: '/dashboard/grades', allowedRoles: ['principal', 'teacher', 'student', 'parent'] },
  { id: 'diary', title: 'Daily Diary', icon: DiaryIcon, color: '', bgHex: '', category: 'ecosystem', href: '/dashboard/diary', allowedRoles: ['principal', 'teacher', 'student', 'parent'] },
  { id: 'documents', title: 'Document Approvals', icon: CetRegistrationIcon, color: '', bgHex: '', category: 'ecosystem', href: '/dashboard/approvals', allowedRoles: ['principal', 'teacher', 'clerk', 'parent', 'student'] },

  // Communication (Fuchsia/Sky)
  { id: 'chat', title: 'Chat / Connect', icon: NotificationIcon, color: '', bgHex: '', category: 'communication', href: '/dashboard/messages', allowedRoles: ['principal', 'teacher', 'student', 'parent'] },
  { id: 'notifications', title: 'Send Notification', icon: BellIcon, color: '', bgHex: '', category: 'communication', href: '/dashboard/notices', allowedRoles: ['principal', 'teacher', 'clerk'] },
  { id: 'suggestions', title: 'Suggestions', icon: SuggestionIcon, color: '', bgHex: '', category: 'communication', href: '#', allowedRoles: ['principal', 'counselor'] },
];

const CATEGORIES = {
  admin: { title: 'Administration & HR', border: 'border-indigo-100', text: 'text-indigo-800' },
  academics: { title: 'Academic Operations', border: 'border-emerald-100', text: 'text-emerald-800' },
  ecosystem: { title: 'Student Ecosystem', border: 'border-amber-100', text: 'text-amber-800' },
  communication: { title: 'Communication', border: 'border-fuchsia-100', text: 'text-fuchsia-800' },
};

export default function DashboardOverview() {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [askVidyaQuery, setAskVidyaQuery] = useState('');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotLoading, setCopilotLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col gap-8 pb-32 max-w-[1400px] mx-auto w-full">
        {/* Skeleton Topbar */}
        <div className="flex justify-between items-center bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
          <div>
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg mb-2" />
            <div className="h-4 w-32 bg-gray-100 animate-pulse rounded-md" />
          </div>
          <div className="h-12 w-full md:w-[400px] bg-gray-100 animate-pulse rounded-full hidden md:block" />
        </div>
        {/* Skeleton Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-[20px] p-5 h-[140px] flex flex-col gap-4 border border-gray-100 shadow-sm animate-pulse">
              <div className="w-14 h-14 bg-gray-100 rounded-[16px]" />
              <div className="h-4 bg-gray-100 w-3/4 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleAskVidya = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askVidyaQuery.trim()) return;
    setIsCopilotOpen(true);
    setCopilotLoading(false); // Instant load
  };

  const availableModules = DASHBOARD_MODULES.filter(m => m.allowedRoles.includes(user.role));

  return (
    <div className="flex flex-col gap-8 pb-32 max-w-[1400px] mx-auto w-full relative">
      
      {/* Ask Vidya Copilot Panel (Living Glass) */}
      <AnimatePresence>
        {isCopilotOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white/70 backdrop-blur-[20px] border-l border-white/50 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <div className="flex items-center gap-2 text-interactive-blue">
                <Sparkles size={20} />
                <h3 className="font-bold font-display text-lg">Ask Vidya</h3>
              </div>
              <button onClick={() => setIsCopilotOpen(false)} className="p-2 bg-gray-100/50 hover:bg-gray-200 rounded-full transition-colors text-ink-secondary">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              {copilotLoading ? (
                <div className="flex flex-col gap-4">
                  <div className="h-24 w-full bg-gray-200 animate-pulse rounded-2xl" />
                  <div className="h-12 w-3/4 bg-gray-200 animate-pulse rounded-2xl" />
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                    <p className="text-sm font-medium text-blue-900 leading-relaxed">
                      "According to today's logs, Class 8A currently has 3 absentees. 92% of the class is present."
                    </p>
                  </div>
                  <button className="text-sm font-bold text-interactive-blue flex items-center gap-1 hover:underline">
                    View detailed absentee list <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Greeting & Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-ink-primary font-display tracking-tight">
            {t('welcomeBack')}, {user.name.split(' ')[0]}
          </h2>
          <p className="text-sm font-medium text-ink-secondary mt-1">
            {new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'kn-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Ask Vidya NLP Field */}
          <form onSubmit={handleAskVidya} className="relative w-full md:w-[350px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-interactive-blue">
              <Sparkles size={18} />
            </div>
            <input 
              type="text" 
              placeholder={t('askVidya')}
              value={askVidyaQuery}
              onChange={(e) => setAskVidyaQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-3 text-sm font-medium text-ink-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-interactive-blue/20 focus:border-interactive-blue focus:bg-white transition-all shadow-inner"
            />
          </form>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
            className="hidden md:flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-ink-primary rounded-full transition-all font-bold tracking-widest text-xs uppercase"
          >
            <Globe size={16} />
            {lang === 'en' ? 'ಕನ್ನಡ' : 'ENGLISH'}
          </button>
        </div>
      </div>

      {/* 2. Priority Insight Row (Hero Tiles) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.role === 'principal' && (
          <>
            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-emerald-100 flex flex-col justify-between group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">{t('todayAttendance')}</span>
                <div className="p-2 bg-emerald-50 rounded-full text-emerald-600"><Activity size={18} /></div>
              </div>
              <div className="mt-4">
                <h3 className="text-4xl font-black text-ink-primary tracking-tighter">94.2%</h3>
                <p className="text-sm font-medium text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp size={14} /> +1.2% {t('fromYesterday')}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-amber-100 flex flex-col justify-between group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">{t('feeCollection')}</span>
                <div className="p-2 bg-amber-50 rounded-full text-amber-600"><Banknote size={18} /></div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-black text-ink-primary tracking-tighter">₹1.2M</h3>
                <div className="w-full h-2 bg-amber-100 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-amber-500 w-[65%] rounded-full" />
                </div>
                <p className="text-xs font-bold text-ink-secondary mt-2">65% {t('monthlyTarget')}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-red-100 flex flex-col justify-between group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">{t('pendingActions')}</span>
                <div className="p-2 bg-red-50 rounded-full text-red-600"><Clock size={18} /></div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="text-4xl font-black text-ink-primary tracking-tighter">3</h3>
                <button className="text-sm font-bold px-4 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors">
                  {t('reviewLeaves')}
                </button>
              </div>
            </div>
          </>
        )}

        {user.role === 'teacher' && (
          <>
            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-indigo-100 md:col-span-2 flex items-center justify-between group cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300" onClick={() => router.push('/dashboard/attendance')}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">{t('actionRequired')}</span>
                <h3 className="text-3xl font-black text-ink-primary mt-2">{t('takeFirstPeriod')}</h3>
                <p className="text-sm font-medium text-ink-secondary mt-1">{t('classWaiting')}</p>
              </div>
              <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <CalendarCheck size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-emerald-100 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">{t('periodsCompleted')}</span>
              <div className="mt-2">
                <h3 className="text-4xl font-black text-ink-primary tracking-tighter">2<span className="text-2xl text-ink-secondary">/5</span></h3>
                <p className="text-sm font-medium text-ink-secondary mt-1">Next: Physics at 11:30 AM</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3 & 4. Categorized Module Clusters (Bento Grid) */}
      <div className="flex flex-col gap-12 mt-4">
        {(['admin', 'academics', 'ecosystem', 'communication'] as const).map(cat => {
          const categoryModules = availableModules.filter(m => m.category === cat);
          if (categoryModules.length === 0) return null;
          
          const style = CATEGORIES[cat];
          return (
            <div key={cat} className="flex flex-col gap-4">
              <h3 className={`text-sm font-bold font-display uppercase tracking-widest ${style.text} pl-2 border-l-4 ${style.border}`}>
                {style.title}
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                <AnimatePresence>
                  {categoryModules.map((module, i) => {
                    const Icon = module.icon;
                    return (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.25, ease: 'easeOut' }}
                        className="bg-white rounded-[20px] p-5 flex flex-col items-start gap-4 cursor-pointer shadow-sm border border-gray-100 group hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                        onClick={() => router.push(module.href)}
                      >
                        <div className="w-16 h-16 relative transition-transform duration-200 group-hover:scale-105">
                          <Icon />
                          {module.id === 'salary' && (
                            <div className="absolute top-1 right-1 text-gray-800 bg-white/80 backdrop-blur-md rounded-full p-0.5">
                              <Lock size={12} />
                            </div>
                          )}
                        </div>
                        
                        {/* 
                          Fixing the Text-Clipping Bug:
                          Using min-h-[3rem] (48px) ensures two-line wrapping fits without truncating ascenders.
                          leading-snug prevents overlapping descenders/ascenders.
                        */}
                        <span className="text-sm font-semibold font-display text-ink-primary leading-snug min-h-[3rem] flex items-center">
                          {t('mod_' + module.id)}
                        </span>
                        
                        {/* Salary slip specific enhancement */}
                        {module.id === 'salary' && (
                          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-[20px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-ink-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                              Unlock to view
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
