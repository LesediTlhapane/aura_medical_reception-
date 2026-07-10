import React, { useRef, useEffect, useState } from 'react';
import BookingWizard from './BookingWizard';
import ConfirmationCard from './ConfirmationCard';
import QuickActions from './QuickActions';
import { Send, Bot, User, ShieldCheck, Sparkles } from 'lucide-react';

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
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendPatientMessage(inputText);
    setInputText('');
    inputRef.current?.focus();
  };

  const handleQuickAction = (query) => {
    sendPatientMessage(query);
  };

  const renderMessageContent = (msg) => {
    if (msg.type === 'wizard') {
      return (
        <div className="my-1 w-full">
          <BookingWizard
            preselectedSpecialist={msg.payload}
            onComplete={completeBooking}
            onCancel={onCancelBooking}
          />
        </div>
      );
    }

    if (msg.type === 'receipt') {
      return (
        <div className="my-1 print-card w-full">
          <ConfirmationCard booking={msg.payload} />
        </div>
      );
    }

    // Render markdown-style bold + line breaks
    const formattedText = msg.text.split('\n').map((paragraph, index) => {
      const regex = /\*\*(.*?)\*\*/g;
      const parts = paragraph.split(regex);
      if (!paragraph.trim()) return <br key={index} />;
      return (
        <p key={index} className={index > 0 ? 'mt-1.5' : ''}>
          {parts.map((part, i) =>
            i % 2 === 1
              ? <strong key={i} className="font-semibold">{part}</strong>
              : part
          )}
        </p>
      );
    });

    return <div className="text-[13px] leading-relaxed">{formattedText}</div>;
  };

  const isAIMessage = (msg) => msg.sender === 'ai';

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden dark:border-white/5 dark:bg-navy-850" style={{ height: '640px' }}>

      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-3.5 dark:border-white/5 dark:bg-navy-900/60">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-white shadow-sm">
              <Sparkles size={15} className="text-emerald-400 dark:text-emerald-500" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-white bg-emerald-500 dark:border-navy-900">
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Aura</span>
              <span className="badge badge-emerald text-[10px] py-0.5 px-2">AI Receptionist</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Sunrise Medical Centre · Online</p>
          </div>
        </div>

        {/* Status tags */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            <ShieldCheck size={12} className="text-emerald-500" />
            POPIA Compliant
          </span>
        </div>
      </div>

      {/* Message feed */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 bg-slate-50/40 dark:bg-navy-950/40">
        {messages.map((msg) => {
          const isAI = isAIMessage(msg);
          if (msg.text === 'inline-wizard-trigger') return null;

          const isCard = msg.type === 'wizard' || msg.type === 'receipt';

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isAI ? 'justify-start msg-ai' : 'justify-end msg-patient'} ${isCard ? 'flex-col items-start' : ''}`}
            >
              {/* AI avatar */}
              {isAI && !isCard && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm dark:bg-white mb-0.5">
                  <Bot size={13} className="text-emerald-400 dark:text-emerald-500" />
                </div>
              )}

              {/* Full-width card messages */}
              {isCard ? (
                <div className="w-full">
                  {renderMessageContent(msg)}
                </div>
              ) : (
                <div className="flex flex-col" style={{ maxWidth: isCard ? '100%' : '82%' }}>
                  {/* Message bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      isAI
                        ? 'rounded-bl-sm bg-white border border-slate-200/80 text-slate-800 dark:bg-navy-850 dark:border-white/5 dark:text-slate-200'
                        : 'rounded-br-sm bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    }`}
                  >
                    {renderMessageContent(msg)}
                  </div>

                  {/* Timestamp */}
                  <span className={`text-[10px] text-slate-400 mt-1 px-1 ${!isAI ? 'text-right' : ''}`}>
                    {msg.timestamp}
                  </span>
                </div>
              )}

              {/* Patient avatar */}
              {!isAI && !isCard && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-700 mb-0.5">
                  <User size={13} className="text-slate-600 dark:text-slate-300" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2.5 msg-ai">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm dark:bg-white mb-0.5">
              <Bot size={13} className="text-emerald-400 dark:text-emerald-500" />
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-white border border-slate-200/80 px-4 py-3.5 shadow-sm dark:bg-navy-850 dark:border-white/5">
              <div className="flex items-center gap-1.5">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick action chips */}
      <div className="border-t border-slate-100 bg-white/80 dark:border-white/5 dark:bg-navy-900/60 px-4">
        <QuickActions onAction={handleQuickAction} isBookingActive={isBookingActive} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-slate-100 bg-white p-3 dark:border-white/5 dark:bg-navy-900"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isBookingActive
              ? 'Booking form is active above…'
              : 'Ask Aura a question — e.g. "Do you accept Discovery?"'
          }
          disabled={isBookingActive}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 disabled:opacity-40 dark:border-white/8 dark:bg-white/4 dark:text-white dark:placeholder-slate-500 dark:focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isBookingActive}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition hover:bg-slate-700 active:scale-95 disabled:opacity-30 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          <Send size={15} />
        </button>
      </form>

      {/* Compliance footer */}
      <div className="flex items-center justify-center gap-1.5 border-t border-slate-100/60 bg-slate-50/80 py-1.5 dark:border-white/4 dark:bg-navy-950/60">
        <ShieldCheck size={11} className="text-emerald-500" />
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide dark:text-slate-600">
          POPIA & HIPAA · End-to-End Encrypted · Aura Tech Intelligence
        </span>
      </div>
    </div>
  );
}
