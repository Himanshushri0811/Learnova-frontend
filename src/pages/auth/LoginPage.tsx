import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Users,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { UserRole } from '../../types';
import { apiRequest } from '../../lib/api';

interface LoginResponse {
  status: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
  };
  message?: string;
}

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const requestedRole = searchParams.get('role');
  const initialRole: UserRole =
    requestedRole === 'admin' ||
      requestedRole === 'student' ||
      requestedRole === 'guardian'
      ? (requestedRole as UserRole)
      : 'admin';

  const [selectedRole, setSelectedRole] =
    useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'guardian') {
      setError(
        'Guardian portal authentication is under active development. Please select Admin or Student.'
      );
      return;
    }

    if (!email.trim() || !password) {
      setError('Please enter your credentials.');
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!data.token || !data.user) {
        throw new Error('Invalid login response received from server.');
      }

      if (selectedRole === 'admin' && data.user.role !== 'admin') {
        throw new Error('These credentials belong to a non-admin account. Please switch role.');
      }

      if (selectedRole === 'student' && data.user.role !== 'student') {
        throw new Error('These credentials belong to an admin account. Please switch to Admin login.');
      }

      localStorage.setItem('learnova_token', data.token);
      localStorage.setItem('learnova_user', JSON.stringify(data.user));

      if (data.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/student', { replace: true });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-brand-surface">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block mb-4">
          <img
            src="/brand/learnova-wordmark.svg"
            alt="Learnova"
            className="h-10 mx-auto"
          />
        </Link>

        <h2 className="text-2xl font-bold tracking-tight text-brand-navy">
          Sign in to your Learnova portal
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Sign in using your registered account credentials.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          <div className="mb-6 pb-6 border-b border-slate-100">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Select your account type
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('student');
                  setError('');
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${selectedRole === 'student'
                  ? 'border-brand-blue bg-blue-50 text-brand-navy'
                  : 'border-slate-200 text-slate-500 hover:border-brand-blue'
                  }`}
              >
                <GraduationCap className="w-5 h-5 mb-1" />
                <span>Student</span>
                <span className="text-[10px] mt-1 text-emerald-600 font-semibold">Available</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('guardian');
                  setError('');
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${selectedRole === 'guardian'
                  ? 'border-brand-cyan bg-cyan-50 text-brand-navy'
                  : 'border-slate-200 text-slate-500 hover:border-brand-cyan'
                  }`}
              >
                <Users className="w-5 h-5 mb-1" />
                <span>Guardian</span>
                <span className="text-[10px] mt-1">Coming soon</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setError('');
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${selectedRole === 'admin'
                  ? 'border-brand-gold bg-amber-50 text-brand-navy'
                  : 'border-slate-200 text-slate-500 hover:border-brand-gold'
                  }`}
              >
                <UserCheck className="w-5 h-5 mb-1" />
                <span>Admin / Tutor</span>
                <span className="text-[10px] mt-1 text-emerald-600 font-semibold">Available</span>
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="login-role"
                className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1"
              >
                Role to authenticate
              </label>

              <select
                id="login-role"
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value as UserRole);
                  setError('');
                }}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white text-brand-text"
              >
                <option value="admin">Administrator / Tutor</option>
                <option value="student">Student</option>
                <option value="guardian">Parent / Guardian (Coming soon)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1"
              >
                {selectedRole === 'student'
                  ? 'Student username'
                  : 'Email address'}
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>

                <input
                  id="login-email"
                  type={selectedRole === 'student' ? 'text' : 'email'}
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'student'
                      ? 'Enter student username'
                      : 'Enter admin email'
                  }
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue text-brand-text"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1"
              >
                Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue text-brand-text"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-navy hover:bg-brand-navyLight rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {loading
                  ? 'Authenticating...'
                  : `Sign in as ${selectedRole.toUpperCase()}`}
              </span>
              <ArrowRight className="w-4 h-4 text-brand-cyan" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 justify-center">
            <ShieldCheck className="w-4 h-4 text-brand-blue shrink-0" />
            <span>Login credentials are verified by the server.</span>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs font-medium text-slate-500 hover:text-brand-navy transition-colors"
          >
            &larr; Return to Learnova Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
