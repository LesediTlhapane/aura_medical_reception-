import React from 'react';
import { CalendarRange, Shield, Clock, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function BottomValueProp() {
  const values = [
    {
      title: "Reduce Reception Workload",
      desc: "Autonomously answers up to 74% of redundant phone calls regarding operating hours, fees, location, and medical aid policies.",
      icon: <Users className="text-emerald-500" size={20} />
    },
    {
      title: "24/7 Patient Access",
      desc: "Enable patients to request appointments and check doctor availability outside of regular business hours, capturing leads overnight.",
      icon: <Clock className="text-emerald-500" size={20} />
    },
    {
      title: "Structured Lead Capture",
      desc: "Collects full names, medical details, and contact numbers in a structured flow, ready for review by receptionists with zero manual data entry.",
      icon: <CalendarRange className="text-emerald-500" size={20} />
    },
    {
      title: "POPIA Compliant Design",
      desc: "Built from the ground up prioritizing patient confidentiality, medical record security, and encryption compliance standards.",
      icon: <Shield className="text-emerald-500" size={20} />
    }
  ];

  return (
    <section className="py-12 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Practice Automation
        </span>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1 dark:text-white">
          How Aura Tech Elevates Medical Practices
        </h2>
        <p className="text-xs text-slate-500 mt-2 dark:text-slate-400">
          Transform patient support, optimize front-desk productivity, and eliminate missed bookings with customized clinical AI receptionists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {values.map((val, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-3 rounded-2xl border border-slate-150 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-850">
              {val.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{val.title}</h3>
              <p className="text-[11px] leading-relaxed text-slate-550 dark:text-slate-400 mt-1.5">
                {val.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* South Africa Medical Impact Statistics Callout */}
      <div className="mt-8 rounded-2xl border border-slate-150 bg-slate-50/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6 dark:border-slate-800 dark:bg-slate-900/20">
        <div className="max-w-xl">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-500" />
            Designed for South African Clinics & Practitioners
          </h4>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed dark:text-slate-400">
            Aura Tech Receptionist fits directly into Pretoria, Johannesburg, Cape Town, and Durban clinical workflows. Integrates with existing booking logs, supports local medical aid submit systems, and operates in multi-language modes.
          </p>
        </div>
        <div className="flex items-center gap-2 border border-slate-200/80 bg-white rounded-xl p-3 px-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Average ROI</span>
            <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">3.5 Hours Saved</p>
          </div>
          <div className="h-8 w-px bg-slate-200 mx-2 dark:bg-slate-800"></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Per Doctor</span>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Each Working Day</p>
          </div>
        </div>
      </div>

    </section>
  );
}
