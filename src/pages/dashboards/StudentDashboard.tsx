import React, { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import {
  Calendar,
  ClipboardList,
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <DashboardLayout role="student" activeTab={activeTab} onTabChange={setActiveTab}>
      {/* 1. PERSONAL DASHBOARD OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                  Class 8 Student
                </span>
                <h2 className="text-2xl font-bold text-brand-navy mt-1">
                  Welcome back, Aarav
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Keep up the consistent work. Your next offline session is today at 6:00 PM.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto bg-blue-50 text-brand-blue px-3 py-1.5 rounded-xl text-xs font-semibold border border-blue-200">
                <Calendar className="w-4 h-4" />
                <span>Next Sunday Quiz in 4 Days</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Monthly Attendance</span>
                <div className="text-xl font-bold text-brand-navy mt-1">96%</div>
                <span className="text-[10px] text-emerald-600 font-medium">On track</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Pending Homework</span>
                <div className="text-xl font-bold text-brand-blue mt-1">1 Task</div>
                <span className="text-[10px] text-slate-500">Due tomorrow</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Last Quiz Score</span>
                <div className="text-xl font-bold text-brand-cyan mt-1">22 / 25</div>
                <span className="text-[10px] text-slate-500">Mathematics</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Subject Focus</span>
                <div className="text-xl font-bold text-brand-gold mt-1">Science</div>
                <span className="text-[10px] text-slate-500">Physics chapter</span>
              </div>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-sm font-bold text-brand-navy mb-4 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-brand-blue" />
                <span>Active Homework Tasks</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-brand-navy">Linear Equations (Ex. 2.3)</span>
                    <p className="text-[10px] text-slate-400">Questions 1 to 8 in notebook</p>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Due Tomorrow
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-brand-navy">Cell Structure Diagram Practice</span>
                    <p className="text-[10px] text-slate-400">Science notebook diagram label</p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-sm font-bold text-brand-navy mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-gold" />
                <span>Upcoming Sunday Quiz</span>
              </h3>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-brand-navy text-sm">Class 8 Mathematics Review</div>
                <p className="text-slate-500 text-xs mt-1">
                  Topics: Linear Equations in One Variable & Understanding Quadrilaterals.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Format: Offline Written Test</span>
                  <span className="font-semibold text-brand-navy">Duration: 45 Mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. HOMEWORK TAB */}
      {activeTab === 'homework' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-brand-blue" />
            <h2 className="text-lg font-bold text-brand-navy">My Homework Assignments</h2>
          </div>
          <p className="text-xs text-slate-600">
            Daily practice tasks assigned by tutor during offline tuition.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-brand-navy font-bold text-sm">Mathematics: Ex 2.3 Linear Equations</span>
                <p className="text-slate-500 text-xs mt-1">Complete questions 1 to 8. Focus on cross-multiplication steps.</p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Assigned: Yesterday • Due: Tomorrow's Session</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 text-[11px] font-semibold">
                Pending Verification
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
              <div>
                <span className="text-brand-navy font-bold text-sm">Science: Chapter 8 Cells & Tissues</span>
                <p className="text-slate-500 text-xs mt-1">Diagram labeling and short answer exercises verified in class.</p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Checked & Approved</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                Complete
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. ATTENDANCE HISTORY TAB */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-cyan" />
              <h2 className="text-lg font-bold text-brand-navy">Attendance Record</h2>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              96% Overall Attendance
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Monthly history of your in-person tuition sessions.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Sessions</span>
              <div className="text-xl font-bold text-brand-navy mt-1">25</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Present</span>
              <div className="text-xl font-bold text-emerald-600 mt-1">24</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Absent</span>
              <div className="text-xl font-bold text-red-500 mt-1">1</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Late Arrival</span>
              <div className="text-xl font-bold text-amber-500 mt-1">0</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUNDAY QUIZZES TAB */}
      {activeTab === 'quizzes' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-gold" />
            <h2 className="text-lg font-bold text-brand-navy">Sunday Quizzes</h2>
          </div>
          <p className="text-xs text-slate-600">
            Weekly evaluation schedules, chapter topics, and performance results.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-navy text-sm">Sunday Test 4: Mathematics</span>
                <span className="text-xs font-bold text-emerald-600">Score: 22 / 25 (88%)</span>
              </div>
              <p className="text-slate-500 text-xs mt-1">Rational Numbers & Linear Equations</p>
              <div className="mt-2 text-[11px] text-slate-400">Feedback: Strong calculation steps; review signs during transposition.</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-navy text-sm">Sunday Test 3: Science Foundation</span>
                <span className="text-xs font-bold text-emerald-600">Score: 23 / 25 (92%)</span>
              </div>
              <p className="text-slate-500 text-xs mt-1">Crop Production & Microorganisms</p>
              <div className="mt-2 text-[11px] text-slate-400">Feedback: Excellent definitions and conceptual answers.</div>
            </div>
          </div>
        </div>
      )}

      {/* 5. RESULTS AND PROGRESS */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-blue" />
            <h2 className="text-lg font-bold text-brand-navy">Results & Growth Summary</h2>
          </div>
          <p className="text-xs text-slate-600">
            Subject-wise performance overview across the term.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-brand-navy">Mathematics Foundation</span>
                <span className="font-bold text-brand-blue">90%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-blue h-full rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-brand-navy">Science Concepts</span>
                <span className="font-bold text-brand-cyan">92%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-cyan h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-brand-navy">English & Grammar</span>
                <span className="font-bold text-brand-gold">85%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-gold h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

