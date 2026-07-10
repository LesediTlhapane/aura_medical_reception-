import React, { useState, useEffect } from 'react';
import { clinicData } from '../data/clinicData';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Calendar, User, Phone, Mail, Clipboard, Check, X, Star, ShieldAlert, Award, Clock } from 'lucide-react';

const TOTAL_STEPS = 5;

export default function BookingWizard({ preselectedSpecialist, onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    doctorId: '',
    doctorName: '',
    serviceId: preselectedSpecialist ? preselectedSpecialist.id : '',
    serviceName: preselectedSpecialist ? preselectedSpecialist.name : '',
    servicePrice: preselectedSpecialist ? preselectedSpecialist.price : '',
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    reason: ''
  });

  // If a specialist was preselected via chat triage, pre-fill doctor & service
  useEffect(() => {
    if (preselectedSpecialist) {
      const doctor = clinicData.doctors.find(d => d.id === preselectedSpecialist.id);
      if (doctor) {
        setFormData(prev => ({
          ...prev,
          doctorId: doctor.id,
          doctorName: doctor.name,
          serviceId: preselectedSpecialist.id,
          serviceName: preselectedSpecialist.name,
          servicePrice: preselectedSpecialist.price
        }));
        // Auto jump to Date step (Step 3) since doctor & service are preselected!
        setStep(3);
      }
    }
  }, [preselectedSpecialist]);

  const selectDoctor = (doc) => {
    const matchedService = clinicData.services.find(s => s.id === doc.id);
    setFormData(prev => ({
      ...prev,
      doctorId: doc.id,
      doctorName: doc.name,
      serviceId: matchedService ? matchedService.id : 'gp',
      serviceName: matchedService ? matchedService.name : 'General Consultation',
      servicePrice: matchedService ? matchedService.price : 'R650'
    }));
    setStep(2);
  };

  const selectService = (svc) => {
    setFormData(prev => ({
      ...prev,
      serviceId: svc.id,
      serviceName: svc.name,
      servicePrice: svc.price
    }));
    setStep(3);
  };

  const handleInput = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const nextStep = () => { if (step < TOTAL_STEPS) setStep(p => p + 1); };
  const prevStep = () => { if (step > 1) setStep(p => p - 1); };

  const handleSubmit = () => {
    onComplete({
      name: formData.name,
      service: formData.serviceName || 'GP Consultation',
      doctor: formData.doctorName || 'Dr. Lerato Khumalo',
      date: formData.date,
      time: formData.time,
      phone: formData.phone,
      email: formData.email,
      reason: formData.reason,
      price: formData.servicePrice
    });
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return !!formData.doctorId;
      case 2: return !!formData.serviceId;
      case 3: return !!formData.date;
      case 4: return !!formData.time;
      case 5: return formData.name.trim().length >= 3 && formData.phone.trim().length >= 9 && formData.email.includes('@');
      default: return true;
    }
  };

  // Generate 7 rolling dates starting from tomorrow (airline schedule style)
  const getRollingDates = () => {
    const dates = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      // Skip Sundays
      if (d.getDay() === 0) continue;

      const dateStr = d.toISOString().split('T')[0];
      dates.push({
        fullDate: dateStr,
        dayName: weekdays[d.getDay()],
        dayNum: d.getDate(),
        monthName: months[d.getMonth()],
        status: i % 3 === 0 ? "Fast Booking" : "Slots Available"
      });
    }
    return dates;
  };

  const rollingDates = getRollingDates();

  // Grouped time slots
  const timeCategories = {
    Morning: ['08:30', '09:15', '10:00', '11:15'],
    Afternoon: ['13:30', '14:15', '15:00', '15:45'],
    Evening: ['16:00', '16:30']
  };

  const stepMeta = [
    { label: 'Doctor' },
    { label: 'Service' },
    { label: 'Date' },
    { label: 'Time' },
    { label: 'Details' }
  ];

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md shadow-lg overflow-hidden dark:border-slate-800 dark:bg-navy-900/60 select-none">
      
      {/* Top Wizard Indicator */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-150 dark:bg-navy-950/40 dark:border-slate-800">
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Step {step} of {TOTAL_STEPS}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350">
            {stepMeta[step - 1].label}
          </span>
        </div>
        <button
          onClick={onCancel}
          title="Cancel scheduling"
          className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition dark:hover:bg-slate-800"
        >
          <X size={12} />
        </button>
      </div>

      {/* Progress Line */}
      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 transition-all duration-300"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* Step Body */}
      <div className="p-4 min-h-[220px] flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          {/* STEP 1: CHOOSE DOCTOR */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="text-center max-w-sm mx-auto mb-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Choose Your Specialist</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Select a doctor to view their available services.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[240px] overflow-y-auto pr-1">
                {clinicData.doctors.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => selectDoctor(doc)}
                    className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition hover:scale-[1.01] cursor-pointer ${
                      formData.doctorId === doc.id
                        ? 'border-indigo-400 bg-indigo-50/40 dark:border-indigo-500/30 dark:bg-indigo-500/10'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-navy-950/60 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Gradient Avatar */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${doc.color} text-white font-extrabold text-xs shadow-sm`}>
                      {doc.avatarInitials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800 dark:text-white truncate">{doc.name}</span>
                        <div className="flex items-center text-[9px] font-bold text-amber-500 shrink-0">
                          <Star size={9} fill="currentColor" className="mr-0.5" />
                          {doc.rating}
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate">{doc.specialty}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">
                          {doc.experience} Years Exp
                        </span>
                        <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded px-1">
                          {doc.availability}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: CHOOSE SERVICE */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="text-center max-w-sm mx-auto mb-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Select Consultation Service</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Listed rates for {formData.doctorName || 'selected specialist'}.</p>
              </div>

              <div className="flex flex-col gap-2">
                {clinicData.services
                  .filter(s => s.id === formData.doctorId || !formData.doctorId)
                  .map(svc => (
                    <button
                      key={svc.id}
                      onClick={() => selectService(svc)}
                      className={`flex flex-col gap-1 rounded-xl border p-3 text-left transition hover:scale-[1.01] cursor-pointer ${
                        formData.serviceId === svc.id
                          ? 'border-indigo-400 bg-indigo-50/40 dark:border-indigo-500/30 dark:bg-indigo-500/10'
                          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-navy-950/60 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-slate-850 dark:text-white">{svc.name}</span>
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                          {svc.price}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
                        {svc.desc}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-400 mt-1 font-semibold uppercase">
                        <Clock size={10} className="text-slate-400" />
                        Duration: {svc.duration}
                      </div>
                    </button>
                  ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: CHOOSE DATE */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="text-center max-w-sm mx-auto mb-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Choose Departure Date</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Select a travel date for your consultation.</p>
              </div>

              {/* Airline style rolling date select */}
              <div className="grid grid-cols-3 gap-2 py-1">
                {rollingDates.map((d, i) => (
                  <button
                    key={d.fullDate}
                    onClick={() => handleInput('date', d.fullDate)}
                    className={`rounded-2xl border p-2.5 flex flex-col items-center gap-0.5 transition hover:scale-[1.02] cursor-pointer ${
                      formData.date === d.fullDate
                        ? 'border-indigo-500 bg-indigo-500 text-white shadow-md shadow-indigo-500/25 dark:border-indigo-500'
                        : 'border-slate-200 bg-white hover:border-slate-350 text-slate-700 dark:border-slate-850 dark:bg-navy-950/60 dark:text-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className={`text-[8px] font-mono uppercase tracking-wider ${formData.date === d.fullDate ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {d.dayName}
                    </span>
                    <span className="text-lg font-black tracking-tight leading-none">
                      {d.dayNum}
                    </span>
                    <span className={`text-[8px] font-semibold uppercase ${formData.date === d.fullDate ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {d.monthName}
                    </span>
                    <span className={`text-[7px] font-bold px-1 rounded mt-1.5 ${
                      formData.date === d.fullDate
                        ? 'bg-white/20 text-white'
                        : d.status === 'Fast Booking'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400'
                    }`}>
                      {d.status}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: CHOOSE TIME */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="text-center max-w-sm mx-auto mb-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Choose Time Slot</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Select a boarding time for your check-in.</p>
              </div>

              <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                {Object.entries(timeCategories).map(([cat, slots]) => (
                  <div key={cat} className="space-y-1">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                      {cat} Slots
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {slots.map(t => (
                        <button
                          key={t}
                          onClick={() => handleInput('time', t)}
                          className={`rounded-full px-3.5 py-1.5 text-center text-[10px] font-bold transition hover:scale-105 cursor-pointer ${
                            formData.time === t
                              ? 'bg-indigo-600 text-white shadow shadow-indigo-600/20'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-navy-950/60 dark:text-slate-300 dark:hover:bg-slate-800'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5: PATIENT DETAILS */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <div className="text-center max-w-sm mx-auto mb-1">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Patient Information</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Verify your details to issue the booking request pass.</p>
              </div>

              <div className="space-y-1.5 text-[11px]">
                {/* Name */}
                <div className="relative">
                  <User size={13} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => handleInput('name', e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-xl border border-slate-250 bg-white/70 py-2 pl-8 pr-3 text-[11px] outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-navy-950 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Phone */}
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => handleInput('phone', e.target.value)}
                      placeholder="Phone Number"
                      className="w-full rounded-xl border border-slate-250 bg-white/70 py-2 pl-8 pr-3 text-[11px] outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-navy-950 dark:text-white"
                    />
                  </div>
                  {/* Email */}
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => handleInput('email', e.target.value)}
                      placeholder="Email Address"
                      className="w-full rounded-xl border border-slate-250 bg-white/70 py-2 pl-8 pr-3 text-[11px] outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-navy-950 dark:text-white"
                    />
                  </div>
                </div>

                {/* Reason */}
                <div className="relative">
                  <Clipboard size={13} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={e => handleInput('reason', e.target.value)}
                    placeholder="Reason for Visit (Optional)"
                    className="w-full rounded-xl border border-slate-250 bg-white/70 py-2 pl-8 pr-3 text-[11px] outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-navy-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Summary Stub */}
              <div className="rounded-xl border border-dashed border-indigo-200/80 bg-indigo-50/30 p-2.5 text-[9px] text-slate-600 dark:border-indigo-950/40 dark:bg-indigo-950/10 dark:text-slate-400 grid grid-cols-2 gap-x-2 gap-y-1">
                <div>Doctor: <span className="font-bold text-slate-800 dark:text-white">{formData.doctorName}</span></div>
                <div>Date: <span className="font-bold text-slate-800 dark:text-white">{formData.date}</span></div>
                <div className="col-span-2">Service: <span className="font-bold text-slate-800 dark:text-white">{formData.serviceName} ({formData.servicePrice})</span></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3 dark:border-slate-800/80">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-450 hover:text-slate-800 transition disabled:opacity-20 dark:hover:text-white"
          >
            <ArrowLeft size={12} />
            Back
          </button>

          <div className="flex items-center gap-1.5">
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 text-white font-bold text-[11px] px-4 py-2 hover:bg-slate-700 active:scale-95 transition disabled:opacity-30 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Continue
                <ArrowRight size={12} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="flex items-center gap-1 rounded-xl bg-indigo-650 text-white font-bold text-[11px] px-4 py-2 hover:bg-indigo-700 active:scale-95 transition disabled:opacity-30 shadow shadow-indigo-650/20"
              >
                <Check size={12} />
                Confirm Boarding
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
