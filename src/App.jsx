import React, { useState } from 'react';
import Header from './components/Header';
import ClinicProfile from './components/ClinicProfile';
import ImpactDashboard from './components/ImpactDashboard';
import ChatWindow from './components/ChatWindow';
import BottomValueProp from './components/BottomValueProp';
import AuraCTA from './components/AuraCTA';
import { useChatSession } from './hooks/useChatSession';
import { LayoutDashboard, Users, MessageSquare, Bell, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const {
    messages,
    language,
    isTyping,
    soundEnabled,
    stats,
    isBookingActive,
    toggleSound,
    resetChat,
    changeLanguage,
    sendPatientMessage,
    startBooking,
    completeBooking,
    cancelBooking,
  } = useChatSession();

  // Mode state for the Left Pane: 'patient' (Clinic Profile) or 'owner' (ROI Analytics)
  const [leftPaneMode, setLeftPaneMode] = useState('patient');
  
  // Floating widget state
  const [floatingWidgetOpen, setFloatingWidgetOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  // Triggered when a quick chip or text query is submitted
  const handlePatientQuery = (text) => {
    sendPatientMessage(text);
  };

  const handleCancelBooking = () => {
    cancelBooking();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition duration-300 dark:bg-slate-950 dark:text-slate-100 pb-12">
      {/* Top Navigation */}
      <Header
        language={language}
        changeLanguage={changeLanguage}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        onReset={resetChat}
      />

      {/* Main Grid Vewport */}
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Clinic Profiles / Impact Dashboards (Width: 5/12) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* View Mode Toggle Pill */}
            <div className="flex items-center justify-between rounded-xl bg-slate-200/60 p-1 dark:bg-slate-850">
              <button
                onClick={() => setLeftPaneMode('patient')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
                  leftPaneMode === 'patient'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Users size={14} />
                <span>Patient Portal (Clinic Info)</span>
              </button>
              <button
                onClick={() => setLeftPaneMode('owner')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
                  leftPaneMode === 'owner'
                    ? 'bg-white text-slate-905 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <LayoutDashboard size={14} />
                <span>Practice Impact (Live ROI)</span>
              </button>
            </div>

            {/* Left Side Content Switcher */}
            <div className="transition duration-300">
              {leftPaneMode === 'patient' ? (
                <ClinicProfile />
              ) : (
                <ImpactDashboard stats={stats} />
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Receptionist Chat Interface (Width: 7/12) */}
          <div className="lg:col-span-7">
            <ChatWindow
              messages={messages}
              language={language}
              isTyping={isTyping}
              sendPatientMessage={handlePatientQuery}
              isBookingActive={isBookingActive}
              startBooking={startBooking}
              completeBooking={completeBooking}
              onCancelBooking={handleCancelBooking}
            />
          </div>

        </div>

        {/* Practice Value Propositions Feature Cards */}
        <BottomValueProp />

        {/* Call To Action Strategy Banner */}
        <AuraCTA />
      </main>

      {/* FLOATING SITE WIDGET DEMO (To simulate website integration) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
        
        {/* Minimized Float Button */}
        <button
          onClick={() => {
            setFloatingWidgetOpen(prev => !prev);
            setHasNotification(false);
          }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl hover:scale-105 active:scale-95 transition-all dark:bg-slate-100 dark:text-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer"
        >
          {floatingWidgetOpen ? <X size={24} /> : <MessageSquare size={24} />}
          
          {/* Dynamic notification badge */}
          {hasNotification && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              1
            </span>
          )}
        </button>

        {/* Floating Mini Widget Panel */}
        <AnimatePresence>
          {floatingWidgetOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="w-80 rounded-2xl border border-slate-250 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-w-sm"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                    <Bot size={14} className="text-emerald-400 dark:text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-850 dark:text-slate-100">Live Website Integration</span>
                    <p className="text-[9px] text-slate-400">Simulation Widget Mode</p>
                  </div>
                </div>
                <button
                  onClick={() => setFloatingWidgetOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                This is a mock-up of how the **Aura Tech Medical AI** is embedded directly onto your existing website.
              </p>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mt-2">
                Patients visiting your landing page can launch the chat console with a single click, automating bookings, and triaging requests instantly.
              </p>

              <button
                onClick={() => {
                  setFloatingWidgetOpen(false);
                  // Scroll to the main chat pane
                  document.querySelector('.lg\\:col-span-7')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-4 w-full rounded-lg bg-slate-900 py-2 text-center text-[10px] font-bold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 cursor-pointer"
              >
                Open Main Receptionist Screen
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default App;