import re

with open('admin-web/src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Add imports
imports = """import { 
  FeePaymentIcon, ProfileIcon, RemarksIcon, AbsentInfoIcon, 
  StudyMaterialIcon, LateComerIcon, NotificationIcon, CalendarIcon, 
  CetRegistrationIcon, UpcomingEventsIcon, BiometricsIcon, GradesIcon, 
  TransportIcon, DiaryIcon, AnalyticsIcon, SettingsIcon, 
  LogoutIcon, AttendanceIcon, SuggestionIcon, NightModeIcon, 
  BellIcon, StaffIcon, CalculatorIcon, SystemIcon, DocumentIcon, SunIcon 
} from '@/components/GridIcons';
"""

# Replace lucide imports if we want, or just insert ours after them
content = content.replace("import { HomeGrid } from '@/components/HomeGrid';", "")
content = content.replace("import { AccountMenu } from '@/components/AccountMenu';", "import { AccountMenu } from '@/components/AccountMenu';\n" + imports)

# Replace DASHBOARD_MODULES
old_modules_str = re.search(r'const DASHBOARD_MODULES: Module\[\] = \[.*?\];', content, re.DOTALL).group(0)

new_modules_str = """const DASHBOARD_MODULES: Module[] = [
  // Administration & HR (Violet/Indigo)
  { id: 'students', title: 'Students Info', icon: ProfileIcon, color: '', bgHex: '', category: 'admin', href: '/dashboard/students', allowedRoles: ['principal', 'teacher', 'clerk'] },
  { id: 'staff', title: 'Staff Info', icon: StaffIcon, color: '', bgHex: '', category: 'admin', href: '/dashboard/staff', allowedRoles: ['principal', 'clerk'] },
  { id: 'salary', title: 'My Salary Slip', icon: FeePaymentIcon, color: '', bgHex: '', category: 'admin', href: '#', allowedRoles: ['principal', 'teacher', 'clerk', 'counselor'] },
  { id: 'ai_insights', title: 'AI Command Center', icon: SystemIcon, color: '', bgHex: '', category: 'admin', href: '/dashboard/ai-insights', allowedRoles: ['principal'] },
  { id: 'staff_attendance', title: 'Staff Attendance', icon: BiometricsIcon, color: '', bgHex: '', category: 'admin', href: '#', allowedRoles: ['principal', 'clerk'] },

  // Academic Operations (Emerald/Teal)
  { id: 'attendance', title: 'Take Attendance', icon: AttendanceIcon, color: '', bgHex: '', category: 'academics', href: '/dashboard/attendance', allowedRoles: ['principal', 'teacher'] },
  { id: 'absent', title: 'Absent Info', icon: AbsentInfoIcon, color: '', bgHex: '', category: 'academics', href: '/dashboard/attendance', allowedRoles: ['principal', 'teacher'] },
  { id: 'classes', title: 'Classes & Timetable', icon: CalendarIcon, color: '', bgHex: '', category: 'academics', href: '/dashboard/classes', allowedRoles: ['principal', 'teacher', 'student', 'parent'] },
  { id: 'class_completed', title: 'Class Completed', icon: RemarksIcon, color: '', bgHex: '', category: 'academics', href: '#', allowedRoles: ['teacher', 'principal'] },
  { id: 'work_done', title: 'Work Done', icon: DocumentIcon, color: '', bgHex: '', category: 'academics', href: '#', allowedRoles: ['teacher'] },

  // Student Ecosystem (Amber/Cyan)
  { id: 'exam_marks', title: 'Exam Marks', icon: GradesIcon, color: '', bgHex: '', category: 'ecosystem', href: '/dashboard/grades', allowedRoles: ['principal', 'teacher', 'student', 'parent'] },
  { id: 'diary', title: 'Daily Diary', icon: DiaryIcon, color: '', bgHex: '', category: 'ecosystem', href: '/dashboard/diary', allowedRoles: ['principal', 'teacher', 'student', 'parent'] },
  { id: 'study_material', title: 'Study Material', icon: StudyMaterialIcon, color: '', bgHex: '', category: 'ecosystem', href: '#', allowedRoles: ['principal', 'teacher', 'student', 'parent'] },
  { id: 'documents', title: 'Document Approvals', icon: CetRegistrationIcon, color: '', bgHex: '', category: 'ecosystem', href: '/dashboard/approvals', allowedRoles: ['principal', 'teacher', 'clerk', 'parent', 'student'] },

  // Communication (Fuchsia/Sky)
  { id: 'chat', title: 'Chat / Connect', icon: NotificationIcon, color: '', bgHex: '', category: 'communication', href: '/dashboard/messages', allowedRoles: ['principal', 'teacher', 'student', 'parent'] },
  { id: 'notifications', title: 'Send Notification', icon: BellIcon, color: '', bgHex: '', category: 'communication', href: '/dashboard/notices', allowedRoles: ['principal', 'teacher', 'clerk'] },
  { id: 'suggestions', title: 'Suggestions', icon: SuggestionIcon, color: '', bgHex: '', category: 'communication', href: '#', allowedRoles: ['principal', 'counselor'] },
];"""

content = content.replace(old_modules_str, new_modules_str)

# Update icon rendering
old_icon_render = """<div 
                          className="w-14 h-14 rounded-[16px] flex items-center justify-center relative transition-transform duration-200 group-hover:scale-105"
                          style={{ backgroundColor: module.bgHex }}
                        >
                          <Icon size={24} className={`${module.color}`} strokeWidth={2} />
                          {module.id === 'salary' && (
                            <div className="absolute top-3 right-3 text-gray-400">
                              <Lock size={14} />
                            </div>
                          )}
                        </div>"""

new_icon_render = """<div className="w-16 h-16 relative transition-transform duration-200 group-hover:scale-105">
                          <Icon />
                          {module.id === 'salary' && (
                            <div className="absolute top-1 right-1 text-gray-800 bg-white/80 backdrop-blur-md rounded-full p-0.5">
                              <Lock size={12} />
                            </div>
                          )}
                        </div>"""

content = content.replace(old_icon_render, new_icon_render)

with open('admin-web/src/app/dashboard/page.tsx', 'w') as f:
    f.write(content)

print("Replaced DASHBOARD_MODULES and icon render logic.")
