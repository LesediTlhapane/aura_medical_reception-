import React from 'react';
import { Calendar, User, UserCheck, Printer, Download, Clock } from 'lucide-react';

export default function ConfirmationCard({ booking }) {
  if (!booking) return null;

  const handlePrint = () => {
    // Basic print setup: targets print window
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(booking, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `appointment-${booking.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-emerald-100 bg-emerald-50/10 p-5 shadow-md dark:border-emerald-950/20 dark:bg-emerald-950/5 select-none">
      
      {/* Stamp Header */}
      <div className="flex items-center justify-between border-b border-emerald-100/50 pb-3 mb-4 dark:border-emerald-950/30">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Sunrise Practice</span>
          <h4 className="m-0 text-sm font-extrabold text-slate-800 dark:text-slate-200">Request Confirmed</h4>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/50 dark:text-amber-400">
          Pending Confirmation
        </span>
      </div>

      {/* Details Box */}
      <div className="flex flex-col gap-3 text-xs">
        
        {/* Ref number */}
        <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2 dark:border-slate-800">
          <span className="text-slate-400">Booking Reference</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">{booking.id}</span>
        </div>

        {/* Patient Name */}
        <div className="flex items-start gap-2.5">
          <User size={14} className="mt-0.5 text-slate-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-450 uppercase">Patient Name</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{booking.name}</span>
          </div>
        </div>

        {/* Doctor and service */}
        <div className="flex items-start gap-2.5">
          <UserCheck size={14} className="mt-0.5 text-slate-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-450 uppercase">Specialist / Service</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{booking.doctor}</span>
            <span className="text-[10px] text-slate-400">{booking.service}</span>
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-start gap-2.5">
            <Calendar size={14} className="mt-0.5 text-slate-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-450 uppercase">Date Requested</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{booking.date}</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock size={14} className="mt-0.5 text-slate-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-450 uppercase">Time Requested</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{booking.time}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Trust Line */}
      <p className="text-[10px] text-slate-450 italic mt-4 text-center">
        *A receptionist will call or SMS you shortly to finalize your appointment details.*
      </p>

      {/* Confirmation Actions */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-emerald-100/50 dark:border-emerald-950/30">
        <button
          onClick={handlePrint}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Printer size={13} />
          <span>Print</span>
        </button>
        
        <button
          onClick={handleDownloadJSON}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Download size={13} />
          <span>JSON Payload</span>
        </button>
      </div>

    </div>
  );
}
