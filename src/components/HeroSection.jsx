import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Sparkles, CalendarCheck, Phone, Shield, ChevronRight, Play } from 'lucide-react';

// Animated counter hook
function useCounter(target, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

export default function HeroSection({ onStartDemo }) {
  const heroRef = useRef(null);
  const [countersActive, setCountersActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCountersActive(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const calls = useCounter(74, 1600, countersActive);
  const hours = useCounter(3.5, 1400, countersActive);
  const patients = useCounter(147, 2000, countersActive);

  const scrollToDemo = () => {
    document.getElementById('live-demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden min-h-[92vh] flex flex-col items-center justify-center px-4 hero-mesh-light dark:hero-mesh-dark"
    >
      {/* Decorative grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(to right, #334155 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* Glow orbs */}
      <div className="pointer-events-none absolute -top-32 left-1/3 h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-[100px] dark:bg-emerald-500/15" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-blue-400/8 blur-[120px] dark:bg-blue-500/12" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center gap-8">

        {/* Top label */}
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            <span className="status-dot-online" />
            AI Receptionist · Live Prototype
          </span>
        </div>

        {/* Main headline */}
        <div className="animate-fade-in-up delay-100 flex flex-col gap-3">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Aura Reception
            <span className="align-super text-2xl font-light text-slate-400 dark:text-slate-500 ml-1">™</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-slate-500 dark:text-slate-400 tracking-tight">
            AI Receptionist for Medical Practices
          </p>
        </div>

        {/* Value prop bullets */}
        <div className="animate-fade-in-up delay-200 flex flex-wrap items-center justify-center gap-4 text-sm">
          {[
            { icon: <CalendarCheck size={14} />, text: 'Capture appointments 24/7' },
            { icon: <Phone size={14} />, text: 'Reduce reception workload' },
            { icon: <Shield size={14} />, text: 'POPIA compliant' },
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
              <span className="text-emerald-500">{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={scrollToDemo}
            className="btn-primary text-sm px-6 py-3 rounded-xl shadow-lg shadow-slate-900/10 dark:shadow-slate-950/40"
          >
            <Sparkles size={16} className="text-emerald-400" />
            Try Live Demo
            <ChevronRight size={15} className="opacity-60" />
          </button>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary text-sm px-6 py-3 rounded-xl"
          >
            <Play size={14} className="text-slate-500" />
            Watch Overview
          </button>
        </div>

        {/* Live metrics strip */}
        <div className="animate-fade-in-up delay-400 w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-sm px-6 py-5 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
            <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-white/5">
              {[
                { value: calls + '%', label: 'Calls Deflected', sub: 'Without staff involvement' },
                { value: hours + 'h', label: 'Admin Hours Saved', sub: 'Per doctor per day' },
                { value: patients + '+', label: 'Patients Served', sub: 'Per day, per practice' },
              ].map((stat, i) => (
                <div key={i} className={`flex flex-col items-center gap-0.5 ${i > 0 ? 'px-6' : 'pr-6'}`}>
                  <span className="kpi-value text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stat.label}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 text-center">{stat.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trusted by */}
        <div className="animate-fade-in-up delay-500 flex items-center gap-6 text-xs text-slate-400 dark:text-slate-600">
          <span>Designed for:</span>
          {['GP Practices', 'Dental Clinics', 'Specialist Rooms', 'Day Hospitals'].map((p, i) => (
            <span key={i} className="font-medium text-slate-500 dark:text-slate-500">{p}</span>
          ))}
        </div>
      </div>

      {/* Scroll CTA */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2 animate-fade-in-up delay-600">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Interactive Preview Below</span>
        <ArrowDown size={18} className="text-slate-400 scroll-indicator" />
      </div>
    </section>
  );
}
