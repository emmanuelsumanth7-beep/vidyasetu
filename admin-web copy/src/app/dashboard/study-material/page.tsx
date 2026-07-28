'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, BookOpen, CheckCircle2, X, Link as LinkIcon, Video, FileText, Download, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function StudyMaterialUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('notes');
  const [classTarget, setClassTarget] = useState('Class 10-A');
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [materials, setMaterials] = useState<any[]>([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    fetchMaterials();
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role) setUserRole(user.role);
    }
  }, []);

  const fetchMaterials = async () => {
    try {
      const data = await api.get('/study-materials');
      setMaterials(data);
    } catch (e) {
      console.error('Failed to fetch materials');
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;
    setStatus('uploading');

    try {
      // 1. Upload file to S3
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await api.postFormData('/upload', formData);
      const fileUrl = uploadRes.url;

      // 2. Save metadata to Postgres
      await api.post('/study-materials', {
        title,
        subject,
        fileUrl,
        fileType: file.type || type,
        className: classTarget
      });

      setStatus('success');
      setFile(null);
      setTitle('');
      setSubject('');
      fetchMaterials();
      
      setTimeout(() => setStatus('idle'), 3000);
    } catch (e) {
      console.error(e);
      setStatus('idle');
      alert('Upload failed!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this material?')) return;
    try {
      await api.delete(`/study-materials/${id}`);
      fetchMaterials();
    } catch (e) {
      alert('Failed to delete material');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-32 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-ink-primary font-display tracking-tight">Study Materials</h1>
          <p className="text-sm font-medium text-ink-secondary mt-1">Upload and manage educational resources.</p>
        </div>
      </div>

      {['principal', 'clerk', 'teacher'].includes(userRole) && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Material Title</label>
              <input 
                type="text" 
                placeholder="e.g. Chapter 4: Photosynthesis Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-ink-primary font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Subject</label>
              <input 
                type="text" 
                placeholder="e.g. Science"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-ink-primary font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Target Class</label>
              <input 
                type="text"
                placeholder="e.g. Class 10-A"
                value={classTarget}
                onChange={(e) => setClassTarget(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-ink-primary font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Attach Resource File</label>
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[24px] transition-all ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
            >
              {file ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-emerald-500">
                    {file.type.includes('video') ? <Video size={32} /> : file.type.includes('pdf') ? <FileText size={32} /> : <BookOpen size={32} />}
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
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-emerald-500 mb-4">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-bold text-ink-primary">Drag & drop your file here</p>
                  <label className="mt-4 px-6 py-2 bg-white border border-gray-200 text-ink-primary text-sm font-bold rounded-full cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                    Browse Files
                    <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} accept="*/*" />
                  </label>
                </>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={!file || !title || status === 'uploading'}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
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
              {status === 'uploading' ? 'Uploading to AWS...' : status === 'success' ? 'Published!' : 'Upload Material'}
            </button>
          </div>
        </form>
      )}

      {/* Resource Gallery */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-ink-primary mb-4">Resource Gallery</h2>
        {materials.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-bold text-lg text-ink-primary">No materials yet</h3>
            <p className="text-ink-secondary mt-1">Upload the first study material to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((mat) => (
              <div key={mat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                <div className="h-32 bg-gradient-to-br from-emerald-500 to-teal-700 p-6 flex flex-col justify-end relative">
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
                    {mat.class?.name || 'All Classes'}
                  </div>
                  {mat.fileType.includes('video') ? <Video size={32} className="text-white/50 absolute top-6 left-6" /> : <FileText size={32} className="text-white/50 absolute top-6 left-6" />}
                  <h3 className="font-bold text-white text-lg leading-tight mt-4 line-clamp-2">{mat.title}</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-sm font-semibold text-emerald-600 mb-2">{mat.subject}</p>
                  <p className="text-xs text-ink-secondary mb-4 font-data">Uploaded by: {mat.teacher?.name || 'Staff'} • {new Date(mat.createdAt).toLocaleDateString()}</p>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <a href={mat.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-interactive-blue flex items-center gap-1 hover:underline">
                      <Download size={16} /> Open Resource
                    </a>
                    {['principal', 'clerk', 'teacher'].includes(userRole) && (
                      <button onClick={() => handleDelete(mat.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
