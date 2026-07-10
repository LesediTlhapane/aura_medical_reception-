import React from 'react';
import { MessageSquare, Zap, CalendarCheck, UserCheck } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <MessageSquare size={22} className="text-blue-500" />,
    title: 'Patient Asks a Question',
    desc: 'The patient types a question — hours, fees, medical aid, or symptoms — in any language. No phone call needed.',
    color: 'blue',
  },
  {
    number: '02',
    icon: <Zap size={22} className="text-emerald-500" />,
    title: 'AI Responds Instantly',
    desc: 'Aura responds in under 2 seconds, 24/7, with accurate clinic-specific information including specialist routing.',
    color: 'emerald',
  },
  {
    number: '03',
    icon: <CalendarCheck size={22} className="text-amber-500" />,
    title: 'Appointment is Captured',
    desc: 'The patient completes a guided booking form. Their details, preferred doctor, date, and time are collected automatically.',
    color: 'amber',
  },
  {
    number: '04',
    icon: <UserCheck size={22} className="text-violet-500" />,
    title: 'Reception Confirms',
    desc: 'The receptionist receives a structured request in the dashboard. One tap to approve — no missed calls, no manual data entry.',
    color: 'violet',
  },
];

const colorMap = {
  blue: {
    badge: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    ring: 'ring-blue-100 dark:ring-blue-500/10',
    connector: 'bg-blue-200 dark:bg-blue-500/20',
  },
  emerald: {
    badge: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    ring: 'ring-emerald-100 dark:ring-emerald-500/10',
    connector: 'bg-emerald-200 dark:bg-emerald-500/20',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    ring: 'ring-amber-100 dark:ring-amber-500/10',
    connector: 'bg-amber-200 dark:bg-amber-500/20',
  },
  violet: {
    badge: 'bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20',
    ring: 'ring-violet-100 dark:ring-violet-500/10',
    connector: 'bg-violet-200 dark:bg-violet-500/20',
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-white dark:bg-navy-950">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-16">
          <span className="badge badge-emerald mb-3">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            From Question to Confirmed Booking
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-4 max-w-xl mx-auto leading-relaxed">
            A seamless four-step flow that replaces phone tag and manual data entry — without replacing your receptionist.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
          {/* Horizontal connector line (desktop) */}
          <div className="hidden md:block absolute top-[52px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-gradient-to-r from-blue-200 via-emerald-200 via-amber-200 to-violet-200 dark:from-blue-500/20 dark:via-emerald-500/20 dark:to-violet-500/20" />

          {steps.map((step, i) => {
            const c = colorMap[step.color];
            return (
              <div
                key={i}
                className={`relative flex flex-col items-center text-center px-4 py-2 animate-fade-in-up`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {/* Icon circle */}
                <div className={`relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-2xl border ${c.badge} ring-4 ${c.ring} bg-white dark:bg-navy-900 shadow-sm mb-5`}>
                  {step.icon}
                </div>

                {/* Step number */}
                <span className="text-[10px] font-bold tracking-widest text-slate-300 dark:text-slate-600 uppercase mb-2">
                  Step {step.number}
                </span>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
