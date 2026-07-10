import { useState, useEffect, useCallback } from 'react';
import { getResponse, detectEmergency } from '../utils/aiEngine';
import { playChime } from '../utils/audio';

const LOCAL_STORAGE_KEY = 'aura_chat_session_state_v2';

export const useChatSession = () => {
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState('en');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isBookingActive, setIsBookingActive] = useState(false);
  const [pendingBookingSpecialist, setPendingBookingSpecialist] = useState(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  
  // Dashboard & ROI statistics
  const [stats, setStats] = useState({
    patientsHelpedToday: 147,
    appointmentsRequested: 39,
    callsPrevented: 109,
    adminHoursSaved: 12.8,
    potentialRevenueProtected: 25350,
    averageResponseTime: 1.8,
    recentBookings: [
      { id: "SRM-2026-7712", name: "Sipho Dlamini", service: "General Practitioner Consultation", doctor: "Dr. Lerato Khumalo", date: "2026-07-13", time: "09:30", status: "Approved" },
      { id: "SRM-2026-3029", name: "Annelize Marais", service: "Dermatologist & Skin Consultation", doctor: "Dr. Sarah Williams", date: "2026-07-14", time: "11:00", status: "Approved" },
      { id: "SRM-2026-9812", name: "Johan Botha", service: "Dentist & Oral Health Consultation", doctor: "Dr. Amit Patel", date: "2026-07-15", time: "14:15", status: "Approved" }
    ]
  });

  // Load state on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.messages || []);
        setLanguage(parsed.language || 'en');
        setSoundEnabled(parsed.soundEnabled !== undefined ? parsed.soundEnabled : true);
        if (parsed.stats) setStats(parsed.stats);
        if (parsed.pendingBookingSpecialist) setPendingBookingSpecialist(parsed.pendingBookingSpecialist);
        if (parsed.isEmergencyActive) setIsEmergencyActive(parsed.isEmergencyActive);
      } catch (e) {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  }, []);

  // Save state on change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      messages,
      language,
      soundEnabled,
      stats,
      pendingBookingSpecialist,
      isEmergencyActive
    }));
  }, [messages, language, soundEnabled, stats, pendingBookingSpecialist, isEmergencyActive]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  // Clean chat history
  const resetChat = useCallback(() => {
    setMessages([]);
    setIsBookingActive(false);
    setPendingBookingSpecialist(null);
    setIsEmergencyActive(false);
  }, []);

  // Handle language switch
  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    setMessages([]);
    setIsBookingActive(false);
    setPendingBookingSpecialist(null);
    setIsEmergencyActive(false);
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
      const lowercase = text.toLowerCase();
      const isEmergency = detectEmergency(lowercase);
      
      setStats(prev => {
        let callsInc = 0;
        let hoursInc = 0.0;
        
        // General query deflection ROI
        if (!isEmergency) {
          callsInc = 1;
          hoursInc = 0.1; // 6 mins saved per query
        }

        return {
          ...prev,
          patientsHelpedToday: prev.patientsHelpedToday + 1,
          callsPrevented: prev.callsPrevented + callsInc,
          adminHoursSaved: parseFloat((prev.adminHoursSaved + hoursInc).toFixed(1))
        };
      });
    }
  }, [soundEnabled]);

  // Initiate Booking Wizard
  const startBooking = useCallback(() => {
    setIsBookingActive(true);
    
    // Add the wizard message directly to chat
    const wizardMsg = {
      id: `msg-${Date.now()}-wizard`,
      sender: 'ai',
      text: 'inline-wizard-trigger',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'wizard',
      payload: pendingBookingSpecialist || null
    };
    
    setMessages(prev => [...prev, wizardMsg]);
  }, [pendingBookingSpecialist]);

  // Complete a booking wizard flow
  const completeBooking = useCallback((bookingDetails) => {
    setIsBookingActive(false);
    setPendingBookingSpecialist(null);
    
    // Generate reference number
    const refNum = `SRM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const priceValue = parseInt((bookingDetails.price || "650").replace(/[^0-9]/g, '')) || 650;
    
    const newBooking = {
      id: refNum,
      name: bookingDetails.name || 'Patient',
      service: bookingDetails.service || 'General Practitioner Consultation',
      doctor: bookingDetails.doctor || 'Dr. Lerato Khumalo',
      date: bookingDetails.date || new Date().toISOString().split('T')[0],
      time: bookingDetails.time || '09:00',
      status: "Pending", // Starts as Pending in log
      phone: bookingDetails.phone || '',
      email: bookingDetails.email || '',
      price: bookingDetails.price || 'R650'
    };

    // Update stats with revenue protected and 30 mins saved
    setStats(prev => ({
      ...prev,
      patientsHelpedToday: prev.patientsHelpedToday + 1,
      appointmentsRequested: prev.appointmentsRequested + 1,
      callsPrevented: prev.callsPrevented + 1,
      adminHoursSaved: parseFloat((prev.adminHoursSaved + 0.5).toFixed(1)),
      potentialRevenueProtected: prev.potentialRevenueProtected + priceValue,
      recentBookings: [newBooking, ...prev.recentBookings]
    }));

    // Add receipt message with confirmation
    const receiptMsg = {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      text: `Receipt confirmation card loaded`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'receipt',
      payload: newBooking
    };
    
    setMessages(prev => [...prev, receiptMsg]);

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
      text: "Certainly 😊. I have closed the scheduling assistant. Feel free to ask any other questions or let me know when you are ready to book!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'cancelled'
    };
    setMessages(prev => [...prev, cancelMsg]);
  }, []);

  // Standard patient message handler
  const sendPatientMessage = useCallback((text) => {
    if (!text.trim()) return;
    
    // Add patient response
    addMessage('patient', text);
    
    const lowercase = text.toLowerCase();

    // 1. Emergency intercept first (always takes priority)
    if (detectEmergency(lowercase)) {
      setIsBookingActive(false);
      setPendingBookingSpecialist(null);
      setIsEmergencyActive(true);
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        const aiReply = getResponse(text, language);
        
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const emergencyMsg = {
          id: `msg-emergency-${Date.now()}`,
          sender: "ai",
          text: aiReply.text,
          timestamp: timeStr,
          type: "emergency",
          payload: null
        };
        
        setMessages(prev => [...prev, emergencyMsg]);
        
        if (soundEnabled) {
          playChime();
        }
      }, 1000);
      return;
    }

    // 2. Check for booking cancellation
    if (lowercase.match(/\b(no|nope|cancel|not now|later|stop)\b/) && isBookingActive) {
      cancelBooking();
      return;
    }
    
    // 3. Check if patient wants to book directly
    if (lowercase.match(/\b(book|appointment|dentist|doctor|gp|physio|specialist|schedul|reserve|need to see|consult)\b/) && !isBookingActive) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        
        // Find if a specific specialist was mentioned
        const matchedSvc = getResponse(text, language).specialist;
        if (matchedSvc) {
          setPendingBookingSpecialist(matchedSvc);
        }
        
        addMessage('ai', "I would be glad to help you schedule that appointment! I will launch our booking assistant to guide you through the details. 👇");
        
        setTimeout(() => {
          startBooking();
        }, 600);
      }, 1000);
      return;
    }
    
    // 4. Otherwise trigger FAQ/general response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiReply = getResponse(text, language);
      addMessage('ai', aiReply.text, aiReply.type, aiReply.specialist);
      
      // If triage matched a specialist, auto-launch booking wizard
      if (aiReply.type === 'triage' && aiReply.specialist) {
        setPendingBookingSpecialist(aiReply.specialist);
        setTimeout(() => {
          startBooking();
        }, 800);
      }
    }, 1000);
    
  }, [addMessage, isBookingActive, language, startBooking, cancelBooking, soundEnabled]);

  return {
    messages,
    language,
    isTyping,
    soundEnabled,
    stats,
    isBookingActive,
    pendingBookingSpecialist,
    isEmergencyActive,
    toggleSound,
    resetChat,
    changeLanguage,
    sendPatientMessage,
    startBooking,
    completeBooking,
    cancelBooking,
  };
};