'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { useSocket } from '@/components/SocketProvider';
import {
  UserPlus,
  Search,
  Users,
  Phone,
  Mail,
  Shield,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  role: string;
  isActive?: boolean;
}

type StaffRole = 'teacher' | 'clerk' | 'accountant' | 'librarian' | 'principal';

const ROLES: { value: StaffRole; label: string }[] = [
  { value: 'teacher', label: 'Teacher' },
  { value: 'clerk', label: 'Clerk' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'librarian', label: 'Librarian' },
  { value: 'principal', label: 'Principal' },
];

function roleBadgeClass(role: string): string {
  const base = "px-2.5 py-1 text-xs font-semibold rounded-full";
  switch (role) {
    case 'principal':
      return `${base} bg-red-100 text-red-800`;
    case 'teacher':
      return `${base} bg-blue-100 text-blue-800`;
    case 'clerk':
      return `${base} bg-amber-100 text-amber-800`;
    case 'accountant':
      return `${base} bg-green-100 text-green-800`;
    case 'librarian':
      return `${base} bg-green-100 text-green-800`;
    default:
      return `${base} bg-gray-100 text-gray-800`;
  }
}

function statusBadgeClass(isActive: boolean): string {
  const base = "px-2.5 py-1 text-xs font-semibold rounded-full";
  return isActive ? `${base} bg-green-100 text-green-800` : `${base} bg-yellow-100 text-yellow-800`;
}

export default function StaffDirectory() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const socket = useSocket();

  // Form state
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffRole>('teacher');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const filteredStaff = useMemo(() => {
    if (!searchQuery.trim()) return staff;
    const q = searchQuery.toLowerCase();
    return staff.filter((m) => m.name.toLowerCase().includes(q));
  }, [staff, searchQuery]);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleStaffAdded = (newStaff: StaffMember) => {
      setStaff((prev) => [...prev, newStaff]);
      setToastMessage(`${newStaff.name} has been added to the team.`);
      setTimeout(() => setToastMessage(''), 4000);
    };

    socket.on('staffAdded', handleStaffAdded);

    return () => {
      socket.off('staffAdded', handleStaffAdded);
    };
  }, [socket]);

  const fetchStaff = async () => {
    try {
      const data = await api.get('/staff');
      setStaff(data);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setPhoneNumber('');
    setEmail('');
    setRole('teacher');
    setPassword('');
    setFormError('');
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      await api.post('/staff', { name, phoneNumber, email, role, password });
      closeModal();
      setToastMessage(
        `${role.charAt(0).toUpperCase() + role.slice(1)} added — they can log in now with their phone number.`
      );
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to add staff member.';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skeleton rows for loading state
  const renderSkeletons = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="p-4 border-b border-gray-100">
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="divide-y divide-gray-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 flex gap-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink-primary font-display tracking-tight">Staff Directory</h1>
          <p className="text-ink-secondary mt-1">Manage teachers, clerks, and administrative staff.</p>
        </div>
        <button 
          onClick={openModal}
          className="bg-interactive-blue hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <UserPlus size={18} />
          <span>Add Staff</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue focus:border-transparent transition-all"
            />
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
            <Users size={14} />
            <span>{filteredStaff.length} {filteredStaff.length === 1 ? 'member' : 'members'}</span>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          renderSkeletons()
        ) : filteredStaff.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-ink-primary mb-2">
              {searchQuery ? 'No matches found' : 'No staff members yet'}
            </h3>
            <p className="text-ink-secondary mb-6 max-w-md">
              {searchQuery
                ? `No staff members match "${searchQuery}". Try a different search.`
                : 'Add your first staff member to get started.'}
            </p>
            {!searchQuery && (
              <button 
                onClick={openModal}
                className="bg-interactive-blue hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <UserPlus size={18} />
                <span>Add Staff</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Phone Number</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStaff.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-ink-primary">{member.name}</span>
                      </td>
                      <td className="p-4">
                        <span className={roleBadgeClass(member.role)}>
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-ink-secondary font-data">{member.phoneNumber}</td>
                      <td className="p-4 text-ink-secondary">{member.email || '—'}</td>
                      <td className="p-4">
                        <span className={statusBadgeClass(member.isActive !== false)}>
                          {member.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredStaff.map((member) => (
                <div key={member.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-ink-primary text-base">{member.name}</h4>
                      <p className="text-ink-secondary text-sm font-data mt-0.5">{member.phoneNumber}</p>
                    </div>
                    <span className={roleBadgeClass(member.role)}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-ink-secondary truncate max-w-[60%]">
                      {member.email || 'No email provided'}
                    </div>
                    <span className={statusBadgeClass(member.isActive !== false)}>
                      {member.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-ink-primary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-ink-primary">Add New Staff</h3>
              <button onClick={closeModal} className="p-2 -mr-2 text-gray-400 hover:text-gray-700 bg-white rounded-full border border-gray-200 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStaff}>
              <div className="p-5 space-y-4">
                {formError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg flex gap-2 items-start text-sm">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-ink-primary" htmlFor="staff-name">Full Name</label>
                  <input
                    id="staff-name"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-ink-primary" htmlFor="staff-role">Role</label>
                  <select
                    id="staff-role"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue bg-white"
                    value={role}
                    onChange={(e) => setRole(e.target.value as StaffRole)}
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-ink-primary flex items-center gap-1.5" htmlFor="staff-phone">
                      <Phone size={14} className="text-gray-400"/> Phone Number
                    </label>
                    <input
                      id="staff-phone"
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue font-data"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="10-digit number"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-ink-primary flex items-center gap-1.5" htmlFor="staff-email">
                      <Mail size={14} className="text-gray-400"/> Email (Optional)
                    </label>
                    <input
                      id="staff-email"
                      type="email"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@school.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-ink-primary flex items-center gap-1.5" htmlFor="staff-password">
                    <Shield size={14} className="text-gray-400"/> Password
                  </label>
                  <input
                    id="staff-password"
                    required
                    type="password"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue font-data tracking-wider"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set a login password"
                  />
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200 bg-white"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-interactive-blue hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving…' : 'Save Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-ink-primary text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-slide-up">
          <CheckCircle size={18} className="text-green-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
