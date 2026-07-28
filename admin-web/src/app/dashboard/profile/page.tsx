'use client';

import { useState } from 'react';
import { readUserSession } from '@/lib/session';
import { SchoolConfig } from '@/config/school.config';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Briefcase, BookOpen, Calendar, Award, Shield, MapPin, Clock, GraduationCap } from 'lucide-react';

export default function ProfilePage() {
  const [user] = useState(() => readUserSession());

  if (!user) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const renderStats = () => {
    const role = (user.role || '').toLowerCase();
    let stats = [];

    if (role === 'principal' || role === 'admin') {
      stats = [
        { label: 'Schools Managed', value: '1', icon: Briefcase },
        { label: 'Total Staff', value: '24', icon: User },
        { label: 'Total Students', value: '450', icon: GraduationCap },
        { label: 'Pending Approvals', value: '7', icon: Clock },
      ];
    } else if (role === 'teacher') {
      stats = [
        { label: 'Classes Assigned', value: '4', icon: BookOpen },
        { label: 'Students', value: '120', icon: User },
        { label: 'Attendance Rate', value: '94%', icon: Calendar },
        { label: 'Leave Balance', value: '12', icon: Briefcase },
      ];
    } else if (role === 'clerk') {
      stats = [
        { label: 'Documents Processed', value: '156', icon: BookOpen },
        { label: 'Fee Collections', value: '₹4.2L', icon: Briefcase },
        { label: 'Pending Tasks', value: '5', icon: Clock },
        { label: 'Certificates Issued', value: '23', icon: Award },
      ];
    } else {
      stats = [
        { label: 'Children Enrolled', value: '1', icon: User },
        { label: 'Attendance', value: '92%', icon: Calendar },
        { label: 'Fees Paid', value: '₹45,000', icon: Briefcase },
        { label: 'Next Exam', value: '15 days', icon: Clock },
      ];
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card p-4 flex flex-col items-center justify-center text-center rounded-xl" style={{ backgroundColor: 'var(--color-glass)', borderColor: 'var(--color-border)' }}>
              <Icon size={24} className="mb-2" style={{ color: 'var(--color-primary)' }} />
              <div className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{stat.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-[700px] mx-auto pb-12"
    >
      <div className="mb-6 flex flex-col items-center">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg mb-4"
          style={{ 
            background: `linear-gradient(135deg, ${SchoolConfig.theme?.primaryLight || 'var(--color-primary-light)'}, var(--color-primary))`,
            color: 'white'
          }}
        >
          {getInitials(user.name)}
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{user.name}</h1>
        <div className="px-3 py-1 rounded-full text-sm font-semibold mb-2" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
          {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
        </div>
        <div style={{ color: 'var(--color-text-secondary)' }}>{SchoolConfig.name}</div>
      </div>

      {renderStats()}

      <div className="glass-card mt-6 p-6 rounded-xl" style={{ backgroundColor: 'var(--color-glass)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
          <User size={20} style={{ color: 'var(--color-primary)' }} />
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <Phone size={18} style={{ color: 'var(--color-text-secondary)' }} />
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Phone</div>
              <div style={{ color: 'var(--color-text-primary)' }}>{user.phoneNumber || 'Not provided'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} style={{ color: 'var(--color-text-secondary)' }} />
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Email</div>
              <div style={{ color: 'var(--color-text-primary)' }}>{user.email || 'Not provided'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase size={18} style={{ color: 'var(--color-text-secondary)' }} />
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Department</div>
              <div style={{ color: 'var(--color-text-primary)' }}>
                {user.role === 'principal' || user.role === 'admin' ? 'Administration' : 'Academic'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award size={18} style={{ color: 'var(--color-text-secondary)' }} />
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Designation</div>
              <div style={{ color: 'var(--color-text-primary)' }}>
                {user.role === 'principal' ? 'Head of Institution' : (user.role === 'admin' ? 'Administrator' : 'Senior Teacher')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield size={18} style={{ color: 'var(--color-text-secondary)' }} />
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Employee ID</div>
              <div style={{ color: 'var(--color-text-primary)' }}>VS-2024-001</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card mt-6 p-6 rounded-xl" style={{ backgroundColor: 'var(--color-glass)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
          <MapPin size={20} style={{ color: 'var(--color-primary)' }} />
          School Information
        </h2>
        <div className="space-y-4">
          <div>
            <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>School Name</div>
            <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{SchoolConfig.name}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Address</div>
            <div style={{ color: 'var(--color-text-primary)' }}>{SchoolConfig.contact?.address || 'Address Not Provided'}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Contact Email</div>
              <div style={{ color: 'var(--color-text-primary)' }}>{SchoolConfig.contact?.email || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Contact Phone</div>
              <div style={{ color: 'var(--color-text-primary)' }}>{SchoolConfig.contact?.phone || 'N/A'}</div>
            </div>
          </div>
          {SchoolConfig.affiliation && (
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Affiliation</div>
              <div style={{ color: 'var(--color-text-primary)' }}>
                {SchoolConfig.affiliation.board} ({SchoolConfig.affiliation.code})
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
