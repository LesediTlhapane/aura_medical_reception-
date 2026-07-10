import React, { useEffect, useState, useRef } from 'react';
import { CalendarRange, Users, Clock3, Cpu, TrendingUp, Phone } from 'lucide-react';

// Animated counter hook
function useAnimatedCounter(target, duration = 1200) {
  const [value, setValue] = useState(target);
  const prevTarget = useRef(target);

  useEffect(() => {
    if (prevTarget.current === target) return;
    const from = prevTarget.current;
    prevTarget.current = target;
    const diff = target - from;
    if (diff === 0) return;

    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((from + diff * ease).toFixed(1)));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

export default function ImpactDashboard({ stats }) {
  const patients  = useAnimatedCounter(stats.patientsHelpedToday);
  const bookings  = useAnimatedCounter(stats.appointmentsRequested);
  const hours     = useAnimatedCounter(stats.adminHoursSaved);
  const deflect   = useAnimatedCounter(stats.deflectionRate);

  const queryTags = [
    { label: 'Opening Hours', count: 84 },
    { label: 'Book Dentist', count: 52 },
    { label: 'Discovery Aid', count: 48 },
    { label: 'GP Fee', count: 39 },
    { label: 'Wheelchair', count: 18 },
    { label: 'Dr. Smith', count: 14 },
  ];

  const kpis = [
    {
      label: 'Patients Assisted',
      value: Math.floor(patients),
      unit: '',
      sub: 'Auto-resolved chats',
      icon: <Users size={16} className="text-blue-500" />,
      color: 'blue',
    },
    {
      label: 'Bookings Logged',
      value: Math.floor(bookings),
      unit: '',
      sub: 'Sent to reception',
      icon: <CalendarRange size={16} className="text-emerald-500" />,
      color: 'emerald',
    },
    {
      label: 'Response Time',
      value: '1.8',
      unit: 's',
      sub: 'Active 24/7',
      icon: <Clock3 size={16} className="text-violet-500" />,
      color: 'violet',
    },
    {
      label: 'Admin Hours Saved',
      value: hours.toFixed(1),
      unit: 'h',
      sub: 'Staff time freed',
      icon: <Cpu size={16} className="text-amber-500" />,
      color: 'amber',
    },
  ];

  const colorMap = {
    blue:    'text-blue-600 dark:text-blue-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    violet:  'text-violet-600 dark:text-violet-400',
    amber:   'text-amber-600 dark:text-amber-400',
  };

  const bgMap = {
    blue:    'bg-blue-50 border-blue-100 dark:bg-blue-500/8 dark:border-blue-500/15',
    emerald: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-500/8 dark:border-emerald-500/15',
    violet:  'bg-violet-50 border-violet-100 dark:bg-violet-500/8 dark:border-violet-500/15',
    amber:   'bg-amber-50 border-amber-100 dark:bg-amber-500/8 dark:border-amber-500/15',
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-navy-850">

      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-5 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="status-dot-online" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Live ROI Simulator
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Practice Impact
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Updates in real-time as patients interact
          </p>
        </div>
        <span className="badge badge-emerald text-[10px]">
          <TrendingUp size={10} />
          Today
        </span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className={`rounded-xl border p-3.5 transition-all duration-200 ${bgMap[kpi.color]}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {kpi.label}
              </span>
              {kpi.icon}
            </div>
            <div className={`kpi-value text-2xl font-extrabold tracking-tight ${colorMap[kpi.color]} animate-count-up`}>
              {kpi.value}{kpi.unit}
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">
              {kpi.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Deflection gauge */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-200 mb-3">
          <span className="flex items-center gap-1.5">
            <Phone size={13} className="text-slate-400" />
            Enquiry Deflection Rate
          </span>
          <span className="kpi-value font-mono text-emerald-600 dark:text-emerald-400 text-base">
            {Math.floor(deflect)}%
          </span>
        </div>
        <div className="relative h-2 w-full rounded-full bg-slate-200 overflow-hidden dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 ease-out"
            style={{ width: `${Math.floor(deflect)}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
          {Math.floor(deflect)}% of incoming enquiries are resolved in chat — without a staff member picking up the phone.
        </p>
      </div>

      {/* Live reception log */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Reception Request Log
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-breathe" />
            Live
          </span>
        </div>

        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-0.5">
          {stats.recentBookings.map((b, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-3 text-xs transition-all duration-300 ${
                b.status === 'Pending'
                  ? 'border-amber-100 bg-amber-50/50 dark:border-amber-500/10 dark:bg-amber-500/5'
                  : 'border-slate-100 bg-white dark:border-white/5 dark:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-slate-900 dark:text-white truncate">{b.name}</span>
                <span className={`badge shrink-0 ${
                  b.status === 'Pending' ? 'badge-amber' : 'badge-emerald'
                }`}>
                  {b.status}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-snug">
                {b.service} · <strong className="text-slate-700 dark:text-slate-300">{b.doctor}</strong>
              </p>
              <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                <span className="font-mono">{b.id}</span>
                <span>📅 {b.date} · {b.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top concerns */}
      <div>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Top Patient Topics
        </span>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {queryTags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600 dark:bg-white/5 dark:text-slate-400"
            >
              {tag.label}
              <span className="font-bold text-slate-400 dark:text-slate-500">({tag.count})</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
