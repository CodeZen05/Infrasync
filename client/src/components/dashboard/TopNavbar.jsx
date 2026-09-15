import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, 
  Bell, 
  ChevronDown, 
  LogOut, 
  User, 
  Briefcase, 
  HardHat, 
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function TopNavbar({ 
  onMenuClick, 
  title = 'Dashboard', 
  projectName = 'Delhi Metro Expansion (Phase 4B)' 
}) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isPM = user?.role === 'PROJECT_MANAGER';

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all">
      {/* Left: Mobile Menu Toggle & Title / Project Indicator */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 transition-colors lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo-squircle.png" alt="InfraSync" className="w-7 h-7 rounded-lg shadow-2xs" />
            <span className="text-sm font-black text-brand-navy tracking-tight">Infra<span className="text-brand-blue">Sync</span></span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-extrabold text-brand-navy hidden sm:block tracking-tight">
            {title}
          </h2>

          {/* Project Selector Badge with Hover Glow */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/70 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 text-xs text-slate-700 transition-all duration-200 cursor-default shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-brand-blue" />
            <span className="font-bold truncate max-w-[220px]">{projectName}</span>
          </div>
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell with Pulsing Indicator */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-all cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/80 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Project Notifications</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Live</span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors">
                  <div className="flex items-center gap-1.5 text-brand-navy font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>DPR Approved for Pier 15</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">65 m³ foundation concrete verified by Project Manager.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-100 transition-colors">
                  <div className="flex items-center gap-1.5 text-brand-navy font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Schedule Milestone Review</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Viaduct girder erection planned window approaching in 48 hrs.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Capsule */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100/80 border border-transparent hover:border-slate-200/70 transition-all duration-200 cursor-pointer"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-xs ${
              isPM ? 'bg-blue-600 bg-gradient-to-br from-brand-blue to-blue-700' : 'bg-purple-600 bg-gradient-to-br from-brand-purple to-indigo-700'
            }`}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-brand-navy truncate max-w-[130px] leading-tight">
                {user?.name || 'Engineer'}
              </span>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {isPM ? 'Manager' : 'Engineer'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-brand-navy">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <Link
                to={isPM ? '/pm/dashboard' : '/se/dashboard'}
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-blue hover:bg-blue-50/70 rounded-xl transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Workspace</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-brand-danger hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
