import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Users,
  Calendar,
  ClipboardList,
  Award,
  BarChart3,
  Bell,
  Settings,
  BookOpen,
  LogOut,
  Menu,
  X,
  Home,
  CheckSquare,
  Shield,
  Layers,
  Wallet,
} from 'lucide-react';
import { UserRole } from '../types';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tabKey: string;
}

interface DashboardLayoutProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  role,
  activeTab,
  onTabChange,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items based on role specifications
  const getNavItems = (): NavItem[] => {
    if (role === 'admin') {
      return [
        { name: 'Overview', href: '/admin', tabKey: 'overview', icon: Home },
        { name: 'Students & Guardians', href: '/admin', tabKey: 'students', icon: Users },
        { name: 'Classes & Subjects', href: '/admin', tabKey: 'classes', icon: BookOpen },
        { name: 'Daily Attendance', href: '/admin', tabKey: 'attendance', icon: Calendar },
        { name: 'Homework Tracker', href: '/admin', tabKey: 'homework', icon: ClipboardList },
        { name: 'Sunday Quizzes', href: '/admin', tabKey: 'quizzes', icon: Award },
        { name: 'Marks & Reports', href: '/admin', tabKey: 'reports', icon: BarChart3 },
        { name: 'Announcements & Settings', href: '/admin', tabKey: 'settings', icon: Settings },
        {
          name: 'Fees Management',
          href: '/admin',
          tabKey: 'fees',
          icon: Wallet,
        },
      ];
    } else if (role === 'student') {
      return [
        { name: 'Personal Dashboard', href: '/student', tabKey: 'overview', icon: Home },
        { name: 'My Homework', href: '/student', tabKey: 'homework', icon: ClipboardList },
        { name: 'Attendance History', href: '/student', tabKey: 'attendance', icon: Calendar },
        { name: 'Sunday Quizzes', href: '/student', tabKey: 'quizzes', icon: Award },
        { name: 'Results & Progress', href: '/student', tabKey: 'results', icon: BarChart3 },
      ];
    } else {
      return [
        { name: 'Guardian Dashboard', href: '/guardian', tabKey: 'overview', icon: Home },
        { name: "Child's Attendance", href: '/guardian', tabKey: 'attendance', icon: Calendar },
        { name: 'Homework & Quiz Results', href: '/guardian', tabKey: 'results', icon: CheckSquare },
        { name: 'Progress Reports', href: '/guardian', tabKey: 'reports', icon: BarChart3 },
        { name: 'Announcements', href: '/guardian', tabKey: 'announcements', icon: Bell },
      ];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    localStorage.removeItem('learnova_user');
    navigate('/login');
  };

  const getRoleBadge = () => {
    if (role === 'admin') {
      return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-200">Admin / Tutor</span>;
    }
    if (role === 'guardian') {
      return <span className="bg-cyan-100 text-cyan-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-cyan-200">Guardian</span>;
    }
    return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-blue-200">Student</span>;
  };

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-brand-navy text-white px-4 py-3 flex items-center justify-between border-b border-brand-navyLight">
        <div className="flex items-center gap-2">
          {/* Compact mark on dashboard */}
          <img src="/brand/learnova-mark.svg" alt="Learnova Mark" className="w-7 h-7" />
          <span className="font-bold text-base tracking-tight">Learnova</span>
          {getRoleBadge()}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-slate-300 hover:text-white"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`${sidebarOpen ? 'block' : 'hidden'
          } md:flex flex-col w-full md:w-64 bg-brand-navy text-white shrink-0 md:min-h-screen border-r border-slate-800 z-30`}
      >
        {/* Brand Header with compact mark */}
        <div className="h-20 px-6 hidden md:flex items-center justify-between border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <img src="/brand/learnova-mark.svg" alt="Learnova Mark" className="w-8 h-8 rounded-lg" />
            <div>
              <div className="text-base font-bold text-white tracking-tight">Learnova</div>
              <div className="text-[10px] text-brand-cyan uppercase font-semibold tracking-wider">
                Management Portal
              </div>
            </div>
          </Link>
        </div>

        {/* Current Active Role Indicator */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Logged in as</div>
            <div className="text-sm font-bold text-white capitalize">{role} Portal</div>
          </div>
          <div>{getRoleBadge()}</div>
        </div>

        {/* Nav list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tabKey;
            return (
              <button
                key={item.tabKey}
                onClick={() => {
                  onTabChange(item.tabKey);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${isActive
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Role Prototype Switcher for Quick Inspection */}
        <div className="p-4 mx-3 mb-3 bg-white/5 rounded-xl border border-white/10">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-brand-cyan" />
            <span>Switch Role Preview</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <Link
              to="/student"
              className={`text-center py-1 rounded text-[11px] font-medium transition-colors ${location.pathname.startsWith('/student')
                ? 'bg-brand-blue text-white'
                : 'text-slate-300 hover:bg-white/10'
                }`}
            >
              Student
            </Link>
            <Link
              to="/guardian"
              className={`text-center py-1 rounded text-[11px] font-medium transition-colors ${location.pathname.startsWith('/guardian')
                ? 'bg-brand-cyan text-brand-navy'
                : 'text-slate-300 hover:bg-white/10'
                }`}
            >
              Guardian
            </Link>
            <Link
              to="/admin"
              className={`text-center py-1 rounded text-[11px] font-medium transition-colors ${location.pathname.startsWith('/admin')
                ? 'bg-brand-gold text-brand-navy'
                : 'text-slate-300 hover:bg-white/10'
                }`}
            >
              Admin
            </Link>
          </div>
        </div>

        {/* User bar & Logout */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-brand-blue/30 text-brand-cyan flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {role.charAt(0)}
            </div>
            <div className="truncate">
              <div className="font-semibold text-white truncate capitalize">{role} User</div>
              <div className="text-[10px] text-slate-400 truncate">demo@{role}.local</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-brand-navy capitalize">
              {role} Workspace
            </h1>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-slate-600 capitalize">
              {navItems.find((n) => n.tabKey === activeTab)?.name || activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
              <Shield className="w-3.5 h-3.5 text-brand-blue" />
              <span>Session Active</span>
            </div>
            <Link
              to="/"
              className="text-xs font-semibold text-brand-blue hover:text-brand-blueHover"
            >
              View Public Site &rarr;
            </Link>
          </div>
        </header>

        {/* Dashboard Body with Subtle Watermark in background */}
        <div className="flex-1 p-6 relative">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};

