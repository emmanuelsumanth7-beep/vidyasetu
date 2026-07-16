'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { Search, Plus, X, Users, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  classId: string;
  className?: string;
  section?: string;
  gender?: string;
  dob?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  rfidCardUid?: string;
  parentalConsent?: boolean;
}

interface SchoolClass {
  id: string;
  name: string;
}

const INITIAL_FORM = {
  name: '',
  rollNumber: '',
  className: '',
  section: '',
  gender: '',
  dob: '',
  bloodGroup: '',
  emergencyContact: '',
  rfidCardUid: '',
  parentalConsent: false,
};

export default function StudentsDirectory() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await api.get('/students');
      setStudents(data);
    } catch {
      console.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const data = await api.get('/classes');
      setClasses(data);
    } catch {
      console.error('Failed to fetch classes');
    }
  };

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.rollNumber?.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  const getClassName = (classId: string) => {
    const cls = classes.find((c) => c.id === classId);
    return cls?.name || classId || 'Unassigned';
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.rollNumber.trim()) {
      setFormError('Name and Roll Number are required.');
      return;
    }
    if (!formData.className.trim()) {
      setFormError('Please enter a class.');
      return;
    }

    setSubmitting(true);
    try {
      // Find or create class
      let targetClass = classes.find(
        (c) => c.name.toLowerCase() === formData.className.trim().toLowerCase()
      );
      if (!targetClass) {
        targetClass = await api.post('/classes', {
          name: formData.className.trim(),
        });
        setClasses([...classes, targetClass!]);
      }

      await api.post('/students', {
        ...formData,
        classId: targetClass!.id,
      });

      setShowModal(false);
      setFormData(INITIAL_FORM);
      fetchStudents();
    } catch (err: any) {
      setFormError(err.message || 'Failed to register student');
    } finally {
      setSubmitting(false);
    }
  };

  // Skeleton Loading
  const renderSkeletons = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse lg:col-span-2">
      <div className="p-4 border-b border-gray-100">
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="divide-y divide-gray-100">
        {[1, 2, 3, 4, 5].map((i) => (
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
    <div className="max-w-7xl mx-auto w-full animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink-primary font-display tracking-tight">Student Roster</h1>
          <p className="text-ink-secondary mt-1">Manage enrollments, IDs, and student profiles.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-interactive-blue hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          <span>Register Student</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Roster List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[650px]">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name or roll number…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue transition-all bg-white"
                />
              </div>
              <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                <Users size={14} />
                <span>{filteredStudents.length} Students</span>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto bg-white">
              {loading ? (
                renderSkeletons()
              ) : filteredStudents.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Users size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-ink-primary mb-2">No students found</h3>
                  <p className="text-ink-secondary max-w-md">Try a different search query or register a new student to populate the roster.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => (
                    <div 
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-50 ${selectedStudent?.id === student.id ? 'bg-blue-50/50 border-l-4 border-interactive-blue' : 'border-l-4 border-transparent'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center border border-blue-200">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-ink-primary">{student.name}</div>
                          <div className="text-xs font-data text-ink-secondary mt-0.5">
                            {student.rollNumber} • {getClassName(student.classId)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {student.rfidCardUid ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-800">
                            <CreditCard size={12} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                            No Card
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details Sidebar */}
        <div className="xl:col-span-1">
          {selectedStudent ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
              <div className="h-24 bg-gradient-to-r from-interactive-blue to-blue-400"></div>
              <div className="px-6 pb-6 relative">
                <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-sm flex items-center justify-center text-3xl font-display font-bold text-interactive-blue -mt-10 mb-4">
                  {selectedStudent.name.charAt(0)}
                </div>
                
                <h3 className="text-2xl font-bold text-ink-primary mb-1">{selectedStudent.name}</h3>
                <p className="text-ink-secondary font-data text-sm mb-6">Roll: {selectedStudent.rollNumber}</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-ink-secondary text-sm">Class & Section</span>
                    <span className="font-semibold text-ink-primary">
                      {getClassName(selectedStudent.classId)} {selectedStudent.section ? `- ${selectedStudent.section}` : ''}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-ink-secondary text-sm">Gender</span>
                    <span className="font-semibold text-ink-primary">{selectedStudent.gender || '—'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-ink-secondary text-sm">Date of Birth</span>
                    <span className="font-semibold text-ink-primary">
                      {selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString() : '—'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-ink-secondary text-sm">Blood Group</span>
                    <span className="font-semibold text-ink-primary text-red-600">{selectedStudent.bloodGroup || '—'}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-ink-secondary text-sm">Emergency</span>
                    <span className="font-semibold text-ink-primary font-data">{selectedStudent.emergencyContact || '—'}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-ink-secondary text-sm">Data Consent</span>
                    {selectedStudent.parentalConsent ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-800">
                        <CheckCircle2 size={12} /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-800">
                        Missing
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col py-2">
                    <span className="text-ink-secondary text-sm mb-1">RFID Access Card</span>
                    {selectedStudent.rfidCardUid ? (
                      <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg font-data text-sm flex items-center justify-between">
                        <span>{selectedStudent.rfidCardUid}</span>
                        <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 text-gray-500 px-3 py-2 rounded-lg text-sm">
                        No active card assigned
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[400px] flex flex-col items-center justify-center p-8 text-center sticky top-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Users size={32} className="text-blue-300" />
              </div>
              <h3 className="text-lg font-bold text-ink-primary mb-2">Select a Student</h3>
              <p className="text-ink-secondary">Click on any student in the roster to view their complete profile and access details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-ink-primary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50 shrink-0">
              <h3 className="font-bold text-lg text-ink-primary">Register New Student</h3>
              <button onClick={() => setShowModal(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-700 bg-white rounded-full border border-gray-200 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              <form id="student-form" onSubmit={handleCreate} className="space-y-4">
                {formError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg flex gap-2 items-start text-sm">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-ink-primary" htmlFor="stu-name">Full Name</label>
                    <input
                      id="stu-name"
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Arjun Sharma"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-ink-primary" htmlFor="stu-roll">Roll Number</label>
                    <input
                      id="stu-roll"
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue font-data"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      placeholder="e.g. 2024-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-ink-primary" htmlFor="stu-class">Class</label>
                    <input
                      id="stu-class"
                      required
                      list="class-suggestions"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue"
                      value={formData.className}
                      onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                      placeholder="e.g. Class 5A"
                    />
                    <datalist id="class-suggestions">
                      {classes.map((c) => (
                        <option key={c.id} value={c.name} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-ink-primary" htmlFor="stu-section">Section (Optional)</label>
                    <input
                      id="stu-section"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      placeholder="e.g. A"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-ink-primary" htmlFor="stu-gender">Gender</label>
                    <select
                      id="stu-gender"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue bg-white"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="">Select…</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-ink-primary" htmlFor="stu-dob">Date of Birth</label>
                    <input
                      id="stu-dob"
                      type="date"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-ink-primary" htmlFor="stu-blood">Blood Group</label>
                    <input
                      id="stu-blood"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue"
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      placeholder="e.g. O+"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-ink-primary" htmlFor="stu-emergency">Emergency Contact</label>
                    <input
                      id="stu-emergency"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue font-data"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      placeholder="10-digit number"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-gray-100">
                  <label className="text-sm font-semibold text-ink-primary flex justify-between items-center" htmlFor="stu-rfid">
                    <span>RFID Card UID</span>
                    <span className="text-xs font-normal text-gray-500">Optional</span>
                  </label>
                  <input
                    id="stu-rfid"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-interactive-blue font-data uppercase"
                    value={formData.rfidCardUid}
                    onChange={(e) => setFormData({ ...formData, rfidCardUid: e.target.value })}
                    placeholder="e.g. A1B2C3D4"
                  />
                  <p className="text-xs text-gray-500 mt-1">Tap a card to auto-fill or enter manually.</p>
                </div>

                <div className="space-y-1 pt-2 border-t border-gray-100 flex items-start gap-2 mt-4">
                  <input
                    id="stu-consent"
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-interactive-blue border-gray-300 rounded focus:ring-interactive-blue"
                    checked={formData.parentalConsent}
                    onChange={(e) => setFormData({ ...formData, parentalConsent: e.target.checked })}
                  />
                  <label className="text-sm text-ink-secondary leading-tight" htmlFor="stu-consent">
                    <span className="font-semibold text-ink-primary block mb-0.5">Parental Data Consent Verified</span>
                    I confirm that a guardian has signed the data privacy consent form for this student in accordance with ISO/IEC 27701.
                  </label>
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0 rounded-b-2xl">
              <button
                type="button"
                className="px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200 bg-white"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="student-form"
                className="bg-interactive-blue hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                disabled={submitting}
              >
                {submitting ? 'Saving…' : 'Register Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
