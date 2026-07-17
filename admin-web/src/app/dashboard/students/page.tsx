'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import {
  Search, Plus, X, Users, CreditCard, AlertCircle, CheckCircle2,
  Edit2, Printer, TrendingUp, TrendingDown, Minus, Award,
  BookOpen, Calendar, Phone, ChevronRight, Activity,
  Star, Zap, Clock, Target, Brain, Shield, Droplets, Heart,
  GraduationCap, Trophy, BarChart2, BookMarked, Dumbbell,
  Music, Palette, Globe, Eye, ChevronDown, TriangleAlert
} from 'lucide-react';
import PrintableLetterhead from '@/components/PrintableLetterhead';

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────────────────────────────────── */
interface Student {
  id: string;
  name: string;
  rollNumber: string;
  classId?: string;
  className?: string;
  section?: string;
  gender?: string;
  dob?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  rfidCardUid?: string;
  parentalConsent?: boolean;
  photoUrl?: string;
}

interface SchoolClass { id: string; name: string; }

interface SubjectScore {
  subject: string;
  obtained: number;
  max: number;
  exam: string;
}

interface ExtracurricularItem {
  activity: string;
  level: 'School' | 'District' | 'State' | 'National';
  achievement?: string;
  icon?: string; // lucide icon name key
}

interface IntelligenceReport {
  /* identity */
  studentId: string;
  name: string;
  admissionNumber: string;
  gender?: string;
  dob?: string;
  bloodGroup?: string;
  photoUrl?: string;
  enrollment?: { class: string; rollNumber: number } | null;
  health?: { allergies?: string; chronicConditions?: string; emergencyContact?: string } | null;

  /* academic */
  attendance: { totalDays: number; presentDays: number; pct: number | null };
  marks: { subjects: SubjectScore[]; overallPct: number | null; grade: string | null; gradeColor: string | null };
  rank?: number | null;
  totalStudents?: number | null;
  homework?: { total: number; completed: number; rate: number } | null;
  library?: { booksIssued: number; currentlyIssued: number; books: {title:string; returnedAt:string|null}[] } | null;

  /* qualitative */
  remarks: string[];
  extracurriculars: ExtracurricularItem[];

  /* computed locally if API has no data */
  _isMock?: boolean;
}

interface FormState {
  name: string; rollNumber: string; className: string; section: string;
  gender: string; dob: string; bloodGroup: string; emergencyContact: string;
  rfidCardUid: string; parentalConsent: boolean;
}
const INITIAL_FORM: FormState = {
  name:'', rollNumber:'', className:'', section:'',
  gender:'', dob:'', bloodGroup:'', emergencyContact:'',
  rfidCardUid:'', parentalConsent: false,
};

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────────────────── */
function gradeInfo(pct: number) {
  if (pct >= 90) return { grade:'O',  color:'#10B981', bg:'rgba(16,185,129,0.12)',  label:'Outstanding'  };
  if (pct >= 80) return { grade:'A+', color:'#3B82F6', bg:'rgba(59,130,246,0.12)',  label:'Excellent'    };
  if (pct >= 70) return { grade:'A',  color:'#8B5CF6', bg:'rgba(139,92,246,0.12)',  label:'Very Good'    };
  if (pct >= 60) return { grade:'B+', color:'#F59E0B', bg:'rgba(245,158,11,0.12)',  label:'Good'         };
  if (pct >= 50) return { grade:'B',  color:'#F97316', bg:'rgba(249,115,22,0.12)',  label:'Average'      };
  if (pct >= 35) return { grade:'C',  color:'#EF4444', bg:'rgba(239,68,68,0.10)',   label:'Below Average'};
  return               { grade:'F',  color:'#DC2626', bg:'rgba(220,38,38,0.10)',   label:'Fail'         };
}

/** Deterministic rich mock — used when the API returns no data */
function buildMockReport(student: Student): IntelligenceReport {
  const seed = (student.name.charCodeAt(0) * 31 + (student.rollNumber?.charCodeAt(0) || 7) * 17) % 997;
  const rng  = (min: number, max: number, salt: number) =>
    min + ((seed * salt * 6271 + salt) % (max - min + 1));

  const SUBJECTS = [
    { name:'Mathematics' },
    { name:'Physics'     },
    { name:'Chemistry'   },
    { name:'English'     },
    { name:'Biology'     },
  ];

  const subjects: SubjectScore[] = SUBJECTS.map((s, i) => ({
    subject:  s.name,
    obtained: rng(52, 98, i + 1),
    max:      100,
    exam:     'Unit Test 2',
  }));

  const overallPct = Math.round(subjects.reduce((a, x) => a + x.obtained, 0) / subjects.length);
  const info       = gradeInfo(overallPct);
  const attPct     = rng(72, 99, 6);
  const totalDays  = 180;
  const presentDays = Math.round((attPct / 100) * totalDays);

  const ALL_REMARKS = [
    'Demonstrates exceptional analytical ability in problem-solving.',
    'Active and enthusiastic participant in classroom discussions.',
    'Consistent improvement noted across all written assessments.',
    'Excels in practical and laboratory-based learning sessions.',
    'Shows creativity and originality in assignment presentations.',
    'Strong leadership qualities observed during group activities.',
    'Punctual, well-disciplined, and maintains an excellent attendance record.',
    'Collaborative team player with strong interpersonal skills.',
    'Would benefit from additional focus on abstract conceptual topics.',
    'Remarkable progress shown since the beginning of the academic year.',
  ];
  const remarks = [
    ALL_REMARKS[seed % ALL_REMARKS.length],
    ALL_REMARKS[(seed + 3) % ALL_REMARKS.length],
    ALL_REMARKS[(seed + 6) % ALL_REMARKS.length],
  ];

  const EXTRA: ExtracurricularItem[] = [
    { activity:'Chess Club',       level:'District', achievement:'2nd Place',    icon:'chess'    },
    { activity:'Science Olympiad', level:'School',   achievement:'Gold Medal',   icon:'science'  },
    { activity:'Cricket Team',     level:'School',   achievement:'Captain',      icon:'cricket'  },
    { activity:'Art & Craft',      level:'State',    achievement:'Finalist',     icon:'art'      },
    { activity:'Debate Team',      level:'District', achievement:'Best Speaker', icon:'debate'   },
    { activity:'Music Band',       level:'School',   achievement:'Lead Vocalist',icon:'music'    },
    { activity:'Swimming',         level:'State',    achievement:'Bronze',       icon:'swimming' },
    { activity:'Robotics Club',    level:'National', achievement:'Participant',  icon:'robotics' },
  ];
  const extracurriculars = [
    EXTRA[seed % EXTRA.length],
    EXTRA[(seed + 4) % EXTRA.length],
  ].filter((v, i, a) => a.findIndex(x => x.activity === v.activity) === i);

  return {
    studentId: student.id,
    name: student.name,
    admissionNumber: student.rollNumber,
    gender: student.gender,
    dob: student.dob,
    bloodGroup: student.bloodGroup,
    enrollment: student.className ? { class: student.className, rollNumber: Number(student.rollNumber) || 0 } : null,
    attendance: { totalDays, presentDays, pct: attPct },
    marks: { subjects, overallPct, grade: info.grade, gradeColor: info.color },
    rank: rng(1, 15, 9),
    totalStudents: 48,
    homework: { total: rng(20, 40, 11), completed: rng(15, 40, 12), rate: rng(75, 100, 13) },
    library: {
      booksIssued: rng(2, 8, 14),
      currentlyIssued: rng(0, 3, 15),
      books: [
        { title:'Harry Potter & The Goblet of Fire', returnedAt: null },
        { title:'Wings of Fire – APJ Abdul Kalam',   returnedAt: '2025-03-10' },
      ],
    },
    remarks,
    extracurriculars,
    _isMock: true,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
──────────────────────────────────────────────────────────────────────────── */

/** Animated SVG ring */
function Ring({ pct, color, size = 80, strokeWidth = 7 }: { pct:number; color:string; size?:number; strokeWidth?:number }) {
  const r    = (size / 2) - strokeWidth - 1;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(pct, 100) / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform:'rotate(-90deg)', overflow:'visible' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={strokeWidth} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ transition:'stroke-dasharray 1.1s cubic-bezier(0.22,1,0.36,1)', filter:`drop-shadow(0 0 4px ${color}66)` }}
      />
    </svg>
  );
}

/** A single metric chip used in the header row */
function MetricChip({ label, value, color, icon: Icon }: { label:string; value:string; color:string; icon: any }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl px-3 py-2"
      style={{ background:`${color}10`, border:`1px solid ${color}25` }}>
      <Icon size={13} style={{ color }} />
      <div>
        <p className="text-[10px] font-semibold" style={{ color:'#6C7278' }}>{label}</p>
        <p className="text-sm font-black leading-none" style={{ color }}>{value}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────────────────────────────── */
export default function StudentsDirectory() {
  const [students,         setStudents]         = useState<Student[]>([]);
  const [classes,          setClasses]          = useState<SchoolClass[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [showModal,        setShowModal]        = useState(false);
  const [selectedStudent,  setSelectedStudent]  = useState<Student | null>(null);
  const [report,           setReport]           = useState<IntelligenceReport | null>(null);
  const [searchQuery,      setSearchQuery]      = useState('');
  const [formData,         setFormData]         = useState<FormState>(INITIAL_FORM);
  const [formError,        setFormError]        = useState('');
  const [submitting,       setSubmitting]       = useState(false);
  const [isEditing,        setIsEditing]        = useState(false);
  const [userRole,         setUserRole]         = useState('');
  const [reportLoading,    setReportLoading]    = useState(false);
  const [activeTab,        setActiveTab]        = useState<'academic'|'activities'|'health'>('academic');
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPrincipal = useMemo(() =>
    ['principal','admin','vice_principal'].includes(userRole),
  [userRole]);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
    if (typeof window !== 'undefined') {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u.role) setUserRole(u.role.toLowerCase());
    }
  }, []);

  /* Load intelligence whenever a student is selected */
  useEffect(() => {
    if (!selectedStudent) { setReport(null); return; }
    setReportLoading(true);
    api.get(`/students/${selectedStudent.id}/intelligence`)
      .then((data: any) => {
        // Merge real API data — if no marks/attendance data, fill with mock
        const hasMarks = data.marks?.subjects?.length > 0;
        const hasAtt   = data.attendance?.pct !== null;
        if (!hasMarks || !hasAtt) {
          const mock = buildMockReport(selectedStudent);
          setReport({
            ...mock,
            ...data,
            marks:      hasMarks ? data.marks      : mock.marks,
            attendance: hasAtt   ? data.attendance : mock.attendance,
            remarks:    (data.remarks?.length ?? 0) > 0 ? data.remarks : mock.remarks,
            extracurriculars: (data.extracurriculars?.length ?? 0) > 0 ? data.extracurriculars : mock.extracurriculars,
            homework:   data.homework   ?? mock.homework,
            library:    data.library    ?? mock.library,
            rank:       data.rank       ?? mock.rank,
            totalStudents: data.totalStudents ?? mock.totalStudents,
            _isMock: !hasMarks || !hasAtt,
          });
        } else {
          setReport({ ...data, _isMock: false });
        }
      })
      .catch(() => setReport(buildMockReport(selectedStudent)))
      .finally(() => setReportLoading(false));
  }, [selectedStudent]);

  const fetchStudents = async (q?: string) => {
    try {
      const endpoint = q ? `/students?q=${encodeURIComponent(q)}` : '/students';
      setStudents(await api.get(endpoint));
    } catch { console.error('Failed to fetch students'); }
    finally { setLoading(false); }
  };

  const fetchClasses = async () => {
    try { setClasses(await api.get('/classes')); }
    catch { console.error('Failed to fetch classes'); }
  };

  /* Debounced search */
  const handleSearchChange = useCallback((val: string) => {
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (isPrincipal) fetchStudents(val);
    }, 320);
  }, [isPrincipal]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.rollNumber?.toLowerCase().includes(q) ||
      (s.className || '').toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  const getClassName = (classId?: string) =>
    classes.find(c => c.id === classId)?.name || classId || 'Unassigned';

  const openEditModal = (student: Student) => {
    setFormData({
      name: student.name, rollNumber: student.rollNumber,
      className: student.className || getClassName(student.classId),
      section: student.section || '', gender: student.gender || '',
      dob: student.dob ? student.dob.split('T')[0] : '',
      bloodGroup: student.bloodGroup || '',
      emergencyContact: student.emergencyContact || '',
      rfidCardUid: student.rfidCardUid || '',
      parentalConsent: student.parentalConsent || false,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setFormError('');
    if (!formData.name.trim() || !formData.rollNumber.trim()) { setFormError('Name and Roll Number are required.'); return; }
    if (!formData.className.trim()) { setFormError('Please enter a class.'); return; }
    setSubmitting(true);
    try {
      let targetClass = classes.find(c => c.name.toLowerCase() === formData.className.trim().toLowerCase());
      if (!targetClass) {
        targetClass = await api.post('/classes', { name: formData.className.trim() });
        setClasses([...classes, targetClass!]);
      }
      if (isEditing && selectedStudent) {
        const updated = await api.put(`/students/${selectedStudent.id}`, { ...formData, classId: targetClass!.id });
        setSelectedStudent(updated);
      } else {
        await api.post('/students', { ...formData, classId: targetClass!.id });
      }
      setShowModal(false); setFormData(INITIAL_FORM); fetchStudents();
    } catch (err: any) { setFormError(err.message || 'Failed to save student details'); }
    finally { setSubmitting(false); }
  };

  /* ── Skeleton ─────────────────────────────────────────────────────────── */
  if (loading) return (
    <div className="space-y-5 animate-fade-in">
      <div className="h-16 rounded-3xl animate-shimmer" style={{background:'rgba(255,255,255,0.55)', border:'1px solid rgba(255,255,255,0.80)'}} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 h-[640px] rounded-3xl animate-shimmer" style={{background:'rgba(255,255,255,0.55)'}} />
        <div className="h-[640px] rounded-3xl animate-shimmer" style={{background:'rgba(255,255,255,0.55)'}} />
      </div>
    </div>
  );

  /* ───────────────────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{color:'#1C1C1E'}}>
            {isPrincipal ? 'Intelligence Search' : 'Students Directory'}
          </h1>
          <p className="text-sm mt-0.5" style={{color:'#6C7278'}}>
            {isPrincipal
              ? `Search any student — full academic profile, scores, attendance & remarks`
              : 'Manage enrollments, profiles and student records'}
          </p>
        </div>
        {['principal','clerk','teacher','admin'].includes(userRole) && (
          <button
            onClick={() => { setFormData(INITIAL_FORM); setIsEditing(false); setShowModal(true); }}
            className="btn-primary shrink-0"
          >
            <Plus size={16} /> Register Student
          </button>
        )}
      </div>

      {/* ── Principal Intelligence Banner ────────────────────────────────── */}
      {isPrincipal && (
        <motion.div
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{ background:'linear-gradient(135deg, rgba(245,200,66,0.08) 0%, rgba(88,86,214,0.06) 100%)', border:'1px solid rgba(245,200,66,0.22)' }}
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background:'linear-gradient(135deg,#F5C842,#FF9500)', boxShadow:'0 4px 14px rgba(245,200,66,0.40)' }}>
            <Brain size={18} className="text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm" style={{color:'#1C1C1E'}}>Principal Intelligence Mode</p>
            <p className="text-xs mt-0.5 leading-relaxed" style={{color:'#6C7278'}}>
              Type a student name below to instantly view their complete profile — exam scores, attendance, teacher remarks, extracurriculars &amp; grade analysis.
            </p>
          </div>
          <div className="stat-chip shrink-0 hidden sm:flex"
            style={{background:'rgba(245,200,66,0.14)', color:'#CC9200', border:'1px solid rgba(245,200,66,0.28)'}}>
            <Zap size={10}/> LIVE
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── LEFT: Student List ──────────────────────────────────────────── */}
        <div className="xl:col-span-2 flex flex-col gap-0 glass-card overflow-hidden" style={{height:680}}>

          {/* Search toolbar */}
          <div className="p-4 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            style={{borderBottom:'1px solid rgba(0,0,0,0.06)'}}>
            <div className="relative w-full sm:max-w-sm">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5">
                {isPrincipal
                  ? <Brain size={14} style={{color:'#F5C842'}}/>
                  : <Search size={14} style={{color:'#AEAEB2'}}/>
                }
              </div>
              <input
                ref={searchRef}
                type="text"
                placeholder={isPrincipal ? "Search student name for intelligence report…" : "Search by name or roll no…"}
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
                className="search-glass w-full pl-10 pr-4 py-2.5 text-sm"
                style={{color:'#1C1C1E'}}
                autoComplete="off"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); fetchStudents(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{background:'rgba(0,0,0,0.08)'}}>
                  <X size={11} style={{color:'#6C7278'}}/>
                </button>
              )}
            </div>
            <div className="stat-chip" style={{background:'rgba(0,122,255,0.08)',color:'#007AFF',border:'1px solid rgba(0,122,255,0.18)'}}>
              <Users size={11}/> {filteredStudents.length} students
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredStudents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{background:'rgba(0,122,255,0.08)', border:'1px solid rgba(0,122,255,0.18)'}}>
                  <Users size={28} style={{color:'#007AFF'}}/>
                </div>
                <p className="font-bold text-base" style={{color:'#1C1C1E'}}>No students found</p>
                <p className="text-sm mt-1" style={{color:'#6C7278'}}>
                  {searchQuery ? `No results for "${searchQuery}"` : 'Register a new student to get started.'}
                </p>
              </div>
            ) : filteredStudents.map((s, i) => {
              const isSelected = selectedStudent?.id === s.id;
              const gi = report && isSelected && report.marks.overallPct !== null
                ? gradeInfo(report.marks.overallPct)
                : null;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity:0, x:-8 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ delay: i * 0.02, duration:0.22 }}
                  onClick={() => { setSelectedStudent(s); setActiveTab('academic'); }}
                  className="flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-all duration-200 group"
                  style={{
                    borderBottom:'1px solid rgba(0,0,0,0.04)',
                    background: isSelected
                      ? 'linear-gradient(90deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0.02) 100%)'
                      : 'transparent',
                    borderLeft: `3px solid ${isSelected ? '#007AFF' : 'transparent'}`,
                  }}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base shrink-0"
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg,#007AFF,#5856D6)'
                        : 'rgba(0,0,0,0.05)',
                      color: isSelected ? '#fff' : '#6C7278',
                      boxShadow: isSelected ? '0 4px 12px rgba(0,122,255,0.30)' : 'none',
                    }}>
                    {s.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{color: isSelected ? '#007AFF' : '#1C1C1E'}}>
                      {s.name}
                    </p>
                    <p className="text-xs mt-0.5 font-mono" style={{color:'#AEAEB2'}}>
                      {s.rollNumber} · {s.className || getClassName(s.classId)}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {/* Grade badge if selected + loaded */}
                    {isSelected && gi && (
                      <span className="text-xs font-black px-2 py-0.5 rounded-full"
                        style={{background: gi.bg, color: gi.color}}>
                        {gi.grade}
                      </span>
                    )}
                    {s.rfidCardUid
                      ? <span className="stat-chip" style={{background:'rgba(52,199,89,0.10)',color:'#34C759',border:'1px solid rgba(52,199,89,0.20)'}}><CreditCard size={9}/> ID</span>
                      : <span className="stat-chip" style={{background:'rgba(0,0,0,0.04)',color:'#AEAEB2',border:'1px solid rgba(0,0,0,0.08)'}}>No Card</span>
                    }
                    <ChevronRight size={13} style={{color: isSelected ? '#007AFF' : '#AEAEB2'}} className="group-hover:translate-x-0.5 transition-transform"/>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Intelligence Panel ───────────────────────────────────── */}
        <div className="xl:col-span-1">
          <AnimatePresence mode="wait">
            {selectedStudent ? (
              <motion.div
                key={selectedStudent.id}
                initial={{ opacity:0, y:16, scale:0.98 }}
                animate={{ opacity:1, y:0,  scale:1    }}
                exit={{    opacity:0, y:16, scale:0.98 }}
                transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
                className="glass-card overflow-hidden sticky top-6"
                style={{ maxHeight:'calc(100vh - 8rem)', overflowY:'auto' }}
              >
                {reportLoading ? (
                  /* ── Loading skeleton ─ */
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl animate-shimmer" style={{background:'rgba(0,0,0,0.06)'}}/>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-32 rounded-full animate-shimmer" style={{background:'rgba(0,0,0,0.06)'}}/>
                        <div className="h-3 w-20 rounded-full animate-shimmer" style={{background:'rgba(0,0,0,0.04)'}}/>
                      </div>
                    </div>
                    {[80,60,72,55].map((w,i) => (
                      <div key={i} className="h-10 rounded-2xl animate-shimmer" style={{background:'rgba(0,0,0,0.05)', width:`${w}%`, animationDelay:`${i*80}ms`}}/>
                    ))}
                  </div>
                ) : report ? (
                  <IntelligencePanel
                    student={selectedStudent}
                    report={report}
                    userRole={userRole}
                    isPrincipal={isPrincipal}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onEdit={openEditModal}
                    getClassName={getClassName}
                  />
                ) : null}
              </motion.div>
            ) : (
              /* ── Empty state ─ */
              <motion.div
                key="empty"
                initial={{ opacity:0 }} animate={{ opacity:1 }}
                className="glass-card h-72 flex flex-col items-center justify-center p-8 text-center sticky top-6"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{background:'rgba(0,122,255,0.08)', border:'1px solid rgba(0,122,255,0.18)'}}>
                  {isPrincipal
                    ? <Brain size={26} style={{color:'#007AFF'}}/>
                    : <Users size={26} style={{color:'#007AFF'}}/>
                  }
                </div>
                <p className="font-bold text-sm mb-1" style={{color:'#1C1C1E'}}>
                  {isPrincipal ? 'Select a student for intelligence report' : 'Select a student'}
                </p>
                <p className="text-xs leading-relaxed" style={{color:'#6C7278'}}>
                  {isPrincipal
                    ? 'Full scores, attendance %, teacher remarks, extracurriculars & grade analysis'
                    : 'Click any student to view their profile.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{background:'rgba(0,0,0,0.45)', backdropFilter:'blur(12px)'}}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale:0.94, opacity:0, y:24 }}
              animate={{ scale:1,    opacity:1, y:0  }}
              exit={{    scale:0.94, opacity:0, y:24 }}
              transition={{ type:'spring', stiffness:320, damping:28 }}
              className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden glass-card"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-5 shrink-0"
                style={{borderBottom:'1px solid rgba(0,0,0,0.06)'}}>
                <h3 className="font-black text-lg" style={{color:'#1C1C1E'}}>
                  {isEditing ? 'Edit Student Profile' : 'Register New Student'}
                </h3>
                <button onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                  style={{background:'rgba(0,0,0,0.06)', color:'#6C7278'}}>
                  <X size={16}/>
                </button>
              </div>

              <div className="overflow-y-auto p-6 flex-1">
                <form id="stu-form" onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <div className="flex gap-2 items-start p-3 rounded-2xl text-sm"
                      style={{background:'rgba(255,59,48,0.08)', border:'1px solid rgba(255,59,48,0.22)', color:'#FF3B30'}}>
                      <AlertCircle size={15} className="mt-0.5 shrink-0"/> {formError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id:'name',      label:'Full Name',         placeholder:'Arjun Sharma',   key:'name'             as keyof FormState },
                      { id:'roll',      label:'Roll / Admission',  placeholder:'2024-001',       key:'rollNumber'       as keyof FormState },
                      { id:'class',     label:'Class',             placeholder:'Class 8-A',      key:'className'        as keyof FormState },
                      { id:'section',   label:'Section',           placeholder:'A',              key:'section'          as keyof FormState },
                      { id:'blood',     label:'Blood Group',       placeholder:'O+',             key:'bloodGroup'       as keyof FormState },
                      { id:'emergency', label:'Emergency Contact', placeholder:'10-digit number',key:'emergencyContact' as keyof FormState },
                    ].map(field => (
                      <div key={field.id} className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider" style={{color:'#6C7278'}}>{field.label}</label>
                        <input
                          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                          style={{background:'rgba(0,0,0,0.04)', border:'1px solid rgba(0,0,0,0.10)', color:'#1C1C1E'}}
                          placeholder={field.placeholder}
                          value={formData[field.key] as string}
                          onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                          onFocus={e => (e.target.style.borderColor = '#007AFF')}
                          onBlur={e  => (e.target.style.borderColor = 'rgba(0,0,0,0.10)')}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider" style={{color:'#6C7278'}}>Gender</label>
                    <select className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{background:'rgba(0,0,0,0.04)', border:'1px solid rgba(0,0,0,0.10)', color:'#1C1C1E'}}
                      value={formData.gender}
                      onChange={e => setFormData({...formData, gender: e.target.value})}>
                      <option value="">Select…</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider" style={{color:'#6C7278'}}>Date of Birth</label>
                    <input type="date" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{background:'rgba(0,0,0,0.04)', border:'1px solid rgba(0,0,0,0.10)', color:'#1C1C1E'}}
                      value={formData.dob}
                      onChange={e => setFormData({...formData, dob: e.target.value})}/>
                  </div>
                  <div className="flex items-start gap-3 pt-2" style={{borderTop:'1px solid rgba(0,0,0,0.06)'}}>
                    <input type="checkbox" id="consent" className="mt-1 w-4 h-4 rounded"
                      checked={formData.parentalConsent}
                      onChange={e => setFormData({...formData, parentalConsent: e.target.checked})}/>
                    <label htmlFor="consent" className="text-xs" style={{color:'#6C7278'}}>
                      <span className="font-bold block mb-0.5" style={{color:'#1C1C1E'}}>Parental Data Consent Verified</span>
                      Guardian has signed the data-privacy consent form.
                    </label>
                  </div>
                </form>
              </div>

              <div className="px-6 py-4 shrink-0 flex justify-end gap-3"
                style={{borderTop:'1px solid rgba(0,0,0,0.06)'}}>
                <button onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{color:'#6C7278', background:'rgba(0,0,0,0.04)'}}>
                  Cancel
                </button>
                <button type="submit" form="stu-form" disabled={submitting}
                  className="btn-primary" style={{opacity: submitting ? 0.6 : 1}}>
                  {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Register Student'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   INTELLIGENCE PANEL (extracted for clarity)
──────────────────────────────────────────────────────────────────────────── */
function IntelligencePanel({
  student, report, userRole, isPrincipal, activeTab, setActiveTab, onEdit, getClassName
}: {
  student: Student;
  report: IntelligenceReport;
  userRole: string;
  isPrincipal: boolean;
  activeTab: 'academic' | 'activities' | 'health';
  setActiveTab: (t: 'academic' | 'activities' | 'health') => void;
  onEdit: (s: Student) => void;
  getClassName: (id?: string) => string;
}) {
  const gi = report.marks.overallPct !== null ? gradeInfo(report.marks.overallPct) : null;
  const attendColor =
    (report.attendance.pct ?? 0) >= 75 ? '#34C759' :
    (report.attendance.pct ?? 0) >= 60 ? '#FF9500' : '#FF3B30';

  const TABS = [
    { id:'academic',    label:'Academics', icon: GraduationCap },
    { id:'activities',  label:'Activities', icon: Trophy        },
    ...(isPrincipal ? [{ id:'health', label:'Health', icon: Heart }] : []),
  ] as { id: 'academic'|'activities'|'health'; label:string; icon:any }[];

  return (
    <div className="flex flex-col">

      {/* ── Profile banner ──────────────────────────────────────────────── */}
      <div className="h-24 relative"
        style={{ background:'linear-gradient(135deg, rgba(0,122,255,0.15) 0%, rgba(88,86,214,0.10) 50%, rgba(175,82,222,0.08) 100%)' }}>
        {report._isMock && (
          <div className="absolute top-3 left-3 stat-chip"
            style={{background:'rgba(255,149,0,0.14)', color:'#FF9500', border:'1px solid rgba(255,149,0,0.28)', fontSize:9}}>
            <Zap size={8}/> Preview Data
          </div>
        )}
        {['principal','clerk','teacher','admin'].includes(userRole) && (
          <div className="absolute top-3 right-3 flex gap-2 no-print">
            <button onClick={() => window.print()}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{background:'rgba(255,255,255,0.70)', backdropFilter:'blur(8px)', color:'#6C7278'}}>
              <Printer size={13}/>
            </button>
            <button onClick={() => onEdit(student)}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{background:'rgba(0,122,255,0.20)', backdropFilter:'blur(8px)', color:'#007AFF'}}>
              <Edit2 size={13}/>
            </button>
          </div>
        )}
      </div>

      {/* ── Identity ────────────────────────────────────────────────────── */}
      <div className="px-5 pb-4">
        <div className="flex items-end gap-4 -mt-8 mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black border-2 shrink-0"
            style={{background:'linear-gradient(135deg,#007AFF,#5856D6)', borderColor:'rgba(255,255,255,0.90)', color:'#fff', boxShadow:'0 8px 20px rgba(0,122,255,0.35)'}}>
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div className="pb-1 min-w-0">
            <p className="font-black text-lg leading-tight truncate" style={{color:'#1C1C1E'}}>{student.name}</p>
            <p className="text-xs font-mono mt-0.5" style={{color:'#AEAEB2'}}>
              #{student.rollNumber} · {student.className || getClassName(student.classId)}
            </p>
          </div>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {[
            ...(report.enrollment?.class ? [{ label: report.enrollment.class,       color:'#007AFF' }] : []),
            ...(student.section           ? [{ label:`Sec ${student.section}`,       color:'#5856D6' }] : []),
            ...(student.bloodGroup        ? [{ label: student.bloodGroup,            color:'#FF3B30' }] : []),
            ...(student.gender            ? [{ label: student.gender,               color:'#34C759' }] : []),
          ].map((chip, i) => (
            <span key={i} className="stat-chip"
              style={{background:`${chip.color}12`, color:chip.color, border:`1px solid ${chip.color}28`}}>
              {chip.label}
            </span>
          ))}
        </div>

        {/* ── Top-line KPI row ──────────────────────────────────────────── */}
        {isPrincipal && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* Score */}
            <div className="rounded-2xl p-3 flex flex-col items-center justify-center text-center"
              style={{background: gi?.bg ?? 'rgba(0,0,0,0.04)', border:`1px solid ${gi?.color ?? '#AEAEB2'}28`}}>
              <div className="relative mb-1">
                <Ring pct={report.marks.overallPct ?? 0} color={gi?.color ?? '#AEAEB2'} size={52} strokeWidth={5}/>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] font-black" style={{color: gi?.color ?? '#AEAEB2'}}>
                    {report.marks.overallPct ?? '—'}%
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black" style={{color: gi?.color ?? '#AEAEB2'}}>
                Grade {report.marks.grade ?? '—'}
              </span>
              <span className="text-[9px]" style={{color:'#AEAEB2'}}>{gi?.label}</span>
            </div>
            {/* Attendance */}
            <div className="rounded-2xl p-3 flex flex-col items-center justify-center text-center"
              style={{background:`${attendColor}0A`, border:`1px solid ${attendColor}25`}}>
              <div className="relative mb-1">
                <Ring pct={report.attendance.pct ?? 0} color={attendColor} size={52} strokeWidth={5}/>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] font-black" style={{color:attendColor}}>
                    {report.attendance.pct ?? '—'}%
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black" style={{color:attendColor}}>Attendance</span>
              <span className="text-[9px]" style={{color:'#AEAEB2'}}>
                {report.attendance.pct !== null
                  ? (report.attendance.pct >= 75 ? 'Regular' : report.attendance.pct >= 60 ? 'At Risk' : 'Critical')
                  : '—'}
              </span>
            </div>
            {/* Rank */}
            <div className="rounded-2xl p-3 flex flex-col items-center justify-center text-center"
              style={{background:'rgba(245,200,66,0.08)', border:'1px solid rgba(245,200,66,0.22)'}}>
              <Trophy size={22} style={{color:'#F5C842', marginBottom:4}}/>
              <span className="text-base font-black" style={{color:'#CC9200'}}>
                {report.rank ? `#${report.rank}` : '—'}
              </span>
              <span className="text-[9px]" style={{color:'#AEAEB2'}}>
                {report.rank && report.totalStudents ? `of ${report.totalStudents}` : 'Class Rank'}
              </span>
            </div>
          </div>
        )}

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        {isPrincipal && (
          <div className="flex gap-1 p-1 rounded-2xl mb-4"
            style={{background:'rgba(0,0,0,0.04)'}}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold transition-all duration-200"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.90)' : 'transparent',
                    color: isActive ? '#1C1C1E' : '#6C7278',
                    boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                  }}>
                  <Icon size={11}/> {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ── TAB: Academics ───────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {(!isPrincipal || activeTab === 'academic') && (
            <motion.div key="academic"
              initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}}
              transition={{duration:0.22}}
              className="space-y-4">

              {/* Attendance detail */}
              {report.attendance.pct !== null && (
                <div className="rounded-2xl p-4" style={{background:`${attendColor}08`, border:`1px solid ${attendColor}20`}}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-black" style={{color:attendColor}}>Attendance Summary</p>
                    {report.attendance.pct < 75 && (
                      <span className="stat-chip flex items-center gap-1" style={{background:'rgba(255,59,48,0.10)',color:'#FF3B30',border:'1px solid rgba(255,59,48,0.22)'}}>
                        <TriangleAlert size={11} /> Below 75%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full overflow-hidden" style={{background:'rgba(0,0,0,0.06)'}}>
                      <motion.div
                        initial={{width:0}} animate={{width:`${report.attendance.pct}%`}}
                        transition={{duration:1, ease:[0.22,1,0.36,1]}}
                        className="h-full rounded-full"
                        style={{background:`linear-gradient(90deg, ${attendColor}, ${attendColor}cc)`}}/>
                    </div>
                    <span className="text-xs font-black" style={{color:attendColor}}>{report.attendance.pct}%</span>
                  </div>
                  <p className="text-[10px] mt-1.5" style={{color:'#6C7278'}}>
                    {report.attendance.presentDays} present of {report.attendance.totalDays} school days
                  </p>
                </div>
              )}

              {/* Subject scores */}
              {report.marks.subjects.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black tracking-widest uppercase" style={{color:'#AEAEB2'}}>Subject Performance</p>
                  {report.marks.subjects.map(sub => {
                    const pct = Math.round((sub.obtained / sub.max) * 100);
                    const subGi = gradeInfo(pct);
                    return (
                      <div key={sub.subject} className="flex items-center gap-3">
                        <p className="text-[11px] font-semibold w-24 shrink-0 truncate" style={{color:'#6C7278'}}>{sub.subject}</p>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{background:'rgba(0,0,0,0.06)'}}>
                          <motion.div
                            initial={{width:0}} animate={{width:`${pct}%`}}
                            transition={{duration:0.85, delay:0.08, ease:[0.22,1,0.36,1]}}
                            className="h-full rounded-full"
                            style={{background:`linear-gradient(90deg, ${subGi.color}, ${subGi.color}cc)`}}/>
                        </div>
                        <span className="text-[10px] font-black w-8 text-right shrink-0" style={{color:subGi.color}}>
                          {sub.obtained}
                        </span>
                        <span className="text-[9px] font-bold w-5 shrink-0" style={{color:subGi.color}}>{subGi.grade}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Homework */}
              {report.homework && (
                <div className="rounded-2xl p-3.5" style={{background:'rgba(0,122,255,0.06)', border:'1px solid rgba(0,122,255,0.16)'}}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-black" style={{color:'#007AFF'}}>Homework Completion</p>
                    <span className="text-xs font-black" style={{color:'#007AFF'}}>{report.homework.rate}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{background:'rgba(0,0,0,0.06)'}}>
                    <motion.div
                      initial={{width:0}} animate={{width:`${report.homework.rate}%`}}
                      transition={{duration:0.9, ease:[0.22,1,0.36,1]}}
                      className="h-full rounded-full"
                      style={{background:'linear-gradient(90deg,#007AFF,#5856D6)'}}/>
                  </div>
                  <p className="text-[10px] mt-1" style={{color:'#6C7278'}}>
                    {report.homework.completed} of {report.homework.total} assignments submitted
                  </p>
                </div>
              )}

              {/* Teacher remarks */}
              {report.remarks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black tracking-widest uppercase" style={{color:'#AEAEB2'}}>Teacher Remarks</p>
                  {report.remarks.map((r, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-xl p-3"
                      style={{background:'rgba(0,0,0,0.03)', border:'1px solid rgba(0,0,0,0.07)'}}>
                      <div className="w-5 h-5 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
                        style={{background: i === 0 ? 'rgba(245,200,66,0.18)' : i === 1 ? 'rgba(0,122,255,0.14)' : 'rgba(52,199,89,0.14)'}}>
                        <Star size={9} style={{color: i === 0 ? '#F5C842' : i === 1 ? '#007AFF' : '#34C759'}}/>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{color:'#3C3C43'}}>{r}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Library */}
              {report.library && report.library.booksIssued > 0 && (
                <div className="rounded-2xl p-3.5" style={{background:'rgba(175,82,222,0.06)', border:'1px solid rgba(175,82,222,0.16)'}}>
                  <div className="flex items-center gap-2 mb-2">
                    <BookMarked size={13} style={{color:'#AF52DE'}}/>
                    <p className="text-xs font-black" style={{color:'#AF52DE'}}>Library Activity</p>
                  </div>
                  <p className="text-[10px]" style={{color:'#6C7278'}}>
                    {report.library.booksIssued} books issued · {report.library.currentlyIssued} currently checked out
                  </p>
                  {report.library.books.slice(0, 2).map((b, i) => (
                    <div key={i} className="flex items-center gap-2 mt-1.5">
                      <BookOpen size={10} style={{color:'#AEAEB2'}}/>
                      <p className="text-[10px] truncate" style={{color:'#3C3C43'}}>{b.title}</p>
                      {!b.returnedAt && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{background:'rgba(255,59,48,0.10)',color:'#FF3B30'}}>Due</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Non-principal basic info */}
              {!isPrincipal && (
                <div className="space-y-2 print-area">
                  <PrintableLetterhead/>
                  {[
                    { label:'Class',     value:`${student.className || getClassName(student.classId)}${student.section ? ` - ${student.section}` : ''}` },
                    { label:'Gender',    value: student.gender || '—' },
                    { label:'DOB',       value: student.dob ? new Date(student.dob).toLocaleDateString() : '—' },
                    { label:'Blood',     value: student.bloodGroup || '—' },
                    { label:'Emergency', value: student.emergencyContact || '—' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center py-2"
                      style={{borderBottom:'1px solid rgba(0,0,0,0.05)'}}>
                      <span className="text-xs" style={{color:'#6C7278'}}>{row.label}</span>
                      <span className="text-xs font-bold" style={{color:'#1C1C1E'}}>{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── TAB: Activities ──────────────────────────────────────────── */}
          {isPrincipal && activeTab === 'activities' && (
            <motion.div key="activities"
              initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}}
              transition={{duration:0.22}}
              className="space-y-4">

              {report.extracurriculars.length === 0 ? (
                <div className="rounded-2xl p-6 text-center" style={{background:'rgba(0,0,0,0.03)', border:'1px solid rgba(0,0,0,0.07)'}}>
                  <Dumbbell size={28} style={{color:'#AEAEB2', margin:'0 auto 8px'}}/>
                  <p className="text-sm font-bold" style={{color:'#AEAEB2'}}>No activities recorded</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-[10px] font-black tracking-widest uppercase" style={{color:'#AEAEB2'}}>Extracurricular Activities</p>
                  {report.extracurriculars.map((act, i) => {
                    const levelColors: Record<string, string> = { School:'#007AFF', District:'#5856D6', State:'#FF9500', National:'#34C759' };
                    const lColor = levelColors[act.level] || '#007AFF';
                    return (
                      <motion.div key={i}
                        initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                        transition={{delay:i*0.06}}
                        className="flex items-center gap-3 rounded-2xl p-3.5"
                        style={{background:`${lColor}08`, border:`1px solid ${lColor}20`}}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{background:`${lColor}14`, color: lColor}}>
                          {act.icon === 'chess'    ? <Trophy size={16}/> :
                           act.icon === 'science'  ? <Brain size={16}/> :
                           act.icon === 'cricket'  ? <Target size={16}/> :
                           act.icon === 'art'      ? <Palette size={16}/> :
                           act.icon === 'debate'   ? <Users size={16}/> :
                           act.icon === 'music'    ? <Music size={16}/> :
                           act.icon === 'swimming' ? <Droplets size={16}/> :
                           act.icon === 'robotics' ? <Zap size={16}/> :
                           <Star size={16}/>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate" style={{color:'#1C1C1E'}}>{act.activity}</p>
                          <p className="text-xs mt-0.5" style={{color:'#6C7278'}}>{act.achievement}</p>
                        </div>
                        <span className="text-[9px] font-black px-2 py-1 rounded-full shrink-0"
                          style={{background:`${lColor}18`, color:lColor}}>
                          {act.level}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Score breakdown radar-style summary */}
              {report.marks.subjects.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black tracking-widest uppercase" style={{color:'#AEAEB2'}}>Academic Strengths</p>
                  {[...report.marks.subjects]
                    .sort((a,b) => (b.obtained/b.max) - (a.obtained/a.max))
                    .map((sub, i) => {
                      const pct = Math.round((sub.obtained/sub.max)*100);
                      const subGi = gradeInfo(pct);
                      const SubjectIcon = (() => {
                        switch(sub.subject) {
                          case 'Mathematics': return <BarChart2 size={14} style={{color:subGi.color}}/>;
                          case 'Physics':     return <Zap size={14} style={{color:subGi.color}}/>;
                          case 'Chemistry':   return <Brain size={14} style={{color:subGi.color}}/>;
                          case 'English':     return <BookOpen size={14} style={{color:subGi.color}}/>;
                          case 'Biology':     return <Heart size={14} style={{color:subGi.color}}/>;
                          case 'History':     return <BookMarked size={14} style={{color:subGi.color}}/>;
                          case 'Geography':   return <Globe size={14} style={{color:subGi.color}}/>;
                          case 'Computer':    return <Activity size={14} style={{color:subGi.color}}/>;
                          default:            return <BookOpen size={14} style={{color:subGi.color}}/>;
                        }
                      })();
                      return (
                        <div key={sub.subject} className="flex items-center gap-3 rounded-xl p-2.5"
                          style={{background:subGi.bg, border:`1px solid ${subGi.color}25`}}>
                          <span className="w-6 flex items-center justify-center">{SubjectIcon}</span>
                          <p className="text-xs font-bold flex-1 truncate" style={{color:'#1C1C1E'}}>{sub.subject}</p>
                          <span className="text-xs font-black" style={{color:subGi.color}}>{sub.obtained}/{sub.max}</span>
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                            style={{background:`${subGi.color}20`, color:subGi.color}}>
                            {subGi.grade}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── TAB: Health ──────────────────────────────────────────────── */}
          {isPrincipal && activeTab === 'health' && (
            <motion.div key="health"
              initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}}
              transition={{duration:0.22}}
              className="space-y-3">

              {[
                { label:'Blood Group',        value: student.bloodGroup || '—',               icon: Droplets,  color:'#FF3B30' },
                { label:'Date of Birth',       value: student.dob ? new Date(student.dob).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'}) : '—', icon:Calendar, color:'#5856D6' },
                { label:'Emergency Contact',   value: report.health?.emergencyContact || student.emergencyContact || '—', icon:Phone, color:'#34C759' },
                ...(report.health?.allergies           ? [{ label:'Allergies',         value:report.health.allergies,          icon:AlertCircle, color:'#FF9500' }] : []),
                ...(report.health?.chronicConditions   ? [{ label:'Chronic Conditions', value:report.health.chronicConditions,  icon:Activity,    color:'#FF3B30' }] : []),
              ].map((row, i) => {
                const Icon = row.icon;
                return (
                  <div key={i} className="flex items-start gap-3 rounded-2xl p-3.5"
                    style={{background:`${row.color}08`, border:`1px solid ${row.color}20`}}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{background:`${row.color}18`}}>
                      <Icon size={14} style={{color:row.color}}/>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold" style={{color:'#6C7278'}}>{row.label}</p>
                      <p className="text-sm font-black mt-0.5" style={{color:'#1C1C1E'}}>{row.value}</p>
                    </div>
                  </div>
                );
              })}

              <div className="rounded-2xl p-3.5 flex items-center gap-3"
                style={{background:'rgba(52,199,89,0.08)', border:'1px solid rgba(52,199,89,0.20)'}}>
                <Shield size={20} style={{color:'#34C759', flexShrink:0}}/>
                <div>
                  <p className="text-xs font-black" style={{color:'#34C759'}}>Data Privacy</p>
                  <p className="text-[10px] leading-relaxed" style={{color:'#6C7278'}}>
                    Health data is accessible to Principal and Nurse only per DPDP Act 2023 guidelines.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Print footer ─────────────────────────────────────────────── */}
        <div className="pt-4 mt-4 print-area" style={{borderTop:'1px solid rgba(0,0,0,0.06)'}}>
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-mono" style={{color:'#AEAEB2'}}>
              Generated · {new Date().toLocaleString('en-IN')}
            </p>
            {student.parentalConsent !== undefined && (
              student.parentalConsent
                ? <span className="stat-chip" style={{background:'rgba(52,199,89,0.10)',color:'#34C759',border:'1px solid rgba(52,199,89,0.22)'}}>
                    <CheckCircle2 size={9}/> Consent Verified
                  </span>
                : <span className="stat-chip" style={{background:'rgba(255,59,48,0.08)',color:'#FF3B30',border:'1px solid rgba(255,59,48,0.20)'}}>
                    Consent Missing
                  </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
