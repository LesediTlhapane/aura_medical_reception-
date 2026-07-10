import React, { useRef, useEffect, useState } from 'react';
import BookingWizard from './BookingWizard';
import ConfirmationCard from './ConfirmationCard';
import QuickActions from './QuickActions';
import { Send, Bot, User, ShieldCheck, Sparkles, Clock, Calendar, Check, AlertTriangle, Building, HeartHandshake, Phone, Stethoscope, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWindow({
  messages,
  language,
  isTyping,
  sendPatientMessage,
  isBookingActive,
  startBooking,
  completeBooking,
  onCancelBooking
}) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    });
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendPatientMessage(inputText);
    setInputText('');
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 50);
  };

  const handleQuickAction = (query) => {
    sendPatientMessage(query);
  };

  // Determine if clinic is currently open (dynamic check)
  const isClinicOpen = () => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 6 is Saturday
    const hour = now.getHours();
    
    if (day === 0) return false; // Closed Sunday
    if (day === 6) return hour >= 8 && hour < 13; // Saturday 8-13
    return hour >= 8 && hour < 17; // Weekdays 8-17
  };

  const clinicOpen = isClinicOpen();

  // Dynamic Emergency status
  const isEmergency = messages.some(m => m.type === 'emergency');

  const renderFormattedText = (text) => {
    if (!text) return null;
    return text.split('\n').map((paragraph, index) => {
      const regex = /\*\*(.*?)\*\*/g;
      const parts = paragraph.split(regex);
      if (!paragraph.trim()) return <br key={index} />;
      return (
        <p key={index} className={index > 0 ? 'mt-1.5' : ''}>
          {parts.map((part, i) =>
            i % 2 === 1
              ? <strong key={i} className="font-semibold text-slate-900 dark:text-white">{part}</strong>
              : part
          )}
        </p>
      );
    });
  };

  const renderMessageContent = (msg) => {
    // 1. Wizard Render
    if (msg.type === 'wizard') {
      return (
        <div className="my-1.5 w-full booking-wizard-container">
          <BookingWizard
            preselectedSpecialist={msg.payload}
            onComplete={completeBooking}
            onCancel={onCancelBooking}
          />
        </div>
      );
    }

    // 2. Receipt Render
    if (msg.type === 'receipt') {
      return (
        <div className="my-1.5 print-card w-full">
          <ConfirmationCard booking={msg.payload} />
        </div>
      );
    }

    // 3. Emergency Render (Flashing card intercept)
    if (msg.type === 'emergency' || msg.isEmergency) {
      return (
        <div className="w-full my-2 animate-bounce">
          <div className="rounded-2xl border-2 border-red-500 bg-red-50/90 p-5 shadow-lg dark:bg-red-950/20 dark:border-red-600">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white animate-pulse">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-red-800 dark:text-red-400 uppercase tracking-wide">
                  CRITICAL INTERCEPT: EMERGENCY AREA
                </h4>
                <p className="text-xs text-red-700 dark:text-red-300 mt-2 leading-relaxed font-semibold">
                  This query relates to high-risk clinical symptoms (e.g. chest tightness, breathing difficulties, stroke signs, or severe blood loss). 
                </p>
                <p className="text-[11px] text-red-600 dark:text-red-400/80 mt-1.5">
                  Do not continue scheduling or wait for call backs. Please reach out immediately to emergency rooms:
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="tel:0123456911"
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white text-xs font-black py-3 hover:bg-red-700 active:scale-[0.98] transition shadow shadow-red-600/20"
              >
                <Phone size={14} />
                Call Clinic Emergency: 012-345-6911
              </a>
              <a
                href="tel:082911"
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white text-xs font-black py-3 hover:bg-slate-800 active:scale-[0.98] transition dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                <Phone size={14} />
                Call Netcare 911 / ER24
              </a>
            </div>
            
            <p className="text-[9px] text-red-500/70 text-center mt-3 font-mono">
              Aura Reception has locked input controls. Please seek immediate physical care.
            </p>
          </div>
        </div>
      );
    }

    // 4. Standard text
    return <div className="text-[14px] leading-relaxed text-slate-700 dark:text-slate-300">{renderFormattedText(msg.text)}</div>;
  };

  const isAIMessage = (msg) => msg.sender === 'ai';

  // Welcome Screen Quick Action Cards
  const welcomeCards = [
    { label: "Book Appointment", query: "I need to book an appointment", icon: <Calendar size={16} className="text-indigo-500" />, desc: "Schedule a specialist visit" },
    { label: "Find a Doctor", query: "Which doctors are available?", icon: <User size={16} className="text-sky-500" />, desc: "Check specialist availability" },
    { label: "Consultation Fees", query: "What are your services and fees?", icon: <Stethoscope size={16} className="text-emerald-500" />, desc: "GP, Dentist, & rates list" },
    { label: "Medical Aid Info", query: "Which medical aids do you accept?", icon: <HeartHandshake size={16} className="text-teal-500" />, desc: "Discovery, Bonitas, & more" },
    { label: "Clinic Hours", query: "What are your opening hours?", icon: <Clock size={16} className="text-amber-500" />, desc: "Check weekday/saturday times" },
    { label: "Emergency Help", query: "Emergency chest pain, help!", icon: <AlertTriangle size={16} className="text-rose-500" />, desc: "Call local emergency lines" }
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-lg overflow-hidden dark:border-slate-800 dark:bg-navy-900/90" style={{ minHeight: '560px', height: 'clamp(560px, 76vh, 760px)' }}>

      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white/90 px-5 py-3.5 dark:border-slate-800/80 dark:bg-navy-950/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-500 text-white shadow shadow-indigo-500/10">
              <Bot size={18} />
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-white dark:border-navy-900 ${
              clinicOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-850 dark:text-white">Aura</span>
              <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-wider py-0.5 px-2">
                Digital Employee
              </span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              {clinicOpen ? 'Online · Responsive 24/7' : 'After-hours triage active'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>POPIA COMPLIANT</span>
        </div>
      </div>

      {/* Message Feed Container */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-slate-50/40 dark:bg-navy-950/20">
        {messages.length === 0 ? (
          // Gorgeous welcome panel on empty chat
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-4 space-y-5"
          >
            {/* Logo Placeholder */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-sky-400 text-white shadow-lg animate-float">
              <Building size={28} />
            </div>

            <div>
              <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                Sunrise Medical Centre
              </h3>
              <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mt-0.5">
                AI Front-Desk Assistant
              </p>
            </div>

            {/* Badges Strip */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${
                clinicOpen 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                  : 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${clinicOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {clinicOpen ? 'Practice is Open' : 'Practice is Closed'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 text-[10px] font-bold dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
                <Calendar size={10} />
                Next Appointment: Today, 14:15
              </span>
            </div>

            {/* Explainer */}
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Hello! I'm <strong>Aura</strong>, the practice digital assistant. I support our front desk by answering questions instantly and capturing appointment requests.
            </p>

            {/* Quick Action Grid */}
            <div className="w-full max-w-md pt-2">
              <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase block mb-3 text-left">
                Select a service to start:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {welcomeCards.map((card, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(card.query)}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md hover:border-slate-350 active:scale-95 dark:border-slate-800 dark:bg-navy-950/60 dark:hover:border-slate-700 cursor-pointer"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-navy-900">
                      {card.icon}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-slate-800 dark:text-white truncate block">{card.label}</span>
                      <p className="text-[9px] text-slate-450 dark:text-slate-500 truncate block mt-0.5">{card.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          // Standard Message List
          messages.map((msg) => {
            if (msg.text === 'inline-wizard-trigger') {
              return renderMessageContent(msg);
            }
            
            const isAI = isAIMessage(msg);
            const isCard = msg.type === 'wizard' || msg.type === 'receipt' || msg.type === 'emergency';

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 ${isAI ? 'justify-start msg-ai' : 'justify-end msg-patient'} ${isCard ? 'flex-col items-start w-full' : ''}`}
              >
                {/* AI Avatar */}
                {isAI && !isCard && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm dark:bg-white mb-0.5">
                    <Bot size={13} className="text-emerald-400 dark:text-emerald-500" />
                  </div>
                )}

                {/* Card Messages */}
                {isCard ? (
                  <div className="w-full max-w-full">
                    {renderMessageContent(msg)}
                  </div>
                ) : (
                  // Text bubbles with glassmorphic styles
                  <div className="flex flex-col" style={{ maxWidth: '86%' }}>
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm text-sm ${
                        isAI
                          ? 'rounded-bl-none bg-white border border-slate-200 text-slate-800 dark:bg-navy-850 dark:border-slate-800 dark:text-slate-200'
                          : 'rounded-br-none bg-indigo-600 text-white shadow shadow-indigo-600/10 dark:bg-indigo-650'
                      }`}
                    >
                      {renderMessageContent(msg)}
                    </div>
                    <div className={`flex items-center gap-1 text-[9px] text-slate-400 mt-1 px-1 ${!isAI ? 'justify-end' : 'justify-start'}`}>
                      <span>{msg.timestamp}</span>
                      {!isAI && (
                        <div className="flex items-center text-blue-500">
                          <Check size={8} />
                          <Check size={8} className="-ml-0.5" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Patient Avatar */}
                {!isAI && !isCard && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 dark:bg-navy-800 dark:border-slate-700 mb-0.5">
                    <User size={13} className="text-slate-655 dark:text-slate-400" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2.5 msg-ai">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm dark:bg-white mb-0.5">
              <Bot size={13} className="text-emerald-400 dark:text-emerald-500" />
            </div>
            <div className="rounded-2xl rounded-bl-none bg-white border border-slate-200 px-4 py-3.5 shadow-sm dark:bg-navy-850 dark:border-slate-800">
              <div className="flex items-center gap-1">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length > 0 && !isEmergency && (
        <div className="border-t border-slate-100 bg-white/90 dark:border-slate-800/60 dark:bg-navy-900/60 px-4">
          <QuickActions onAction={handleQuickAction} isBookingActive={isBookingActive} />
        </div>
      )}

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-slate-100 bg-white p-3 dark:border-slate-800/80 dark:bg-navy-950"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isEmergency
              ? 'Emergency Intercept Active. Call 012-345-6911 immediately.'
              : isBookingActive
              ? 'Please fill in details in the form card above…'
              : 'Ask Aura — e.g., "What are GP fees?" or "My tooth hurts"'
          }
          disabled={isBookingActive || isEmergency}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-850 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 disabled:opacity-40 dark:border-slate-800 dark:bg-navy-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isBookingActive || isEmergency}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition hover:bg-slate-700 active:scale-95 disabled:opacity-30 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 cursor-pointer"
        >
          <Send size={14} />
        </button>
      </form>

      {/* Security compliance footer */}
      <div className="flex items-center justify-center gap-1.5 border-t border-slate-100/60 bg-slate-50/80 py-2 dark:border-slate-800/60 dark:bg-navy-950/60">
        <ShieldCheck size={12} className="text-emerald-500" />
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest dark:text-slate-500">
          POPIA Compliant · 256-bit Encryption · Aura Tech Intelligence
        </span>
      </div>
    </div>
  );
}