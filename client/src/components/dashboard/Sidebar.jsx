import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import { 
  Layers, 
  LayoutDashboard, 
  Building2, 
  CheckSquare, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Camera, 
  Send, 
  Settings, 
  LogOut,
  Briefcase,
  HardHat,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ mobileOpen = false, setMobileOpen = () => {} }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isPM = user?.role === 'PROJECT_MANAGER';

  const pmNavItems = [
    { label: 'Overview', to: '/pm/dashboard', icon: LayoutDashboard },
    { label: 'Projects', to: '/pm/projects', icon: Building2 },
    { label: 'Activities', to: '/pm/activities', icon: CheckSquare },
    { label: 'Risks', to: '/pm/risks', icon: AlertTriangle },
    { label: 'Approvals', to: '/pm/approvals', icon: CheckCircle, badge: 'Live' },
  ];

  const seNavItems = [
    { label: 'Overview', to: '/se/dashboard', icon: LayoutDashboard },
    { label: 'My Activities', to: '/se/activities', icon: CheckSquare },
    { label: 'Submit Progress', to: '/se/progress', icon: Send },
    { label: 'Site Evidence', to: '/se/evidence', icon: Camera, badge: 'AI' },
  ];

  const navItems = isPM ? pmNavItems : seNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 shadow-sm ${
        mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        {/* Top Header & Logo */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
            <Logo size="md" badge="Enterprise" />

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Indicator Banner */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className={`px-3.5 py-2 rounded-xl flex items-center justify-between border transition-all ${
              isPM 
                ? 'bg-blue-50 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border-blue-200/80 text-brand-blue shadow-2xs' 
                : 'bg-purple-50 bg-gradient-to-r from-purple-50/80 to-indigo-50/50 border-purple-200/80 text-brand-purple shadow-2xs'
            }`}>
              <div className="flex items-center gap-2">
                {isPM ? (
                  <Briefcase className="w-4 h-4 shrink-0 text-brand-blue" />
                ) : (
                  <HardHat className="w-4 h-4 shrink-0 text-brand-purple" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider truncate">
                  {isPM ? 'Project Manager' : 'Site Engineer'}
                </span>
              </div>
              <span className={`w-2 h-2 rounded-full shrink-0 ${isPM ? 'bg-blue-500 animate-pulse' : 'bg-purple-500 animate-pulse'}`} />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/pm/dashboard' || item.to === '/se/dashboard'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? isPM
                        ? 'bg-blue-50 bg-gradient-to-r from-blue-50 to-blue-100/50 text-brand-blue shadow-xs border border-blue-200/60'
                        : 'bg-purple-50 bg-gradient-to-r from-purple-50 to-purple-100/50 text-brand-purple shadow-xs border border-purple-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/90 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 stroke-[2.2] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                      item.badge === 'AI' 
                        ? 'bg-purple-100 text-brand-purple border border-purple-200' 
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile Card & Sign Out */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs mb-2.5 flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs ${
              isPM ? 'bg-blue-600 bg-gradient-to-br from-brand-blue to-blue-700' : 'bg-purple-600 bg-gradient-to-br from-brand-purple to-indigo-700'
            }`}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Authorized User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'user@infrasync.demo'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-brand-danger hover:bg-rose-50 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-rose-100"
          >
            <LogOut className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
