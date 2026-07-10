import React, { useState } from 'react';
import { Calendar, User, UserCheck, Check, Phone, Mail, Award, ArrowUpRight, Barcode, CalendarPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmationCard({ booking }) {
  const [scheduledCall, setScheduledCall] = useState(false);
  const [strategyForm, setStrategyForm] = useState({ name: '', email: '', clinicName: '' });
  const [submittingCall, setSubmittingCall] = useState(false);
  const [showCallForm, setShowCallForm] = useState(false);

  if (!booking) return null;

  const handleStrategySubmit = (e) => {
    e.preventDefault();
    setSubmittingCall(true);
    setTimeout(() => {
      setSubmittingCall(false);
      setScheduledCall(true);
    }, 1200);
  };

  // Generate CSS-based visual barcodes
  const barcodeLines = Array.from({ length: 42 }, () => Math.floor(Math.random() * 3) + 1);

  return (
    <div className="w-full max-w-md mx-auto my-4 select-none">
      {/* Boarding Pass Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden dark:bg-navy-900 dark:border-slate-800"
      >
        {/* Top Header - Airline Style */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm text-emerald-300 font-bold text-sm">
                A
              </div>
              <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-sky-200">
                Aura Boarding Pass
              </span>
            </div>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-300 tracking-wider">
              REQUEST FILED
            </span>
          </div>
          
          <div className="mt-4 flex justify-between items-end">
            <div>
              <p className="text-[9px] text-sky-200/80 uppercase tracking-wider font-mono">Carrier</p>
              <h4 className="text-sm font-black tracking-tight font-sans text-white">SUNRISE MEDICAL</h4>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-sky-200/80 uppercase tracking-wider font-mono">Flight Ref</p>
              <h4 className="text-sm font-mono font-bold text-white">{booking.id}</h4>
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 bg-white dark:bg-navy-900">
          
          {/* Main Info Columns */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-b border-dashed border-slate-200 pb-5 dark:border-slate-800">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">Patient Name</span>
              <p className="text-xs font-extrabold text-slate-850 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                <User size={13} className="text-indigo-500" />
                {booking.name}
              </p>
            </div>
            
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">Specialist</span>
              <p className="text-xs font-extrabold text-slate-850 dark:text-slate-100 flex items-center gap-1.5 mt-0.5 truncate">
                <UserCheck size={13} className="text-indigo-500" />
                {booking.doctor}
              </p>
            </div>

            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">Service Class</span>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-350 truncate mt-0.5">
                {booking.service}
              </p>
            </div>

            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">Estimated Fare</span>
              <p className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {booking.price || 'R650'} (Claims Accepted)
              </p>
            </div>

            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">Date</span>
              <p className="text-xs font-extrabold text-slate-850 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                <Calendar size={13} className="text-sky-500" />
                {booking.date}
              </p>
            </div>

            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">Boarding Time</span>
              <p className="text-xs font-extrabold text-slate-850 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {booking.time}
              </p>
            </div>
          </div>

          {/* Ticket Bottom Stub */}
          <div className="pt-5 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400">Security Gate</span>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Room 3, Wing A</span>
            </div>
            
            {/* Visual Barcode Illustration */}
            <div className="flex flex-col items-center">
              <div className="flex items-end h-8 gap-[1px]">
                {barcodeLines.map((w, i) => (
                  <div 
                    key={i} 
                    className="bg-slate-900 dark:bg-white h-full"
                    style={{ width: `${w}px`, opacity: i % 7 === 0 ? 0.3 : 1 }}
                  />
                ))}
              </div>
              <span className="text-[7px] font-mono text-slate-400 tracking-[0.2em] mt-1">
                {booking.id}-SECURE
              </span>
            </div>
          </div>

        </div>

        {/* Boarding Pass Tear Divider */}
        <div className="relative h-4 bg-slate-50 dark:bg-navy-950 flex items-center">
          <div className="absolute -left-2 w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800" />
          <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-800" />
          <div className="absolute -right-2 w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800" />
        </div>

        {/* Marketing / ROI psychology footnote */}
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-150 dark:bg-navy-950/20 dark:border-slate-850">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center leading-relaxed italic">
             ✨ <strong>This appointment would normally require a phone call.</strong><br />
             Aura Reception saved <strong>6 minutes</strong> of administrative staff time.
          </p>
        </div>

        {/* Conversion CTA Block */}
        <div className="p-6 bg-slate-50 dark:bg-navy-950">
          <div className="text-center mb-4">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              "Imagine every patient interaction being this simple."
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!showCallForm && !scheduledCall && (
              <motion.button
                key="btn"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setShowCallForm(true)}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs py-3 px-4 shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CalendarPlus size={14} />
                Book a FREE AI Strategy Call
                <ArrowUpRight size={13} />
              </motion.button>
            )}

            {showCallForm && !scheduledCall && (
              <motion.form
                key="form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleStrategySubmit}
                className="flex flex-col gap-2.5"
              >
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={strategyForm.name}
                    onChange={(e) => setStrategyForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your Name"
                    className="rounded-lg border border-slate-200 bg-white p-2 text-[11px] outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-navy-900 dark:text-white"
                  />
                  <input
                    type="text"
                    required
                    value={strategyForm.clinicName}
                    onChange={(e) => setStrategyForm(prev => ({ ...prev, clinicName: e.target.value }))}
                    placeholder="Practice Name"
                    className="rounded-lg border border-slate-200 bg-white p-2 text-[11px] outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-navy-900 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={strategyForm.email}
                    onChange={(e) => setStrategyForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email Address"
                    className="flex-1 rounded-lg border border-slate-200 bg-white p-2 text-[11px] outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-navy-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={submittingCall}
                    className="rounded-lg bg-indigo-600 text-white font-bold text-[11px] px-3 py-2 hover:bg-indigo-700 disabled:opacity-40"
                  >
                    {submittingCall ? 'Loading...' : 'Schedule'}
                  </button>
                </div>
              </motion.form>
            )}

            {scheduledCall && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-emerald-200 bg-emerald-500/10 p-3 text-center flex flex-col items-center gap-1.5 dark:border-emerald-500/20"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
                    Strategy Call Request Logged!
                  </p>
                  <p className="text-[9px] text-emerald-700/80 dark:text-emerald-500/70 mt-0.5">
                    We will send a scheduling link to <strong>{strategyForm.email}</strong> shortly.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-[9px] text-slate-400 text-center mt-3 font-semibold uppercase tracking-wider dark:text-slate-650">
            Developed by Aura Tech Intelligence
          </p>
        </div>
      </motion.div>
    </div>
  );
}
