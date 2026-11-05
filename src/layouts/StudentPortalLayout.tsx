import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CalendarRange,
  CheckSquare,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  MessageSquareText,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wallet,
  X,
} from 'lucide-react';

export type StudentMode = 'kids' | 'junior' | 'senior' | 'onboarding';

interface StudentPortalLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  studentName: string;
  gradeLevel?: string;
  profilePhoto?: string;
  mode: StudentMode;
}

const navigation = [
  { key: 'overview', label: 'Home', icon: Home, short: 'Home' },
  { key: 'subjects', label: 'My subjects', icon: BookOpen, short: 'Subjects' },
  { key: 'homework', label: 'Homework', icon: ClipboardList, short: 'Homework' },
  { key: 'assignments', label: 'Assignments', icon: ClipboardCheck, short: 'Tasks' },
  { key: 'tests', label: 'Upcoming tests', icon: CalendarDays, short: 'Tests' },
  { key: 'results', label: 'My results', icon: BarChart3, short: 'Results' },
  { key: 'attendance', label: 'Attendance', icon: CheckSquare, short: 'Attendance' },
  { key: 'progress', label: 'My progress', icon: Sparkles, short: 'Progress' },
  { key: 'calendar', label: 'Study calendar', icon: CalendarRange, short: 'Calendar' },
  { key: 'announcements', label: 'Announcements', icon: MessageSquareText, short: 'News' },
  { key: 'achievements', label: 'Achievements', icon: Award, short: 'Awards' },
  { key: 'fees', label: 'Tuition fees', icon: Wallet, short: 'Fees' },
  { key: 'profile', label: 'My profile', icon: UserRound, short: 'Profile' },
];

const modeLabel: Record<StudentMode, string> = {
  kids: 'Kids mode',
  junior: 'Junior mode',
  senior: 'Senior mode',
  onboarding: 'Your learning space',
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export function StudentPortalLayout({
  children,
  activeTab,
  onTabChange,
  studentName,
  gradeLevel,
  profilePhoto,
  mode,
}: StudentPortalLayoutProps) {
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const firstName = studentName.trim().split(/\s+/)[0] || 'Learner';
  const primaryNav = navigation.slice(0, 4);
  const mobileMore = navigation.slice(4);
  const currentPage = navigation.find((item) => item.key === activeTab)?.label ?? 'Home';

  const changeTab = (tab: string) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const logout = () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    localStorage.removeItem('learnova_token');
    localStorage.removeItem('learnova_user');
    navigate('/student/login', { replace: true });
  };

  return (
    <div className={`student-portal min-h-screen ${mode === 'senior' ? 'bg-slate-50' : 'bg-[#f5f8ff]'}`}>
      <a
        href="#student-main"
        className="sr-only z-50 rounded-lg bg-white p-3 text-brand-navy focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col overflow-y-auto border-r border-slate-200/80 bg-white/90 px-4 py-5 backdrop-blur-xl lg:flex">
        <button
          type="button"
          onClick={() => changeTab('overview')}
          className="mb-7 flex items-center gap-3 rounded-xl px-2 py-1 text-left"
          aria-label="Learnova student home"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <GraduationCap size={24} />
          </span>
          <span>
            <span className="block text-lg font-extrabold tracking-tight text-[#0b1f4d]">Learnova</span>
            <span className="block text-[11px] font-medium text-slate-500">Your learning space</span>
          </span>
        </button>

        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Learning menu
        </div>
        <nav aria-label="Student navigation" className="flex-none space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const selected = activeTab === item.key;
            return (
              <button
                type="button"
                key={item.key}
                onClick={() => changeTab(item.key)}
                aria-current={selected ? 'page' : undefined}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-colors ${
                  selected
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={17} className={selected ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-600'} />
                <span className="flex-1">{item.label}</span>
                {selected && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
              </button>
            );
          })}
        </nav>

        <div className="mt-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <ShieldCheck size={18} />
          </div>
          <p className="mt-3 text-xs font-bold text-[#0b1f4d]">A space that’s yours</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
            Your account keeps your personal learning records private.
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut size={17} />
          Log out
        </button>
      </aside>

      <div className="min-h-screen lg:pl-[252px]">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close learning menu' : 'Open learning menu'}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
              >
                {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-slate-500 sm:text-xs">
                  {getGreeting()}{mode === 'kids' ? ', ready to explore?' : `, ${firstName}`}
                </p>
                <h1 className="truncate text-base font-extrabold text-[#0b1f4d] sm:text-lg">{currentPage}</h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="hidden rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700 sm:inline-flex">
                {modeLabel[mode]}
              </span>
              {gradeLevel && (
                <span className="hidden rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700 md:inline-flex">
                  {gradeLevel}
                </span>
              )}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen((open) => !open);
                    setProfileMenuOpen(false);
                  }}
                  aria-label="Notifications"
                  aria-expanded={notificationsOpen}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:text-blue-700"
                >
                  <Bell size={18} />
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-12 z-30 w-[min(19rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                    <p className="font-bold text-[#0b1f4d]">Notifications</p>
                    <p className="mt-2 text-sm text-slate-500">You’re all caught up. New updates will appear here.</p>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen((open) => !open);
                    setNotificationsOpen(false);
                  }}
                  aria-label="Open profile menu"
                  aria-expanded={profileMenuOpen}
                  className="flex items-center gap-2 rounded-full p-1 pr-1.5 transition hover:bg-slate-100"
                >
                  <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-bold text-white ring-2 ring-white">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="" className="h-full w-full object-cover" />
                    ) : (
                      firstName.charAt(0).toUpperCase()
                    )}
                  </span>
                  <ChevronDown size={15} className="hidden text-slate-500 sm:block" />
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 top-12 z-30 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="border-b border-slate-100 px-3 py-2">
                      <p className="truncate text-sm font-bold text-[#0b1f4d]">{studentName}</p>
                      <p className="text-xs text-slate-500">{gradeLevel ?? 'Class not set'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => changeTab('profile')}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Settings2 size={16} /> Profile settings
                    </button>
                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-700 hover:bg-rose-50"
                    >
                      <LogOut size={16} /> Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-[1440px] px-4 pb-3 sm:px-6 lg:hidden">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Sparkles size={13} className="text-blue-500" />
              <span>{modeLabel[mode]}{gradeLevel ? ` · ${gradeLevel}` : ' · Choose your class in profile'}</span>
            </div>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-slate-950/25 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <nav
              aria-label="Mobile student navigation"
              className="h-full w-[min(20rem,85vw)] overflow-y-auto bg-white p-4 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="font-extrabold text-[#0b1f4d]">Learning menu</span>
                <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close learning menu" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                  <X size={19} />
                </button>
              </div>
              <div className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => changeTab(item.key)}
                      aria-current={activeTab === item.key ? 'page' : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${
                        activeTab === item.key ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={18} /> {item.label}
                      {activeTab === item.key && <ArrowUpRight size={15} className="ml-auto" />}
                    </button>
                  );
                })}
              </div>
              <button type="button" onClick={logout} className="mt-5 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50">
                <LogOut size={18} /> Log out
              </button>
            </nav>
          </div>
        )}

        <main id="student-main" className="mx-auto max-w-[1440px] px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-10">
          <div key={activeTab} className="student-page-enter">{children}</div>
        </main>
      </div>

      <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const selected = activeTab === item.key;
            return (
              <button
                type="button"
                key={item.key}
                onClick={() => changeTab(item.key)}
                aria-current={selected ? 'page' : undefined}
                className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold ${
                  selected ? 'text-blue-700' : 'text-slate-500'
                }`}
              >
                <Icon size={18} />
                <span className="max-w-full truncate">{item.short}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="More student sections"
            className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold ${
              mobileMore.some((item) => item.key === activeTab) ? 'text-blue-700' : 'text-slate-500'
            }`}
          >
            <Menu size={18} />
            <span>More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
