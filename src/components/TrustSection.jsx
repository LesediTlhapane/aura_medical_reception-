import React from 'react';
import { ShieldCheck, Lock, FileKey, EyeOff } from 'lucide-react';

const items = [
  {
    icon: <ShieldCheck size={20} className="text-emerald-500" />,
    title: 'POPIA Compliant',
    desc: 'Built to comply with South Africa\'s Protection of Personal Information Act. Patient data is handled according to POPIA\'s eight conditions for lawful processing.',
    badge: 'SA Regulation',
    badgeColor: 'badge-emerald',
  },
  {
    icon: <Lock size={20} className="text-blue-500" />,
    title: 'End-to-End Encrypted',
    desc: 'All patient conversations are transmitted over TLS 1.3 encrypted channels. No message content is stored in plaintext or accessible to third parties.',
    badge: 'TLS 1.3',
    badgeColor: 'badge-blue',
  },
  {
    icon: <FileKey size={20} className="text-violet-500" />,
    title: 'Secure Appointment Requests',
    desc: 'Appointment data is securely logged and only accessible to authorised practice staff. Each booking entry carries a unique reference for full audit trail.',
    badge: 'Audit Trail',
    badgeColor: 'badge-blue',
  },
  {
    icon: <EyeOff size={20} className="text-slate-500" />,
    title: 'Private Patient Data',
    desc: 'No patient information is sold, shared, or used to train AI models. Each practice operates in a fully isolated data environment.',
    badge: 'Zero Sharing',
    badgeColor: 'badge-emerald',
  },
];

export default function TrustSection() {
  return (
    <section className="py-24 px-4 bg-slate-50/60 dark:bg-navy-900/60">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-14">
          <span className="badge badge-emerald mb-3">Security & Compliance</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            Built for Healthcare Privacy Standards
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Medical practices require the highest level of patient privacy. Aura Reception is designed from the ground up with security as a foundation, not an afterthought.
          </p>
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="group flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md dark:border-white/5 dark:bg-navy-850"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Icon */}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 dark:bg-navy-800 dark:border-white/5">
                {item.icon}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <span className={`badge ${item.badgeColor} shrink-0`}>{item.badge}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom compliance strip */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-8 py-5 border-y border-slate-200/80 dark:border-white/5">
          {[
            { icon: <ShieldCheck size={14} className="text-emerald-500" />, text: 'POPIA Compliant' },
            { icon: <Lock size={14} className="text-blue-500" />, text: 'TLS 1.3 Encrypted' },
            { icon: <EyeOff size={14} className="text-slate-400" />, text: 'Zero Data Selling' },
            { icon: <FileKey size={14} className="text-violet-500" />, text: 'Full Audit Logs' },
          ].map((badge, i) => (
            <span key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {badge.icon}
              {badge.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
