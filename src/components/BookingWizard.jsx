import React, { useState, useEffect } from 'react';
import { clinicData } from '../data/clinicData';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Calendar, User, Phone, Mail, Clipboard, Check, X, Stethoscope, UserCheck, Clock } from 'lucide-react';

const TOTAL_STEPS = 6;

export default function BookingWizard({ preselectedSpecialist, onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceId: preselectedSpecialist ? preselectedSpecialist.id : 'gp',
    doctor: '',
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    reason: ''
  });

  const filteredDoctors = clinicData.doctors.filter(d => d.id === formData.serviceId);

  useEffect(() => {
    if (filteredDoctors.length > 0) {
      setFormData(prev => ({ ...prev, doctor: filteredDoctors[0].name }));
    }
  }, [formData.serviceId]);

  const handleServiceChange = (id) => {
    setFormData(prev => ({ ...prev, serviceId: id }));
  };

  const handleInput = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const nextStep = () => { if (step < TOTAL_STEPS) setStep(p => p + 1); };
  const prevStep = () => { if (step > 1) setStep(p => p - 1); };

  const handleSubmit = () => {
    const selectedSvc = clinicData.services.find(s => s.id === formData.serviceId);
    onComplete({
      name: formData.name,
      service: selectedSvc ? selectedSvc.name : 'Consultation',
      doctor: formData.doctor || 'First Available',
      date: formData.date || new Date().toISOString().split('T')[0],
      time: formData.time || '09:00',
      reason: formData.reason || 'General checkup'
    });
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.serviceId && formData.doctor;
      case 2: return formData.name.trim().length >= 3;
      case 3: return formData.phone.trim().length >= 9 && formData.email.includes('@');
      case 4: return !!formData.date;
      case 5: return !!formData.time;
      default: return true;
    }
  };

  const timeSlots = ['08:30', '09:15', '10:00', '11:30', '14:00', '15:15', '16:00'];

  const stepMeta = [
    { label: 'Service', icon: <Stethoscope size={12} /> },
    { label: 'Your Name', icon: <User size={12} /> },
    { label: 'Contact', icon: <Phone size={12} /> },
    { label: 'Date', icon: <Calendar size={12} /> },
    { label: 'Time', icon: <Clock size={12} /> },
    { label: 'Reason', icon: <Clipboard size={12} /> },
  ];

  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white shadow-md overflow-hidden dark:border-white/5 dark:bg-navy-850 select-none">

      {/* Progress bar */}
      <div className="h-1 w-full bg-slate-100 dark:bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* Step indicator pills */}
      <div className="flex items-center gap-1 overflow-x-auto px-4 pt-3 pb-1 scrollbar-none">
        {stepMeta.map((meta, i) => {
          const sNum = i + 1;
          const isDone = sNum < step;
          const isCurrent = sNum === step;
          return (
            <div
              key={i}
              className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all ${
                isDone
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                  : isCurrent
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-600'
              }`}
            >
              {isDone ? <Check size={10} strokeWidth={3} /> : meta.icon}
              <span className="hidden sm:inline">{meta.label}</span>
            </div>
          );
        })}
        <button
          onClick={onCancel}
          className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600"
        >
          <X size={12} />
        </button>
      </div>

      {/* Step content */}
      <div className="px-4 pb-4 pt-3">
        <div style={{ minHeight: '190px' }}>
          <AnimatePresence mode="wait">
            {/* Step 1 – Service & Doctor */}
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Healthcare Service</p>
                  <div className="flex flex-col gap-1.5">
                    {clinicData.services.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleServiceChange(s.id)}
                        className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition ${
                          formData.serviceId === s.id
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700 dark:border-white/6 dark:bg-white/3 dark:text-slate-300 dark:hover:bg-white/5'
                        }`}
                      >
                        <span>{s.name}</span>
                        <span className={`font-mono text-[11px] ${formData.serviceId === s.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                          {s.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 – Name */}
            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">What is your full name?</h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3">As it appears on your SA ID or medical aid card.</p>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      autoFocus
                      value={formData.name}
                      onChange={e => handleInput('name', e.target.value)}
                      placeholder="e.g. Sipho Dlamini"
                      className="input-field pl-9"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3 – Contact */}
            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">Contact Details</h3>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 block">Mobile Number</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="tel"
                      autoFocus
                      value={formData.phone}
                      onChange={e => handleInput('phone', e.target.value)}
                      placeholder="082 123 4567"
                      className="input-field pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => handleInput('email', e.target.value)}
                      placeholder="sipho@gmail.com"
                      className="input-field pl-9"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4 – Date */}
            {step === 4 && (
              <motion.div
                key="s4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">Preferred Date</h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3">Weekdays and Saturdays available.</p>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={e => handleInput('date', e.target.value)}
                      className="input-field pl-9"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5 – Time */}
            {step === 5 && (
              <motion.div
                key="s5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">Choose a Time Slot</h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3">Select your preferred appointment time:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleInput('time', t)}
                        className={`rounded-xl border py-2.5 text-center text-xs font-bold transition ${
                          formData.time === t
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-white/6 dark:bg-white/3 dark:text-slate-300 dark:hover:bg-white/6'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6 – Reason */}
            {step === 6 && (
              <motion.div
                key="s6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">Reason for Visit</h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3">Brief description to help our team prepare (optional).</p>
                  <div className="relative">
                    <Clipboard size={14} className="absolute left-3.5 top-3 text-slate-400" />
                    <textarea
                      rows={3}
                      value={formData.reason}
                      onChange={e => handleInput('reason', e.target.value)}
                      placeholder="e.g. Recurring lower back pain / Annual health check"
                      className="input-field pl-9 resize-none"
                    />
                  </div>
                  {/* Summary preview */}
                  <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] text-slate-600 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-400 space-y-1">
                    <div className="flex justify-between"><span className="text-slate-400">Patient:</span><strong className="text-slate-800 dark:text-white">{formData.name}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">Doctor:</span><strong className="text-slate-800 dark:text-white">{formData.doctor}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">Date:</span><strong className="text-slate-800 dark:text-white">{formData.date || 'TBC'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">Time:</span><strong className="text-slate-800 dark:text-white">{formData.time || 'TBC'}</strong></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3 dark:border-white/5">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-800 disabled:opacity-30 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft size={13} />
            Back
          </button>

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white transition hover:bg-slate-700 active:scale-95 disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Continue
              <ArrowRight size={13} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 active:scale-95 shadow-sm shadow-emerald-600/20"
            >
              <Check size={13} />
              Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
