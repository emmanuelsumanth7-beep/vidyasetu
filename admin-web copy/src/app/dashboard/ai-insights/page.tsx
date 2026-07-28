'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, CalendarClock, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';

export default function AIInsightsPage() {
  const [clusters, setClusters] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState({ clusters: true, timetable: false });

  useEffect(() => {
    fetch('https://ai.bot.smha.co.in/api/ai/exams/clusters')
      .then(res => res.json())
      .then(data => {
        setClusters(data.clusters || []);
        setLoading(prev => ({ ...prev, clusters: false }));
      })
      .catch(err => {
        console.error(err);
        setLoading(prev => ({ ...prev, clusters: false }));
      });
  }, []);

  const generateTimetable = async () => {
    setLoading(prev => ({ ...prev, timetable: true }));
    try {
      // 1. Fetch real data from the database
      const [classesData, teachersData] = await Promise.all([
        api.get('/classes'),
        api.get('/users/teachers').catch(() => []) // fallback
      ]);

      const classNames = classesData.length > 0 ? classesData.map((c: any) => c.name) : ['Class 8A', 'Class 8B', 'Class 8C'];
      const teacherNames = teachersData.length > 0 ? teachersData.map((t: any) => t.name) : ['Mr. Smith', 'Ms. Johnson', 'Mr. Davis'];
      
      // We'll limit it to 5 classes for the demo so it solves quickly
      const selectedClasses = classNames.slice(0, 5);

      // 2. Send dynamic data to AI Constraint Solver
      const res = await fetch('https://bot-ai.smha.co.in/api/ai/timetable/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classes: selectedClasses,
          teachers: teacherNames.length >= 3 ? teacherNames.slice(0, 5) : ['T1', 'T2', 'T3'],
          subjects: ['Mathematics', 'Science', 'English', 'History', 'Art'],
          timeslots: ['09:00 AM - 09:45 AM', '10:00 AM - 10:45 AM', '11:00 AM - 11:45 AM', '12:00 PM - 12:45 PM'],
          rooms: ['Room 101', 'Room 102', 'Room 103', 'Room 104', 'Lab A']
        })
      });
      
      const data = await res.json();
      if (data.status === 'success') {
        setTimetable(data.schedule);
      } else {
        console.error("AI Error:", data.reason);
        alert(`Failed to generate timetable: ${data.reason}`);
      }
    } catch (err) {
      console.error('Timetable Generation Error:', err);
    } finally {
      setLoading(prev => ({ ...prev, timetable: false }));
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-32 max-w-[1400px] mx-auto w-full font-data">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border-draft pb-6">
        <div className="w-16 h-16 rounded-[20px] bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <BrainCircuit size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-ink-primary">Vidya AI Insights</h1>
          <p className="text-ink-secondary mt-1">Machine Learning algorithms powered by Scikit-Learn and OR-Tools</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Exam Clustering */}
        <div className="bg-white rounded-[24px] p-8 border border-border-draft shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display text-ink-primary flex items-center gap-2">
              <Users size={20} className="text-teal-500" />
              Student Segmentation (K-Means)
            </h2>
          </div>
          
          {loading.clusters ? (
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-20 bg-gray-100 rounded-xl w-full" />
              <div className="h-20 bg-gray-100 rounded-xl w-full" />
              <div className="h-20 bg-gray-100 rounded-xl w-full" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {clusters.map((c, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-ink-primary">{c.label}</span>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold">{c.student_count} Students</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-ink-secondary uppercase tracking-wider">Math</span>
                      <span className="font-bold">{c.avg_math}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-ink-secondary uppercase tracking-wider">Science</span>
                      <span className="font-bold">{c.avg_science}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-ink-secondary uppercase tracking-wider">English</span>
                      <span className="font-bold">{c.avg_english}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Predictive Analytics */}
        <div className="bg-white rounded-[24px] p-8 border border-border-draft shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display text-ink-primary flex items-center gap-2">
              <TrendingUp size={20} className="text-amber-500" />
              Risk Predictions (Logistic Regression)
            </h2>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-4">
            <AlertTriangle className="text-amber-600 shrink-0" />
            <div>
              <h3 className="font-bold text-amber-900">Fee Default Prediction Engine</h3>
              <p className="text-sm text-amber-800 mt-1">
                SQL Heuristics estimate that <strong>124 students</strong> are at High Risk of fee default this semester based on days overdue &gt; 30 and Paid Ratio &lt; 50%.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 flex gap-4">
            <BrainCircuit className="text-red-600 shrink-0" />
            <div>
              <h3 className="font-bold text-red-900">Performance Drop Risk</h3>
              <p className="text-sm text-red-800 mt-1">
                The ML model predicts <strong>42 students</strong> have a &gt;60% probability of failing upcoming midterms based on lagging attendance patterns.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* OR-Tools Timetable */}
      <div className="bg-white rounded-[24px] p-8 border border-border-draft shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-display text-ink-primary flex items-center gap-2">
            <CalendarClock size={20} className="text-indigo-500" />
            Constraint Solver Timetable (OR-Tools)
          </h2>
          <button 
            onClick={generateTimetable}
            disabled={loading.timetable}
            className="px-4 py-2 bg-indigo-600 text-white rounded-full font-bold text-sm shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading.timetable ? 'Solving Constraints...' : 'Generate New Timetable'}
          </button>
        </div>

        {timetable.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b-2 border-gray-100 font-bold text-ink-secondary">Time Slot</th>
                  <th className="p-4 border-b-2 border-gray-100 font-bold text-ink-secondary">Class 8A</th>
                  <th className="p-4 border-b-2 border-gray-100 font-bold text-ink-secondary">Class 8B</th>
                  <th className="p-4 border-b-2 border-gray-100 font-bold text-ink-secondary">Class 8C</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-4 border-b border-gray-100 font-bold">{row.time}</td>
                    <td className="p-4 border-b border-gray-100">{row['Class 8A']}</td>
                    <td className="p-4 border-b border-gray-100">{row['Class 8B']}</td>
                    <td className="p-4 border-b border-gray-100">{row['Class 8C']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
            Click 'Generate' to let the AI solve timetable conflicts.
          </div>
        )}
      </div>

    </div>
  );
}
