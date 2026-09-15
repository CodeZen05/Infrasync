import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import { 
  Layers, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) setGeneralError('');
  };

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setGeneralError('');

    try {
      const user = await login(formData.email, formData.password, formData.rememberMe);
      
      // Check if redirect intended or route by role
      if (user.role === 'PROJECT_MANAGER') {
        navigate('/pm/dashboard', { replace: true });
      } else if (user.role === 'SITE_ENGINEER') {
        navigate('/se/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setGeneralError(err.response.data.message || 'Invalid email or password.');
        if (err.response.data.errors) {
          setErrors(err.response.data.errors);
        }
      } else {
        setGeneralError(err.message || 'Network error. Please check backend connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick fill helper for demo/testing
  const fillDemoCredentials = (role) => {
    if (role === 'PM') {
      setFormData({
        email: 'pm@infrasync.demo',
        password: 'password123',
        rememberMe: true,
      });
    } else {
      setFormData({
        email: 'se@infrasync.demo',
        password: 'password123',
        rememberMe: true,
      });
    }
    setErrors({});
    setGeneralError('');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-brand-bg text-brand-navy">
      {/* Left Column: Enterprise Branding Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-navy text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px'
          }}
        />

        {/* Brand Header */}
        <div className="relative z-10">
          <Logo size="lg" theme="dark" />
        </div>

        {/* Center Marketing Narrative */}
        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-300 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI-POWERED INFRASTRUCTURE INTELLIGENCE</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
            Intelligent Planning-to-Execution Bridge
          </h2>

          <p className="text-slate-300 text-base leading-relaxed">
            Real-time synchronization between project schedules and site progress for infrastructure managers and site engineers.
          </p>

          <div className="space-y-3 pt-4 border-t border-slate-800 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Role-based access for PMs and Site Engineers</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Automated schedule activity reconciliation</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Enterprise-grade security with encrypted JWT &amp; bcrypt</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between">
          <span>© 2026 InfraSync Systems Inc.</span>
          <span>Smart India Hackathon Edition</span>
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-12 max-w-xl mx-auto w-full">
        {/* Mobile Brand Header */}
        <div className="lg:hidden mb-8">
          <Logo size="md" />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
              Sign in to InfraSync
            </h1>
            <p className="text-sm text-brand-muted mt-1.5">
              Enter your work credentials to access your project dashboard.
            </p>
          </div>

          {/* Quick Demo Credentials Assistant */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-brand-navy flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-blue" />
                Demo Credentials (1-Click Fill):
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('PM')}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-brand-navy hover:bg-blue-100 hover:text-brand-blue font-medium transition-colors text-left truncate"
              >
                👔 <span className="font-semibold">Project Manager</span>
                <span className="block text-[10px] text-brand-muted">pm@infrasync.demo</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('SE')}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-brand-navy hover:bg-blue-100 hover:text-brand-blue font-medium transition-colors text-left truncate"
              >
                👷 <span className="font-semibold">Site Engineer</span>
                <span className="block text-[10px] text-brand-muted">se@infrasync.demo</span>
              </button>
            </div>
          </div>

          {/* General Error Banner */}
          {generalError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-brand-danger text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all ${
                    errors.email 
                      ? 'border-red-300 ring-2 ring-red-100 focus:border-brand-danger' 
                      : 'border-brand-border focus:border-brand-blue focus:ring-2 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-brand-danger flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset placeholder for Phase 3.')}
                  className="text-xs font-medium text-brand-blue hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all ${
                    errors.password 
                      ? 'border-red-300 ring-2 ring-red-100 focus:border-brand-danger' 
                      : 'border-brand-border focus:border-brand-blue focus:ring-2 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-brand-danger flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-brand-blue border-brand-border rounded focus:ring-blue-400"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-brand-muted select-none">
                Remember this device for 7 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-70 rounded-xl shadow-md shadow-blue-600/25 hover:shadow-lg transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Google Login Placeholder */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-brand-bg px-2 text-slate-400 font-medium">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('Enterprise Google SSO placeholder for Phase 3.')}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors cursor-pointer active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="text-center pt-2">
            <p className="text-sm text-brand-muted">
              Don't have an InfraSync account?{' '}
              <Link to="/signup" className="font-semibold text-brand-blue hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
