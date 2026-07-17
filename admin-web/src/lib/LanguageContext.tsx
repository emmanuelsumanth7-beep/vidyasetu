'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'kn';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const TRANSLATIONS = {
  en: {
    // Login
    appName: 'Vidya Setu',
    subtitle: 'Central Command Desk. Authorize access to enter the workspace.',
    guardian: 'Guardian',
    faculty: 'Faculty',
    phoneLabel: 'Registered Mobile Number',
    facultyPhone: 'Faculty Mobile Number',
    phonePlaceholder: 'e.g. +91 74832 92660',
    reqKey: 'Request Authorization Key',
    transmitting: 'Transmitting...',
    keyLabel: 'Authorization Key (Sent to',
    keyPlaceholder: '6-digit code',
    verifying: 'Verifying Key...',
    confirmKey: 'Confirm & Enter',
    reenter: 'Re-enter Number',
    devBypass: 'Developer Quick Access',
    principal: 'Principal',
    teacher: 'Teacher',
    parent: 'Parent',
    clerk: 'Clerk',
    idCheck: 'Identity Check',
    sysAuth: 'SYS_AUTH_v3',

    // Dashboard
    welcomeBack: 'Welcome back',
    askVidya: 'Ask Vidya e.g. "Show me Class 8 absentees..."',
    todayAttendance: "Today's Attendance",
    feeCollection: 'Fee Collection',
    pendingActions: 'Pending Actions',
    actionRequired: 'Action Required',
    takeFirstPeriod: 'Take First Period Attendance',
    classWaiting: 'Class 8A is waiting.',
    periodsCompleted: 'Periods Completed',
    unlockToView: 'Unlock to view',
    reviewLeaves: 'Review Leaves',
    monthlyTarget: 'of monthly target',
    fromYesterday: 'from yesterday',
    
    // Modules
    mod_students: 'Students Info',
    mod_staff: 'Staff Info',
    mod_salary: 'My Salary Slip',
    mod_ai_insights: 'AI Command Center',
    mod_staff_attendance: 'Staff Attendance',
    mod_attendance: 'Take Attendance',
    mod_absent: 'Absent Info',
    mod_classes: 'Classes & Timetable',
    mod_work_done: 'Work Done',
    mod_homework: 'Homework Upload',
    mod_study_material: 'Study Material Upload',
    mod_exam_marks: 'Exam Marks',
    mod_diary: 'Daily Diary',
    mod_documents: 'Document Approvals',
    mod_chat: 'Chat / Connect',
    mod_notifications: 'Send Notification',
    mod_suggestions: 'Suggestions'
  },
  kn: {
    // Login
    appName: 'ವಿದ್ಯಾಸೇತು',
    subtitle: 'ಕೇಂದ್ರ ಕಮಾಂಡ್ ಡೆಸ್ಕ್. ಕಾರ್ಯಸ್ಥಳವನ್ನು ಪ್ರವೇಶಿಸಲು ದೃಢೀಕರಿಸಿ.',
    guardian: 'ಪೋಷಕರು',
    faculty: 'ಶಿಕ್ಷಕರು',
    phoneLabel: 'ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    facultyPhone: 'ಶಿಕ್ಷಕರ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    phonePlaceholder: 'ಉದಾ: +91 74832 92660',
    reqKey: 'ದೃಢೀಕರಣ ಕೀಲಿಯನ್ನು ವಿನಂತಿಸಿ',
    transmitting: 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
    keyLabel: 'ದೃಢೀಕರಣ ಕೀಲಿ (ಕಳುಹಿಸಲಾಗಿದೆ',
    keyPlaceholder: '6-ಅಂಕಿಯ ಕೋಡ್',
    verifying: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    confirmKey: 'ದೃಢೀಕರಿಸಿ ಮತ್ತು ಪ್ರವೇಶಿಸಿ',
    reenter: 'ಸಂಖ್ಯೆಯನ್ನು ಮರು-ನಮೂದಿಸಿ',
    devBypass: 'ಡೆವಲಪರ್ ತ್ವರಿತ ಪ್ರವೇಶ',
    principal: 'ಪ್ರಾಂಶುಪಾಲರು',
    teacher: 'ಶಿಕ್ಷಕರು',
    parent: 'ಪೋಷಕರು',
    clerk: 'ಗುಮಾಸ್ತ',
    idCheck: 'ಗುರುತಿನ ಪರಿಶೀಲನೆ',
    sysAuth: 'SYS_AUTH_v3',

    // Dashboard
    welcomeBack: 'ಸ್ವಾಗತ',
    askVidya: 'ವಿದ್ಯಾಗೆ ಕೇಳಿ ಉದಾ: "8ನೇ ತರಗತಿ ಗೈರುಹಾಜರಾದವರನ್ನು ತೋರಿಸಿ..."',
    todayAttendance: 'ಇಂದಿನ ಹಾಜರಾತಿ',
    feeCollection: 'ಶುಲ್ಕ ಸಂಗ್ರಹ',
    pendingActions: 'ಬಾಕಿ ಉಳಿದಿರುವ ಕಾರ್ಯಗಳು',
    actionRequired: 'ಕ್ರಮ ಅಗತ್ಯವಿದೆ',
    takeFirstPeriod: 'ಮೊದಲ ಅವಧಿಯ ಹಾಜರಾತಿ ತೆಗೆದುಕೊಳ್ಳಿ',
    classWaiting: '8ನೇ ತರಗತಿ ಕಾಯುತ್ತಿದೆ.',
    periodsCompleted: 'ಪೂರ್ಣಗೊಂಡ ಅವಧಿಗಳು',
    unlockToView: 'ವೀಕ್ಷಿಸಲು ಅನ್ಲಾಕ್ ಮಾಡಿ',
    reviewLeaves: 'ರಜೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
    monthlyTarget: 'ಮಾಸಿಕ ಗುರಿಯ',
    fromYesterday: 'ನಿನ್ನೆಯಿಂದ',

    // Modules
    mod_students: 'ವಿದ್ಯಾರ್ಥಿಗಳ ಮಾಹಿತಿ',
    mod_staff: 'ಸಿಬ್ಬಂದಿ ಮಾಹಿತಿ',
    mod_salary: 'ನನ್ನ ವೇತನ ಚೀಟಿ',
    mod_ai_insights: 'ಎಐ ಕಮಾಂಡ್ ಸೆಂಟರ್',
    mod_staff_attendance: 'ಸಿಬ್ಬಂದಿ ಹಾಜರಾತಿ',
    mod_attendance: 'ಹಾಜರಾತಿ ತೆಗೆದುಕೊಳ್ಳಿ',
    mod_absent: 'ಗೈರುಹಾಜರಿ ಮಾಹಿತಿ',
    mod_classes: 'ತರಗತಿಗಳು ಮತ್ತು ವೇಳಾಪಟ್ಟಿ',
    mod_work_done: 'ಪೂರ್ಣಗೊಂಡ ಕೆಲಸ',
    mod_homework: 'ಮನೆಕೆಲಸ ಅಪ್‌ಲೋಡ್',
    mod_study_material: 'ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ ಅಪ್‌ಲೋಡ್',
    mod_exam_marks: 'ಪರೀಕ್ಷೆಯ ಅಂಕಗಳು',
    mod_diary: 'ದೈನಂದಿನ ಡೈರಿ',
    mod_documents: 'ದಾಖಲೆಗಳ ಅನುಮೋದನೆ',
    mod_chat: 'ಚಾಟ್ / ಸಂಪರ್ಕ',
    mod_notifications: 'ಸೂಚನೆ ಕಳುಹಿಸಿ',
    mod_suggestions: 'ಸಲಹೆಗಳು'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('vidya_lang') as Language;
    if (saved && (saved === 'en' || saved === 'kn')) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('vidya_lang', newLang);
  };

  const t = (key: string): string => {
    // @ts-ignore
    return TRANSLATIONS[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
