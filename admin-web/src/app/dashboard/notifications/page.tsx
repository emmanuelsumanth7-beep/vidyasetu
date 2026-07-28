'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Award, BookMarked, CreditCard, UserCheck, 
  BookOpen, Calendar, CheckCircle2, Filter, Sparkles,
  ArrowLeft
} from 'lucide-react';
import { readUserSession } from '@/lib/session';
import { subscribeToNotifications, markAsRead, markAllAsRead, type AppNotification } from '@/lib/notifications';
import { useRouter } from 'next/navigation';

const ICON_MAP: Record<string, any> = {
  Award, BookMarked, CreditCard, UserCheck, BookOpen, Calendar, Bell, Sparkles
};

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'marks_uploaded', label: 'Marks' },
  { id: 'diary_posted', label: 'Diary' },
  { id: 'notice_published', label: 'Notices' },
  { id: 'fee_reminder', label: 'Fees' },
  { id: 'attendance_alert', label: 'Attendance' },
  { id: 'homework_assigned', label: 'Homework' },
  { id: 'leave_status', label: 'Leaves' },
] as const;

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function groupByDate(items: AppNotification[]): { label: string; items: AppNotification[] }[] {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: Record<string, AppNotification[]> = {};
  
  items.forEach(item => {
    const d = new Date(item.createdAt);
    let label: string;
    if (d.toDateString() === today.toDateString()) label = 'Today';
    else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    else label = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });

  return Object.entries(groups).map(([label, items]) => ({ label, items }));
}

export default function NotificationsPage() {
  const router = useRouter();
  const [user] = useState(() => readUserSession());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.schoolId) {
      setLoading(false);
      return;
    }
    const unsubscribe = subscribeToNotifications(user.schoolId, (notifs) => {
      setNotifications(notifs);
      setLoading(false);
    });
    return unsubscribe;
  }, [user?.schoolId]);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    return notifications.filter(n => n.type === activeFilter);
  }, [notifications, activeFilter]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  const unreadCount = notifications.filter(n => !n.readBy?.includes(user?.id || '')).length;

  const handleMarkAllRead = async () => {
    if (!user?.schoolId || !user?.id) return;
    await markAllAsRead(user.schoolId, user.id);
  };

  const handleTapNotification = async (n: AppNotification) => {
    if (user?.id && !n.readBy?.includes(user.id)) {
      await markAsRead(n.id, user.id);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto w-full animate-fade-in pb-20 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-105"
            style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}
          >
            <ArrowLeft size={18} style={{ color: 'var(--color-text-primary)' }} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Notifications
            </h1>
            <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-xl text-xs font-black transition-all hover:scale-105"
            style={{ background: 'rgba(27,42,74,0.08)', color: '#1B2A4A' }}
          >
            <CheckCircle2 size={14} className="inline mr-1" />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div 
        className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        {FILTER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className="px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all"
            style={{
              background: activeFilter === tab.id ? 'var(--vs-primary)' : 'var(--color-glass)',
              color: activeFilter === tab.id ? '#fff' : 'var(--color-text-secondary)',
              border: `1px solid ${activeFilter === tab.id ? 'transparent' : 'var(--color-border)'}`,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-20 animate-pulse" style={{ background: 'var(--color-glass)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div 
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
            style={{ background: 'var(--color-glass-2)' }}
          >
            <Bell size={32} style={{ color: 'var(--color-text-tertiary)' }} />
          </div>
          <h3 className="text-lg font-black mb-2" style={{ color: 'var(--color-text-primary)' }}>
            No notifications
          </h3>
          <p className="text-sm font-medium max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {activeFilter !== 'all' 
              ? 'No notifications in this category yet.' 
              : "You're all caught up! Notifications will appear here when teachers update marks, post diaries, or publish notices."
            }
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {groups.map(group => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] px-1" style={{ color: 'var(--color-text-tertiary)' }}>
                  {group.label}
                </h3>

                <div className="space-y-2">
                  {group.items.map((n, idx) => {
                    const isUnread = !n.readBy?.includes(user?.id || '');
                    const IconComp = ICON_MAP[n.icon] || Bell;
                    
                    return (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => handleTapNotification(n)}
                        className="flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.01]"
                        style={{
                          background: isUnread ? 'var(--surface)' : 'var(--color-glass)',
                          border: `1px solid ${isUnread ? 'var(--color-border)' : 'transparent'}`,
                          boxShadow: isUnread ? '0 2px 12px rgba(0,0,0,0.04)' : 'none',
                        }}
                      >
                        {/* Icon */}
                        <div 
                          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                          style={{ background: `${n.color}15`, color: n.color }}
                        >
                          <IconComp size={20} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 
                              className={`text-sm leading-tight ${isUnread ? 'font-black' : 'font-bold'}`}
                              style={{ color: 'var(--color-text-primary)' }}
                            >
                              {n.title}
                            </h4>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: 'var(--color-text-tertiary)' }}>
                                {timeAgo(n.createdAt)}
                              </span>
                              {isUnread && (
                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#1B2A4A' }} />
                              )}
                            </div>
                          </div>
                          <p 
                            className="text-xs font-medium mt-1 line-clamp-2 leading-relaxed"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {n.body}
                          </p>
                          {n.createdBy && (
                            <p className="text-[10px] font-bold mt-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
                              By {n.createdBy}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
