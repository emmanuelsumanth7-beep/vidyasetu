import React from 'react';
import { BookOpen } from 'lucide-react';

export default function PrintableLetterhead() {
  return (
    <div className="hidden print:block w-full mb-8">
      <div className="flex items-center justify-between border-b-2 border-indigo-900 pb-6">
        {/* Logo and School Name */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-indigo-900 rounded-full flex items-center justify-center text-white">
            <BookOpen size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-indigo-900 tracking-tighter uppercase font-serif">Vidya Setu</h1>
            <h2 className="text-xl font-bold text-indigo-700 tracking-widest font-serif">International School</h2>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-right text-xs text-gray-600 font-medium space-y-1 font-serif">
          <p>Tech Park, Phase 1, Bangalore, KA - 560100</p>
          <p>Affiliated to CBSE, New Delhi | Code: 450912</p>
          <p>Phone: +91 98765 43210</p>
          <p>Email: contact@vidyasetu.com</p>
        </div>
      </div>
    </div>
  );
}
