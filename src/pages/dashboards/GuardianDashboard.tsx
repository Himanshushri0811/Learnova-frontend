import React, { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import {
  Calendar,
  CheckSquare,
  BarChart3,
  Bell,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const GuardianDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <DashboardLayout role="guardian" activeTab={activeTab} onTabChange={setActiveTab}>
      {/* 1. GUARDIAN OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Linked Child Header */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 text-brand-navy flex items-center justify-center font-bold text-lg">
                  AS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-brand-navy">Aarav Sharma</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-brand-blue">
                      Class 8
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Offline Tuition Batch: Senior Evening (6:00 PM – 7:30 PM)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-semibold border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Guardian Access Verified</span>
              </div>
            </div>

            {/* Child Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Monthly Attendance</span>
                <div className="text-xl font-bold text-brand-navy mt-1">96%</div>
                <span className="text-[10px] text-emerald-600 font-medium">24 / 25 Sessions</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Homework Status</span>
                <div className="text-xl font-bold text-brand-blue mt-1">Verified</div>
                <span className="text-[10px] text-slate-500">Regular submissions</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Avg Sunday Quiz</span>
                <div className="text-xl font-bold text-brand-cyan mt-1">90%</div>
                <span className="text-[10px] text-slate-500">Consistent score</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Monthly Feedback</span>
                <div className="text-xl font-bold text-brand-gold mt-1">Satisfactory</div>
                <span className="text-[10px] text-slate-500">Active participation</span>
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-sm font-bold text-brand-navy mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-cyan" />
                <span>Latest Tuition Attendance</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-brand-navy">Yesterday Session</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    PRESENT (6:00 PM)
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-brand-navy">Day Before Yesterday</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    PRESENT (6:00 PM)
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-sm font-bold text-brand-navy mb-4 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-brand-blue" />
                <span>Tutor Notes for Parents</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                "Aarav is showing consistent interest in Algebra and Science concepts. Please encourage him to spend 20 minutes daily revising formula derivations to maintain speed during timed quizzes."
              </p>
              <div className="mt-3 text-[11px] text-slate-400">
                Notes by: Himanshu Shrivastava (Tutor)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LINKED CHILD'S ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-lg font-bold text-brand-navy">Attendance Record (Aarav Sharma)</h2>
          </div>
          <p className="text-xs text-slate-600">
            Transparent attendance log for offline tuition sessions.
          </p>

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
            <div className="p-3.5 flex items-center justify-between bg-slate-50 font-semibold text-slate-600">
              <span>Date & Session</span>
              <span>Status</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span>Current Week — Session 1</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Present
              </span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span>Current Week — Session 2</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Present
              </span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span>Current Week — Session 3</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Present
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. HOMEWORK & QUIZ RESULTS */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-brand-blue" />
            <h2 className="text-lg font-bold text-brand-navy">Homework & Quiz Evaluations</h2>
          </div>
          <p className="text-xs text-slate-600">
            Records of weekly quizzes and completed homework assignments.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-brand-navy text-sm">Sunday Quiz: Mathematics (Class 8)</span>
                <p className="text-slate-500 text-xs mt-0.5">Topic: Linear Equations & Algebra</p>
                <div className="text-[11px] text-slate-400 mt-1">Date: Last Sunday</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-brand-blue">22 / 25</div>
                <span className="text-[10px] text-emerald-600 font-medium">88% (Grade A)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-brand-navy text-sm">Sunday Quiz: Science (Class 8)</span>
                <p className="text-slate-500 text-xs mt-0.5">Topic: Cell Structure & Functions</p>
                <div className="text-[11px] text-slate-400 mt-1">Date: 2 Weeks Ago</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-brand-cyan">23 / 25</div>
                <span className="text-[10px] text-emerald-600 font-medium">92% (Grade A+)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PROGRESS REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-gold" />
            <h2 className="text-lg font-bold text-brand-navy">Child's Progress Report</h2>
          </div>
          <p className="text-xs text-slate-600">
            Comprehensive quarterly overview of academic development and tutor comments.
          </p>

          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 text-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="font-bold text-brand-navy text-sm">Monthly Progress Summary</span>
                <p className="text-slate-500 text-[11px]">Period: Current Term • Class 8</p>
              </div>
              <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
                Good Academic Standing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Tuition Attendance</span>
                <div className="text-lg font-bold text-brand-navy mt-0.5">96%</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Homework Consistency</span>
                <div className="text-lg font-bold text-brand-blue mt-0.5">High</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Average Test Score</span>
                <div className="text-lg font-bold text-emerald-600 mt-0.5">90%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-gold" />
            <h2 className="text-lg font-bold text-brand-navy">Tuition Center Notices</h2>
          </div>
          <p className="text-xs text-slate-600">
            Important schedules and batch updates from tutor.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <span className="text-[10px] font-bold text-brand-blue uppercase">Upcoming Schedule</span>
            <h4 className="font-bold text-brand-navy text-sm">Sunday Quiz Timings Confirmed</h4>
            <p className="text-slate-600 leading-relaxed pt-1">
              The upcoming Sunday quiz for Classes 8 to 10 will take place from 10:00 AM to 11:30 AM. Students are advised to bring their geometry kit and revision notebooks.
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

