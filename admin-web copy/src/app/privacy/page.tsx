'use client';

import React from 'react';
import Link from 'next/link';
import { SchoolConfig } from '@/config/school.config';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
            &larr; <span className="ml-2">Back to Login</span>
          </Link>
        </div>
        
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">
            Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p>
                Welcome to {SchoolConfig.name}. We respect your privacy and are committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                school management application. This policy complies with the Digital Personal Data Protection Act (DPDPA), India.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Data Collection</h2>
              <p className="mb-2">We collect the following types of personal data to provide and improve our educational services:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Student Records:</strong> Name, age, grade, academic performance, attendance, and disciplinary records.</li>
                <li><strong>Parent/Guardian Information:</strong> Name, relationship to the student, email address, and residential address.</li>
                <li><strong>Contact Information:</strong> Phone numbers (used for OTP authentication, important alerts, and communication).</li>
                <li><strong>Financial Data:</strong> Fee payment history (we do not store full credit card or bank account numbers).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Data Usage</h2>
              <p className="mb-2">Your personal data is processed lawfully, fairly, and transparently for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To facilitate student enrollment, academic tracking, and school administration.</li>
                <li>To communicate important updates, attendance alerts, and academic reports to parents/guardians.</li>
                <li>To verify identity using OTP via phone numbers and ensure secure access to the application.</li>
                <li>To process fee payments and maintain accurate financial records.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Protection & Security (DPDP Compliance)</h2>
              <p>
                In accordance with the Digital Personal Data Protection Act, we implement robust technical and organizational measures 
                to secure your personal data against unauthorized access, loss, or misuse. Access to sensitive student records is strictly 
                limited to authorized school personnel. We do not sell or rent your personal data to third parties. 
              </p>
              <p className="mt-2">
                As a Data Principal, you have the right to request access to, correction of, or erasure of your personal data stored by us, 
                subject to mandatory retention laws for educational records.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Contact Information</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or the processing of your personal data, 
                please contact our administration at:
              </p>
              <div className="mt-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="space-y-3">
                  <p className="flex flex-col sm:flex-row sm:items-center">
                    <strong className="w-32 text-gray-900">School Name:</strong> 
                    <span className="text-gray-700">{SchoolConfig.name}</span>
                  </p>
                  <p className="flex flex-col sm:flex-row sm:items-center">
                    <strong className="w-32 text-gray-900">Email:</strong> 
                    <a href={`mailto:${SchoolConfig.email}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                      {SchoolConfig.email}
                    </a>
                  </p>
                  <p className="flex flex-col sm:flex-row sm:items-start">
                    <strong className="w-32 text-gray-900 pt-1">Address:</strong> 
                    <span className="text-gray-700 flex-1">{SchoolConfig.address}</span>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
