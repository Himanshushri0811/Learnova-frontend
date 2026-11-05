import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Compass,
  GraduationCap,
  Heart,
  ImagePlus,
  LockKeyhole,
  MessageSquareText,
  PartyPopper,
  Sparkles,
  Star,
  UserRound,
  Wallet,
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { StudentMode, StudentPortalLayout } from '../../layouts/StudentPortalLayout';
import './StudentDashboard.css';

type DashboardTab =
  | 'overview'
  | 'subjects'
  | 'homework'
  | 'assignments'
  | 'tests'
  | 'results'
  | 'attendance'
  | 'progress'
  | 'calendar'
  | 'announcements'
  | 'achievements'
  | 'fees'
  | 'profile';

type AttendanceStatus = 'present' | 'absent' | 'leave';

interface StudentProfile {
  _id: string;
  name: string;
  gradeLevel?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  academicNotes?: string;
  profilePhoto?: string;
}

type StudentProfileFields = Omit<StudentProfile, '_id'>;

interface AttendanceRecord {
  _id: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  leave: number;
  percentage: number;
}

interface StudentFee {
  _id: string;
  academicMonth: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'partial' | 'overdue';
  payments: Array<{
    amount: number;
    paymentDate: string;
    method: string;
    transactionReference?: string;
    remarks?: string;
  }>;
}

interface StudentResponse {
  data: { student: StudentProfile };
}

interface AttendanceResponse {
  data: {
    summary: AttendanceSummary;
    records: AttendanceRecord[];
  };
}

interface FeesResponse {
  data: { fees: StudentFee[] };
}

interface LearningSection {
  key: DashboardTab;
  title: string;
  description: string;
  icon: typeof BookOpen;
  emptyTitle: string;
  emptyMessage: string;
}

const learningSections: LearningSection[] = [
  {
    key: 'subjects',
    title: 'My subjects',
    description: 'Your subjects and learning materials, all in one place.',
    icon: BookOpen,
    emptyTitle: 'Your subjects will show up here',
    emptyMessage: 'Subject lists and learning materials are not available in the connected backend yet.',
  },
  {
    key: 'homework',
    title: 'My homework',
    description: 'See the work your teacher has assigned you.',
    icon: ClipboardList,
    emptyTitle: 'Your learning journey starts here!',
    emptyMessage: 'There are no homework records yet. Assignments will appear here when the backend supports them.',
  },
  {
    key: 'assignments',
    title: 'My assignments',
    description: 'Keep track of your assigned classwork.',
    icon: ClipboardCheck,
    emptyTitle: 'No assignments to show',
    emptyMessage: 'Assignment records are not available in the connected backend yet.',
  },
  {
    key: 'tests',
    title: 'Upcoming tests',
    description: 'Get ready for your next assessment.',
    icon: CalendarDays,
    emptyTitle: 'No test schedule yet',
    emptyMessage: 'Upcoming tests will appear here once test schedules are available.',
  },
  {
    key: 'results',
    title: 'My results',
    description: 'Your real assessment scores and feedback.',
    icon: BarChart3,
    emptyTitle: 'Your results will appear here',
    emptyMessage: 'Test results and marks are not available in the connected backend yet.',
  },
  {
    key: 'calendar',
    title: 'Study calendar',
    description: 'A clear view of your learning plans and important dates.',
    icon: CalendarRange,
    emptyTitle: 'Your calendar is ready',
    emptyMessage: 'There are no study events to display because calendar events are not stored in the backend yet.',
  },
  {
    key: 'announcements',
    title: 'Teacher announcements',
    description: 'Updates shared by your teacher.',
    icon: MessageSquareText,
    emptyTitle: 'Nothing new for now',
    emptyMessage: 'Teacher announcements are not available in the connected backend yet.',
  },
  {
    key: 'achievements',
    title: 'My achievements',
    description: 'Celebrate the milestones you have actually earned.',
    icon: Award,
    emptyTitle: 'Your first milestone is waiting',
    emptyMessage: 'There are no recorded badges or rewards yet. Achievements will only appear when they are saved by your teacher.',
  },
];

const gradeNumber = (gradeLevel?: string): number | undefined => {
  const match = gradeLevel?.match(/\d+/);
  if (!match) return undefined;
  const grade = Number(match[0]);
  return grade >= 1 && grade <= 10 ? grade : undefined;
};

const getStudentMode = (gradeLevel?: string): StudentMode => {
  const grade = gradeNumber(gradeLevel);
  if (!grade) return 'onboarding';
  if (grade <= 5) return 'kids';
  if (grade <= 8) return 'junior';
  return 'senior';
};

const modeCopy: Record<StudentMode, { title: string; subtitle: string; button: string }> = {
  kids: {
    title: 'Ready for a little learning adventure?',
    subtitle: 'Every curious question is a brilliant beginning.',
    button: 'Explore my learning',
  },
  junior: {
    title: 'Small steps add up to big progress.',
    subtitle: 'Your learning space, made just for you.',
    button: 'See my learning',
  },
  senior: {
    title: 'Make today count.',
    subtitle: 'Your academic overview, grounded in your real records.',
    button: 'View my progress',
  },
  onboarding: {
    title: 'Your learning journey starts here!',
    subtitle: 'Add your class to shape your personal learning space.',
    button: 'Complete my profile',
  },
};

const errorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const formatAmount = (amount: number): string =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);

const createProfileDraft = (student: StudentProfile): StudentProfileFields => ({
  name: student.name,
  gradeLevel: student.gradeLevel ?? '',
  guardianName: student.guardianName ?? '',
  guardianPhone: student.guardianPhone ?? '',
  guardianEmail: student.guardianEmail ?? '',
  fatherName: student.fatherName ?? '',
  motherName: student.motherName ?? '',
  address: student.address ?? '',
  academicNotes: student.academicNotes ?? '',
  profilePhoto: student.profilePhoto ?? '',
});

function LoadingCard() {
  return (
    <div aria-hidden="true" className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5">
      <div className="h-10 w-10 rounded-2xl bg-slate-100" />
      <div className="mt-5 h-3 w-24 rounded bg-slate-100" />
      <div className="mt-3 h-7 w-32 rounded bg-slate-100" />
      <div className="mt-3 h-3 w-40 rounded bg-slate-100" />
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  onAction,
}: {
  icon: typeof Sparkles;
  title: string;
  message: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-blue-200 bg-gradient-to-br from-white to-blue-50/70 px-5 py-12 text-center sm:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-white text-blue-600 shadow-md shadow-blue-100">
        <Icon size={28} strokeWidth={1.8} />
      </div>
      <h3 className="mt-5 text-lg font-extrabold text-[#0b1f4d]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{message}</p>
      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          {action} <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof BookOpen;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Icon size={21} />
      </span>
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-600">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[#0b1f4d] sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [attendance, setAttendance] = useState<AttendanceSummary | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [profileDraft, setProfileDraft] = useState<StudentProfileFields | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [feesLoading, setFeesLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [attendanceError, setAttendanceError] = useState('');
  const [feesError, setFeesError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      const [profileResult, attendanceResult, feesResult] = await Promise.allSettled([
        apiRequest<StudentResponse>('/students/me'),
        apiRequest<AttendanceResponse>('/attendance/my-attendance'),
        apiRequest<FeesResponse>('/fees/my-fees'),
      ]);
      if (!active) return;

      if (profileResult.status === 'fulfilled') {
        setStudent(profileResult.value.data.student);
        setProfileDraft(createProfileDraft(profileResult.value.data.student));
      } else {
        setProfileError(errorMessage(profileResult.reason, 'Unable to load your profile.'));
      }
      setProfileLoading(false);

      if (attendanceResult.status === 'fulfilled') {
        setAttendance(attendanceResult.value.data.summary);
        setAttendanceRecords(attendanceResult.value.data.records);
      } else {
        setAttendanceError(errorMessage(attendanceResult.reason, 'Unable to load attendance records.'));
      }
      setAttendanceLoading(false);

      if (feesResult.status === 'fulfilled') {
        setFees(feesResult.value.data.fees);
      } else {
        setFeesError(errorMessage(feesResult.reason, 'Unable to load fee records.'));
      }
      setFeesLoading(false);
    };

    void loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const mode = useMemo(() => getStudentMode(student?.gradeLevel), [student?.gradeLevel]);
  const modeContent = modeCopy[mode];
  const firstName = student?.name.trim().split(/\s+/)[0] || 'Learner';
  const pendingFees = fees.reduce((total, fee) => total + fee.pendingAmount, 0);
  const profileFields = [
    student?.name,
    student?.gradeLevel,
    student?.fatherName,
    student?.motherName,
    student?.guardianPhone,
    student?.address,
  ];
  const profileCompletion = Math.round(
    (profileFields.filter((field) => Boolean(field?.trim())).length / profileFields.length) * 100,
  );

  const selectTab = (tab: string) => {
    if ([
      'overview', 'subjects', 'homework', 'assignments', 'tests', 'results',
      'attendance', 'progress', 'calendar', 'announcements', 'achievements',
      'fees', 'profile',
    ].includes(tab)) {
      setActiveTab(tab as DashboardTab);
    }
  };

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profileDraft) return;
    setSavingProfile(true);
    setProfileError('');
    try {
      const response = await apiRequest<StudentResponse>('/students/me', {
        method: 'PATCH',
        body: JSON.stringify(profileDraft),
      });
      setStudent(response.data.student);
      setProfileDraft(createProfileDraft(response.data.student));
      setToast({ message: 'Your profile has been saved.', type: 'success' });
    } catch (error) {
      const message = errorMessage(error, 'Unable to save your profile.');
      setProfileError(message);
      setToast({ message, type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const uploadProfilePhoto = (file?: File) => {
    if (!file || !profileDraft) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setToast({ message: 'Choose a JPG, PNG, or WebP image.', type: 'error' });
      return;
    }
    if (file.size > 256 * 1024) {
      setToast({ message: 'Please choose an image smaller than 256 KB.', type: 'error' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileDraft((draft) => draft ? { ...draft, profilePhoto: reader.result as string } : draft);
        setToast({ message: 'Photo ready. Save your profile to keep it.', type: 'success' });
      } else {
        setToast({ message: 'Unable to read that image. Please try another.', type: 'error' });
      }
    };
    reader.onerror = () => setToast({ message: 'Unable to read that image. Please try another.', type: 'error' });
    reader.readAsDataURL(file);
  };

  const changePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      setToast({ message: 'The new passwords do not match.', type: 'error' });
      return;
    }
    setChangingPassword(true);
    try {
      await apiRequest('/students/me/password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordFields.currentPassword,
          newPassword: passwordFields.newPassword,
        }),
      });
      setPasswordFields({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setToast({ message: 'Your password has been updated.', type: 'success' });
    } catch (error) {
      setToast({ message: errorMessage(error, 'Unable to change your password.'), type: 'error' });
    } finally {
      setChangingPassword(false);
    }
  };

  const updateDraft = <K extends keyof StudentProfileFields>(
    key: K,
    value: StudentProfileFields[K],
  ) => {
    setProfileDraft((draft) => draft ? { ...draft, [key]: value } : draft);
  };

  const studentName = student?.name || 'Learner';

  return (
    <StudentPortalLayout
      activeTab={activeTab}
      onTabChange={selectTab}
      studentName={studentName}
      gradeLevel={student?.gradeLevel}
      profilePhoto={student?.profilePhoto}
      mode={mode}
    >
      {toast && (
        <div
          role={toast.type === 'error' ? 'alert' : 'status'}
          aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
          className={`fixed right-4 top-20 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl ${
            toast.type === 'success'
              ? 'border-emerald-200 bg-white text-emerald-800'
              : 'border-rose-200 bg-white text-rose-800'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={17} /> : <Heart size={17} />}
          {toast.message}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <section className={`relative isolate overflow-hidden rounded-[30px] p-6 shadow-xl sm:p-8 lg:p-10 ${
            mode === 'kids'
              ? 'bg-gradient-to-br from-orange-50 via-pink-50 to-rose-100 text-[#0b1f4d] shadow-pink-200/50'
              : mode === 'junior'
                ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-100 text-[#0b1f4d] shadow-blue-200/60'
                : mode === 'senior'
                  ? 'bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 text-[#0B1F4D] shadow-indigo-200/60'
                  : 'bg-gradient-to-br from-cyan-50 via-blue-50 to-violet-100 text-[#0b1f4d] shadow-blue-200/60'
          }`}>
            <div aria-hidden="true" className="absolute -right-10 -top-20 -z-10 h-64 w-64 rounded-full border-[34px] border-white/10" />
            <div aria-hidden="true" className="absolute -bottom-28 right-28 -z-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-[11px] font-bold text-blue-900 shadow-sm">
                  {mode === 'kids' ? <Star size={14} /> : <Sparkles size={14} />}
                  {mode === 'onboarding' ? 'Let’s get started' : mode === 'kids' ? 'A little learning adventure' : `${student?.gradeLevel} · Your learning space`}
                </span>
                <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-[#0B1F4D] sm:text-4xl">
                  {mode === 'onboarding' ? modeContent.title : `Hi ${firstName}, ${mode === 'kids' ? 'you’re amazing!' : 'welcome back.'}`}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#334155] sm:text-base">
                  {mode === 'onboarding'
                    ? modeContent.subtitle
                    : mode === 'kids'
                      ? 'Every curious question is a brilliant beginning. Let’s see what’s new in your learning space.'
                      : mode === 'senior'
                        ? 'Check in on your real academic records and plan your next steps.'
                        : 'Your learning space is ready. Keep exploring at your own pace.'}
                </p>
                <button
                  type="button"
                  onClick={() => selectTab(mode === 'onboarding' ? 'profile' : 'subjects')}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-xl"
                >
                  {modeContent.button} <ArrowRight size={16} />
                </button>
              </div>
              <div className="flex shrink-0 justify-end sm:block">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner backdrop-blur sm:h-36 sm:w-36 sm:rounded-[32px] ${
                  mode === 'senior'
                    ? 'border border-white/30 bg-white/15 text-white'
                    : 'border border-blue-200 bg-white/70 text-blue-700'
                }`}>
                  {student?.profilePhoto ? (
                    <img src={student.profilePhoto} alt="" className="h-full w-full rounded-2xl object-cover sm:rounded-[32px]" />
                  ) : mode === 'kids' ? (
                    <PartyPopper size={38} className="sm:h-[58px] sm:w-[58px]" strokeWidth={1.4} />
                  ) : (
                    <GraduationCap size={40} className="sm:h-16 sm:w-16" strokeWidth={1.35} />
                  )}
                </div>
              </div>
            </div>
          </section>

          {mode === 'onboarding' && !profileLoading && (
            <button
              type="button"
              onClick={() => selectTab('profile')}
              className="flex w-full items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left transition hover:bg-amber-100"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600">
                <GraduationCap size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold text-amber-950">Choose your class to personalize your dashboard</span>
                <span className="mt-0.5 block text-xs text-amber-800">You can add it in your profile. Your mode updates right away.</span>
              </span>
              <ArrowRight size={17} className="shrink-0 text-amber-700" />
            </button>
          )}

          <section>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-600">Your snapshot</p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[#0b1f4d]">Learning at a glance</h2>
              </div>
              <button type="button" onClick={() => selectTab('progress')} className="hidden items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 sm:inline-flex">
                View learning journey <ArrowRight size={14} />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {profileLoading || attendanceLoading || feesLoading ? (
                Array.from({ length: 4 }, (_, index) => <LoadingCard key={index} />)
              ) : (
                <>
                  <MetricCard
                    icon={CheckCircle2}
                    label="My attendance"
                    value={attendanceError ? 'Unavailable' : attendance?.total ? `${attendance.percentage}%` : 'No records yet'}
                    detail={attendanceError ? 'Could not load attendance' : attendance?.total ? `${attendance.present} present · ${attendance.absent} absent` : 'Your records will appear here'}
                    tint="blue"
                    onClick={() => selectTab('attendance')}
                  />
                  <MetricCard
                    icon={ClipboardList}
                    label="My homework"
                    value="Not connected"
                    detail="Assignment records are not available yet"
                    tint="violet"
                    onClick={() => selectTab('homework')}
                  />
                  <MetricCard
                    icon={Award}
                    label="My achievements"
                    value="No records yet"
                    detail="Only saved achievements appear here"
                    tint="amber"
                    onClick={() => selectTab('achievements')}
                  />
                  <MetricCard
                    icon={BarChart3}
                    label="My test results"
                    value="Not connected"
                    detail="Test results are not available yet"
                    tint="cyan"
                    onClick={() => selectTab('results')}
                  />
                </>
              )}
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-600">One step at a time</p>
                  <h2 className="mt-1 text-lg font-extrabold text-[#0b1f4d]">My learning journey</h2>
                </div>
                <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-700">Based on saved records</span>
              </div>
              <div className="mt-5 space-y-5">
                <JourneyProgress
                  icon={UserRound}
                  label="Profile completion"
                  detail={`${profileFields.filter((field) => Boolean(field?.trim())).length} of ${profileFields.length} details filled`}
                  value={profileCompletion}
                  color="bg-violet-500"
                  onClick={() => selectTab('profile')}
                />
                {attendance && attendance.total > 0 ? (
                  <JourneyProgress
                    icon={CheckCircle2}
                    label="Attendance record"
                    detail={`${attendance.present} present out of ${attendance.total} recorded sessions`}
                    value={attendance.percentage}
                    color="bg-emerald-500"
                    onClick={() => selectTab('attendance')}
                  />
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500">
                      <CheckCircle2 size={19} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-700">Attendance record</p>
                      <p className="mt-0.5 text-xs text-slate-500">{attendanceLoading ? 'Loading your records…' : attendanceError || 'No attendance records yet'}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 p-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                    <ClipboardList size={19} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Homework, tests and milestones</p>
                    <p className="mt-0.5 text-xs text-slate-500">These records are not supported by the backend yet.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-cyan-700">Keep exploring</p>
                  <h2 className="mt-1 text-lg font-extrabold text-[#0b1f4d]">Quick links</h2>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700"><Compass size={20} /></span>
              </div>
              <div className="mt-4 space-y-2">
                <QuickLink icon={BookOpen} label="Explore my subjects" onClick={() => selectTab('subjects')} />
                <QuickLink icon={CalendarDays} label="Check attendance" onClick={() => selectTab('attendance')} />
                <QuickLink icon={Wallet} label={feesLoading ? 'Loading fees…' : feesError ? 'Tuition fees · unavailable' : fees.length ? `Tuition fees · ${formatAmount(pendingFees)} due` : 'Tuition fees · no records yet'} onClick={() => selectTab('fees')} />
                <QuickLink icon={UserRound} label="Update my profile" onClick={() => selectTab('profile')} />
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-600">Made for your learning</p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[#0b1f4d]">Explore your space</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {learningSections.map((section) => (
                <LearningCard key={section.key} section={section} onClick={() => selectTab(section.key)} mode={mode} />
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'attendance' && (
        <section>
          <SectionHeading eyebrow="Your records" title="My attendance" description="A clear view of the attendance records saved for your account." icon={CheckCircle2} />
          {attendanceError ? (
            <ErrorPanel message={attendanceError} onRetry={() => window.location.reload()} />
          ) : attendanceLoading ? (
            <div className="grid gap-3 sm:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <LoadingCard key={index} />)}</div>
          ) : attendanceRecords.length ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard label="Attendance" value={`${attendance?.percentage ?? 0}%`} icon={BarChart3} tint="blue" />
                <SummaryCard label="Sessions" value={attendance?.total ?? 0} icon={CalendarDays} tint="violet" />
                <SummaryCard label="Present" value={attendance?.present ?? 0} icon={CheckCircle2} tint="green" />
                <SummaryCard label="Absent" value={attendance?.absent ?? 0} icon={Clock3} tint="amber" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h3 className="font-extrabold text-[#0b1f4d]">Attendance history</h3>
                </div>
                <ul className="divide-y divide-slate-100">
                  {attendanceRecords.map((record) => (
                    <li key={record._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{formatDate(record.date)}</p>
                        {record.remarks && <p className="mt-1 text-xs text-slate-500">{record.remarks}</p>}
                      </div>
                      <StatusPill value={record.status} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <EmptyState icon={CalendarDays} title="Your attendance story starts here" message="There are no attendance records saved for your account yet." />
          )}
        </section>
      )}

      {activeTab === 'fees' && (
        <section>
          <SectionHeading eyebrow="Family account" title="Tuition fees" description="Your fee balance and recorded payments. This information is private to your student account." icon={Wallet} />
          {feesError ? (
            <ErrorPanel message={feesError} onRetry={() => window.location.reload()} />
          ) : feesLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">{Array.from({ length: 2 }, (_, index) => <LoadingCard key={index} />)}</div>
          ) : fees.length ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <SummaryCard label="Outstanding" value={formatAmount(pendingFees)} icon={Wallet} tint="amber" />
                <SummaryCard label="Fee periods" value={fees.length} icon={CalendarDays} tint="blue" />
                <SummaryCard label="Payments recorded" value={fees.reduce((count, fee) => count + fee.payments.length, 0)} icon={CheckCircle2} tint="green" />
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {fees.map((fee) => (
                  <article key={fee._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-extrabold text-[#0b1f4d]">{fee.academicMonth}</h3>
                        <p className="mt-1 text-xs text-slate-500">Due {formatDate(fee.dueDate)}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        fee.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : fee.status === 'overdue' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-800'
                      }`}>{fee.status}</span>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-3">
                      <FeeAmount label="Total" amount={fee.totalAmount} />
                      <FeeAmount label="Paid" amount={fee.paidAmount} />
                      <FeeAmount label="Due" amount={fee.pendingAmount} />
                    </div>
                    {fee.payments.length > 0 ? (
                      <div className="mt-4">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Payment history</h4>
                        <ul className="mt-2 space-y-2">
                          {fee.payments.map((payment, index) => (
                            <li key={`${fee._id}-${payment.paymentDate}-${index}`} className="flex flex-wrap justify-between gap-2 text-xs">
                              <span className="text-slate-600">{formatDate(payment.paymentDate)} · {payment.method.replace('_', ' ')}</span>
                              <span className="font-bold text-slate-800">{formatAmount(payment.amount)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="mt-4 text-xs text-slate-500">No payments have been recorded for this period.</p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState icon={Wallet} title="No fee records yet" message="There are no fee records attached to your account." />
          )}
        </section>
      )}

      {activeTab === 'profile' && (
        <section>
          <SectionHeading eyebrow="This is your space" title="My profile" description="Keep your details up to date. Only your account can edit this profile." icon={UserRound} />
          {profileLoading ? (
            <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]"><LoadingCard /><LoadingCard /></div>
          ) : profileError && !student ? (
            <ErrorPanel message={profileError} onRetry={() => window.location.reload()} />
          ) : student && profileDraft ? (
            <div className="grid items-start gap-5 xl:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col items-center text-center">
                    <ProfileAvatar photo={profileDraft.profilePhoto} name={student.name} size="large" />
                    <h3 className="mt-4 text-lg font-extrabold text-[#0b1f4d]">{student.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{student.gradeLevel || 'Class not set'}</p>
                    <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100">
                      <ImagePlus size={17} />
                      {profileDraft.profilePhoto ? 'Change photo' : 'Upload a photo'}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="sr-only"
                        onChange={(event) => {
                          uploadProfilePhoto(event.target.files?.[0]);
                          event.currentTarget.value = '';
                        }}
                      />
                    </label>
                    <p className="mt-2 text-[11px] text-slate-500">JPG, PNG, or WebP · up to 256 KB</p>
                    {profileDraft.profilePhoto && (
                      <button type="button" onClick={() => updateDraft('profilePhoto', '')} className="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-700">
                        Remove photo
                      </button>
                    )}
                  </div>
                  <div className="mt-7 border-t border-slate-100 pt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-[#0b1f4d]">Profile completion</span>
                      <span className="font-extrabold text-blue-700">{profileCompletion}%</span>
                    </div>
                    <div
                      role="progressbar"
                      aria-label="Profile completion"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={profileCompletion}
                      className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"
                    >
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">Completion is calculated from your name, class, parents’ names, guardian phone, and address.</p>
                    {!student.gradeLevel && (
                      <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">Choose your class to automatically personalize your dashboard mode.</p>
                    )}
                  </div>
                </div>
                <form onSubmit={changePassword} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><LockKeyhole size={19} /></span>
                    <div>
                      <h3 className="font-extrabold text-[#0b1f4d]">Change password</h3>
                      <p className="text-xs text-slate-500">Confirm your current password first.</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <ProfileInput label="Current password" type="password" autoComplete="current-password" required value={passwordFields.currentPassword} onChange={(value) => setPasswordFields({ ...passwordFields, currentPassword: value })} />
                    <ProfileInput label="New password" type="password" autoComplete="new-password" minLength={12} required value={passwordFields.newPassword} onChange={(value) => setPasswordFields({ ...passwordFields, newPassword: value })} hint="Use at least 12 characters." />
                    <ProfileInput label="Confirm new password" type="password" autoComplete="new-password" minLength={12} required value={passwordFields.confirmPassword} onChange={(value) => setPasswordFields({ ...passwordFields, confirmPassword: value })} />
                  </div>
                  <button disabled={changingPassword} className="mt-4 min-h-11 rounded-xl bg-[#0b1f4d] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-900 disabled:opacity-50">
                    {changingPassword ? 'Updating…' : 'Update password'}
                  </button>
                </form>
              </div>

              <form onSubmit={saveProfile} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
                <div className="mb-5">
                  <h3 className="text-lg font-extrabold text-[#0b1f4d]">Personal details</h3>
                  <p className="mt-1 text-sm text-slate-500">Add only details you’re comfortable sharing with your school.</p>
                </div>
                {profileError && <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{profileError}</p>}
                <div className="grid gap-4 sm:grid-cols-2">
                  <ProfileInput label="Full name" required minLength={2} maxLength={100} value={profileDraft.name} onChange={(value) => updateDraft('name', value)} />
                  <label className="block text-sm font-semibold text-slate-700">
                    Class
                    <select value={profileDraft.gradeLevel} onChange={(event) => updateDraft('gradeLevel', event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
                      <option value="">Choose your class</option>
                      {Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={`Class ${index + 1}`}>Class {index + 1}</option>)}
                    </select>
                  </label>
                  <ProfileInput label="Father’s name" maxLength={100} value={profileDraft.fatherName ?? ''} onChange={(value) => updateDraft('fatherName', value)} />
                  <ProfileInput label="Mother’s name" maxLength={100} value={profileDraft.motherName ?? ''} onChange={(value) => updateDraft('motherName', value)} />
                  <ProfileInput label="Parent / guardian phone" type="tel" minLength={7} maxLength={20} value={profileDraft.guardianPhone ?? ''} onChange={(value) => updateDraft('guardianPhone', value)} />
                  <ProfileInput label="Parent / guardian email" type="email" value={profileDraft.guardianEmail ?? ''} onChange={(value) => updateDraft('guardianEmail', value)} />
                  <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
                    Home address
                    <textarea maxLength={500} rows={3} value={profileDraft.address ?? ''} onChange={(event) => updateDraft('address', event.target.value)} className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
                    Learning notes (optional)
                    <textarea maxLength={1000} rows={3} value={profileDraft.academicNotes ?? ''} onChange={(event) => updateDraft('academicNotes', event.target.value)} className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
                  </label>
                </div>
                <button type="submit" disabled={savingProfile} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-50">
                  {savingProfile ? 'Saving profile…' : 'Save my profile'} <ArrowRight size={16} />
                </button>
              </form>
            </div>
          ) : (
            <EmptyState icon={UserRound} title="Profile unavailable" message="We couldn’t find your student profile. Please sign out and sign in again." />
          )}
        </section>
      )}

      {activeTab === 'progress' && (
        <section>
          <SectionHeading eyebrow="Real milestones only" title="My learning progress" description="A view of your progress calculated only from records in your account." icon={Sparkles} />
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="font-extrabold text-[#0b1f4d]">Profile completion</h3>
              <p className="mt-1 text-sm text-slate-500">Your saved profile details</p>
              <div className="mt-6 flex items-center gap-5">
                <ProgressRing value={profileCompletion} />
                <div><p className="text-sm font-bold text-[#0b1f4d]">{profileCompletion}% complete</p><p className="mt-1 text-xs text-slate-500">Calculated from the details in your profile.</p></div>
              </div>
              <button type="button" onClick={() => selectTab('profile')} className="mt-5 text-sm font-bold text-blue-700 hover:text-blue-900">Update profile <ArrowRight size={14} className="ml-1 inline" /></button>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="font-extrabold text-[#0b1f4d]">Attendance progress</h3>
              <p className="mt-1 text-sm text-slate-500">Based on recorded attendance sessions</p>
              {attendanceLoading ? <div className="mt-6 h-20 animate-pulse rounded-2xl bg-slate-100" /> : attendanceError ? <p role="alert" className="mt-5 text-sm text-rose-700">{attendanceError}</p> : attendance?.total ? (
                <div className="mt-6">
                  <div className="flex items-end justify-between"><span className="text-3xl font-black text-[#0b1f4d]">{attendance.percentage}%</span><span className="text-xs text-slate-500">{attendance.present} / {attendance.total} present</span></div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: `${attendance.percentage}%` }} /></div>
                  <button type="button" onClick={() => selectTab('attendance')} className="mt-5 text-sm font-bold text-blue-700 hover:text-blue-900">View attendance history <ArrowRight size={14} className="ml-1 inline" /></button>
                </div>
              ) : <p className="mt-5 text-sm text-slate-500">{attendanceError || 'No attendance data has been recorded yet.'}</p>}
            </div>
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-5 sm:col-span-2 sm:p-6">
              <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Award size={19} /></span><div><h3 className="font-extrabold text-[#0b1f4d]">Learning milestones</h3><p className="mt-1 text-sm text-slate-500">Homework completion, assessments and rewards are not available in the backend yet.</p></div></div>
            </div>
          </div>
        </section>
      )}

      {(['subjects', 'homework', 'assignments', 'tests', 'results', 'calendar', 'announcements', 'achievements'] as DashboardTab[]).includes(activeTab) && (
        <LearningSectionPage
          section={learningSections.find((section) => section.key === activeTab)!}
          mode={mode}
          onCompleteProfile={() => selectTab('profile')}
        />
      )}
    </StudentPortalLayout>
  );
};

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  tint,
  onClick,
}: {
  icon: typeof Sparkles;
  label: string;
  value: string;
  detail: string;
  tint: 'blue' | 'violet' | 'amber' | 'cyan';
  onClick: () => void;
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    violet: 'bg-violet-50 text-violet-700',
    amber: 'bg-amber-50 text-amber-700',
    cyan: 'bg-cyan-50 text-cyan-700',
  };
  return (
    <button type="button" onClick={onClick} className="group min-h-36 rounded-3xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/70 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${colors[tint]}`}><Icon size={19} /></span>
        <ArrowRight size={16} className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-blue-600" />
      </div>
      <p className="mt-4 text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black leading-tight text-[#0b1f4d]">{value}</p>
      <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500">{detail}</p>
    </button>
  );
}

function JourneyProgress({
  icon: Icon,
  label,
  detail,
  value,
  color,
  onClick,
}: {
  icon: typeof Sparkles;
  label: string;
  detail: string;
  value: number;
  color: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600"><Icon size={18} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-3"><p className="text-sm font-bold text-[#0b1f4d]">{label}</p><span className="text-xs font-extrabold text-slate-600">{value}%</span></div>
          <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} /></div>
        </div>
      </div>
    </button>
  );
}

function QuickLink({ icon: Icon, label, onClick }: { icon: typeof BookOpen; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-blue-700">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500"><Icon size={16} /></span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <ArrowRight size={14} className="shrink-0 text-slate-500" />
    </button>
  );
}

function LearningCard({
  section,
  onClick,
  mode,
}: {
  section: LearningSection;
  onClick: () => void;
  mode: StudentMode;
}) {
  const Icon = section.icon;
  return (
    <button type="button" onClick={onClick} className={`group rounded-3xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60 ${
      mode === 'kids' ? 'min-h-36 sm:p-5' : 'min-h-32'
    }`}>
      <span className={`flex h-10 w-10 items-center justify-center rounded-2xl transition group-hover:scale-105 ${
        mode === 'kids' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-700'
      }`}><Icon size={19} /></span>
      <span className="mt-4 flex items-center justify-between gap-2">
        <span className="text-sm font-extrabold text-[#0b1f4d]">{section.title}</span>
        <ArrowRight size={15} className="shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-blue-600" />
      </span>
      <span className="mt-1 block text-xs leading-5 text-slate-500">{section.description}</span>
    </button>
  );
}

function LearningSectionPage({
  section,
  mode,
  onCompleteProfile,
}: {
  section: LearningSection;
  mode: StudentMode;
  onCompleteProfile: () => void;
}) {
  const message = mode === 'kids' && section.key === 'homework'
    ? 'Your teacher’s activities will pop up here when they are available. Keep being curious!'
    : section.emptyMessage;
  return (
    <section>
      <SectionHeading eyebrow={mode === 'kids' ? 'Keep exploring' : 'Your learning space'} title={section.title} description={section.description} icon={section.icon} />
      <EmptyState
        icon={section.icon}
        title={section.emptyTitle}
        message={message}
        action={mode === 'onboarding' ? 'Add my class' : undefined}
        onAction={mode === 'onboarding' ? onCompleteProfile : undefined}
      />
    </section>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tint,
}: {
  label: string;
  value: string | number;
  icon: typeof Sparkles;
  tint: 'blue' | 'violet' | 'green' | 'amber';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    violet: 'bg-violet-50 text-violet-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  };
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors[tint]}`}><Icon size={17} /></span>
      <p className="mt-3 text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#0b1f4d]">{value}</p>
    </div>
  );
}

function StatusPill({ value }: { value: AttendanceStatus }) {
  const colors = {
    present: 'bg-emerald-50 text-emerald-700',
    absent: 'bg-rose-50 text-rose-700',
    leave: 'bg-amber-50 text-amber-700',
  };
  return <span className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${colors[value]}`}>{value}</span>;
}

function FeeAmount({ label, amount }: { label: string; amount: number }) {
  return <div><p className="text-[10px] font-bold uppercase text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-extrabold text-[#0b1f4d]">{formatAmount(amount)}</p></div>;
}

function ProfileAvatar({ photo, name, size }: { photo?: string; name: string; size: 'large' }) {
  return (
    <span className={`flex items-center justify-center overflow-hidden rounded-[30px] bg-gradient-to-br from-blue-500 to-cyan-400 font-black text-white shadow-lg shadow-blue-100 ${
      size === 'large' ? 'h-24 w-24 text-3xl' : ''
    }`}>
      {photo ? <img src={photo} alt={`${name}'s profile`} className="h-full w-full object-cover" /> : name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

function ProfileInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  minLength,
  maxLength,
  autoComplete,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
      {hint && <span className="mt-1 block text-[11px] font-normal text-slate-500">{hint}</span>}
    </label>
  );
}

function ProgressRing({ value }: { value: number }) {
  const degrees = Math.round(value * 3.6);
  return (
    <div
      role="img"
      aria-label={`Profile completion ${value}%`}
      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
      style={{ background: `conic-gradient(#4f46e5 ${degrees}deg, #eef2ff ${degrees}deg)` }}
    >
      <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white text-sm font-black text-[#0b1f4d]">{value}%</span>
    </div>
  );
}

function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-3xl border border-rose-200 bg-rose-50 p-5">
      <p className="text-sm font-bold text-rose-800">{message}</p>
      <button type="button" onClick={onRetry} className="mt-3 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-800 hover:bg-rose-100">Try again</button>
    </div>
  );
}
