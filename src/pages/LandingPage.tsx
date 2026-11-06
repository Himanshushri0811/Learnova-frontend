import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  MessageCircle,
  PhoneCall,
  Sparkles,
  Users,
  UserRound,
} from 'lucide-react';
import { BRAND_CONFIG } from '../utils/config';
import { EnquiryModal } from '../components/common/EnquiryModal';

const benefits = [
  {
    title: 'Concept-Based Learning',
    description: 'Help students understand concepts instead of relying only on memorization.',
    icon: BookOpen,
    tone: 'blue',
  },
  {
    title: 'Personalized Attention',
    description: 'Understand each student’s learning needs and offer individual guidance.',
    icon: Users,
    tone: 'cyan',
  },
  {
    title: 'Weak Student Support',
    description: 'Give additional guidance to students who need more help.',
    icon: HelpCircle,
    tone: 'violet',
  },
  {
    title: 'Regular Assessment',
    description: 'Conduct regular tests and Sunday quizzes to check understanding.',
    icon: Calendar,
    tone: 'gold',
  },
  {
    title: 'Homework Monitoring',
    description: 'Encourage consistency and discipline through regular homework follow-up.',
    icon: ClipboardList,
    tone: 'pink',
  },
  {
    title: 'Parent Communication',
    description: 'Keep parents informed about student progress.',
    icon: MessageCircle,
    tone: 'green',
  },
] as const;

const learningSteps = [
  ['Assess', "Understand the student's current level and learning needs."],
  ['Explain', 'Build concept clarity with clear explanations and real examples.'],
  ['Practice', 'Homework and practice questions.'],
  ['Test', 'Regular assessments, tests and Sunday quizzes.'],
  ['Improve', 'Review progress and focus on areas that need support.'],
] as const;

const portalFeatures = [
  { title: 'Homework & Assignments', icon: ClipboardList, tone: 'blue' },
  { title: 'Test Results & Progress', icon: Award, tone: 'violet' },
  { title: 'Attendance Tracking', icon: CheckCircle2, tone: 'green' },
  { title: 'Announcements', icon: MessageCircle, tone: 'gold' },
  { title: 'Your Learning Journey', icon: GraduationCap, tone: 'cyan' },
] as const;

const toneStyles = {
  blue: 'bg-blue-50 text-blue-600 ring-blue-100',
  cyan: 'bg-cyan-50 text-cyan-600 ring-cyan-100',
  violet: 'bg-violet-50 text-violet-600 ring-violet-100',
  gold: 'bg-amber-50 text-amber-600 ring-amber-100',
  pink: 'bg-pink-50 text-pink-600 ring-pink-100',
  green: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
};

const StudentIllustration: React.FC = () => (
  <div className="relative mx-auto w-full max-w-[540px]">
    <div className="absolute inset-8 rounded-full bg-blue-100/70 blur-3xl" />
    <div className="relative rounded-[2.5rem] border border-white/80 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 shadow-[0_30px_90px_-40px_rgba(37,99,235,0.38)] sm:p-7">
      <img
        src="/brand/learnova-watermark.svg"
        alt=""
        aria-hidden="true"
        className="absolute -right-5 -top-5 w-32 opacity-[0.12]"
      />
      <svg
        viewBox="0 0 520 410"
        role="img"
        aria-label="Illustration of a student studying at a desk"
        className="relative w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="desk" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#2563EB" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="shirt" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#818CF8" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        <circle cx="260" cy="205" r="165" fill="#DBEAFE" />
        <circle cx="380" cy="100" r="24" fill="#FDE68A" />
        <path d="M92 310c17-89 66-135 145-135s128 46 145 135" fill="#CFFAFE" />
        <path d="M144 303h253v20H144z" rx="8" fill="url(#desk)" />
        <path d="M170 324h15v45h-15zm187 0h15v45h-15z" fill="#0B1F4D" />
        <path d="M200 292c5-48 24-76 57-76s52 28 57 76" fill="url(#shirt)" />
        <path d="M231 213c0 20 52 20 52 0v-31h-52z" fill="#F2B69E" />
        <ellipse cx="257" cy="151" rx="49" ry="57" fill="#F6C7A9" />
        <path d="M209 151c-6-44 15-72 54-72 36 0 53 24 48 61-14-2-26-12-34-27-15 17-39 26-68 25z" fill="#172554" />
        <path d="M212 147c-2 25 4 43 15 55-15-4-25-20-26-38-1-8 3-14 11-17zm88 0c2 25-4 43-15 55 15-4 25-20 26-38 1-8-3-14-11-17z" fill="#172554" />
        <circle cx="240" cy="153" r="3" fill="#0B1F4D" />
        <circle cx="274" cy="153" r="3" fill="#0B1F4D" />
        <path d="M247 174c6 5 14 5 20 0" fill="none" stroke="#C56D61" strokeLinecap="round" strokeWidth="3" />
        <path d="M215 260c-22-12-39-29-47-51" fill="none" stroke="#F2B69E" strokeLinecap="round" strokeWidth="13" />
        <path d="M299 254c14-13 25-28 33-44" fill="none" stroke="#F2B69E" strokeLinecap="round" strokeWidth="13" />
        <path d="M194 276h91l-9 13h-91z" fill="#F59E0B" />
        <path d="M193 289h91l-6 7h-91z" fill="#FCD34D" />
        <path d="M293 268h45v25h-45z" rx="3" fill="#fff" stroke="#BFDBFE" strokeWidth="2" />
        <path d="M302 276h27m-27 6h19" stroke="#93C5FD" strokeLinecap="round" strokeWidth="3" />
        <path d="M119 215h32v88h-32z" rx="5" fill="#fff" />
        <path d="M119 215h32v15h-32z" rx="5" fill="#F59E0B" />
        <path d="M126 241h18m-18 10h18m-18 10h18" stroke="#CBD5E1" strokeLinecap="round" strokeWidth="3" />
        <path d="M377 226h27v77h-27z" rx="4" fill="#fff" />
        <path d="M377 226h27v13h-27z" rx="4" fill="#A78BFA" />
        <path d="M383 249h15m-15 9h15m-15 9h15" stroke="#CBD5E1" strokeLinecap="round" strokeWidth="3" />
        <path d="m103 135 6 14 15 2-11 10 3 15-13-8-13 8 3-15-11-10 15-2z" fill="#F59E0B" />
        <path d="m410 150 4 9 10 1-8 7 2 10-8-5-9 5 2-10-7-7 10-1z" fill="#06B6D4" />
      </svg>

      <div className="float-slow absolute -left-3 top-14 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-blue-900/10 sm:-left-7 sm:px-5">
        <div className="flex items-center gap-2 text-sm font-bold text-brand-navy">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Sparkles className="h-4 w-4" />
          </span>
          Learn with confidence
        </div>
      </div>

      <div className="float-slow absolute -bottom-5 right-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-blue-900/10 sm:right-0">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          A thoughtful routine
        </p>
        {['Understand the concept', 'Practice together', 'Keep improving'].map((item) => (
          <div key={item} className="flex items-center gap-2 py-1 text-xs font-medium text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const LandingPage: React.FC = () => {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  return (
    <>
      <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-white via-white to-blue-50/70">
        <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-100/40 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-24">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-blue shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand-cyan" />
              Offline Tuition <span className="text-slate-300">/</span> Classes 1–10
              <span className="text-slate-300">/</span> CBSE &amp; UP Board curricula
            </div>
            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-tight text-brand-navy sm:text-5xl lg:text-[3.6rem]">
              Concept-Based Learning.
              <span className="block text-brand-blue">Personal Attention.</span>
              Better Results.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Learnova provides structured offline tuition for students across Classes 1 to 10, covering CBSE and UP Board curricula. We focus on strong fundamentals, regular assessments, individual guidance and consistent academic improvement.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Enquire About Tuition <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/student/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-brand-navy shadow-sm transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <GraduationCap className="h-5 w-5 text-brand-blue" />
                Student Login
              </Link>
            </div>
            <div className="mt-11 grid grid-cols-1 gap-5 border-t border-slate-200/80 pt-7 sm:grid-cols-3">
              {[
                ['Classes 1–10', 'CBSE & UP Board curricula covered'],
                ['Offline Personal Teaching', 'Direct in-person mentoring'],
                ['Small Batch Learning', 'Individual student attention'],
              ].map(([title, detail]) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-brand-blue">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold leading-5 text-brand-navy">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <StudentIllustration />
        </div>
      </section>

      <section id="about" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue">Why Learnova?</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              A Complete Learning Support for Your Child
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              A caring, consistent approach that helps students understand more and feel ready to keep learning.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={benefit.title}
                  className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_-20px_rgba(15,23,42,0.25)] transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg"
                >
                  <span className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${toneStyles[benefit.tone]}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-lg font-bold text-brand-navy">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="methodology" className="overflow-hidden bg-blue-50/60 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue">Our Teaching Methodology</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              A Simple & Effective Learning Journey
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Offline tuition for Classes 1–10, supporting CBSE and UP Board curricula through consistent teaching, practice and review.
            </p>
          </div>
          <div className="relative grid gap-5 md:grid-cols-5 md:gap-3">
            <div className="absolute left-7 top-8 bottom-8 w-px bg-blue-200 md:left-[10%] md:right-[10%] md:top-8 md:bottom-auto md:h-px md:w-auto" />
            {learningSteps.map(([title, description], index) => (
              <article key={title} className="relative flex gap-4 rounded-2xl bg-white p-5 shadow-sm md:flex-col md:items-center md:bg-transparent md:p-3 md:text-center md:shadow-none">
                <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-4 border-blue-50 bg-brand-blue text-lg font-extrabold text-white shadow-md shadow-blue-600/20">
                  {index + 1}
                </span>
                <div className="pt-1 md:pt-2">
                  <h3 className="text-lg font-bold text-brand-navy">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700">
                <Sparkles className="h-4 w-4" /> Your student portal
              </div>
              <h2 className="max-w-xl text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
                Track, Learn and Grow with Learnova
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                A simple and student-friendly portal to stay organized, track progress and manage learning.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {portalFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${toneStyles[feature.tone]}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-slate-700">{feature.title}</span>
                    </div>
                  );
                })}
              </div>
              <Link
                to="/student/login"
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-brand-blue transition hover:gap-3"
              >
                Visit Student Login <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mx-auto w-full max-w-[570px] rounded-[1.75rem] bg-gradient-to-br from-blue-100 via-indigo-50 to-cyan-100 p-4 shadow-inner sm:p-7">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-blue-900/10">
                <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                  <span className="ml-3 text-[11px] font-medium text-slate-400">Learnova Student Portal</span>
                </div>
                <div className="grid min-h-[270px] grid-cols-[52px_1fr] sm:grid-cols-[145px_1fr]">
                  <aside className="space-y-4 bg-brand-navy p-3 sm:p-4">
                    <img src="/brand/learnova-mark.svg" alt="" className="mx-auto h-8 w-8" />
                    <div className="space-y-3 pt-4">
                      {['Overview', 'Homework', 'Progress', 'Attendance'].map((item, index) => (
                        <div key={item} className={`h-7 rounded-lg ${index === 0 ? 'bg-white/15' : 'bg-white/[0.06]'}`}>
                          <span className="sr-only">{item}</span>
                        </div>
                      ))}
                    </div>
                  </aside>
                  <div className="p-4 sm:p-6">
                    <p className="text-xs font-medium text-slate-400">Your learning space</p>
                    <h3 className="mt-1 text-lg font-bold text-brand-navy">Learning overview</h3>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {[
                        ['Homework & Assignments', 'bg-blue-50'],
                        ['Test Results & Progress', 'bg-violet-50'],
                        ['Attendance Tracking', 'bg-emerald-50'],
                        ['Announcements', 'bg-amber-50'],
                      ].map(([label, color]) => (
                        <div key={label} className={`min-h-[72px] rounded-xl border border-slate-100 ${color} p-3`}>
                          <div className="mb-3 h-2 w-2/3 rounded-full bg-slate-300/70" />
                          <p className="text-[10px] font-semibold leading-4 text-slate-600 sm:text-xs">{label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-xl border border-dashed border-blue-200 bg-blue-50/50 p-3">
                      <p className="text-[10px] font-bold text-brand-navy sm:text-xs">Your Learning Journey</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {['Understand', 'Practice', 'Review'].map((step) => (
                          <span key={step} className="rounded-full bg-white px-2 py-1 text-[9px] font-medium text-slate-500">
                            {step}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-auto h-3 w-[72%] rounded-b-xl bg-slate-300 shadow-sm" />
              <div className="mx-auto h-2 w-[82%] rounded-b-full bg-slate-200" />
            </div>
          </div>
        </div>
      </section>

      <section id="founder" className="relative overflow-hidden bg-blue-50/50 py-20 sm:py-24">
        <img
          src="/brand/learnova-watermark.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-8 w-80 opacity-[0.08]"
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue">The person behind Learnova</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              Teaching with care, clarity and personal attention
            </h2>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_24px_80px_-45px_rgba(15,23,42,0.4)]">
            <div className="grid lg:grid-cols-[0.78fr_1.5fr]">
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-brand-navy via-blue-900 to-indigo-900 px-7 py-10 text-center text-white sm:px-10">
                <div className="flex h-40 w-40 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-inner">
                  <UserRound className="h-20 w-20 text-blue-100" strokeWidth={1.2} aria-hidden="true" />
                </div>
                <p className="mt-6 text-xl font-bold">{BRAND_CONFIG.founder.name}</p>
                <p className="mt-1 text-sm text-blue-100">Founder &amp; Educator, Learnova</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">2+ Years Experience</span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">Classes 1–10</span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">CBSE &amp; UP Board curricula</span>
                </div>
                <a
                  href={BRAND_CONFIG.founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
                >
                  LinkedIn Profile <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <p className="mt-4 text-[11px] text-blue-200">Portrait placeholder</p>
              </div>
              <div className="p-7 sm:p-10 lg:p-12">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue">A personal introduction</p>
                <h3 className="mt-3 text-2xl font-extrabold leading-tight text-brand-navy sm:text-3xl">
                  Hello, I’m {BRAND_CONFIG.founder.name}.
                </h3>
                <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                  <p>
                    I’m the Founder and Educator at Learnova. With over 2 years of teaching experience, I provide offline tuition for students from Class 1 to Class 10, covering both CBSE and UP Board curricula.
                  </p>
                  <p>
                    My teaching approach focuses on concept-based learning, personal attention, regular assessments and identifying areas where each student needs improvement.
                  </p>
                  <p>
                    I believe every student learns differently. My goal is to make learning easier, strengthen academic fundamentals and help students become more confident and independent learners.
                  </p>
                </div>
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <h4 className="text-sm font-bold text-brand-navy">What guides my teaching</h4>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      'Concept clarity over memorization',
                      'Attention to individual learning needs',
                      'Extra guidance when students need support',
                      'Regular tests and Sunday quizzes',
                      'Consistent homework monitoring',
                      'Keeping parents informed about progress',
                    ].map((priority) => (
                      <div key={priority} className="flex items-start gap-2.5 text-sm leading-5 text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
                        {priority}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden bg-brand-navy py-16 sm:py-20">
        <img src="/brand/learnova-watermark.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 w-80 opacity-[0.08]" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
            <Sparkles className="h-6 w-6" />
          </span>
          <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Give Your Child the Right Learning Environment.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">
            Help your child build strong fundamentals with personal attention and structured learning.
          </p>
          <button
            onClick={() => setIsEnquiryOpen(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-navy shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-navy"
          >
            Enquire About Tuition <ArrowRight className="h-4 w-4 text-brand-blue" />
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a href={`tel:${BRAND_CONFIG.contact.phoneRaw}`} className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">
              <PhoneCall className="h-4 w-4" />Call {BRAND_CONFIG.contact.phoneDisplay}
            </a>
            <a href={`https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/50 px-4 py-2.5 text-sm font-bold text-emerald-100 transition hover:bg-white/10">
              <MessageCircle className="h-4 w-4" />WhatsApp
            </a>
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs text-blue-100">
            <CheckCircle2 className="h-4 w-4 text-cyan-300" />
            Offline tuition for Classes 1–10
          </div>
        </div>
      </section>

      <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </>
  );
};
