import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'admin') {
      navigate('/admin/login', { replace: true });
    } else {
      navigate('/student/login', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-surface text-sm text-slate-500">
      Redirecting to portal login…
    </div>
  );
};
