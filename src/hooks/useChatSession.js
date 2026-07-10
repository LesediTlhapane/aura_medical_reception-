import { useState, useEffect, useCallback } from 'react';
import { getResponse } from '../utils/aiEngine';
import { playChime } from '../utils/audio';

const LOCAL_STORAGE_KEY = 'aura_chat_session_state';

const initialMessages = (lang = 'en') => {
  const greetings = {
    en: [
      {
        id: "greet-1",
        sender: "ai",
        text: "Hello 👋 Welcome to **Sunrise Medical Centre**.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: "greet-2",
        sender: "ai",
        text: "I am **Aura**, your digital medical receptionist. I am here to help you:\n\n• 📅 **Book appointments** with our specialists\n• ❓ Answer **frequently asked questions**\n• 📍 Get **clinic directions and hours**\n• 💳 Verify **medical aid / rates** information\n\nHow may I assist you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    af: [
      {
        id: "greet-1",
        sender: "ai",
        text: "Goeiedag 👋 Welkom by **Sunrise Mediese Sentrum**.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: "greet-2",
        sender: "ai",
        text: "Ek is **Aura**, jou digitale mediese ontvangsdame. Ek kan jou help om:\n\n• 📅 **Afsprake te bespreek** met ons spesialiste\n• ❓ **Gereelde vrae** te beantwoord\n• 📍 **Kliniek aanwysings en ure** te vind\n• 💳 Inligting oor **mediese fondse / tariewe** te kry\n\nHoe kan ek jou vandag help?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    zu: [
      {
        id: "greet-1",
        sender: "ai",
        text: "Sawubona 👋 Siyakwamukela e-**Sunrise Medical Centre**.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: "greet-2",
        sender: "ai",
        text: "Ngingu-**Aura**, umamukeli wakho wezivakashi wedijithali. Ngilapha ukuzokusiza:\n\n• 📅 **Ukubhukha ama-aphoyintimenti** nochwepheshe bethu\n• ❓ Ukuphendula **imibuzo evame ukubuzwa**\n• 📍 Thola **izikhombisi-ndlela namahora omtholampilo**\n• 💳 Hlola imininingwane ye-**medical aid / rates**\n\nNgingakusiza ngani namuhla?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  };
  return greetings[lang] || greetings.en;
};

export const useChatSession = () => {
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState('en');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isBookingActive, setIsBookingActive] = useState(false);
  const [pendingBookingSpecialist, setPendingBookingSpecialist] = useState(null);
  
  // Dashboard & ROI statistics
  const [stats, setStats] = useState({
    patientsHelpedToday: 147,
    appointmentsRequested: 39,
    adminHoursSaved: 12.8,
    deflectionRate: 74,
    recentBookings: [
      { id: "SRM-2026-7712", name: "Sipho Dlamini", service: "General Practitioner", doctor: "Dr. Smith", date: "2026-07-13", time: "09:30", status: "Approved" },
      { id: "SRM-2026-3029", name: "Annelize Marais", service: "Dermatologist & Skin Care", doctor: "Dr. Williams", date: "2026-07-14", time: "11:00", status: "Approved" },
      { id: "SRM-2026-9812", name: "Johan Botha", service: "Dentist & Oral Health", doctor: "Dr. Patel", date: "2026-07-15", time: "14:15", status: "Approved" }
    ]
  });

  // Load state on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.messages || initialMessages(parsed.language || 'en'));
        setLanguage(parsed.language || 'en');
        setSoundEnabled(parsed.soundEnabled !== undefined ? parsed.soundEnabled : true);
        if (parsed.stats) setStats(parsed.stats);
        if (parsed.pendingBookingSpecialist) setPendingBookingSpecialist(parsed.pendingBookingSpecialist);
      } catch (e) {
        setMessages(initialMessages('en'));
      }
    } else {
      setMessages(initialMessages('en'));
    }
  }, []);

  // Save state on change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        messages,
        language,
        soundEnabled,
        stats,
        pendingBookingSpecialist
      }));
    }
  }, [messages, language, soundEnabled, stats, pendingBookingSpecialist]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  // Clean chat history
  const resetChat = useCallback(() => {
    const fresh = initialMessages(language);
    setMessages(fresh);
    setIsBookingActive(false);
    setPendingBookingSpecialist(null);
  }, [language]);

  // Handle language switch
  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    setMessages(initialMessages(lang));
    setIsBookingActive(false);
    setPendingBookingSpecialist(null);
  }, []);

  // Add message to feed
  const addMessage = useCallback((sender, text, type = 'text', payload = null) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      sender,
      text,
      timestamp: timeStr,
      type,
      payload
    };
    
    setMessages(prev => [...prev, newMsg]);

    // Play chime sound if AI is sending the message and sound is on
    if (sender === 'ai' && soundEnabled) {
      playChime();
    }
    
    // Auto-update dashboard metrics on user message
    if (sender === 'patient') {
      setStats(prev => ({
        ...prev,
        patientsHelpedToday: prev.patientsHelpedToday + 1,
        adminHoursSaved: parseFloat((prev.adminHoursSaved + 0.1).toFixed(1))
      }));
    }
  }, [soundEnabled]);

  // Initiate Booking Wizard - FIXED
  const startBooking = useCallback(() => {
    setIsBookingActive(true);
    
    // Add the wizard message directly to chat
    const wizardMsg = {
      id: `msg-${Date.now()}-wizard`,
      sender: 'ai',
      text: '📋 Please fill in your details below to book your appointment.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'wizard',
      payload: pendingBookingSpecialist || null
    };
    
    setMessages(prev => [...prev, wizardMsg]);
    
    // Also add the booking active state message
    const activeMsg = {
      id: `msg-${Date.now()}-active`,
      sender: 'ai',
      text: 'Booking form is active above...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'info'
    };
    
    setMessages(prev => [...prev, activeMsg]);
  }, [pendingBookingSpecialist]);

  // Complete a booking wizard flow - FIXED
  const completeBooking = useCallback((bookingDetails) => {
    console.log('✅ completeBooking called with:', bookingDetails);
    setIsBookingActive(false);
    setPendingBookingSpecialist(null);
    
    // Generate reference number
    const refNum = `SRM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: refNum,
      name: bookingDetails.name || 'Patient',
      service: bookingDetails.specialist?.name || bookingDetails.service || 'General Consultation',
      doctor: bookingDetails.doctor || 'Dr. Smith',
      date: bookingDetails.date || new Date().toISOString().split('T')[0],
      time: bookingDetails.time || '09:00',
      status: "Pending Confirmation",
      phone: bookingDetails.phone || '',
      email: bookingDetails.email || '',
    };

    // Update stats
    setStats(prev => ({
      ...prev,
      appointmentsRequested: prev.appointmentsRequested + 1,
      adminHoursSaved: parseFloat((prev.adminHoursSaved + 0.5).toFixed(1)),
      recentBookings: [newBooking, ...prev.recentBookings]
    }));

    // Add receipt message with confirmation
    const receiptMsg = {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      text: `✅ **Appointment Confirmed!**\n\nThank you ${newBooking.name}, your booking has been submitted.\n\n📋 **Reference:** ${newBooking.id}\n👨‍⚕️ **Service:** ${newBooking.service}\n📅 **Date:** ${newBooking.date}\n⏰ **Time:** ${newBooking.time}\n\nOur team will confirm your booking shortly.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'receipt',
      payload: newBooking
    };
    
    setMessages(prev => [...prev, receiptMsg]);

    // Play sound if enabled
    if (soundEnabled) {
      playChime();
    }
  }, [soundEnabled]);

  // Cancel booking
  const cancelBooking = useCallback(() => {
    setIsBookingActive(false);
    setPendingBookingSpecialist(null);
    const cancelMsg = {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      text: "No problem! Let me know if you change your mind. 😊",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'cancelled'
    };
    setMessages(prev => [...prev, cancelMsg]);
  }, []);

  // Standard patient message handler - FIXED
  const sendPatientMessage = useCallback((text) => {
    if (!text.trim()) return;
    
    // Add patient response
    addMessage('patient', text);
    
    const lowercase = text.toLowerCase();

    // Check for booking cancellation
    if (lowercase.match(/\b(no|nope|cancel|not now|later)\b/) && isBookingActive) {
      cancelBooking();
      return;
    }
    
    // Check if patient wants to book directly
    if (lowercase.match(/\b(book|appointment|dentist|doctor|gp|physio|specialist|schedul|reserve|need to see|consult)\b/) && !isBookingActive) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const confirmMsg = {
          en: "Certainly! I would be glad to assist you with booking an appointment. Let me guide you through the process.",
          af: "Beslis! Ek sal jou graag help om 'n afspraak te bespreek. Laat ek jou deur die proses lei.",
          zu: "Impela! Ngingakujabulela ukukusiza ngokubhukha i-aphoyintimenti. Ake ngikuqondise kule nqubo."
        };
        addMessage('ai', confirmMsg[language] || confirmMsg.en);
        
        // Launch booking wizard card in chat
        setTimeout(() => {
          startBooking();
        }, 500);
      }, 1200);
      return;
    }
    
    // Otherwise triggers smart keyword match
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiReply = getResponse(text, language);
      addMessage('ai', aiReply.text, aiReply.type, aiReply.specialist);
      
      // If triage matched a specialist, store it for booking
      if (aiReply.type === 'triage' && aiReply.specialist) {
        setPendingBookingSpecialist(aiReply.specialist);
        // Also start booking automatically
        setTimeout(() => {
          startBooking();
        }, 500);
      }
    }, 1200);
    
  }, [addMessage, isBookingActive, language, startBooking, cancelBooking]);

  return {
    messages,
    language,
    isTyping,
    soundEnabled,
    stats,
    isBookingActive,
    pendingBookingSpecialist,
    toggleSound,
    resetChat,
    changeLanguage,
    sendPatientMessage,
    startBooking,
    completeBooking,
    cancelBooking,
  };
};