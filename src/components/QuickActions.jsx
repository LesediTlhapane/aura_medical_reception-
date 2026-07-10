import React from 'react';
import { Calendar, Clock, UserCheck, Stethoscope, HeartHandshake, Phone, MapPin, AlertTriangle } from 'lucide-react';

const actions = [
  { label: 'Book Appointment', query: 'I need to book an appointment', icon: <Calendar size={12} />, variant: 'emerald' },
  { label: 'Clinic Hours', query: 'What are your opening hours?', icon: <Clock size={12} />, variant: 'default' },
  { label: 'Doctors Available', query: 'Which doctors are available?', icon: <UserCheck size={12} />, variant: 'default' },
  { label: 'Services & Fees', query: 'What services do you offer?', icon: <Stethoscope size={12} />, variant: 'default' },
  { label: 'Medical Aid', query: 'Do you accept Discovery medical aid?', icon: <HeartHandshake size={12} />, variant: 'default' },
  { label: 'Contact', query: 'How do I contact Sunrise Medical?', icon: <Phone size={12} />, variant: 'default' },
  { label: 'Directions', query: 'Where is the clinic located?', icon: <MapPin size={12} />, variant: 'default' },
  { label: 'Emergency', query: 'Emergency chest pain, help!', icon: <AlertTriangle size={12} />, variant: 'red' },
];

export default function QuickActions({ onAction, isBookingActive }) {
  return (
    <div className="flex flex-wrap gap-1.5 py-3 select-none">
      {actions.map((act, idx) => {
        const disabled = act.variant === 'emerald' && isBookingActive;
        let cls = '';

        if (disabled) {
          cls = 'border border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed dark:border-white/5 dark:bg-white/2 dark:text-white/20';
        } else if (act.variant === 'emerald') {
          cls = 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 dark:border-emerald-500/20 dark:bg-emerald-500/8 dark:text-emerald-400 dark:hover:bg-emerald-500/15';
        } else if (act.variant === 'red') {
          cls = 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300 dark:border-red-500/20 dark:bg-red-500/8 dark:text-red-400 dark:hover:bg-red-500/15';
        } else {
          cls = 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 dark:border-white/6 dark:bg-white/3 dark:text-slate-300 dark:hover:bg-white/6';
        }

        return (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onAction(act.query)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all duration-150 cursor-pointer active:scale-95 ${cls}`}
          >
            {act.icon}
            {act.label}
          </button>
        );
      })}
    </div>
  );
}
