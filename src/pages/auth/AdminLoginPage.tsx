import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

interface LoginResponse {
  status: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role: 'admin' | 'student' | 'guardian';
  };
  message?: string;
}

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('Please enter your administrator email and password.');
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: cleanEmail,
          password,
        }),
      });

      if (!data.token || !data.user) {
        throw new Error('Invalid login response from server.');
      }

      if (data.user.role !== 'admin') {
        throw new Error(
          'These credentials belong to a student account. Please use the Student Login page.'
        );
      }

      localStorage.setItem('learnova_token', data.token);
      localStorage.setItem('learnova_user', JSON.stringify(data.user));

      navigate('/admin', { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your admin credentials or network connection.');
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

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
          <UserCheck className="w-4 h-4" />
          <span>Admin & Tutor Workspace</span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-brand-navy">
          Sign in to Admin Console
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Tuition management, student enrolments, attendance, and fee tracking.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1"
              >
                Administrator Email
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>

                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@learnova.edu"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue text-brand-text"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1"
              >
                Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue text-brand-text"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-navy hover:bg-brand-navyLight rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Authenticating…' : 'Sign in to Admin Workspace'}</span>
              <ArrowRight className="w-4 h-4 text-brand-cyan" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-blue" />
              <span>Admin Authentication</span>
            </div>
            <Link
              to="/student/login"
              className="font-semibold text-brand-blue hover:text-brand-navy transition-colors"
            >
              Student Login &rarr;
            </Link>
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

