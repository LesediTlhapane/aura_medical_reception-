import React, { useEffect, useState } from 'react';
import { Sparkles, ChevronRight, Calendar, ArrowRight, ShieldCheck, Heart, User, Check, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection({ onStartDemo, onBookCall }) {
  const [activeTab, setActiveTab] = useState('patient');

  const scrollToDemo = () => {
    document.getElementById('live-demo-section')?.scrollIntoView({ behavior: 'smooth' });
    if (onStartDemo) onStartDemo();
  };

  return (
    <section className="relative overflow-hidden min-h-[95vh] flex flex-col items-center justify-center px-6 py-20 bg-white dark:bg-navy-950">
      
      {/* Premium Glassmorphic Glowing Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft glowing mesh gradient background */}
        <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-100/40 blur-[120px] dark:bg-indigo-950/20" />
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[70%] rounded-full bg-emerald-50/50 blur-[130px] dark:bg-emerald-950/10" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-sky-100/30 blur-[100px] dark:bg-sky-900/10" />
        
        {/* SVG Dot grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#1e1b4b 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Content Layout */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        
        {/* Left Column: SaaS Value Proposition */}
        <div className="lg:col-span-6 flex flex-col gap-6 text-left">
          {/* Online pill badge */}
          <div className="inline-flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50/60 px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <span className="status-dot-online" />
              Aura Tech Intelligence · Commercial SaaS
            </span>
          </div>

          {/* Main Headline */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Meet Aura Reception
              <span className="align-super text-xl font-light text-slate-400 dark:text-slate-500 ml-0.5">™</span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-indigo-650 dark:text-indigo-400">
              AI Receptionist for Medical Practices
            </p>
            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              Supporting your reception team 24 hours a day. Aura automates repetitive administrative calls, routes patient symptom triage, and captures appointments with premium precision.
            </p>
          </div>

          {/* Quick value flags */}
          <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {[
              { text: 'POPIA Compliant', color: 'text-emerald-500' },
              { text: '256-bit Encrypted', color: 'text-blue-500' },
              { text: 'Secure Appointments', color: 'text-indigo-500' },
              { text: 'Medical Data Protected', color: 'text-purple-500' }
            ].map((v, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                {v.text}
              </span>
            ))}
          </div>

          {/* Core Landing CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <button
              onClick={scrollToDemo}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white font-extrabold text-sm py-4 px-7 shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <Sparkles size={16} className="text-emerald-400 dark:text-emerald-600" />
              Start Live Demo
              <ChevronRight size={14} className="opacity-60" />
            </button>
            
            <button
              onClick={onBookCall}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-extrabold text-sm py-4 px-7 shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer dark:border-slate-800 dark:bg-navy-900 dark:text-slate-350 dark:hover:bg-slate-850"
            >
              <Calendar size={15} className="text-indigo-500" />
              Book Strategy Call
            </button>
          </div>

          {/* Social Proof Flag */}
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-650 uppercase tracking-widest mt-2">
            🛡️ Trusted by South African Medical Practices
          </p>
        </div>

        {/* Right Column: Premium Interactive CSS Illustration (Dashboard Mockup) */}
        <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl border border-slate-200 bg-slate-50/50 p-4 shadow-xl dark:border-slate-800 dark:bg-navy-900/40">
            
            {/* Inner Dashboard Layout Illustration */}
            <div className="w-full h-full bg-white rounded-2xl border border-slate-150 p-4 shadow-sm overflow-hidden flex flex-col justify-between dark:bg-navy-950 dark:border-slate-850">
              
              {/* Mockup Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-900">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-12 rounded bg-slate-100 dark:bg-navy-850 flex items-center justify-center text-[7px] font-black text-slate-400 uppercase tracking-widest">
                    Aura
                  </div>
                  <span className="text-[8px] font-bold text-slate-400">Sunrise Practice rooms</span>
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* Mockup Body Grid */}
              <div className="grid grid-cols-12 gap-3 flex-1 pt-3 min-h-0">
                {/* Left side: Analytics */}
                <div className="col-span-7 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl p-2.5 border border-indigo-100/50 dark:border-indigo-950/30">
                    <div>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Live ROI Protected</span>
                      <p className="text-sm font-black text-indigo-700 dark:text-indigo-400">R25,350</p>
                    </div>
                    <div className="h-7 w-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      R
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-slate-100 bg-slate-50/50 dark:border-slate-900 dark:bg-navy-900 rounded-xl p-2">
                      <span className="text-[7px] text-slate-400 uppercase font-bold block">Assisted</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white">147</span>
                    </div>
                    <div className="border border-slate-100 bg-slate-50/50 dark:border-slate-900 dark:bg-navy-900 rounded-xl p-2">
                      <span className="text-[7px] text-slate-400 uppercase font-bold block">Hours Saved</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white">12.8 hrs</span>
                    </div>
                  </div>

                  {/* Micro timeline log */}
                  <div className="border border-slate-150 rounded-xl p-2 space-y-1 flex-1 overflow-hidden dark:border-slate-900">
                    <span className="text-[7px] font-bold text-slate-400 block uppercase">Real-Time Actions</span>
                    <div className="flex items-center justify-between text-[8px] bg-slate-50 dark:bg-navy-900 p-1 rounded">
                      <span className="font-bold">Sipho Dlamini</span>
                      <span className="text-emerald-500 font-bold">GP Booked</span>
                    </div>
                    <div className="flex items-center justify-between text-[8px] bg-slate-50 dark:bg-navy-900 p-1 rounded opacity-70">
                      <span>Annelize Marais</span>
                      <span className="text-emerald-500">Dentist Booked</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Mobile conversation simulator */}
                <div className="col-span-5 border border-slate-150 dark:border-slate-850 bg-slate-50/60 dark:bg-navy-900/60 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
                  <div className="space-y-1.5 flex-1 overflow-hidden">
                    <span className="text-[6.5px] font-mono text-slate-400 uppercase block tracking-wider">Patient Chat View</span>
                    <div className="rounded bg-indigo-650 text-white text-[7.5px] p-1.5 max-w-[90%] ml-auto">
                      "I need to see a dentist."
                    </div>
                    <div className="rounded bg-white dark:bg-navy-950 text-slate-700 dark:text-slate-350 text-[7px] p-1.5 max-w-[90%] border border-slate-100 dark:border-slate-900">
                      "Hi! I can assist with booking Dr. Amit Patel."
                    </div>
                  </div>
                  <div className="h-4 bg-white dark:bg-navy-950 rounded border border-slate-100 dark:border-slate-900 flex items-center justify-between px-1">
                    <span className="text-[7px] text-slate-300">Select Date...</span>
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>

            </div>

            {/* Glowing floating indicator tag */}
            <div className="absolute -top-3 -right-3 rounded-2xl bg-slate-900 text-white text-[10px] font-bold p-3 py-2 flex items-center gap-1.5 shadow-lg border border-slate-800 dark:bg-white dark:text-slate-900 dark:border-slate-200">
              <Sparkles size={11} className="text-emerald-400 dark:text-emerald-600" />
              <span>Aura SaaS Active</span>
            </div>

            {/* Dynamic visual connection lines */}
            <div className="absolute bottom-6 -left-6 rounded-xl bg-white border border-slate-200 p-2.5 flex items-center gap-2 shadow dark:bg-navy-950 dark:border-slate-800">
              <div className="h-6 w-6 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <ShieldCheck size={14} />
              </div>
              <div>
                <span className="text-[8px] text-slate-400 block uppercase">Data Audit</span>
                <span className="text-[10px] font-bold text-slate-800 dark:text-white">POPIA Secured</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Downward indicator */}
      <div className="absolute bottom-6 flex flex-col items-center gap-1 opacity-50">
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Launch Interactive Workspace</span>
        <div className="h-4 w-0.5 bg-slate-400 animate-pulse" />
      </div>

    </section>
  );
}
