import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import TrustSection from './components/TrustSection';
import ClinicProfile from './components/ClinicProfile';
import ImpactDashboard from './components/ImpactDashboard';
import ChatWindow from './components/ChatWindow';
import BottomValueProp from './components/BottomValueProp';
import AuraCTA from './components/AuraCTA';
import { useChatSession } from './hooks/useChatSession';
import { LayoutDashboard, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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

  // Mode state for the Left Pane: 'owner' (ROI Analytics/Dashboard) or 'patient' (Clinic Profile)
  // Set default to 'owner' so clinic owners immediately see the ROI stats updating!
  const [leftPaneMode, setLeftPaneMode] = useState('owner');
  
  // Strategy call modal state shared with Hero Section
  const [strategyModalOpen, setStrategyModalOpen] = useState(false);

  // Triggered when a quick chip or text query is submitted
  const handlePatientQuery = (text) => {
    sendPatientMessage(text);
  };

  const handleCancelBooking = () => {
    cancelBooking();
  };

  return (
    <div className="app-shell min-h-screen transition duration-300 font-sans pb-16">
      {/* Top Navigation */}
      <Header
        language={language}
        changeLanguage={changeLanguage}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        onReset={resetChat}
      />

      {/* Hero Section Landing Page */}
      <HeroSection 
        onStartDemo={() => {
          document.getElementById('live-demo-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onBookCall={() => setStrategyModalOpen(true)}
      />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Trust Compliance Section */}
      <TrustSection />

      {/* LIVE DEMO WORKSPACE CONSOLE */}
      <section 
        id="live-demo-section" 
        className="mx-auto max-w-7xl px-4 sm:px-6 py-16 scroll-mt-20"
      >
        {/* Section Title */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
            <Sparkles size={11} className="text-indigo-500" />
            Interactive Simulation Workspace
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">
            Experience Aura Reception™ Live
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
            Act as a patient in the chat console on the right (e.g. ask about fees, book a dentist, or trigger an emergency). Watch the live ROI dashboard on the left update in real time.
          </p>
        </div>

        {/* Demo Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Clinic Profiles / Impact Dashboards (Width: 5/12) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* View Mode Toggle Pill - Apple Style */}
            <div className="flex items-center justify-between rounded-xl bg-slate-200/50 p-1 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-850">
              <button
                onClick={() => setLeftPaneMode('owner')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                  leftPaneMode === 'owner'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                    : 'text-slate-550 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <LayoutDashboard size={13} />
                <span>Practice Impact (Live ROI)</span>
              </button>
              <button
                onClick={() => setLeftPaneMode('patient')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                  leftPaneMode === 'patient'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                    : 'text-slate-550 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Users size={13} />
                <span>Patient Portal (Clinic Info)</span>
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
        <AuraCTA 
          modalOpen={strategyModalOpen} 
          setModalOpen={setStrategyModalOpen} 
        />
      </section>
    </div>
  );
}

export default App;