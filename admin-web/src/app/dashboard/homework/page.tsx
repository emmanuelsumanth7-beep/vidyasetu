'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomeworkUpload() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [classTarget, setClassTarget] = useState('10A');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;
    setStatus('success');
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-ink-primary font-display tracking-tight">Post Homework</h1>
          <p className="text-sm font-medium text-ink-secondary mt-1">Distribute assignments to your class instantly.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Assignment Title</label>
            <input 
              type="text" 
              placeholder="e.g. Physics: Thermodynamics Chapter 4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-ink-primary font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              required
            />
          </div>
          <div className="w-full md:w-1/3 flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Target Class</label>
            <select 
              value={classTarget}
              onChange={(e) => setClassTarget(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-ink-primary font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="10A">Class 10-A</option>
              <option value="10B">Class 10-B</option>
              <option value="9A">Class 9-A</option>
              <option value="8C">Class 8-C</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Attach Questions (PDF/DOCX)</label>
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-[32px] transition-all ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
          >
            {file ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-indigo-500">
                  <FileText size={32} />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-ink-primary">{file.name}</h4>
                  <p className="text-xs font-medium text-ink-secondary mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button type="button" onClick={() => setFile(null)} className="mt-2 text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
                  <X size={14} /> Remove File
                </button>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-indigo-500 mb-6">
                  <Upload size={32} />
                </div>
                <p className="text-sm font-bold text-ink-primary">Drag & drop your file here</p>
                <p className="text-xs font-medium text-ink-secondary mt-2">or</p>
                <label className="mt-4 px-6 py-2 bg-white border border-gray-200 text-ink-primary text-sm font-bold rounded-full cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                  Browse Files
                  <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} accept=".pdf,.doc,.docx" />
                </label>
              </>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={!file || !title || status !== 'idle'}
            className="px-8 py-4 bg-interactive-blue hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {status === 'uploading' ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Upload size={20} />
              </motion.div>
            ) : status === 'success' ? (
              <CheckCircle2 size={20} />
            ) : (
              <Upload size={20} />
            )}
            {status === 'uploading' ? 'Uploading...' : status === 'success' ? 'Published!' : 'Publish Homework'}
          </button>
        </div>

      </form>
    </div>
  );
}
