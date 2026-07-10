import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, Moon, Sun, ChevronDown } from 'lucide-react';

export default function Header({ language, changeLanguage, soundEnabled, toggleSound, onReset }) {
  const languages = [
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'af', label: 'AF', full: 'Afrikaans' },
    { code: 'zu', label: 'ZU', full: 'isiZulu' },
  ];

  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('aura_theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  // Apply theme on mount and changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aura_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aura_theme', 'light');
    }
  }, [darkMode]);

  // Scroll detection for header shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close lang dropdown when clicking outside
  useEffect(() => {
    if (!langOpen) return;
    const close = () => setLangOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [langOpen]);

  const toggleDark = () => setDarkMode(p => !p);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_0_0_#E8EBF0] dark:bg-navy-900/90 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.04)]'
          : 'bg-transparent backdrop-blur-md'
      }`}
    >
      {/* Demo banner */}
      <div className="flex w-full items-center justify-center gap-2 bg-emerald-500/10 border-b border-emerald-500/10 px-4 py-1.5 dark:bg-emerald-500/5 dark:border-emerald-500/10">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-breathe" />
        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide">
          Interactive Product Preview · Aura Tech Intelligence
        </span>
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 h-16">

        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          {/* Logo mark */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-white overflow-hidden shadow-sm">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2L17 6V14L10 18L3 14V6L10 2Z"
                className="fill-emerald-400 dark:fill-emerald-500"
              />
              <path
                d="M10 5L14.5 7.5V12.5L10 15L5.5 12.5V7.5L10 5Z"
                className="fill-white dark:fill-slate-900"
                fillOpacity="0.15"
              />
            </svg>
          </div>

          {/* Brand text */}
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
              Aura Reception
              <span className="align-super text-[9px] font-normal text-slate-400 dark:text-slate-500 ml-0.5">™</span>
            </span>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wide">
              by Aura Tech Intelligence
            </span>
          </div>
        </a>

        {/* Right controls */}
        <div className="flex items-center gap-2">

          {/* Language picker */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setLangOpen(p => !p); }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-white/8 dark:bg-white/4 dark:text-slate-300 dark:hover:bg-white/6"
            >
              <span className="font-mono">{currentLang.label}</span>
              <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {langOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-white/8 dark:bg-navy-850"
                onClick={e => e.stopPropagation()}
              >
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { changeLanguage(lang.code); setLangOpen(false); }}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-xs transition ${
                      language === lang.code
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="font-mono font-bold w-5">{lang.label}</span>
                    <span>{lang.full}</span>
                    {language === lang.code && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-slate-200 dark:bg-white/8" />

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 dark:border-white/8 dark:bg-white/4 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-white"
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 dark:border-white/8 dark:bg-white/4 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-white"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            title="Reset demo"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 dark:border-white/8 dark:bg-white/4 dark:text-slate-400 dark:hover:bg-white/6 dark:hover:text-white"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
