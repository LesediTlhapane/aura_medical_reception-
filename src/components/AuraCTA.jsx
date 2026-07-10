import React, { useState } from 'react';
import { Mail, Phone, Calendar, Check, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuraCTA({ modalOpen: controlledModalOpen, setModalOpen: controlledSetModalOpen }) {
  const [localModalOpen, localSetModalOpen] = useState(false);
  const modalOpen = controlledModalOpen !== undefined ? controlledModalOpen : localModalOpen;
  const setModalOpen = controlledSetModalOpen !== undefined ? controlledSetModalOpen : localSetModalOpen;
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    clinic: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API delivery
    setSubmitted(true);
    setTimeout(() => {
      // Keep open for a bit
    }, 2000);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSubmitted(false);
    setFormData({ name: '', clinic: '', email: '', phone: '', notes: '' });
  };

  return (
    <>
      <section className="rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-8 text-center text-white my-8 shadow-xl relative overflow-hidden dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        
        {/* Abstract background vector glow */}
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="absolute left-10 bottom-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl"></div>

        <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-emerald-400 backdrop-blur-sm">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">
              Ready to automate your practice front desk?
            </h3>
            <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
              Book a <strong>FREE 30-Minute AI Readiness Consultation</strong> with the Aura Tech team. We will analyze your patient flows and outline a deployment roadmap.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-2 rounded-xl bg-white px-6 py-3 text-xs font-bold text-slate-905 transition hover:bg-slate-100 hover:scale-105 active:scale-95 shadow-md shadow-slate-900/40 select-none cursor-pointer"
          >
            Schedule Free Strategy Call
          </button>
        </div>
      </section>

      {/* Strategy Call Consultation Booking Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 select-none"
            >
              {/* Close pin */}
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>

              {/* Submitting Flow */}
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Bot className="text-emerald-500" size={18} />
                      AI Strategy Call Consultation
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Provide your details and we will coordinate a calendar link for your practice.
                    </p>
                  </div>

                  {/* Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-450 uppercase">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g. Dr. Lerato Khumalo"
                      className="rounded-lg border border-slate-200 p-2.5 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  {/* Practice Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-450 uppercase">Medical Practice Name</label>
                    <input
                      type="text"
                      required
                      value={formData.clinic}
                      onChange={(e) => handleInputChange('clinic', e.target.value)}
                      placeholder="e.g. Khumalo Dental Clinic"
                      className="rounded-lg border border-slate-200 p-2.5 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  {/* Email & Phone grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-450 uppercase">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="e.g. doctor@khumalodental.co.za"
                        className="rounded-lg border border-slate-200 p-2.5 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-955 dark:text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-450 uppercase">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="e.g. 011 482 1092"
                        className="rounded-lg border border-slate-200 p-2.5 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-955 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Custom notes */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-450 uppercase">Practice Requirements (Optional)</label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Specify your practice systems (e.g. Healthbridge) or special triage rules..."
                      className="rounded-lg border border-slate-200 p-2.5 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-955 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    Send Strategy Call Request
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 text-center py-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                    <Check size={24} strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Consultation Request Received</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                      Thank you, <strong className="text-slate-900 dark:text-white">{formData.name}</strong>. The Aura Tech Intelligence team has logged your interest for <strong className="text-slate-900 dark:text-white">{formData.clinic}</strong>.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-2">
                      An advisor will contact you at <strong>{formData.email}</strong> shortly to coordinate the meeting.
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="mt-2 rounded-lg border border-slate-250 px-5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
