import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopNavbar from '../components/dashboard/TopNavbar';

export default function DashboardLayout({ children, title, projectName }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/70 bg-mesh-gradient text-brand-navy flex selection:bg-blue-500/15 selection:text-brand-blue">
      {/* Responsive Sidebar */}
      <Sidebar 
        mobileOpen={mobileSidebarOpen} 
        setMobileOpen={setMobileSidebarOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <TopNavbar 
          onMenuClick={() => setMobileSidebarOpen(true)} 
          title={title} 
          projectName={projectName}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto animate-fade-slide-up">
          {children}
        </main>
      </div>
    </div>
  );
}
