"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ChevronLeft, 
  Edit3, 
  X,
  FileText,
  IdCard,
  Book,
  BookOpen,
  Bookmark,
  Hash,
  Droplet,
  Calendar,
  Mail,
  User,
  Users,
  MapPin,
  Map
} from 'lucide-react';

const initialStudentData = {
  name: 'RIKHIL P',
  classLevel: 'II PUC',
  stream: 'PCMB',
  section: 'C',
  applicationNo: '253826',
  studentId: '25P1523',
  satNo: '267629271',
  bloodGroup: 'O+',
  dob: '21 Sep, 2009',
  email: 'jyothida21@gmail.com',
  gender: 'MALE',
  caste: 'ROMAN CATHOLIC',
  presentAddress: '5/115 LINGARAJPURAM JOSEPH REDDY LAYOUT NEW POST OFFICE ROAD BANGALORE URBAN,KARNATAKA,560084',
  permanentAddress: '5/115 LINGARAJPURAM JOSEPH REDDY LAYOUT NEW POST OFFICE ROAD BANGALORE URBAN,KARNATAKA,560084',
  aadharNo: '900857889267',
  fatherName: 'Prakash P',
  fatherOccupation: 'Business',
  motherName: 'Jyothi',
  motherOccupation: 'Homemaker',
  emergencyContact: '9876543210'
};

interface InfoRowProps {
  icon: any;
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (val: string) => void;
  hideBorder?: boolean;
  multiline?: boolean;
}

const InfoRow = ({ icon: Icon, label, value, isEditing, onChange, hideBorder, multiline }: InfoRowProps) => {
  return (
    <div className={`flex items-start gap-4 py-4 ${!hideBorder ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
      <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-indigo-500">
        <Icon size={20} />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
        {isEditing ? (
          multiline ? (
             <textarea 
               className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-y min-h-[80px]" 
               value={value} 
               onChange={(e) => onChange(e.target.value)} 
               rows={3}
             />
          ) : (
             <input 
               type="text" 
               className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
               value={value} 
               onChange={(e) => onChange(e.target.value)} 
             />
          )
        ) : (
          <div className="text-base font-medium text-gray-900 dark:text-gray-100">{value}</div>
        )}
      </div>
    </div>
  );
};

export function StudentProfile({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('academic');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialStudentData);

  const handleSave = () => {
    setIsEditing(false);
    // Real API call would go here
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const tabContentVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 max-w-2xl mx-auto rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
      <header className="flex items-center justify-between p-4 border-b border-transparent">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button 
                className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                onClick={() => { setIsEditing(false); setFormData(initialStudentData); }}
              >
                <X size={20} />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500 transition-colors"
                onClick={handleSave}
              >
                <Check size={20} />
              </button>
            </>
          ) : (
            <button 
              className="p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-500 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={20} />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-6 pt-4 pb-6 gap-3">
          <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-4xl font-bold flex items-center justify-center shadow-inner">
            {getInitials(formData.name)}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wide">{formData.name}</h1>
            <p className="text-sm font-semibold text-indigo-500 mt-1 uppercase tracking-wider">
              {formData.classLevel} - {formData.stream} - {formData.section}
            </p>
          </div>
        </div>

        <div className="px-4 mb-4 flex gap-2 overflow-x-auto no-scrollbar">
          {['personal', 'academic', 'family'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('Info', ' Info')}
            </button>
          ))}
        </div>

        <div className="px-4 pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabContentVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-900 rounded-3xl p-2 sm:p-4 shadow-sm border border-gray-50 dark:border-gray-800"
            >
              {activeTab === 'academic' && (
                <>
                  <InfoRow icon={FileText} label="Application No." value={formData.applicationNo} isEditing={isEditing} onChange={(v) => handleChange('applicationNo', v)} />
                  <InfoRow icon={IdCard} label="Student ID" value={formData.studentId} isEditing={isEditing} onChange={(v) => handleChange('studentId', v)} />
                  <InfoRow icon={Book} label="Class" value={formData.classLevel} isEditing={isEditing} onChange={(v) => handleChange('classLevel', v)} />
                  <InfoRow icon={BookOpen} label="Stream" value={formData.stream} isEditing={isEditing} onChange={(v) => handleChange('stream', v)} />
                  <InfoRow icon={Bookmark} label="Section" value={formData.section} isEditing={isEditing} onChange={(v) => handleChange('section', v)} />
                  <InfoRow icon={Hash} label="Sat No." value={formData.satNo} isEditing={isEditing} onChange={(v) => handleChange('satNo', v)} hideBorder />
                </>
              )}

              {activeTab === 'personal' && (
                <>
                  <InfoRow icon={Droplet} label="Blood Group" value={formData.bloodGroup} isEditing={isEditing} onChange={(v) => handleChange('bloodGroup', v)} />
                  <InfoRow icon={Calendar} label="Date Of Birth" value={formData.dob} isEditing={isEditing} onChange={(v) => handleChange('dob', v)} />
                  <InfoRow icon={Mail} label="Email" value={formData.email} isEditing={isEditing} onChange={(v) => handleChange('email', v)} />
                  <InfoRow icon={User} label="Gender" value={formData.gender} isEditing={isEditing} onChange={(v) => handleChange('gender', v)} />
                  <InfoRow icon={Users} label="Caste" value={formData.caste} isEditing={isEditing} onChange={(v) => handleChange('caste', v)} />
                  <InfoRow icon={MapPin} label="Present Address" value={formData.presentAddress} isEditing={isEditing} onChange={(v) => handleChange('presentAddress', v)} multiline />
                  <InfoRow icon={Map} label="Permanent Address" value={formData.permanentAddress} isEditing={isEditing} onChange={(v) => handleChange('permanentAddress', v)} multiline />
                  <InfoRow icon={IdCard} label="Aadhar No." value={formData.aadharNo} isEditing={isEditing} onChange={(v) => handleChange('aadharNo', v)} hideBorder />
                </>
              )}

              {activeTab === 'family' && (
                <>
                  <InfoRow icon={User} label="Father's Name" value={formData.fatherName} isEditing={isEditing} onChange={(v) => handleChange('fatherName', v)} />
                  <InfoRow icon={BookOpen} label="Father's Occupation" value={formData.fatherOccupation} isEditing={isEditing} onChange={(v) => handleChange('fatherOccupation', v)} />
                  <InfoRow icon={User} label="Mother's Name" value={formData.motherName} isEditing={isEditing} onChange={(v) => handleChange('motherName', v)} />
                  <InfoRow icon={BookOpen} label="Mother's Occupation" value={formData.motherOccupation} isEditing={isEditing} onChange={(v) => handleChange('motherOccupation', v)} />
                  <InfoRow icon={Mail} label="Emergency Contact" value={formData.emergencyContact} isEditing={isEditing} onChange={(v) => handleChange('emergencyContact', v)} hideBorder />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
