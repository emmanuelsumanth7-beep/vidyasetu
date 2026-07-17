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
  Briefcase,
  BadgeCheck,
  CalendarDays,
  FileCheck2
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  role: string;
  isActive?: boolean;
  employeeCode?: string;
  department?: string;
  dateOfJoining?: string;
  policeVerification?: string;
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
  switch (role.toLowerCase()) {
    case 'principal':
      return `${base} bg-red-100 text-red-800`;
    case 'teacher':
      return `${base} bg-blue-100 text-blue-800`;
    case 'clerk':
      return `${base} bg-amber-100 text-amber-800`;
    case 'accountant':
      return `${base} bg-green-100 text-green-800`;
    case 'librarian':
      return `${base} bg-purple-100 text-purple-800`;
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
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  
  const socket = useSocket();

  // Form state
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffRole>('teacher');
  const [password, setPassword] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [department, setDepartment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const filteredStaff = useMemo(() => {
    if (!searchQuery.trim()) return staff;
    const q = searchQuery.toLowerCase();
    return staff.filter((m) => m.name.toLowerCase().includes(q) || (m.employeeCode && m.employeeCode.toLowerCase().includes(q)));
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
      // Mock some extended data since backend doesn't return everything yet
      const extendedData = data.map((d: any, i: number) => ({
        ...d,
        employeeCode: d.employeeCode || `EMP-${1000 + i}`,
        department: d.department || (d.role.toLowerCase() === 'teacher' ? 'Academics' : 'Administration'),
        dateOfJoining: d.dateOfJoining || '2024-06-15',
        policeVerification: i % 3 === 0 ? 'Pending' : 'Verified'
      }));
      setStaff(extendedData);
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
    setEmployeeCode('');
    setDepartment('');
    setFormError('');
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      await api.post('/staff', { name, phoneNumber, email, role, password, employeeCode, department });
      setShowAddModal(false);
      resetForm();
      setToastMessage(`${role.charAt(0).toUpperCase() + role.slice(1)} added successfully.`);
      setTimeout(() => setToastMessage(''), 4000);
      fetchStaff(); // Refresh list to get mock data if backend doesn't return full profile
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add staff member.';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSkeletons = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="p-4 border-b border-gray-100">
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="divide-y divide-gray-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 flex gap-4">
            <div className="h-6 bg-gray-200 rounded w-1/5"></div>
            <div className="h-6 bg-gray-200 rounded w-1/5"></div>
            <div className="h-6 bg-gray-200 rounded w-1/5"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in space-y-6 flex relative">
      
      <div className={`flex-1 transition-all duration-300 ${selectedMember ? 'mr-[400px]' : ''}`}>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink-primary font-display tracking-tight">Staff Directory</h1>
            <p className="text-ink-secondary mt-1">Manage teachers, clerks, and administrative staff profiles.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
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
                placeholder="Search by name or code…"
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
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                      <th className="p-4 font-semibold">Emp Code</th>
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Role</th>
                      <th className="p-4 font-semibold">Department</th>
                      <th className="p-4 font-semibold">Phone Number</th>
                      <th className="p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStaff.map((member) => (
                      <tr 
                        key={member.id} 
                        onClick={() => setSelectedMember(member)}
                        className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                      >
                        <td className="p-4 text-ink-secondary font-mono text-sm">{member.employeeCode}</td>
                        <td className="p-4">
                          <span className="font-bold text-ink-primary">{member.name}</span>
                        </td>
                        <td className="p-4">
                          <span className={roleBadgeClass(member.role)}>
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </span>
                        </td>
                        <td className="p-4 text-ink-secondary">{member.department}</td>
                        <td className="p-4 text-ink-secondary font-data">{member.phoneNumber}</td>
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
            </>
          )}
        </div>
      </div>

      {/* Slide-over Profile Detail */}
      {selectedMember && (
        <div className="fixed inset-y-0 right-0 w-[400px] bg-white border-l border-gray-200 shadow-2xl z-40 transform transition-transform duration-300 translate-x-0 overflow-y-auto">
          <div className="p-6">
            <button onClick={() => setSelectedMember(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center text-center mb-8 mt-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-full flex items-center justify-center text-interactive-blue mb-4 shadow-sm border border-blue-100">
                <span className="text-3xl font-display font-bold">{selectedMember.name.charAt(0)}</span>
              </div>
              <h2 className="text-2xl font-bold text-ink-primary font-display">{selectedMember.name}</h2>
              <p className="text-gray-500 font-mono text-sm mt-1">{selectedMember.employeeCode}</p>
              <div className="mt-3">
                <span className={roleBadgeClass(selectedMember.role)}>
                  {selectedMember.role.charAt(0).toUpperCase() + selectedMember.role.slice(1)}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Information</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-gray-400" />
                    <span className="font-medium text-ink-primary">{selectedMember.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-400" />
                    <span className="font-medium text-ink-primary">{selectedMember.email || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Employment Details</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Briefcase size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Department</p>
                      <p className="font-medium text-ink-primary">{selectedMember.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarDays size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Date of Joining</p>
                      <p className="font-medium text-ink-primary">{new Date(selectedMember.dateOfJoining || '').toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Compliance</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-gray-400" />
                      <span className="font-medium text-ink-primary">Police Verification</span>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${selectedMember.policeVerification === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {selectedMember.policeVerification}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileCheck2 size={18} className="text-gray-400" />
                      <span className="font-medium text-ink-primary">Qualifications</span>
                    </div>
                    <button className="text-interactive-blue text-sm font-semibold hover:underline">View Docs</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button className="w-full bg-white border-2 border-red-100 text-red-600 font-bold py-2.5 rounded-lg hover:bg-red-50 transition-colors">
                Suspend Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 animate-scale-in flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h2 className="text-xl font-bold text-ink-primary font-display flex items-center gap-2">
                <UserPlus size={20} className="text-interactive-blue" />
                Add New Staff Member
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {formError && (
                <div className="mb-6 bg-red-50 text-red-800 p-4 rounded-xl flex items-start gap-3 border border-red-100">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <span className="text-sm font-medium">{formError}</span>
                </div>
              )}

              <form id="add-staff-form" onSubmit={handleAddStaff} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-bold text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue focus:border-transparent transition-all"
                      placeholder="e.g. Anita Sharma"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Employee Code</label>
                    <input
                      type="text"
                      value={employeeCode}
                      onChange={(e) => setEmployeeCode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue focus:border-transparent transition-all"
                      placeholder="EMP-1024"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue focus:border-transparent transition-all"
                      placeholder="e.g. Science"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue focus:border-transparent transition-all"
                      placeholder="+91..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue focus:border-transparent transition-all"
                      placeholder="name@school.com"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-bold text-gray-700">Role *</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as StaffRole)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue focus:border-transparent transition-all bg-white"
                    >
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-staff-form"
                disabled={isSubmitting}
                className="bg-interactive-blue hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center min-w-[120px]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Add Staff'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50">
          <CheckCircle size={20} className="text-green-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
