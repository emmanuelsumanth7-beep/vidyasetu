'use client';
import { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  ShieldCheck,
  Palette,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Lock
} from 'lucide-react';
import { api } from '@/lib/api';

export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState('school');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    setIsUpdatingPassword(true);
    setPasswordError('');
    try {
      await api.post('/auth/set-password', { newPassword });
      setToastMessage('Password updated successfully!');
      setNewPassword('');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to set password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToastMessage('Settings saved successfully');
      setTimeout(() => setToastMessage(''), 3000);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] font-display tracking-tight">System Settings</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Global configuration, academic years, and security policies.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-[var(--shadow-glass)] disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <CheckCircle2 size={18} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {toastMessage && (
        <div className="bg-[#34C759]/10 text-[#34C759] p-4 rounded-lg flex items-center gap-2 border border-[#34C759]/20 animate-in slide-in-from-top-2">
          <CheckCircle2 size={20} />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-glass)] border border-[var(--color-border)] overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[var(--color-glass)] border-r border-[var(--color-border)] p-4 space-y-2">
          <button
            onClick={() => setActiveTab('school')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${activeTab === 'school' ? 'bg-blue-600 text-white shadow-[var(--shadow-glass)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-glass-2)]'}`}
          >
            <Building2 size={20} />
            School Profile
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${activeTab === 'academic' ? 'bg-blue-600 text-white shadow-[var(--shadow-glass)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-glass-2)]'}`}
          >
            <Calendar size={20} />
            Academic Years
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-[var(--shadow-glass)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-glass-2)]'}`}
          >
            <ShieldCheck size={20} />
            Security & Roles
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${activeTab === 'theme' ? 'bg-blue-600 text-white shadow-[var(--shadow-glass)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-glass-2)]'}`}
          >
            <Palette size={20} />
            Branding
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8">
          {activeTab === 'school' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">School Profile</h2>
                <p className="text-[var(--color-text-secondary)] text-sm mt-1">Basic information about the institution.</p>
              </div>
              <hr className="border-[var(--color-border)]" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[var(--color-text-primary)]">Institution Name</label>
                  <input type="text" defaultValue="Jnanasagara International Public School" className="w-full border border-[var(--color-border)] rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[var(--color-text-primary)]">Institution Code</label>
                  <input type="text" defaultValue="jips" disabled className="w-full border border-[var(--color-border)] bg-[var(--color-glass)] rounded-lg p-2.5 text-[var(--color-text-secondary)]" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-semibold text-[var(--color-text-primary)]">Address</label>
                  <textarea rows={3} defaultValue="Jnanasagara International Public School Campus, Karnataka, India" className="w-full border border-[var(--color-border)] rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[var(--color-text-primary)]">School Affiliation / Board Code</label>
                  <input type="text" defaultValue="ICSE-KAR-2026" className="w-full border border-[var(--color-border)] rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[var(--color-text-primary)]">UDISE+ School Code</label>
                  <input type="text" defaultValue="29230501101" className="w-full border border-[var(--color-border)] rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all font-mono text-blue-700 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[var(--color-text-primary)]">CRP (Cluster Resource Person) & Circle</label>
                  <input type="text" defaultValue="Holenarasipura Education Cluster (CRP)" className="w-full border border-[var(--color-border)] rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[var(--color-text-primary)]">Block Education Office (BEO)</label>
                  <input type="text" defaultValue="Holenarasipura BEO Office, Hassan District" className="w-full border border-[var(--color-border)] rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Academic Years</h2>
                  <p className="text-[var(--color-text-secondary)] text-sm mt-1">Manage terms and active sessions.</p>
                </div>
                <button className="text-blue-600 font-semibold hover:underline text-sm">+ Add New Session</button>
              </div>
              <hr className="border-[var(--color-border)]" />
              
              <div className="space-y-4">
                {/* Active Session */}
                <div className="border border-[#34C759]/20 bg-[#34C759]/10 rounded-xl p-5 flex items-center justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#34C759]/100"></div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-[var(--color-text-primary)]">2026-2027</h3>
                      <span className="bg-[#34C759]/20 text-[#34C759] text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">April 1, 2026 — March 31, 2027</p>
                  </div>
                  <button className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] font-medium">Edit</button>
                </div>

                {/* Past Session */}
                <div className="border border-[var(--color-border)] bg-[var(--surface)] rounded-xl p-5 flex items-center justify-between opacity-70">
                  <div>
                    <h3 className="font-bold text-lg text-[var(--color-text-primary)]">2025-2026</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">April 1, 2025 — March 31, 2026</p>
                  </div>
                  <button className="bg-[var(--color-glass-2)] text-[var(--color-text-primary)] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--color-glass-3)] transition-colors">Set Active</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Security & Roles</h2>
                <p className="text-[var(--color-text-secondary)] text-sm mt-1">Configure Multi-Factor Authentication (MFA) and access control.</p>
              </div>
              <hr className="border-[var(--color-border)]" />
              
              <div className="bg-[var(--vs-primary)]/10 border border-[var(--vs-primary)]/20 rounded-lg p-4 flex gap-3 text-[var(--vs-primary)]">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <p className="text-sm">Enforcing MFA will require users in these roles to set up an Authenticator App (Google/Microsoft) on their next login.</p>
              </div>

              <div className="space-y-4">
                {[
                  { role: 'Principals & Admins', enforced: true },
                  { role: 'Accountants (Finance access)', enforced: true },
                  { role: 'Teachers', enforced: false },
                  { role: 'Clerks', enforced: false }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-glass)]">
                    <span className="font-semibold text-[var(--color-text-primary)]">{item.role}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.enforced} />
                      <div className="w-11 h-6 bg-[var(--color-glass-3)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--surface)] after:border-[var(--color-border)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-2 mb-3">
                  <KeyRound className="text-[var(--vs-secondary,#D4AF37)]" size={20} />
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Account Password Management</h3>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">Set or rotate your personal login password for fast access without SMS OTP verification.</p>

                <form onSubmit={handleUpdatePassword} className="max-w-md space-y-4 p-5 bg-[var(--color-glass)] rounded-xl border border-[var(--color-border)]">
                  {passwordError && (
                    <div className="text-xs bg-red-50 text-red-700 p-2 rounded border border-red-200">{passwordError}</div>
                  )}
                  <div>
                    <label className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider block mb-1">New Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Enter at least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-white text-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdatingPassword || !newPassword}
                    className="w-full bg-[#1B2A4A] hover:bg-[#253963] text-white py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50 shadow-md flex justify-center items-center gap-2"
                  >
                    {isUpdatingPassword ? 'Updating...' : 'Save New Password'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Branding & Theme</h2>
                <p className="text-[var(--color-text-secondary)] text-sm mt-1">Customize how the ERP and Mobile App look.</p>
              </div>
              <hr className="border-[var(--color-border)]" />
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-sm font-semibold text-[var(--color-text-primary)] block mb-2">Primary Color</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1B2A4A] shadow-inner border border-[var(--color-border)]"></div>
                    <input type="text" defaultValue="#1B2A4A" className="border border-[var(--color-border)] rounded-lg p-2.5 w-full font-mono text-[var(--color-text-secondary)]" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[var(--color-text-primary)] block mb-2">Secondary Color</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37] shadow-inner border border-[var(--color-border)]"></div>
                    <input type="text" defaultValue="#D4AF37" className="border border-[var(--color-border)] rounded-lg p-2.5 w-full font-mono text-[var(--color-text-secondary)]" />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-semibold text-[var(--color-text-primary)] block mb-2">School Logo</label>
                <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 flex flex-col items-center justify-center bg-[var(--color-glass)] text-[var(--color-text-secondary)] hover:bg-[var(--color-glass-2)] transition-colors cursor-pointer">
                  <Palette size={32} className="mb-2 text-[var(--color-text-tertiary)]" />
                  <p className="font-medium text-[var(--color-text-primary)]">Click to upload or drag and drop</p>
                  <p className="text-sm">SVG, PNG, JPG (max 2MB)</p>
                </div>
              </div>

              <div className="mt-8 border-t border-[var(--color-border)] pt-8">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Appearance</h3>
                <div className="flex items-center justify-between p-4 bg-[var(--color-glass)] rounded-xl border border-[var(--color-border)]">
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">Dark Mode</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">Switch between light and dark aesthetics.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
