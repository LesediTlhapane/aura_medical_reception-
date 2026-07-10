import React from 'react';
import { clinicData } from '../data/clinicData';
import { Clock, Stethoscope, Phone, MapPin, Shield, Check, HeartHandshake, AlertTriangle } from 'lucide-react';

export default function ClinicProfile() {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-navy-850">

      {/* Clinic Header */}
      <div className="border-b border-slate-100 pb-5 dark:border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <span className="status-dot-online" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Sunrise Practice Group
          </span>
        </div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {clinicData.name}
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Practice No: <span className="font-mono">{clinicData.practiceNumber}</span>
        </p>
      </div>

      {/* Emergency banner */}
      <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/60 p-3.5 dark:border-red-500/10 dark:bg-red-500/5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-500/10">
          <AlertTriangle size={16} className="text-red-500" />
        </div>
        <div>
          <p className="text-xs font-bold text-red-700 dark:text-red-400">Medical Emergency?</p>
          <a
            href={`tel:${clinicData.emergencyPhone}`}
            className="text-[11px] font-mono font-bold text-red-600 dark:text-red-400 underline"
          >
            {clinicData.emergencyPhone}
          </a>
          <span className="text-[11px] text-red-500/80 dark:text-red-400/70"> · Available 24 hrs</span>
        </div>
      </div>

      {/* Operating hours */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5">
            <Clock size={14} className="text-slate-500 dark:text-slate-400" />
          </div>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Operating Hours</span>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 divide-y divide-slate-100 overflow-hidden dark:border-white/5 dark:bg-white/[0.02] dark:divide-white/5">
          {[
            { label: 'Monday – Friday', value: clinicData.operatingHours.weekdays },
            { label: 'Saturday', value: clinicData.operatingHours.saturday },
            { label: 'Sunday & Holidays', value: clinicData.operatingHours.sunday, closed: true },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between px-3.5 py-2.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
              <span className={`font-semibold ${row.closed ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5">
            <Stethoscope size={14} className="text-slate-500 dark:text-slate-400" />
          </div>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Services & Fees</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {clinicData.services.map((svc) => (
            <div
              key={svc.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 text-xs transition hover:border-slate-200 hover:shadow-sm dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/8"
            >
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{svc.name}</span>
                <span className="ml-2 text-slate-400">· {svc.duration}</span>
              </div>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{svc.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Medical aids */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5">
            <HeartHandshake size={14} className="text-slate-500 dark:text-slate-400" />
          </div>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Accepted Medical Aids</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {clinicData.medicalAids.map((ma, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 dark:border-white/5 dark:bg-white/[0.02]"
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
                <Check size={10} strokeWidth={3} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">{ma.name}</p>
                <p className="text-[9px] text-slate-400">{ma.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5">
            <MapPin size={14} className="text-slate-500 dark:text-slate-400" />
          </div>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Location & Access</span>
        </div>
        <div className="rounded-xl border border-slate-100 overflow-hidden dark:border-white/5">
          {/* Stylized map */}
          <div className="relative h-28 bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 dark:from-navy-800 dark:via-navy-850 dark:to-navy-800"
            style={{
              backgroundImage: 'linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(to right, rgba(148,163,184,0.15) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          >
            <div className="absolute left-1/3 top-1/2 h-1 w-28 -translate-y-1/2 rotate-6 bg-white/80 dark:bg-navy-700/80 rounded shadow-sm" />
            <div className="absolute left-1/4 top-1/4 h-20 w-0.5 bg-white/80 dark:bg-navy-700/80 shadow-sm" />
            <div className="absolute left-[34%] top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">
              <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 shadow-lg ring-4 ring-emerald-500/20">
                <span className="animate-ping absolute h-3.5 w-3.5 rounded-full bg-emerald-400 opacity-50" />
              </div>
              <span className="rounded-md bg-slate-900/90 px-2 py-0.5 text-[9px] font-bold text-white shadow-lg dark:bg-white/90 dark:text-slate-900 whitespace-nowrap">
                Sunrise Medical
              </span>
            </div>
          </div>
          <div className="bg-white p-3 dark:bg-navy-850 border-t border-slate-100 dark:border-white/5">
            <p className="text-xs font-semibold text-slate-800 dark:text-white">Brooklyn, Pretoria</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{clinicData.address}</p>
            <div className="flex gap-4 mt-2 text-[10px] text-slate-400">
              <span>🚗 {clinicData.logistics.parking}</span>
              <span>♿ {clinicData.logistics.accessibility}</span>
            </div>
          </div>
        </div>
      </div>

      {/* POPIA badge */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-100/60 dark:border-white/4">
        <Shield size={13} className="text-emerald-500" />
        <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
          POPIA Compliant · Secure Patient Data
        </span>
      </div>
    </div>
  );
}
