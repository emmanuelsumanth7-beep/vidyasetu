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
        <p className="text-xs text-gray-500 italic">
          This is a computer-generated document. No signature is required.
        </p>
        <div className="text-center">
          <div className="w-32 h-32 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center mb-2 mx-auto">
            <span className="text-gray-400 text-sm rotate-[-30deg]">School Seal</span>
          </div>
          <p className="text-sm font-semibold text-gray-800">Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
};
