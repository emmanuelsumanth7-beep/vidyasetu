"use client";

import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  StickyNote, 
  Clock, 
  BookOpen, 
  BellRing, 
  CalendarDays, 
  CalendarClock, 
  MessageSquareQuote, 
  Globe, 
  LogOut,
  Moon
} from 'lucide-react';

export function AccountMenu({ onBack }: { onBack: () => void }) {
  // Simple dark mode toggle for demonstration
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const menuItems = [
    { icon: StickyNote, label: 'Remarks', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { icon: Clock, label: 'Late comer', color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-500/10' },
    { icon: BookOpen, label: 'Study material', color: 'text-rose-400', bg: 'bg-rose-50 dark:bg-rose-400/10' },
    { icon: BellRing, label: 'My notification', color: 'text-sky-400', bg: 'bg-sky-50 dark:bg-sky-400/10' },
    { icon: CalendarDays, label: 'Calender', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    { icon: CalendarClock, label: 'Upcoming events', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-600/10' },
    { icon: MessageSquareQuote, label: 'Suggestion', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { icon: Globe, label: 'Website', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
    { icon: LogOut, label: 'Logout', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', action: () => alert('Logging out...') },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 max-w-2xl mx-auto rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
      <header className="flex items-center justify-between p-4 border-b border-transparent">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account</h2>
        <div className="w-10"></div> {/* Spacer to center the title */}
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-800 overflow-hidden">
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
              onClick={item.action}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg} ${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="flex-1 text-base font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-800 overflow-hidden">
           <div 
              className="flex items-center gap-4 p-4 cursor-pointer"
              onClick={toggleDarkMode}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-50 dark:bg-yellow-500/10 text-yellow-500">
                <Moon size={20} />
              </div>
              <span className="flex-1 text-base font-medium text-gray-800 dark:text-gray-200">Enable dark mode</span>
              
              <div className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
