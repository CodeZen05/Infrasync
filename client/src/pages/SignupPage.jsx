import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import { 
  Layers, 
  User, 
  Mail, 
  Lock, 
  Briefcase, 
  HardHat, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '', // 'PROJECT_MANAGER' or 'SITE_ENGINEER'
    acceptTerms: false,
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

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errs.name = 'Full Name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Work email is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid work email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirm Password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.role) {
      errs.role = 'Please select your role (Project Manager or Site Engineer).';
    }

    if (!formData.acceptTerms) {
      errs.acceptTerms = 'You must agree to the Terms of Service and Privacy Policy.';
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
      const user = await signup(formData);
      
      // Redirect based on selected role
      if (user.role === 'PROJECT_MANAGER') {
        navigate('/pm/dashboard', { replace: true });
      } else if (user.role === 'SITE_ENGINEER') {
        navigate('/se/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setGeneralError(err.response.data.message || 'Registration failed. Please check your inputs.');
        if (err.response.data.errors) {
          setErrors(err.response.data.errors);
        }
      } else {
        setGeneralError(err.message || 'Network error occurred. Please verify backend service.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-brand-bg text-brand-navy">
      {/* Left Column: Enterprise Branding Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-5/12 bg-brand-navy text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle background grid pattern */}
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

        {/* Value Proposition */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-300 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>ROLE-BASED PLATFORM ONBOARDING</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
            Streamline Infrastructure Project Execution
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Join enterprise contractors, project authorities, and site teams coordinating mega projects with intelligent schedule tracking.
          </p>

          <div className="space-y-4 pt-4 border-t border-slate-800 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">For Project Managers</p>
                <p className="text-xs text-slate-400">Master schedule oversight, delay forecasting, and milestone governance.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 mt-0.5">
                <HardHat className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">For Site Engineers</p>
                <p className="text-xs text-slate-400">Daily Progress Reports (DPR), site evidence capture, and quantity logging.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between">
          <span>InfraSync Security Certified</span>
          <span>ISO 27001 &amp; SOC2 Ready</span>
        </div>
      </div>

      {/* Right Column: Signup Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-12 max-w-2xl mx-auto w-full">
        {/* Mobile Header */}
        <div className="lg:hidden mb-6">
          <Logo size="md" />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
              Create your InfraSync account
            </h1>
            <p className="text-sm text-brand-muted mt-1">
              Select your role and enter your details to get started.
            </p>
          </div>

          {/* General Error Banner */}
          {generalError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-brand-danger text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Role Selection Cards */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Select Your Role <span className="text-brand-danger">*</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* PM Role Card */}
                <div
                  onClick={() => handleRoleSelect('PROJECT_MANAGER')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.role === 'PROJECT_MANAGER'
                      ? 'border-brand-blue bg-blue-50/50 shadow-sm ring-1 ring-blue-200'
                      : 'border-brand-border bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-blue-100 text-brand-blue">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.role === 'PROJECT_MANAGER'
                        ? 'border-brand-blue bg-brand-blue text-white'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {formData.role === 'PROJECT_MANAGER' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-brand-navy">PROJECT MANAGER</h4>
                  <p className="text-xs text-brand-muted mt-1 leading-normal">
                    Monitor projects, schedules, progress, risks and approvals.
                  </p>
                </div>

                {/* SE Role Card */}
                <div
                  onClick={() => handleRoleSelect('SITE_ENGINEER')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.role === 'SITE_ENGINEER'
                      ? 'border-brand-purple bg-purple-50/50 shadow-sm ring-1 ring-purple-200'
                      : 'border-brand-border bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-purple-100 text-brand-purple">
                      <HardHat className="w-5 h-5" />
                    </div>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.role === 'SITE_ENGINEER'
                        ? 'border-brand-purple bg-brand-purple text-white'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {formData.role === 'SITE_ENGINEER' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-brand-navy">SITE ENGINEER</h4>
                  <p className="text-xs text-brand-muted mt-1 leading-normal">
                    Upload site evidence, update progress and report site issues.
                  </p>
                </div>
              </div>

              {errors.role && (
                <p className="mt-1.5 text-xs text-brand-danger flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.role}
                </p>
              )}
            </div>

            {/* Step 2: Name & Email Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name <span className="text-brand-danger">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all ${
                      errors.name 
                        ? 'border-red-300 ring-2 ring-red-100 focus:border-brand-danger' 
                        : 'border-brand-border focus:border-brand-blue focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-brand-danger flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Work Email <span className="text-brand-danger">*</span>
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
                    placeholder="john@construction.com"
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
            </div>

            {/* Step 3: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Password <span className="text-brand-danger">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Confirm Password <span className="text-brand-danger">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all ${
                      errors.confirmPassword 
                        ? 'border-red-300 ring-2 ring-red-100 focus:border-brand-danger' 
                        : 'border-brand-border focus:border-brand-blue focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-brand-danger flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div>
              <div className="flex items-start">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-brand-blue border-brand-border rounded focus:ring-blue-400"
                />
                <label htmlFor="acceptTerms" className="ml-2.5 block text-xs text-brand-muted leading-relaxed select-none">
                  I agree to the <a href="#" className="text-brand-blue hover:underline">Terms of Service</a>,{' '}
                  <a href="#" className="text-brand-blue hover:underline">Privacy Policy</a>, and consent to enterprise project role-based logging.
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="mt-1 text-xs text-brand-danger flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.acceptTerms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-70 rounded-xl shadow-md shadow-blue-600/25 hover:shadow-lg transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create InfraSync Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center pt-2">
            <p className="text-sm text-brand-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-blue hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
