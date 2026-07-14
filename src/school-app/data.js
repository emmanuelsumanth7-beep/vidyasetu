import {
  BadgeIndianRupee,
  Bell,
  BookOpen,
  Bus,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardCheck,
  FileBadge,
  FileText,
  GraduationCap,
  Home,
  MessageCircle,
  NotebookPen,
  Printer,
  ReceiptText,
  School,
  Settings,
  ShieldCheck,
  Star,
  Users,
  WalletCards,
} from 'lucide-react';

export const roles = [
  { id: 'parent', icon: Home, gradient: 'sunrise' },
  { id: 'teacher', icon: BookOpen, gradient: 'emerald' },
  { id: 'staff', icon: ReceiptText, gradient: 'sapphire' },
  { id: 'principal', icon: School, gradient: 'royal' },
];

export const child = {
  name: 'Ananya Rao',
  className: 'Class 5A',
  photo: 'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?auto=format&fit=crop&w=320&q=80',
};

export const notifications = [
  { type: 'urgent', title: 'Fee reminder', kn: 'ಫೀಸ್ ಬಾಕಿ ಇದೆ', body: 'Term 2 balance closes in 4 days.' },
  { type: 'info', title: 'Kannada Rajyotsava practice', kn: 'ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ ಪ್ರಾಕ್ಟೀಸ್', body: 'Costume rehearsal tomorrow.' },
  { type: 'success', title: 'Homework checked', kn: 'ಹೋಂವರ್ಕ್ ಚೆಕ್ ಆಯ್ತು', body: 'Math notebook received.' },
];

export const gradeCards = [
  { subject: 'Kannada', score: 92, average: 78, trend: 'improving', stars: 5 },
  { subject: 'Mathematics', score: 84, average: 73, trend: 'stable', stars: 4 },
  { subject: 'Science', score: 76, average: 72, trend: 'needsCare', stars: 4 },
  { subject: 'English', score: 88, average: 75, trend: 'improving', stars: 4 },
];

export const attendanceDays = Array.from({ length: 30 }, (_, index) => {
  const day = index + 1;
  const state = [6, 14, 24].includes(day) ? 'absent' : [11, 22].includes(day) ? 'half' : 'present';
  return { day, state };
});

export const quickReplies = [
  'Child is sick today',
  'ಮಗು ಇಂದು ಅಸ್ವಸ್ಥ',
  'ನಾಳೆ ಫೀಸ್ ಪಾವತಿ ಮಾಡುತ್ತೇನೆ',
  'ಬಸ್ ಬಂತಾ?',
];

export const teacherStudents = [
  'Aarav Hegde',
  'Ananya Rao',
  'Diya Gowda',
  'Ishaan Kumar',
  'Meera Shetty',
  'Nikhil Patil',
];

export const timetable = [
  ['Kannada', 'Math', 'Science', 'Break', 'English'],
  ['Math', 'EVS', 'Computer', 'Lunch', 'Kannada'],
  ['Science', 'English', 'Math', 'Break', 'Sports'],
  ['Social', 'Kannada', 'Art', 'Lunch', 'Science'],
  ['English', 'Math Lab', 'Library', 'Break', 'Assembly'],
];

export const diaryEntries = [
  {
    className: '5A',
    subject: 'Kannada',
    activity: 'Read lesson 4 and practiced handwriting.',
    activityKn: 'ಪಾಠ 4 ಓದಿದೆವು, ಕೈ ಬರಹ ಪ್ರಾಕ್ಟೀಸ್ ಮಾಡಿದೆವು.',
    homework: 'Write 10 lines from page 42.',
    homeworkKn: 'ಪುಟ 42 ರಿಂದ 10 ಸಾಲು ಬರೆಯಬೇಕು.',
    remark: 'Reading is improving. Please sign today.',
    remarkKn: 'ಓದುವುದು ಚೆನ್ನಾಗಿ ಆಗುತ್ತಿದೆ. ಇಂದು ಸೈನ್ ಮಾಡಿ.',
  },
  {
    className: '5A',
    subject: 'Math',
    activity: 'Solved division sums with remainders.',
    activityKn: 'ಭಾಗಾಕಾರದ sums ಪ್ರಾಕ್ಟೀಸ್ ಮಾಡಿದೆವು.',
    homework: 'Complete exercise 6.2.',
    homeworkKn: 'Exercise 6.2 ಮುಗಿಸಬೇಕು.',
    remark: 'Needs a little more practice.',
    remarkKn: 'ಸ್ವಲ್ಪ ಇನ್ನೂ ಪ್ರಾಕ್ಟೀಸ್ ಬೇಕು.',
  },
  {
    className: '6B',
    subject: 'Science',
    activity: 'Plant parts diagram and oral discussion.',
    activityKn: 'ಸಸ್ಯದ ಭಾಗಗಳ ಚಿತ್ರ ಮತ್ತು ಮಾತುಕತೆ ಮಾಡಿದೆವು.',
    homework: 'Bring one leaf sample tomorrow.',
    homeworkKn: 'ನಾಳೆ ಒಂದು ಎಲೆ sample ತರಬೇಕು.',
    remark: 'Good participation today.',
    remarkKn: 'ಇಂದು ಚೆನ್ನಾಗಿ ಭಾಗವಹಿಸಿದರು.',
  },
];

export const parentMessageThreads = [
  { name: 'Lakshmi Rao', child: 'Ananya Rao', message: 'Please confirm bus drop timing today.', messageKn: 'ಇಂದು ಬಸ್ ಡ್ರಾಪ್ ಸಮಯ ಹೇಳಿ.', status: 'New', statusKn: 'ಹೊಸದು' },
  { name: 'Prakash Hegde', child: 'Aarav Hegde', message: 'Aarav has fever. He will be absent.', messageKn: 'ಆರವ್ ಗೆ ಜ್ವರ ಇದೆ. ಇಂದು ಬರಲ್ಲ.', status: 'Replied', statusKn: 'ಉತ್ತರಿಸಿದೆ' },
  { name: 'Meenakshi Gowda', child: 'Diya Gowda', message: 'Can I meet Kannada teacher Friday?', messageKn: 'ಶುಕ್ರವಾರ ಕನ್ನಡ ಟೀಚರ್ ಭೇಟಿ ಮಾಡಬಹುದಾ?', status: 'Open', statusKn: 'ಓಪನ್' },
];

export const principalNav = [
  { id: 'overview', icon: ChartNoAxesCombined },
  { id: 'students', icon: Users },
  { id: 'faculty', icon: GraduationCap },
  { id: 'academics', icon: ClipboardCheck },
  { id: 'finance', icon: BadgeIndianRupee },
  { id: 'communication', icon: Bell },
  { id: 'calendar', icon: CalendarDays },
  { id: 'transport', icon: Bus },
  { id: 'settings', icon: Settings },
];

export const students = [
  { name: 'Ananya Rao', className: '5A', attendance: '96%', fees: 'Paid', guardian: 'Lakshmi Rao' },
  { name: 'Aarav Hegde', className: '5A', attendance: '91%', fees: 'Due', guardian: 'Prakash Hegde' },
  { name: 'Diya Gowda', className: '6B', attendance: '98%', fees: 'Paid', guardian: 'Meenakshi Gowda' },
  { name: 'Nikhil Patil', className: '7C', attendance: '87%', fees: 'Partial', guardian: 'Sunil Patil' },
  { name: 'Meera Shetty', className: '8A', attendance: '94%', fees: 'Paid', guardian: 'Asha Shetty' },
];

export const faculty = [
  { name: 'Meera Iyer', role: 'Kannada Teacher', load: '5 classes', status: 'Present' },
  { name: 'Ravi Kulkarni', role: 'Math Faculty', load: '6 classes', status: 'Present' },
  { name: 'Nandini Bhat', role: 'Science Lead', load: '4 classes', status: 'On duty' },
];

export const adminStats = [
  { key: 'totalStudents', value: 1248, icon: Users, delta: '+8%' },
  { key: 'presentToday', value: 1189, icon: ShieldCheck, delta: '95.2%' },
  { key: 'feeCollection', value: 86, suffix: '%', icon: WalletCards, delta: '+12%' },
  { key: 'pendingFees', value: 142, icon: Bell, delta: '-9%' },
];

export const officeModules = [
  { key: 'receipts', icon: ReceiptText, count: '42', tone: 'gold' },
  { key: 'admissions', icon: ClipboardCheck, count: '18', tone: 'green' },
  { key: 'certificates', icon: FileBadge, count: '9', tone: 'blue' },
  { key: 'records', icon: FileText, count: '1,248', tone: 'violet' },
  { key: 'visitorPass', icon: ShieldCheck, count: '7', tone: 'green' },
  { key: 'inventory', icon: Printer, count: '23', tone: 'gold' },
];

export const receiptQueue = [
  { receiptNo: 'VS-2026-1042', student: 'Aarav Hegde', className: '5A', amount: '₹ 8,500', mode: 'UPI', status: 'ready' },
  { receiptNo: 'VS-2026-1043', student: 'Nikhil Patil', className: '7C', amount: '₹ 4,200', mode: 'cash', status: 'print' },
  { receiptNo: 'VS-2026-1044', student: 'Diya Gowda', className: '6B', amount: '₹ 12,000', mode: 'card', status: 'ready' },
];

export const officeTasks = [
  'Print fee receipts and daily collection sheet',
  'Issue study certificate for Class 8A',
  'Update new admission documents',
  'Prepare transfer certificate request',
  'Record uniform stock received',
];

export const parentTabs = [
  { id: 'home', icon: Home, label: 'Home', kn: 'ಮನೆ' },
  { id: 'attendance', icon: ClipboardCheck, label: 'Attendance', kn: 'ಹಾಜರಾತಿ' },
  { id: 'diary', icon: NotebookPen, label: 'Diary', kn: 'ಡೈರಿ' },
  { id: 'grades', icon: Star, label: 'Grades', kn: 'ಅಂಕಗಳು' },
  { id: 'fees', icon: BadgeIndianRupee, label: 'Fees', kn: 'ಫೀಸ್' },
  { id: 'transport', icon: Bus, label: 'Bus', kn: 'ಬಸ್' },
  { id: 'messages', icon: MessageCircle, label: 'Chat', kn: 'ಚಾಟ್' },
];
