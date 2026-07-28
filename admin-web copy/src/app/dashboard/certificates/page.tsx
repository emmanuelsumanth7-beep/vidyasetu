'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Search, Printer, FileBadge, CheckCircle2, BookOpen, Shield, CreditCard, Mail, IdCard, Stamp, ShieldAlert } from 'lucide-react';
import { triggerPrint } from '@/lib/printUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { readUserSession } from '@/lib/session';
import { SchoolConfig } from '@/config/school.config';

export default function OfficePrintCenterPage() {
  const [user] = useState(() => readUserSession());
  const canAccess = user?.role === 'principal' || user?.role === 'admin' || user?.role === 'clerk';

  // If user doesn't have access, show a denied message
  if (!canAccess) {
    return (
      <div className="max-w-[600px] mx-auto w-full animate-fade-in flex flex-col items-center justify-center pt-20 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(255,59,48,0.1)' }}>
          <ShieldAlert size={40} style={{ color: '#FF3B30' }} />
        </div>
        <h2 className="text-2xl font-black mb-3" style={{ color: 'var(--color-text-primary)' }}>Access Restricted</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Only the Principal, Admin, or Clerk can access the Office Print Center.
        </p>
      </div>
    );
  }
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // Document Data
  const [docGroup, setDocGroup] = useState<'certificates'|'finance'|'admin'|'id'>('certificates');
  const [docType, setDocType] = useState('bonafide');
  
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
    triggerPrint();
  };

  // --- TEMPLATES ---
  
  const renderCertificates = () => (
    <div className="text-black leading-relaxed text-justify space-y-6">
      <h2 className="text-2xl font-bold text-center underline mb-8 font-serif uppercase tracking-widest">
        {docType.replace('_', ' ')} Certificate
      </h2>
      
      {docType === 'bonafide' && (
        <>
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
        </>
      )}

      {docType === 'transfer' && (
        <>
          <p className="text-lg font-serif">
            This is to certify that <strong>{selectedStudent.name}</strong>, roll number <strong>{selectedStudent.rollNumber}</strong>, 
            has been a student of this school from <strong>{new Date(selectedStudent.dob || Date.now()).getFullYear() + 5}</strong> to <strong>{new Date().getFullYear()}</strong>.
          </p>
          <p className="text-lg font-serif">
            He/She was studying in <strong>{selectedStudent.class?.name || '________________'}</strong> at the time of leaving. 
            All dues to the school have been cleared. We wish him/her the best in future endeavors.
          </p>
          <p className="text-lg font-serif">
            Remarks: {remarks || 'Good conduct and satisfactory academic progress.'}
          </p>
        </>
      )}

      {docType === 'character' && (
        <>
          <p className="text-lg font-serif">
            This is to certify that I personally know <strong>{selectedStudent.name}</strong> (Roll No: <strong>{selectedStudent.rollNumber}</strong>), 
            a student of <strong>{selectedStudent.class?.name || '________________'}</strong>.
          </p>
          <p className="text-lg font-serif">
            During his/her tenure at this institution, his/her character and conduct have been <strong>{remarks || 'Exemplary'}</strong>. 
            He/She has actively participated in school activities and demonstrated good citizenship.
          </p>
        </>
      )}
    </div>
  );

  const renderFeeReceipt = () => (
    <div className="text-black space-y-6">
      <h2 className="text-2xl font-bold text-center underline mb-8 font-serif uppercase tracking-widest">
        Official Fee Receipt
      </h2>
      
      <div className="flex justify-between items-start border-b border-black pb-6 mb-6">
        <div className="space-y-1 font-serif">
          <p><strong>Student Name:</strong> {selectedStudent.name}</p>
          <p><strong>Roll No / ID:</strong> {selectedStudent.rollNumber}</p>
          <p><strong>Class/Section:</strong> {selectedStudent.class?.name || 'N/A'}</p>
        </div>
        <div className="space-y-1 font-serif text-right">
          <p><strong>Receipt No:</strong> {referenceNo}</p>
          <p><strong>Date:</strong> {new Date(issueDate).toLocaleDateString('en-GB')}</p>
          <p><strong>Term:</strong> Fall 2026</p>
        </div>
      </div>

      <table className="w-full text-left font-serif border-collapse">
        <thead>
          <tr className="border-y-2 border-black">
            <th className="py-3 px-2">Sl. No.</th>
            <th className="py-3 px-2">Particulars</th>
            <th className="py-3 px-2 text-right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody className="divide-y border-b-2 border-black">
          <tr>
            <td className="py-4 px-2">1</td>
            <td className="py-4 px-2">Tuition Fee (Q1)</td>
            <td className="py-4 px-2 text-right">15,000.00</td>
          </tr>
          <tr>
            <td className="py-4 px-2">2</td>
            <td className="py-4 px-2">Transport Fee</td>
            <td className="py-4 px-2 text-right">4,500.00</td>
          </tr>
          <tr>
            <td className="py-4 px-2">3</td>
            <td className="py-4 px-2">Library & Lab Fees</td>
            <td className="py-4 px-2 text-right">1,200.00</td>
          </tr>
          {remarks && (
            <tr>
              <td className="py-4 px-2">4</td>
              <td className="py-4 px-2">Late Fee / Other: {remarks}</td>
              <td className="py-4 px-2 text-right">500.00</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="py-4 px-2 text-right font-bold text-lg">Total Paid:</td>
            <td className="py-4 px-2 text-right font-bold text-lg">₹ {remarks ? '21,200.00' : '20,700.00'}</td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-8 flex justify-between items-center relative">
        <p className="font-serif italic text-sm">Amount received with thanks.</p>
        {/* Paid Stamp */}
        <div className="absolute right-40 top-0 border-4 border-red-600 text-red-600 font-black text-4xl uppercase tracking-widest px-6 py-2 rotate-[-15deg] opacity-70">
          PAID
        </div>
      </div>
    </div>
  );

  const renderAdmissionLetter = () => (
    <div className="text-black leading-relaxed space-y-6">
      <h2 className="text-2xl font-bold text-center underline mb-8 font-serif uppercase tracking-widest">
        Admission Offer Letter
      </h2>
      
      <p className="font-serif">
        Dear <strong>{selectedStudent.parentLinks?.[0]?.parent?.name || 'Parent/Guardian'}</strong>,
      </p>
      
      <p className="text-lg font-serif text-justify mt-4">
        We are pleased to inform you that your child, <strong>{selectedStudent.name}</strong>, has been offered provisional admission to <strong>{selectedStudent.class?.name || 'our institution'}</strong> for the academic session 2026-2027.
      </p>
      
      <p className="text-lg font-serif text-justify mt-4">
        Please complete the admission formalities and submit the required documents along with the first term fee by <strong>{new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-GB')}</strong> to secure the seat. Failure to do so may result in the cancellation of this offer.
      </p>
      
      <p className="text-lg font-serif text-justify mt-4">
        We look forward to welcoming {selectedStudent.name} to our school community and wish them a successful academic journey with us.
      </p>
      
      {remarks && (
        <p className="text-lg font-serif text-justify mt-4 border-l-4 border-black pl-4">
          <strong>Special Note:</strong> {remarks}
        </p>
      )}
    </div>
  );

  const renderIdCard = () => (
    <div className="flex flex-col items-center justify-center pt-10">
      <h2 className="text-lg font-bold mb-8 font-serif print:hidden text-center text-gray-500">ID cards will print at exact physical dimensions (54mm x 86mm). <br/>Please ensure scale is set to 100% in print dialog.</h2>
      
      {/* Actual ID Card Size: 54mm x 86mm (Vertical CR80 standard) */}
      <div 
        className="relative bg-white overflow-hidden shadow-2xl print:shadow-none"
        style={{ width: '54mm', height: '86mm', border: '1px solid #ccc' }}
      >
        {/* Header Ribbon */}
        <div className="absolute top-0 w-full h-[18mm] bg-[#1a237e] flex flex-col items-center justify-center px-2">
          <h1 className="text-white text-[9px] font-black uppercase tracking-widest text-center leading-tight">Vidya Setu</h1>
          <h2 className="text-white/80 text-[6px] font-bold uppercase tracking-wider text-center">International School</h2>
        </div>

        {/* Photo Container */}
        <div className="absolute top-[22mm] left-1/2 -translate-x-1/2 w-[25mm] h-[30mm] bg-gray-200 border-2 border-[#1a237e] overflow-hidden flex items-center justify-center">
          <User size={32} className="text-gray-400" />
        </div>

        {/* Student Details */}
        <div className="absolute top-[55mm] w-full px-2 text-center">
          <h2 className="text-[11px] font-black text-[#1a237e] uppercase truncate leading-tight mb-1">{selectedStudent.name}</h2>
          <p className="text-[8px] font-bold text-black mb-0.5"><span className="text-red-600">ID:</span> {selectedStudent.rollNumber}</p>
          <p className="text-[8px] font-bold text-black mb-0.5"><span className="text-red-600">CLASS:</span> {selectedStudent.class?.name || 'N/A'}</p>
          <p className="text-[8px] font-bold text-black mb-0.5"><span className="text-red-600">DOB:</span> {new Date(selectedStudent.dob || '2010-01-01').toLocaleDateString('en-GB')}</p>
        </div>

        {/* Footer Barcode/BloodGroup */}
        <div className="absolute bottom-0 w-full h-[12mm] bg-red-600 flex items-center justify-between px-3">
          <div className="bg-white px-2 py-0.5 text-[6px] font-black tracking-widest">
            || | | || ||| | ||
          </div>
          <div className="text-white text-[8px] font-black">
            O+ VE
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="p-8 text-center" style={{ color: 'var(--color-text-tertiary)' }}>Loading registry...</div>;
  }

  return (
    <div className="animate-fade-in max-w-[1400px] mx-auto pb-20 relative">
      
      {/* STRICT PRINT STYLES */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body { background: white !important; }
          body * { visibility: hidden; }
          #printable-certificate, #printable-certificate * {
            visibility: visible;
          }
          #printable-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}} />

      <div className="print-hidden mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3" style={{ color: 'var(--color-text-primary)' }}>
          <FileBadge className="text-indigo-500" size={32} />
          Office & Print Center
        </h1>
        <p className="mt-2 text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>
          Auto-fill and print official school documents, fee receipts, and ID cards.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* LEFT PANEL: Controls (Hidden on Print) */}
        <div className="w-full xl:w-[450px] flex flex-col gap-6 print-hidden shrink-0">
          
          {/* Step 1: Document Category */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-black mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white" style={{ background: 'var(--vs-primary)' }}>1</span>
              Select Document Category
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'certificates', label: 'Certificates', icon: FileBadge },
                { id: 'finance', label: 'Finance & Fees', icon: CreditCard },
                { id: 'admin', label: 'Admissions', icon: Mail },
                { id: 'id', label: 'ID Cards', icon: IdCard },
              ].map(cat => {
                const Icon = cat.icon;
                const active = docGroup === cat.id;
                return (
                  <button 
                    key={cat.id} onClick={() => { setDocGroup(cat.id as any); setDocType(''); }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all"
                    style={{ 
                      background: active ? 'var(--surface)' : 'var(--color-glass)',
                      borderColor: active ? 'var(--vs-primary)' : 'var(--color-border)',
                      color: active ? 'var(--vs-primary)' : 'var(--color-text-secondary)'
                    }}
                  >
                    <Icon size={24} />
                    <span className="text-xs font-bold uppercase tracking-widest">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Search Student */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-black mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white" style={{ background: 'var(--vs-primary)' }}>2</span>
              Select Student
            </h3>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--color-text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search by name or roll..." 
                className="w-full pl-10 pr-4 py-3 text-sm font-bold rounded-2xl focus:outline-none"
                style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="max-h-[180px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {filteredStudents.slice(0, 10).map(s => {
                const isSelected = selectedStudent?.id === s.id;
                return (
                  <div 
                    key={s.id} onClick={() => setSelectedStudent(s)}
                    className="p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between"
                    style={{ 
                      background: isSelected ? 'var(--surface)' : 'var(--color-glass)',
                      border: `1px solid ${isSelected ? 'var(--vs-primary)' : 'var(--color-border)'}`,
                    }}
                  >
                    <div>
                      <p className="text-sm font-black" style={{ color: 'var(--color-text-primary)' }}>{s.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{s.rollNumber} • {s.class?.name}</p>
                    </div>
                    {isSelected && <CheckCircle2 size={18} style={{ color: 'var(--vs-primary)' }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Configure Document */}
          <div className={`glass-card p-5 transition-opacity duration-300 ${!selectedStudent || !docGroup ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-sm font-black mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white" style={{ background: 'var(--vs-primary)' }}>3</span>
              Document Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>Specific Format</label>
                <select 
                  className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none appearance-none"
                  style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <option value="" disabled>-- Select specific format --</option>
                  {docGroup === 'certificates' && (
                    <>
                      <option value="bonafide">Bonafide Certificate</option>
                      <option value="transfer">Transfer Certificate (TC)</option>
                      <option value="character">Character Certificate</option>
                    </>
                  )}
                  {docGroup === 'finance' && <option value="fee_receipt">Official Fee Receipt</option>}
                  {docGroup === 'admin' && <option value="admission_letter">Admission Offer Letter</option>}
                  {docGroup === 'id' && <option value="id_card">Student ID Card (CR80)</option>}
                </select>
              </div>

              {docType && docType !== 'id_card' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>Issue Date</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none"
                        style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>Ref No.</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 rounded-2xl text-sm font-bold focus:outline-none"
                        style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                        value={referenceNo}
                        onChange={(e) => setReferenceNo(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>Custom Remarks / Additions</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-2xl text-sm font-medium focus:outline-none resize-none h-20"
                      style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Enter custom remarks if necessary..."
                    />
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={handlePrint}
              disabled={!selectedStudent || !docType}
              className="w-full mt-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 btn-primary shadow-xl"
            >
              <Printer size={18} />
              Print Document
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Live A4 Preview */}
        <div className="flex-1 min-w-0 overflow-x-auto pb-4">
          {selectedStudent && docType ? (
            <div 
              id="printable-certificate"
              className="bg-white mx-auto relative overflow-hidden"
              style={{ 
                width: '210mm', minHeight: '297mm', padding: docType === 'id_card' ? '0' : '20mm',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                color: 'black' // FORCE BLACK TEXT FOR PRINT
              }}
            >
              {docType === 'id_card' ? renderIdCard() : (
                <>
                  {/* Fake Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none grayscale">
                    <Shield size={700} />
                  </div>

                  {/* Letterhead Header */}
                  <div className="flex items-center justify-between border-b-2 border-indigo-900 pb-6 mb-8 mt-4">
                    <div className="flex items-center gap-5">
                      <div className="w-24 h-24 bg-indigo-900 rounded-full flex items-center justify-center text-white shadow-md">
                        <BookOpen size={48} />
                      </div>
                      <div>
                        <h1 className="text-4xl font-black text-indigo-900 tracking-tighter uppercase font-serif">Vidya Setu</h1>
                        <h2 className="text-2xl font-bold text-indigo-700 tracking-widest font-serif mt-1">International School</h2>
                        <p className="text-sm text-gray-700 mt-2 font-serif">Tech Park, Phase 1, Bangalore, KA - 560100</p>
                        <p className="text-sm text-gray-700 font-serif">Affiliated to CBSE, New Delhi | Affiliation Code: 450912</p>
                      </div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex justify-between items-center mb-12 font-serif border-b border-gray-200 pb-4">
                    <p className="text-sm font-bold text-gray-800">Ref No: <span className="font-normal text-red-700">{referenceNo}</span></p>
                    <p className="text-sm font-bold text-gray-800">Date: <span className="font-normal">{new Date(issueDate).toLocaleDateString('en-GB')}</span></p>
                  </div>

                  {/* Dynamic Body */}
                  <div className="px-6 mb-32">
                    {['bonafide', 'transfer', 'character'].includes(docType) && renderCertificates()}
                    {docType === 'fee_receipt' && renderFeeReceipt()}
                    {docType === 'admission_letter' && renderAdmissionLetter()}
                  </div>

                  {/* Footer Signatures */}
                  <div className="absolute bottom-[30mm] left-[20mm] right-[20mm] flex justify-between items-end">
                    <div className="text-center">
                      <div className="w-48 border-b border-gray-800 mb-2"></div>
                      <p className="text-sm font-bold font-serif text-black uppercase tracking-widest">Office Clerk</p>
                    </div>
                    
                    {/* Office Seal Placeholder */}
                    <div className="w-32 h-32 rounded-full border-4 border-indigo-900/40 flex items-center justify-center opacity-70 rotate-[-15deg]">
                      <div className="w-28 h-28 rounded-full border border-indigo-900/30 flex items-center justify-center">
                        <p className="text-sm font-black text-indigo-900 text-center leading-tight uppercase tracking-widest">Official<br/>Seal</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="w-48 border-b border-gray-800 mb-2"></div>
                      <p className="text-sm font-bold font-serif text-black uppercase tracking-widest">Principal</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-[600px] rounded-[32px] flex flex-col items-center justify-center print-hidden border-2 border-dashed"
                 style={{ borderColor: 'var(--color-border)', background: 'var(--color-glass)' }}>
              <FileBadge size={48} style={{ color: 'var(--color-text-tertiary)' }} className="mb-4" />
              <p className="font-black text-lg" style={{ color: 'var(--color-text-primary)' }}>No Document Configured</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Select a category, student, and format to render the live A4 preview.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
