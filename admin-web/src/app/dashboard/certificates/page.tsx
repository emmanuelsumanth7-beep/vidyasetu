'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Search, Printer, FileBadge, CheckCircle2, User, Calendar, BookOpen, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CertificatesPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // Certificate Data
  const [certType, setCertType] = useState('bonafide');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');
  const [referenceNo, setReferenceNo] = useState(`REF-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await api.get('/students');
      setStudents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading registry...</div>;
  }

  // --- CERTIFICATE TEMPLATES ---
  
  const renderBonafide = () => (
    <div className="text-gray-800 leading-relaxed text-justify space-y-6">
      <h2 className="text-2xl font-bold text-center underline mb-8 font-serif">BONAFIDE CERTIFICATE</h2>
      <p className="text-lg font-serif">
        This is to certify that <strong>{selectedStudent.name}</strong>, son/daughter of <strong>{selectedStudent.parentLinks?.[0]?.parent?.name || '________________'}</strong>, 
        is a bonafide student of our institution.
      </p>
      <p className="text-lg font-serif">
        He/She is currently studying in <strong>{selectedStudent.class?.name || '________________'}</strong> 
        for the academic year <strong>2026-2027</strong>. His/Her admission/roll number is <strong>{selectedStudent.rollNumber}</strong>.
      </p>
      <p className="text-lg font-serif">
        To the best of our knowledge, he/she bears a good moral character. This certificate is issued upon the request of the parent/guardian for general purposes.
      </p>
    </div>
  );

  const renderTransfer = () => (
    <div className="text-gray-800 leading-relaxed text-justify space-y-6">
      <h2 className="text-2xl font-bold text-center underline mb-8 font-serif">TRANSFER CERTIFICATE</h2>
      <p className="text-lg font-serif">
        This is to certify that <strong>{selectedStudent.name}</strong>, roll number <strong>{selectedStudent.rollNumber}</strong>, 
        has been a student of this school from <strong>{new Date(selectedStudent.dob).getFullYear() + 5}</strong> to <strong>{new Date().getFullYear()}</strong>.
      </p>
      <p className="text-lg font-serif">
        He/She was studying in <strong>{selectedStudent.class?.name || '________________'}</strong> at the time of leaving. 
        All dues to the school have been cleared. We wish him/her the best in future endeavors.
      </p>
      <p className="text-lg font-serif">
        Remarks: {remarks || 'Good conduct and satisfactory academic progress.'}
      </p>
    </div>
  );

  const renderCharacter = () => (
    <div className="text-gray-800 leading-relaxed text-justify space-y-6">
      <h2 className="text-2xl font-bold text-center underline mb-8 font-serif">CHARACTER CERTIFICATE</h2>
      <p className="text-lg font-serif">
        This is to certify that I personally know <strong>{selectedStudent.name}</strong> (Roll No: <strong>{selectedStudent.rollNumber}</strong>), 
        a student of <strong>{selectedStudent.class?.name || '________________'}</strong>.
      </p>
      <p className="text-lg font-serif">
        During his/her tenure at this institution, his/her character and conduct have been <strong>{remarks || 'Exemplary'}</strong>. 
        He/She has actively participated in school activities and demonstrated good citizenship.
      </p>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-[1400px] mx-auto pb-20">
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible;
          }
          #printable-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}} />

      <div className="print-hidden mb-8">
        <h1 className="text-4xl font-bold font-display text-gray-900 tracking-tight flex items-center gap-3">
          <FileBadge className="text-indigo-600" size={36} />
          Certificate Generator
        </h1>
        <p className="text-gray-600 mt-2 font-medium">Auto-fill and print official school documents on letterhead.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT PANEL: Controls (Hidden on Print) */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6 print-hidden">
          
          {/* Step 1: Search Student */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/50 p-6 rounded-[24px] shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">1</span>
              Select Student
            </h3>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or roll..." 
                className="w-full bg-white/50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {filteredStudents.slice(0, 10).map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setSelectedStudent(s)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center justify-between ${
                    selectedStudent?.id === s.id 
                    ? 'bg-indigo-50 border-indigo-200 shadow-inner' 
                    : 'bg-white/60 border-transparent hover:bg-white/80 hover:border-gray-200'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.rollNumber} • {s.class?.name}</p>
                  </div>
                  {selectedStudent?.id === s.id && <CheckCircle2 className="text-indigo-600" size={18} />}
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Configure Document */}
          <div className={`bg-white/40 backdrop-blur-xl border border-white/50 p-6 rounded-[24px] shadow-sm transition-opacity duration-300 ${!selectedStudent ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">2</span>
              Document Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Certificate Type</label>
                <select 
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={certType}
                  onChange={(e) => setCertType(e.target.value)}
                >
                  <option value="bonafide">Bonafide Certificate</option>
                  <option value="transfer">Transfer Certificate (TC)</option>
                  <option value="character">Character Certificate</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Issue Date</label>
                <input 
                  type="date" 
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Reference No.</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                />
              </div>

              {(certType === 'transfer' || certType === 'character') && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Custom Remarks</label>
                  <textarea 
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none h-24"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter custom remarks..."
                  />
                </div>
              )}
            </div>

            <button 
              onClick={handlePrint}
              disabled={!selectedStudent}
              className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Printer size={18} />
              Print on Letterhead
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Live Preview */}
        <div className="flex-1">
          {selectedStudent ? (
            <div 
              id="printable-certificate"
              className="bg-white rounded-sm shadow-2xl mx-auto border border-gray-200 overflow-hidden relative"
              style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }} // A4 Size Specs
            >
              {/* Fake Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none grayscale">
                <Shield size={600} />
              </div>

              {/* Letterhead Header */}
              <div className="flex items-center justify-between border-b-2 border-indigo-900 pb-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-indigo-900 rounded-full flex items-center justify-center text-white">
                    <BookOpen size={40} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-indigo-900 tracking-tighter uppercase font-serif">Vidya Setu</h1>
                    <h2 className="text-xl font-bold text-indigo-700 tracking-widest font-serif">International School</h2>
                    <p className="text-xs text-gray-600 mt-1">Tech Park, Phase 1, Bangalore, KA - 560100</p>
                    <p className="text-xs text-gray-600">Affiliated to CBSE, New Delhi | Code: 450912</p>
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex justify-between items-center mb-12 font-serif">
                <p className="text-sm font-bold">Ref No: <span className="font-normal text-red-600">{referenceNo}</span></p>
                <p className="text-sm font-bold">Date: <span className="font-normal">{new Date(issueDate).toLocaleDateString('en-GB')}</span></p>
              </div>

              {/* Dynamic Body */}
              <div className="px-8 mb-24">
                {certType === 'bonafide' && renderBonafide()}
                {certType === 'transfer' && renderTransfer()}
                {certType === 'character' && renderCharacter()}
              </div>

              {/* Footer Signatures */}
              <div className="absolute bottom-[30mm] left-[20mm] right-[20mm] flex justify-between items-end">
                <div className="text-center">
                  <div className="w-40 border-b border-gray-400 mb-2"></div>
                  <p className="text-sm font-bold font-serif text-gray-800">Class Teacher</p>
                </div>
                
                {/* Office Seal Placeholder */}
                <div className="w-24 h-24 rounded-full border-2 border-indigo-900/30 flex items-center justify-center opacity-50 rotate-[-15deg]">
                  <p className="text-xs font-bold text-indigo-900 text-center leading-tight">OFFICIAL<br/>SEAL</p>
                </div>

                <div className="text-center">
                  <div className="w-40 border-b border-gray-400 mb-2"></div>
                  <p className="text-sm font-bold font-serif text-gray-800">Principal</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full min-h-[600px] border-2 border-dashed border-gray-300 rounded-[32px] flex flex-col items-center justify-center text-gray-400 bg-white/20 print-hidden">
              <FileBadge size={48} className="mb-4 text-gray-300" />
              <p className="font-medium text-lg">Select a student to generate preview.</p>
              <p className="text-sm mt-1">Live A4 letterhead rendering will appear here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
