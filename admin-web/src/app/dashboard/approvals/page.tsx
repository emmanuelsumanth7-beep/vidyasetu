'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FileText, CheckCircle, XCircle, Clock, ShieldCheck, Key, FileSignature, Send, Eye, X, AlertCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
}

interface Document {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'signed' | 'rejected';
  submittedBy?: { name: string; role: string };
  signedBy?: { name: string };
  signedAt?: string;
  createdAt: string;
}

export default function ApprovalsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Teacher UI state
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');

  // Principal UI state
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      setUser(JSON.parse(u));
      fetchDocuments();
    }
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await api.get('/documents');
      setDocuments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDraftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle || !draftContent) return;
    try {
      await api.post('/documents', { title: draftTitle, content: draftContent });
      setIsDrafting(false);
      setDraftTitle('');
      setDraftContent('');
      fetchDocuments();
    } catch (e) {
      console.error('Failed to submit document');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this document? It will be removed from official storage and returned.')) return;
    try {
      await api.post(`/documents/${id}/reject`, {});
      setViewingDoc(null);
      fetchDocuments();
    } catch (e) {
      console.error('Failed to reject document');
    }
  };

  const handleSecureSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authPassword) {
      setAuthError('Password is required');
      return;
    }
    setIsSigning(true);
    setAuthError('');
    try {
      await api.post(`/documents/${viewingDoc?.id}/sign`, { password: authPassword });
      setShowSignModal(false);
      setAuthPassword('');
      fetchDocuments();
      
      // Update viewing doc state locally to show signature immediately
      if (viewingDoc) {
        setViewingDoc({
          ...viewingDoc,
          status: 'signed',
          signedBy: { name: user?.name || '' },
          signedAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setIsSigning(false);
    }
  };

  if (!user) return null;

  const isPrincipal = user.role === 'principal' || user.role === 'admin';

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-fade-in pb-20 font-body relative">
      {/* Liquid Abstract Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none -z-10"></div>
      <div className="fixed top-[20%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none -z-10"></div>

      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-display text-gray-900 tracking-tight">
            {isPrincipal ? 'Secure Document Approvals' : 'My Document Submissions'}
          </h1>
          <p className="text-sm font-medium text-gray-600 mt-1">
            {isPrincipal 
              ? 'Review and digitally sign official documents requiring your authorization.' 
              : 'Submit reports for the Principal\'s official signature.'}
          </p>
        </div>
        
        {!isPrincipal && (
          <button onClick={() => setIsDrafting(true)} className="bg-indigo-600 text-white px-6 py-3 flex items-center gap-2 rounded-2xl font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all">
            <Send size={20} strokeWidth={3} /> New Document
          </button>
        )}
      </header>

      {/* Drafting Form for Teachers */}
      {isDrafting && !isPrincipal && (
        <section className="bg-white/40 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] overflow-hidden mb-6 animate-slide-up">
          <div className="p-8">
            <h3 className="text-2xl font-bold font-display text-gray-900 mb-6">Draft New Document</h3>
            <form onSubmit={handleDraftSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Document Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white/50 border border-gray-200/50 rounded-2xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-400"
                  placeholder="e.g. Annual Sports Day Report" 
                  value={draftTitle}
                  onChange={e => setDraftTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Document Content</label>
                <textarea 
                  required
                  className="w-full bg-white/50 border border-gray-200/50 rounded-2xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-400 min-h-[200px] resize-y"
                  placeholder="Write your report or document content here..." 
                  value={draftContent}
                  onChange={e => setDraftContent(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsDrafting(false)} className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 rounded-2xl transition-all">
                  Cancel
                </button>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50" disabled={!draftTitle || !draftContent}>
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {loading ? (
        <div className="h-64 bg-white/20 backdrop-blur-md rounded-[32px] shadow-sm border border-white/40 animate-pulse" />
      ) : (
        <div className={`grid grid-cols-1 ${viewingDoc ? 'lg:grid-cols-2' : ''} gap-6`}>
          
          {/* Document List */}
          <div className={`flex flex-col gap-4 ${viewingDoc ? 'hidden lg:flex' : ''}`}>
            {documents.length === 0 ? (
              <div className="bg-white/40 backdrop-blur-2xl rounded-[32px] border border-white/50 p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4"><FileText size={32} /></div>
                <h3 className="text-xl font-bold font-display text-gray-900">No documents</h3>
                <p className="text-gray-500 mt-2">No documents found in the system.</p>
              </div>
            ) : documents.map(doc => (
              <div 
                key={doc.id} 
                className={`bg-white/60 backdrop-blur-xl rounded-[24px] border ${viewingDoc?.id === doc.id ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-white/50'} shadow-sm hover:shadow-md transition-all cursor-pointer`}
                onClick={() => setViewingDoc(doc)}
              >
                <div className="p-5 flex justify-between items-center">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${doc.status === 'signed' ? 'bg-emerald-100 text-emerald-600' : doc.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {doc.status === 'signed' ? <FileSignature size={24} /> : doc.status === 'rejected' ? <XCircle size={24} /> : <FileText size={24} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{doc.title}</h3>
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        {isPrincipal 
                          ? `Submitted by ${doc.submittedBy?.name || 'Unknown'} (${doc.submittedBy?.role || 'Staff'})` 
                          : `Submitted on ${new Date(doc.createdAt).toLocaleDateString()}`
                        }
                      </p>
                      <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase">
                        {doc.status === 'signed' ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle size={14} /> Officially Signed
                          </span>
                        ) : doc.status === 'rejected' ? (
                          <span className="text-red-600 flex items-center gap-1">
                            <XCircle size={14} /> Rejected
                          </span>
                        ) : (
                          <span className="text-amber-600 flex items-center gap-1">
                            <Clock size={14} /> Pending Review
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-indigo-600 p-2"><Eye size={20} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Document Viewer */}
          {viewingDoc && (
            <div className="bg-white/60 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] flex flex-col h-full overflow-hidden animate-slide-up">
              <div className="p-6 border-b border-white/50 flex justify-between items-center bg-white/30">
                <h3 className="text-xl font-bold text-gray-900 font-display">Document Viewer</h3>
                <button onClick={() => setViewingDoc(null)} className="text-gray-500 hover:text-gray-900 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              
              {/* Document Content - Needs to look like a real document but respect dark mode */}
              <div className="p-10 flex-1 bg-white/90 text-gray-900 font-serif relative overflow-y-auto min-h-[400px]">
                <h1 className="text-3xl font-bold mb-8 text-center border-b border-gray-200 pb-6">
                  {viewingDoc.title}
                </h1>
                
                <div className="text-lg leading-relaxed whitespace-pre-wrap mb-16 text-gray-800">
                  {viewingDoc.content}
                </div>

                {/* Digital Signature Overlay */}
                {viewingDoc.status === 'signed' && (
                  <div className="mt-10 border-t border-dashed border-gray-300 pt-6 flex justify-end animate-fade-in">
                    <div className="text-center">
                      <div className="font-[cursive] text-4xl text-gray-900 -rotate-2 mb-2 text-shadow-sm opacity-80" style={{ fontFamily: '"Brush Script MT", cursive' }}>
                        {viewingDoc.signedBy?.name || 'Authorized Signatory'}
                      </div>
                      <div className="text-xs font-medium text-gray-500 border-t border-gray-200 pt-2 uppercase tracking-widest">
                        Digitally Signed<br/>
                        {new Date(viewingDoc.signedAt || new Date()).toLocaleString()}
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 mt-3 bg-emerald-100/80 px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-200">
                        <ShieldCheck size={14} /> Verified Signature
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar (Only for Principal on Pending Docs) */}
              {isPrincipal && viewingDoc.status === 'pending' && (
                <div className="p-6 bg-white/40 border-t border-white/50 flex justify-end gap-4">
                  <button onClick={() => handleReject(viewingDoc.id)} className="px-6 py-3 bg-red-50 text-red-600 font-bold uppercase tracking-widest rounded-2xl hover:bg-red-100 transition-all border border-red-100">
                    Reject & Return
                  </button>
                  <button 
                    onClick={() => setShowSignModal(true)} 
                    className="bg-indigo-600 text-white px-6 py-3 flex items-center gap-2 rounded-2xl font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all"
                  >
                    <FileSignature size={20} strokeWidth={3} /> Sign Document
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Secure Sign Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in" onClick={() => { setShowSignModal(false); setAuthPassword(''); setAuthError(''); }}>
          <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-2xl w-full max-w-md overflow-hidden animate-modal-scale" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/50 flex justify-between items-center bg-white/40">
              <h3 className="text-xl font-bold text-gray-900 font-display">Security Verification</h3>
              <button className="text-gray-500 hover:text-gray-900 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-all" onClick={() => { setShowSignModal(false); setAuthPassword(''); setAuthError(''); }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSecureSign}>
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                    <ShieldCheck size={40} />
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    Please enter your password to officially sign this document. This action cannot be undone.
                  </p>
                </div>
                
                {authError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold">
                    <AlertCircle size={18} />
                    {authError}
                  </div>
                )}

                <div>
                  <div className="relative">
                    <Key size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password" 
                      required
                      placeholder="Enter your password" 
                      value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                      className="w-full bg-white/50 border border-gray-200/50 rounded-2xl py-4 pl-12 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:font-medium placeholder:text-gray-400"
                      autoFocus
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white/40 border-t border-white/50 flex justify-end gap-3">
                <button type="button" onClick={() => { setShowSignModal(false); setAuthPassword(''); setAuthError(''); }} className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 rounded-2xl transition-all">
                  Cancel
                </button>
                <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl hover:bg-indigo-700 transition-all disabled:opacity-50" disabled={isSigning || !authPassword}>
                  {isSigning ? 'Verifying...' : 'Sign Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
