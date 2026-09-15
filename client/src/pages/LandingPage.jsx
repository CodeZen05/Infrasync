import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ValueStrip from '../components/ValueStrip';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import AIScheduleShowcase from '../components/AIScheduleShowcase';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-navy overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Hero Section with Live Product Mockup */}
        <Hero />

        {/* Horizontal Trust / Value Strip */}
        <ValueStrip />

        {/* 3-Step Workflow: Plan -> Capture -> Connect */}
        <HowItWorks />

        {/* 2x2 Feature Grid */}
        <Features />

        {/* Deep Dive Showcase: AI Schedule Linking & Reconciliation */}
        <AIScheduleShowcase />

        {/* Full-Width Action Banner */}
        <CTA />
      </main>

      {/* Dark Navy Enterprise Footer */}
      <Footer />
    </div>
  );
}
