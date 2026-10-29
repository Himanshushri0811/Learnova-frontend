import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  CheckCircle2,
  Calendar,
  ClipboardList,
  BarChart3,
  MessageCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Award,
  Layers,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { BRAND_CONFIG } from '../utils/config';
import { EnquiryModal } from '../components/common/EnquiryModal';

export const LandingPage: React.FC = () => {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface text-brand-text">
      {/* 1. HERO SECTION */}
      <section
        id="hero"
        className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200"
      >
        {/* Subtle decorative watermark placement in background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-40">
          <img
            src="/brand/learnova-watermark.svg"
            alt=""
            className="w-96 h-96 select-none"
            aria-hidden="true"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Mode & Audience Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
              <span className="text-xs font-semibold text-brand-blue uppercase tracking-wider">
                Offline Tuition • Classes 1–10 • All Subjects
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-navy tracking-tight leading-[1.15] mb-6">
              Concept-based learning with genuine{' '}
              <span className="text-brand-blue">personal attention</span>.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl">
              Learnova provides structured offline tuition for school students across Classes 1 to 10. We focus on strong fundamentals, regular assessment, and active guidance for students who need extra support.
            </p>

            {/* Main CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-brand-blue hover:bg-brand-blueHover rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
              >
                <span>Enquire About Tuition</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-brand-navy bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-xs"
              >
                <GraduationCap className="w-5 h-5 text-brand-blue" />
                <span>Student Login</span>
              </Link>
            </div>

            {/* Quick highlights */}
            <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-brand-navy">Classes 1–10</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">All school subjects covered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-blue">Offline Batches</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">Direct in-person mentoring</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-2xl font-bold text-brand-cyan">Small Batches</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">Individual student tracking</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TEACHING APPROACH SECTION */}
      <section id="about" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-2">
              Our Methodology
            </h2>
            <h3 className="text-3xl font-bold text-brand-navy tracking-tight sm:text-4xl">
              How we help students build confidence
            </h3>
            <p className="mt-4 text-base text-slate-600">
              Education should not be about rote memorization. Our classroom rhythm is designed to make fundamentals intuitive and repeatable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-brand-surface rounded-2xl p-7 border border-slate-200 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-100/80 text-brand-blue flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-brand-navy mb-2">
                Concept-First Understanding
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                We break complex topics into relatable steps so students understand the logic behind formulas, rules, and problem-solving techniques before solving exercises.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-brand-surface rounded-2xl p-7 border border-slate-200 hover:border-cyan-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-100/80 text-brand-cyan flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-brand-navy mb-2">
                Personalized Attention
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every child absorbs concepts at their own pace. Small offline batches allow direct interaction, doubt resolution, and tailored explanations.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-brand-surface rounded-2xl p-7 border border-slate-200 hover:border-gold-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-brand-gold flex items-center justify-center mb-5">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-brand-navy mb-2">
                Dedicated Extra Support
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Students needing reinforcement receive supplementary guidance and revision sessions to strengthen foundational gaps without feeling rushed.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-brand-surface rounded-2xl p-7 border border-slate-200 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-100/80 text-brand-blue flex items-center justify-center mb-5">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-brand-navy mb-2">
                Homework & Practice Monitoring
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Daily school homework and tuition assignments are tracked methodically, building consistent study discipline and self-reliance.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-brand-surface rounded-2xl p-7 border border-slate-200 hover:border-cyan-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-100/80 text-brand-cyan flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-brand-navy mb-2">
                Regular Tests & Sunday Quizzes
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Periodic chapter assessments and Sunday review quizzes measure understanding under timed conditions, reducing exam anxiety.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-brand-surface rounded-2xl p-7 border border-slate-200 hover:border-amber-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-brand-gold flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-brand-navy mb-2">
                Structured Feedback
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Constructive feedback pinpoints exact areas needing review, helping students recognize their progress and improve step by step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ACADEMIC TRACKING PREVIEW (Clearly identified as platform preview) */}
      <section id="features" className="py-20 bg-brand-surface border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
              <span>Technology in Development • Platform Preview</span>
            </div>
            <h2 className="text-3xl font-bold text-brand-navy tracking-tight sm:text-4xl">
              Academic Tracking Platform
            </h2>
            <p className="mt-4 text-base text-slate-600">
              We are building a clean digital companion for our tuition center. Below is an authentic preview of the tracking capabilities being introduced to simplify record-keeping for parents, students, and tutors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Preview
                  </span>
                </div>
                <h4 className="text-base font-bold text-brand-navy mb-2">
                  Attendance Tracking
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Daily presence and absence log to ensure students maintain consistent attendance throughout the school term.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                Log mode: In-person session logs
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-50 text-brand-cyan flex items-center justify-center">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Preview
                  </span>
                </div>
                <h4 className="text-base font-bold text-brand-navy mb-2">
                  Homework Status
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Transparent record of completed, pending, or reviewed homework assignments across subjects.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                Track mode: Daily verification
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-brand-gold flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Preview
                  </span>
                </div>
                <h4 className="text-base font-bold text-brand-navy mb-2">
                  Test Results & Quizzes
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Chapter marks, score breakdowns, and question reviews for both regular offline tests and Sunday quizzes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                Data mode: Recorded score sheets
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Preview
                  </span>
                </div>
                <h4 className="text-base font-bold text-brand-navy mb-2">
                  Progress Summaries
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Periodic summary reports highlighting growth trends, consistent subject performance, and suggested practice topics.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                Report mode: Quarterly & Monthly review
              </div>
            </div>
          </div>

          {/* Interactive preview note */}
          <div className="mt-8 bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-blue shrink-0" />
              <p className="text-xs sm:text-sm text-brand-navy font-medium">
                Want to explore the UI architecture? Test the role-specific dashboard views.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-brand-blue hover:text-brand-blueHover underline"
              >
                Access Portal Prototype &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PARENT PARTNERSHIP SECTION */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-2">
                Parent Partnership
              </h2>
              <h3 className="text-3xl font-bold text-brand-navy tracking-tight sm:text-4xl mb-6">
                Active transparency without guesswork
              </h3>
              <p className="text-base text-slate-600 leading-relaxed mb-6">
                Parents play an indispensable role in a child's academic development. At Learnova, we maintain an open feedback loop through regular progress reviews, attendance alerts, and direct discussions on strengths and areas needing attention.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-brand-navy">
                      Timely Progress Communication
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Regular updates after monthly tests so parents know exactly where the student stands before school exams.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-brand-navy">
                      Homework Accountability
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Clarity on whether regular home practice tasks are being completed conscientiously.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-brand-navy">
                      Direct Educator Consultation
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Scheduled discussions to align on exam preparation and personalized study strategies.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-brand-surface p-8 rounded-3xl border border-slate-200">
              <div className="border-l-4 border-brand-cyan pl-4 mb-6">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tuition Philosophy
                </span>
                <p className="text-sm text-brand-navy font-medium mt-1 italic">
                  "Consistent small efforts, monitored every week, create sustainable academic confidence."
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-3">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Typical Academic Cycle
                </div>
                <div className="text-xs text-slate-600 flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-medium text-brand-navy">Mon – Fri</span>
                  <span>Concept teaching & homework review</span>
                </div>
                <div className="text-xs text-slate-600 flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-medium text-brand-navy">Weekend / Sunday</span>
                  <span>Review quiz & revision for key topics</span>
                </div>
                <div className="text-xs text-slate-600 flex items-center justify-between py-1.5">
                  <span className="font-medium text-brand-navy">Month-end</span>
                  <span>Evaluation summary for parents</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOUNDER SECTION (Verified info only, no fictitious claims) */}
      <section id="founder" className="py-20 bg-brand-surface border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Founder Avatar / Mark */}
              <div className="md:col-span-4 flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-2xl bg-brand-navy flex items-center justify-center p-4 shadow-md mb-4 border-2 border-brand-blue/30">
                  <img
                    src="/brand/learnova-mark.svg"
                    alt="Learnova Icon"
                    className="w-16 h-16"
                  />
                </div>
                <h3 className="text-xl font-bold text-brand-navy">
                  {BRAND_CONFIG.founder.name}
                </h3>
                <p className="text-xs font-semibold text-brand-blue uppercase tracking-wider mt-1">
                  Founder & Offline Tutor
                </p>
                <div className="mt-4">
                  <a
                    href={BRAND_CONFIG.founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:text-brand-blueHover bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                  >
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Founder Details */}
              <div className="md:col-span-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-4">
                  <span>Verified Educator Profile</span>
                </div>
                <h4 className="text-2xl font-bold text-brand-navy tracking-tight mb-4">
                  Dedicated in-person guidance for foundational classes
                </h4>
                <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                  <p>
                    Himanshu Shrivastava brings <strong>2 years of teaching experience</strong> conducting offline tuition for students from <strong>Class 1 to Class 10</strong> across all core school subjects.
                  </p>
                  <p>
                    With an emphasis on conceptual clarity rather than rote recall, his teaching methodology ensures students build lasting comprehension, regular study habits, and analytical problem-solving skills.
                  </p>
                  <p>
                    Learnova was created to combine high-touch in-person classroom teaching with clean, dependable operational tools for academic follow-up.
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-semibold">Teaching Scope</span>
                    <p className="text-sm font-bold text-brand-navy">{BRAND_CONFIG.founder.scope}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-semibold">Tuition Format</span>
                    <p className="text-sm font-bold text-brand-navy">{BRAND_CONFIG.founder.mode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FUTURE PLATFORM FEATURES (Honestly presented SaaS roadmap) */}
      <section id="future-saas" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
              <Layers className="w-3.5 h-3.5 text-brand-navy" />
              <span>Future Roadmap • EdTech Vision</span>
            </div>
            <h2 className="text-3xl font-bold text-brand-navy tracking-tight sm:text-4xl">
              Future Platform for Tutors and Coaching Institutes
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Our long-term goal is to mature our internal tuition management platform into an easy-to-use SaaS product for independent tutors and small coaching centres. These capabilities are currently in active design and engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-brand-surface rounded-2xl p-6 border border-slate-200">
              <div className="text-xs font-semibold text-brand-blue uppercase tracking-wider mb-2">
                Planned Phase 1
              </div>
              <h4 className="text-lg font-bold text-brand-navy mb-2">
                Batch & Class Management
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Centralized timetable, student enrollments, subject mappings, and batch schedule management for solo educators.
              </p>
              <div className="mt-6 text-[11px] font-semibold text-slate-400 uppercase">
                Status: In Prototype Architecture
              </div>
            </div>

            <div className="bg-brand-surface rounded-2xl p-6 border border-slate-200">
              <div className="text-xs font-semibold text-brand-cyan uppercase tracking-wider mb-2">
                Planned Phase 2
              </div>
              <h4 className="text-lg font-bold text-brand-navy mb-2">
                Multi-Tutor & Center Workspaces
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Permissions and class allocations for coaching centres with multiple instructors teaching different subjects.
              </p>
              <div className="mt-6 text-[11px] font-semibold text-slate-400 uppercase">
                Status: Architecture Planning
              </div>
            </div>

            <div className="bg-brand-surface rounded-2xl p-6 border border-slate-200">
              <div className="text-xs font-semibold text-brand-gold uppercase tracking-wider mb-2">
                Planned Phase 3
              </div>
              <h4 className="text-lg font-bold text-brand-navy mb-2">
                Guardian Communication Hub
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated monthly attendance and quiz reports delivered securely via email or messaging channels.
              </p>
              <div className="mt-6 text-[11px] font-semibold text-slate-400 uppercase">
                Status: Roadmap Item
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CONTACT & ENQUIRY SECTION (Configurable, no invented contact details) */}
      <section id="contact" className="py-20 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-2">
                Get In Touch
              </h2>
              <h3 className="text-3xl font-bold text-brand-navy tracking-tight sm:text-4xl">
                Enquire for tuition admissions
              </h3>
              <p className="mt-4 text-base text-slate-600">
                Contact us to check current offline batch timings, seat availability, and subject schedules for Classes 1 to 10.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-100">
                {/* Direct Phone / Call */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-navy uppercase">
                        Phone Enquiries
                      </div>
                      <div className="text-sm font-semibold text-slate-700">
                        {BRAND_CONFIG.contact.phoneDisplay}
                      </div>
                    </div>
                  </div>
                  {BRAND_CONFIG.contact.phoneRaw ? (
                    <a
                      href={`tel:${BRAND_CONFIG.contact.phoneRaw}`}
                      className="text-xs font-semibold text-brand-blue hover:underline"
                    >
                      Call for admissions &rarr;
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      (Configurable via environment placeholder)
                    </span>
                  )}
                </div>

                {/* WhatsApp Enquiry */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-navy uppercase">
                        WhatsApp Message
                      </div>
                      <div className="text-sm font-semibold text-slate-700">
                        Direct messaging
                      </div>
                    </div>
                  </div>
                  {BRAND_CONFIG.contact.whatsappRaw ? (
                    <a
                      href={`https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-600 hover:underline"
                    >
                      Chat on WhatsApp &rarr;
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      (Configurable via environment placeholder)
                    </span>
                  )}
                </div>
              </div>

              {/* Trigger Online Form */}
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-4">
                  Prefer leaving your contact details? Fill out our quick admission enquiry form.
                </p>
                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-brand-navy hover:bg-brand-navyLight rounded-xl transition-all shadow-sm"
                >
                  <span>Open Tuition Enquiry Form</span>
                  <ArrowRight className="w-4 h-4 text-brand-cyan" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </div>
  );
};

