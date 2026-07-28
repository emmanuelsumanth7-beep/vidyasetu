'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  FileText, 
  Info, 
  AlertTriangle, 
  Book, 
  MessageSquare,
  Award,
  BookMarked,
  CreditCard,
  UserCheck,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { readUserSession, ClientUser } from '@/lib/session';
import { subscribeToNotifications, markAsRead, markAllAsRead, AppNotification } from '@/lib/notifications';

function formatRelativeTime(timestamp: number) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

function groupNotificationsByDate(notifications: AppNotification[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: { [key: string]: AppNotification[] } = {
    'Today': [],
    'Yesterday': [],
    'Earlier': []
  };

  notifications.forEach(n => {
    const date = new Date(n.createdAt);
    if (date >= today) {
      groups['Today'].push(n);
    } else if (date >= yesterday) {
      groups['Yesterday'].push(n);
    } else {
      groups['Earlier'].push(n);
    }
  });

  return groups;
}

const IconMap: Record<string, React.ElementType> = {
  'Award': Award,
  'BookMarked': BookMarked,
  'Bell': Bell,
  'CreditCard': CreditCard,
  'UserCheck': UserCheck,
  'BookOpen': BookOpen,
  'Calendar': Calendar,
  'Sparkles': Sparkles,
  'file-text': FileText,
  'calendar': Calendar,
  'check-circle': CheckCircle2,
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  'info': Info,
  'book': Book,
  'message-square': MessageSquare,
  'bell': Bell
};

export function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [user, setUser] = useState<ClientUser | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const currentUser = readUserSession();
    setUser(currentUser);
    
    if (currentUser && currentUser.schoolId) {
      const unsubscribe = subscribeToNotifications(currentUser.schoolId, (allNotifs) => {
        const role = currentUser.role;
        
        // Filter by targetAudience
        const relevant = allNotifs.filter(n => {
          if (n.targetAudience === 'all') return true;
          if (['admin', 'super_admin', 'principal'].includes(role)) return true;
          
          const aud = n.targetAudience;
          if (aud === 'parents' && role === 'parent') return true;
          if (aud === 'students' && role === 'student') return true;
          if (aud === 'staff' && ['teacher', 'staff', 'clerk', 'accountant', 'librarian'].includes(role)) return true;
          
          return false;
        });
        
        // Sort by createdAt desc
        const sorted = relevant.sort((a, b) => b.createdAt - a.createdAt);
        setNotifications(sorted);
      });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current && 
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => user && !n.readBy.includes(user.id)).length;
  const hasUnread = unreadCount > 0;
  
  const handleMarkAsRead = async (id: string) => {
    if (user) {
      await markAsRead(id, user.id);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (user && user.schoolId) {
      await markAllAsRead(user.schoolId, user.id);
    }
  };

  const groups = groupNotificationsByDate(notifications);
  const prevUnreadCount = useRef(unreadCount);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (unreadCount > prevUnreadCount.current) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 1000);
      return () => clearTimeout(timer);
    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  return (
    <div className="relative z-[60]">
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-glass-2)] border border-[var(--color-border)] hover:bg-[var(--color-glass-3)] transition-colors shadow-sm"
        animate={shake ? { rotate: [0, -15, 15, -10, 10, -5, 5, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" strokeWidth={2} />
        {hasUnread && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={unreadCount}
            className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full border-2 border-white dark:border-[#151226] text-[10px] font-bold text-white shadow-sm"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
          {/* Backdrop overlay to block content underneath */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed right-3 top-16 md:absolute md:right-0 md:top-auto mt-3 w-[calc(100vw-24px)] max-w-[380px] z-[80] flex flex-col rounded-[20px]"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.05) inset',
              backdropFilter: 'blur(40px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] bg-white/40 dark:bg-black/20">
              <h3 className="font-display font-semibold text-lg text-[var(--color-ink-primary)]">
                Notifications
              </h3>
              {hasUnread && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-medium text-[var(--color-interactive-blue,var(--color-primary))] hover:opacity-80 transition-opacity flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto no-scrollbar py-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-glass-2)] flex items-center justify-center mb-4 shadow-sm">
                    <Bell className="w-6 h-6 text-[var(--color-text-tertiary)]" />
                  </div>
                  <p className="text-[var(--color-text-secondary)] font-medium">No notifications yet</p>
                  <p className="text-[var(--color-text-tertiary)] text-sm mt-1">You&apos;re all caught up!</p>
                </div>
              ) : (
                Object.entries(groups).map(([dateLabel, items]) => {
                  if (items.length === 0) return null;
                  return (
                    <div key={dateLabel} className="mb-2">
                      <div className="px-5 py-1.5">
                        <span className="text-[11px] font-bold tracking-wider uppercase text-[var(--color-text-tertiary)]">
                          {dateLabel}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        {items.map((notification) => {
                          const isUnread = user && !notification.readBy.includes(user.id);
                          const IconComp = IconMap[notification.icon] || Info;
                          
                          return (
                            <button
                              key={notification.id}
                              onClick={() => {
                                if (isUnread) handleMarkAsRead(notification.id);
                              }}
                              className={`relative flex items-start gap-4 px-5 py-3 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
                                isUnread ? 'bg-black/[0.02] dark:bg-white/[0.02]' : ''
                              }`}
                            >
                              <div
                                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                                style={{ backgroundColor: `${notification.color}20`, color: notification.color }}
                              >
                                <IconComp className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0 pt-0.5">
                                <p className={`text-[13px] sm:text-sm ${isUnread ? 'font-semibold text-[var(--color-text-primary)]' : 'font-medium text-[var(--color-text-secondary)]'}`}>
                                  {notification.title}
                                </p>
                                <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5 line-clamp-2 leading-relaxed">
                                  {notification.body}
                                </p>
                                <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1.5 font-medium">
                                  {formatRelativeTime(notification.createdAt)}
                                </p>
                              </div>
                              {isUnread && (
                                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-[var(--color-interactive-blue,var(--color-primary))] mt-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 border-t border-[var(--color-border)] bg-white/40 dark:bg-black/20">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/dashboard/notifications');
                }}
                className="w-full py-2.5 text-sm font-semibold text-[var(--color-text-primary)] bg-[var(--color-glass)] hover:bg-[var(--color-glass-2)] rounded-[14px] transition-colors text-center shadow-sm border border-[var(--color-border)]"
              >
                View All Notifications
              </button>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
