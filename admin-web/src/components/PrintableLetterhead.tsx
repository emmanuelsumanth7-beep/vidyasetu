import React from 'react';
import { SchoolConfig } from '@/config/school.config';

export const PrintableLetterhead: React.FC = () => {
  return (
    <div className="hidden print:block mb-8">
      <div className="flex items-center justify-between pb-4" style={{ borderBottom: `3px solid ${SchoolConfig.theme.primaryLight}` }}>
        <div className="flex items-center gap-6">
          {/* Logo Placeholder */}
          {SchoolConfig.logoPath ? (
            <img src={SchoolConfig.logoPath} alt="Logo" className="w-16 h-16 object-contain" />
          ) : (
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
              style={{ backgroundColor: SchoolConfig.theme.primaryLight }}
            >
              {SchoolConfig.shortName}
            </div>
          )}
          
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">
              {SchoolConfig.name}
            </h1>
            <p className="text-gray-600 font-medium italic mt-1 text-lg">
              {SchoolConfig.tagline}
            </p>
            <p className="text-sm text-gray-700 mt-2 font-semibold uppercase tracking-wider">
              {SchoolConfig.affiliation}
            </p>
          </div>
        </div>
        
        <div className="text-right text-sm text-gray-700 space-y-1">
          <p>{SchoolConfig.address}</p>
          <p>Phone: {SchoolConfig.phone}</p>
          <p>Email: {SchoolConfig.email}</p>
          <p>Website: {SchoolConfig.website}</p>
        </div>
      </div>
      <div 
        className="w-full h-1 mt-1" 
        style={{ backgroundColor: SchoolConfig.theme.primaryLight, opacity: 0.2 }}
      />
    </div>
  );
};

export const PrintableFooter: React.FC = () => {
  return (
    <div className="hidden print:block mt-16 pt-8 border-t border-gray-300">
      <div className="flex justify-between items-end">
        <div>
          <div className="w-40 border-b border-gray-700 mb-2"></div>
          <p className="text-xs font-semibold text-gray-800 font-serif uppercase">Signature of Clerk / Prepared By</p>
          <p className="text-[10px] text-gray-500 italic font-serif mt-1">
            Official Document Record from Manasa Innovative P U College.
          </p>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="w-52 border-b-2 border-gray-950 mb-2"></div>
          <p className="text-sm font-black text-gray-950 font-serif uppercase tracking-wider">Signature of Principal</p>
          <p className="text-xs font-bold text-indigo-950 font-serif mt-0.5">{SchoolConfig.principal || 'Principal Venkatesh'}</p>
        </div>
      </div>
    </div>
  );
};
