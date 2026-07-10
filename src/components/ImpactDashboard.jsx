import React, { useEffect, useState, useRef } from 'react';
import { CalendarRange, Users, Clock3, Cpu, TrendingUp, Phone, Coins, CheckCircle, Sparkles, Building, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

// Animated counter hook for numbers
function useAnimatedCounter(target, duration = 1000) {
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
  const patients = useAnimatedCounter(stats.patientsHelpedToday);
  const bookings = useAnimatedCounter(stats.appointmentsRequested);
  const calls = useAnimatedCounter(stats.callsPrevented);
  const hours = useAnimatedCounter(stats.adminHoursSaved);
  const revenue = useAnimatedCounter(stats.potentialRevenueProtected);
  const responseTime = stats.averageResponseTime || 1.8;

  // Formatting currency in Rands
  const formatCurrency = (val) => {
    return 'R' + Math.floor(val).toLocaleString('en-ZA');
  };

  const kpis = [
    {
      label: 'Patients Assisted Today',
      value: Math.floor(patients),
      unit: '',
      sub: 'Queries solved without staff',
      icon: <Users size={16} className="text-blue-500" />,
      color: 'blue',
      salesTip: 'Patients assisted while reception was busy'
    },
    {
      label: 'Appointments Captured',
      value: Math.floor(bookings),
      unit: '',
      sub: 'Logged to clinical files',
      icon: <CalendarRange size={16} className="text-emerald-500" />,
      color: 'emerald',
      salesTip: 'This booking would normally require a phone call'
    },
    {
      label: 'Calls Prevented',
      value: Math.floor(calls),
      unit: '',
      sub: 'FAQ deflections in chat',
      icon: <Phone size={16} className="text-sky-500" />,
      color: 'sky',
      salesTip: 'Aura deflected redundant questions'
    },
    {
      label: 'Reception Hours Saved',
      value: hours.toFixed(1),
      unit: 'h',
      sub: 'Administrative time freed',
      icon: <Cpu size={16} className="text-violet-500" />,
      color: 'violet',
      salesTip: 'Estimated reception time saved: 6 mins per chat'
    },
    {
      label: 'Revenue Protected',
      value: formatCurrency(revenue),
      unit: '',
      sub: 'Booked consultations secured',
      icon: <Coins size={16} className="text-indigo-500" />,
      color: 'indigo',
      salesTip: 'Secures booking pipeline leaks'
    },
    {
      label: 'Average Response Time',
      value: responseTime,
      unit: 's',
      sub: 'Active patient support 24/7',
      icon: <Clock3 size={16} className="text-amber-500" />,
      color: 'amber',
      salesTip: 'Average patient response time: 1.8 seconds'
    }
  ];

  const colorMap = {
    blue:    'text-blue-600 dark:text-blue-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    sky:     'text-sky-600 dark:text-sky-400',
    violet:  'text-violet-600 dark:text-violet-400',
    indigo:  'text-indigo-600 dark:text-indigo-400',
    amber:   'text-amber-600 dark:text-amber-400',
  };

  const bgMap = {
    blue:    'bg-blue-50/50 border-blue-100 dark:bg-blue-500/5 dark:border-blue-500/10',
    emerald: 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/10',
    sky:     'bg-sky-50/50 border-sky-100 dark:bg-sky-500/5 dark:border-sky-500/10',
    violet:  'bg-violet-50/50 border-violet-100 dark:bg-violet-500/5 dark:border-violet-500/10',
    indigo:  'bg-indigo-50/50 border-indigo-100 dark:bg-indigo-500/5 dark:border-indigo-500/10',
    amber:   'bg-amber-50/50 border-amber-100 dark:bg-amber-500/5 dark:border-amber-500/10',
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-navy-900/60">

      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="status-dot-online" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Live Practice Metrics Simulator
            </span>
          </div>
          <h2 className="text-lg font-black tracking-tight text-slate-850 dark:text-white">
            Practice ROI Dashboard
          </h2>
          <p className="text-[11px] text-slate-450 dark:text-slate-500">
            Real-time analytics for clinic administrators.
          </p>
        </div>
        <span className="badge badge-emerald text-[9px] py-1 px-2.5 font-bold">
          <TrendingUp size={10} />
          Today's Feed
        </span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className={`rounded-xl border p-3.5 flex flex-col justify-between transition hover:-translate-y-0.5 hover:shadow duration-150 ${bgMap[kpi.color]}`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {kpi.label}
                </span>
                {kpi.icon}
              </div>
              <div className={`kpi-value text-xl font-black tracking-tight ${colorMap[kpi.color]}`}>
                {kpi.value}{kpi.unit}
              </div>
            </div>
            <div className="mt-2 pt-1.5 border-t border-slate-200/40 dark:border-slate-850">
              <span className="text-[8px] font-medium text-slate-400 dark:text-slate-500 block leading-tight">
                {kpi.sub}
              </span>
              {/* Sales Psychology notification tag */}
              <span className="text-[7.5px] font-bold text-slate-500 dark:text-slate-400 block leading-tight mt-1 truncate">
                💡 {kpi.salesTip}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Conversion ROI Strip */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-navy-950/40">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
            <Building size={14} className="text-slate-400" />
            Clinic Automation Status
          </span>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
            99.9% Uptime
          </span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Aura Reception successfully resolves patient administrative tasks in real-time, safeguarding your practitioner calendar bookings.
        </p>
      </div>

      {/* Live Reception Request Log */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Reception Audit Log
          </span>
          <span className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-breathe" />
            AUTO SYNC
          </span>
        </div>

        <div className="flex flex-col gap-2 max-h-[170px] overflow-y-auto pr-1">
          {stats.recentBookings.map((b, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-3 text-xs transition-all duration-300 ${
                b.status === 'Pending'
                  ? 'border-amber-100 bg-amber-50/20 dark:border-amber-500/10 dark:bg-amber-500/5 animate-pulse'
                  : 'border-slate-150 bg-white dark:border-slate-800 dark:bg-navy-950/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-extrabold text-slate-850 dark:text-white truncate">{b.name}</span>
                <span className={`badge shrink-0 text-[8px] font-black uppercase ${
                  b.status === 'Pending' ? 'badge-amber' : 'badge-emerald'
                }`}>
                  {b.status === 'Pending' ? 'Pending Approval' : 'Approved & Synced'}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-450 text-[11px]">
                {b.service} · <strong className="text-slate-700 dark:text-slate-300 font-bold">{b.doctor}</strong>
              </p>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 dark:border-slate-800/40 text-[9px] text-slate-400">
                <span className="font-mono">{b.id}</span>
                <span>📅 {b.date} · {b.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
