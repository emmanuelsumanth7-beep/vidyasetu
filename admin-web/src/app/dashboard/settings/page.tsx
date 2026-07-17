'use client';
import { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  ShieldCheck,
  Palette,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState('school');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
          <h1 className="text-3xl font-bold text-ink-primary font-display tracking-tight">System Settings</h1>
          <p className="text-ink-secondary mt-1">Global configuration, academic years, and security policies.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-interactive-blue hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <CheckCircle2 size={18} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {toastMessage && (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-center gap-2 border border-green-200 animate-in slide-in-from-top-2">
          <CheckCircle2 size={20} />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('school')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${activeTab === 'school' ? 'bg-interactive-blue text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Building2 size={20} />
            School Profile
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${activeTab === 'academic' ? 'bg-interactive-blue text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Calendar size={20} />
            Academic Years
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${activeTab === 'security' ? 'bg-interactive-blue text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ShieldCheck size={20} />
            Security & Roles
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${activeTab === 'theme' ? 'bg-interactive-blue text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
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
                <h2 className="text-xl font-bold text-ink-primary">School Profile</h2>
                <p className="text-gray-500 text-sm mt-1">Basic information about the institution.</p>
              </div>
              <hr className="border-gray-100" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Institution Name</label>
                  <input type="text" defaultValue="Vidya Setu International" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-interactive-blue focus:border-interactive-blue outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Institution Code</label>
                  <input type="text" defaultValue="vidyasetu-intl" disabled className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-gray-500" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Address</label>
                  <textarea rows={3} defaultValue="Tech Park, Phase 1, Bangalore" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-interactive-blue focus:border-interactive-blue outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">CBSE Affiliation Code</label>
                  <input type="text" defaultValue="CBSE-883920" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-interactive-blue focus:border-interactive-blue outline-none transition-all" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-ink-primary">Academic Years</h2>
                  <p className="text-gray-500 text-sm mt-1">Manage terms and active sessions.</p>
                </div>
                <button className="text-interactive-blue font-semibold hover:underline text-sm">+ Add New Session</button>
              </div>
              <hr className="border-gray-100" />
              
              <div className="space-y-4">
                {/* Active Session */}
                <div className="border border-green-200 bg-green-50/50 rounded-xl p-5 flex items-center justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-ink-primary">2026-2027</h3>
                      <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">April 1, 2026 — March 31, 2027</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-700 font-medium">Edit</button>
                </div>

                {/* Past Session */}
                <div className="border border-gray-200 bg-white rounded-xl p-5 flex items-center justify-between opacity-70">
                  <div>
                    <h3 className="font-bold text-lg text-ink-primary">2025-2026</h3>
                    <p className="text-sm text-gray-600 mt-1">April 1, 2025 — March 31, 2026</p>
                  </div>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">Set Active</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-ink-primary">Security & Roles</h2>
                <p className="text-gray-500 text-sm mt-1">Configure Multi-Factor Authentication (MFA) and access control.</p>
              </div>
              <hr className="border-gray-100" />
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-blue-800">
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
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50/30">
                    <span className="font-semibold text-gray-800">{item.role}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.enforced} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-interactive-blue"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-ink-primary">Branding & Theme</h2>
                <p className="text-gray-500 text-sm mt-1">Customize how the ERP and Mobile App look.</p>
              </div>
              <hr className="border-gray-100" />
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Primary Color</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#4F46E5] shadow-inner border border-gray-200"></div>
                    <input type="text" defaultValue="#4F46E5" className="border border-gray-300 rounded-lg p-2.5 w-full font-mono text-gray-600" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Secondary Color</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#7C3AED] shadow-inner border border-gray-200"></div>
                    <input type="text" defaultValue="#7C3AED" className="border border-gray-300 rounded-lg p-2.5 w-full font-mono text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-semibold text-gray-700 block mb-2">School Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
                  <Palette size={32} className="mb-2 text-gray-400" />
                  <p className="font-medium text-ink-primary">Click to upload or drag and drop</p>
                  <p className="text-sm">SVG, PNG, JPG (max 2MB)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
