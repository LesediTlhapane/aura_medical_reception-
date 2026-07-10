// src/services/aiService.js
import { clinicData } from '../data/clinicData';

// ============ CONFIGURATION ============
const CONFIG = {
  // Enable/disable features
  USE_LLM_FALLBACK: false, // Set to true when you add OpenAI/Gemini
  SIMILARITY_THRESHOLD: 0.3, // For fuzzy matching
};

// ============ LANGUAGE UTILITIES ============
const translations = {
  en: {
    emergency: `🚨 **EMERGENCY DETECTED** 🚨\n\nThis appears to be a medical emergency. Please do NOT wait. Contact our Emergency Line immediately at **{{emergencyPhone}}** or Netcare 911 / ER24 (082 911 / 084 124).\n\nOur address is: **{{address}}**.`,
    booking_prompt: `I can help you book an appointment for **{{specialist}}**{{doctor}}.\n\nStandard duration is **{{duration}}** and the consultation fee is **{{price}}**.\n\nWould you like me to request this appointment for you?`,
    opening_hours: `Our operating hours at **{{name}}** are:\n\n• **Weekdays:** {{weekdays}}\n• **Saturdays:** {{saturday}}\n• **Sundays & Holidays:** {{sunday}}`,
    // ... add all other templates
  },
  af: { /* Afrikaans templates */ },
  zu: { /* Zulu templates */ },
};

// ============ IMPROVED DETECTION ============
// Use word boundaries and stemming for better matching
const createWordMatcher = (patterns) => {
  const regex = new RegExp(`\\b(${patterns.join('|')})\\b`, 'i');
  return (text) => regex.test(text);
};

// Emergency detection with more comprehensive patterns
export const detectEmergency = (text) => {
  const lowercase = text.toLowerCase();
  const emergencyPatterns = [
    // Symptoms
    'chest pain', 'breathing difficulty', 'severe bleeding', 'difficulty breathing',
    'stroke', 'numbness', 'heart attack', 'unconscious', 'unresponsive',
    'high fever', 'poison', 'choking', 'seizure', 'convuls', 
    'broken bone', 'fracture', 'head injury', 'concussion',
    // Short forms
    'heart', 'bleed', 'unconscious', 'fit', 'seiz',
  ];
  
  // Check for exact phrases first
  for (const pattern of emergencyPatterns) {
    if (lowercase.includes(pattern)) return true;
  }
  
  // Check for symptom + severity combos
  const severeModifiers = ['severe', 'extreme', 'intense', 'unbearable', 'heavy'];
  const symptomKeywords = ['pain', 'bleed', 'fever', 'headache', 'cough', 'vomit'];
  
  for (const modifier of severeModifiers) {
    for (const symptom of symptomKeywords) {
      if (lowercase.includes(`${modifier} ${symptom}`)) return true;
    }
  }
  
  return false;
};

// ============ INTENT CLASSIFICATION ============
// Better than simple keyword matching - uses scoring
export const classifyIntent = (text) => {
  const lowercase = text.toLowerCase();
  const intents = {
    booking: {
      keywords: ['book', 'appointment', 'schedule', 'see', 'consult', 'visit', 'need', 'want', 'make', 'request'],
      score: 0,
    },
    hours: {
      keywords: ['hours', 'open', 'close', 'saturday', 'sunday', 'time', 'weekend', 'morning', 'afternoon', 'evening'],
      score: 0,
    },
    pricing: {
      keywords: ['price', 'cost', 'fee', 'charge', 'payment', 'rates', 'how much', 'expensive', 'afford'],
      score: 0,
    },
    location: {
      keywords: ['where', 'address', 'located', 'map', 'directions', 'parking', 'find', 'get to'],
      score: 0,
    },
    medical_aid: {
      keywords: ['medical aid', 'discovery', 'bonitas', 'momentum', 'fedhealth', 'insurance', 'cover', 'claim'],
      score: 0,
    },
    services: {
      keywords: ['services', 'treatments', 'offer', 'specialist', 'doctor', 'gp', 'dentist', 'dermatologist', 'physio'],
      score: 0,
    },
    cancellation: {
      keywords: ['cancel', 'reschedule', 'change', 'postpone', 'move', 'delay', 'push back'],
      score: 0,
    },
  };

  // Score each intent
  for (const [intent, data] of Object.entries(intents)) {
    let score = 0;
    for (const keyword of data.keywords) {
      if (lowercase.includes(keyword)) {
        // Weight longer matches more
        score += keyword.length / 10;
        // Check if keyword is a whole word
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(lowercase)) score += 1;
      }
    }
    data.score = score;
  }

  // Return the highest scoring intent
  const sorted = Object.entries(intents).sort((a, b) => b[1].score - a[1].score);
  return sorted[0][0] === 'booking' && sorted[0][1].score > 0 ? 'booking' : sorted[0][0];
};

// ============ SPECIALIST MATCHING ============
export const matchSpecialist = (text) => {
  const lowercase = text.toLowerCase();
  
  const specialistMap = [
    {
      id: 'dentist',
      patterns: ['tooth', 'teeth', 'dentist', 'dental', 'mouth', 'gum', 'filling', 'crown', 'cavity', 'orthodont', 'braces'],
      weight: 1,
    },
    {
      id: 'dermatologist',
      patterns: ['skin', 'dermatologist', 'acne', 'rash', 'mole', 'eczema', 'psoriasis', 'skin cancer', 'hair loss'],
      weight: 1,
    },
    {
      id: 'womens-health',
      patterns: ['women', 'pregnancy', 'pregnant', 'gynae', 'contracep', 'birth control', 'pap smear', 'prenatal', 'period', 'menstrual'],
      weight: 1,
    },
    {
      id: 'physiotherapy',
      patterns: ['back pain', 'physio', 'rehab', 'joint', 'muscle', 'sprain', 'injury', 'physiotherapy', 'massage', 'neck pain', 'sports injury'],
      weight: 1,
    },
    {
      id: 'vaccinations',
      patterns: ['vaccine', 'vaccination', 'baby check', 'flu shot', 'immuniz', 'booster', 'covid shot', 'childhood vaccine'],
      weight: 1,
    },
    {
      id: 'gp',
      patterns: ['gp', 'doctor', 'general practitioner', 'flu', 'fever', 'cough', 'sick', 'checkup', 'prescrip', 'consult', 'cold', 'infection'],
      weight: 0.8, // Lower weight so more specific specialists take priority
    },
  ];

  // Score each specialist
  let bestMatch = null;
  let bestScore = 0;

  for (const specialist of specialistMap) {
    let score = 0;
    for (const pattern of specialist.patterns) {
      if (lowercase.includes(pattern)) {
        score += specialist.weight;
        // Bonus for exact word match
        const regex = new RegExp(`\\b${pattern}\\b`, 'i');
        if (regex.test(lowercase)) score += 0.5;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = specialist.id;
    }
  }

  if (bestMatch && bestScore > 0) {
    return clinicData.services.find(s => s.id === bestMatch);
  }
  return null;
};

// ============ CONTEXT-AWARE RESPONSE ============
// Simple conversation memory
let conversationContext = {
  lastIntent: null,
  lastSpecialist: null,
  awaitingConfirmation: false,
  messages: [],
};

export const resetContext = () => {
  conversationContext = {
    lastIntent: null,
    lastSpecialist: null,
    awaitingConfirmation: false,
    messages: [],
  };
};

// ============ MAIN RESPONSE GENERATOR ============
export const getResponse = (text, language = 'en', includeContext = true) => {
  const lowercase = text.toLowerCase().trim();
  
  // 1. Emergency check (always priority)
  if (detectEmergency(lowercase)) {
    return {
      type: "emergency",
      text: translations[language].emergency
        .replace('{{emergencyPhone}}', clinicData.emergencyPhone)
        .replace('{{address}}', clinicData.address),
    };
  }

  // 2. Check if confirming a booking
  if (conversationContext.awaitingConfirmation && 
      (lowercase.includes('yes') || lowercase.includes('yep') || lowercase.includes('sure') || lowercase.includes('ok'))) {
    conversationContext.awaitingConfirmation = false;
    return {
      type: "booking_confirmed",
      text: {
        en: `✅ Your appointment request has been recorded! One of our receptionists will confirm the booking via phone or email within 24 hours.\n\nIf you need immediate assistance, call us at **${clinicData.phone}**.`,
        af: `✅ Uw afspraak versoek is aangeteken! Een van ons ontvangsdames sal die bespreking binne 24 uur per telefoon of e-pos bevestig.\n\nAs u onmiddellike hulp benodig, skakel ons by **${clinicData.phone}**.`,
        zu: `✅ Isicelo sakho se-aphoyintimenti sibhaliwe! Omunye wabamukeli bethu uzokuqinisekisa ngocingo noma nge-imeyili kungakapheli amahora angu-24.\n\nUma udinga usizo olusheshayo, sifonele ku **${clinicData.phone}**.`,
      }[language],
    };
  }

  // 3. Classify intent
  const intent = classifyIntent(lowercase);
  const specialist = matchSpecialist(lowercase);

  // 4. Handle booking intent
  if (intent === 'booking' || (specialist && intent !== 'unknown')) {
    const matchedSpecialist = specialist || conversationContext.lastSpecialist;
    
    if (matchedSpecialist) {
      const doctor = clinicData.doctors.find(d => d.id === matchedSpecialist.id);
      const docText = doctor ? ` with ${doctor.name}` : "";
      
      conversationContext.awaitingConfirmation = true;
      conversationContext.lastSpecialist = matchedSpecialist;
      
      return {
        type: "triage",
        specialist: matchedSpecialist,
        text: translations[language].booking_prompt
          .replace('{{specialist}}', matchedSpecialist.name)
          .replace('{{doctor}}', docText)
          .replace('{{duration}}', matchedSpecialist.duration)
          .replace('{{price}}', matchedSpecialist.price),
      };
    }
    
    // No specialist matched, ask for more info
    return {
      type: "clarification",
      text: {
        en: `I'd be happy to help you book an appointment! Could you please tell me what type of service you need? We offer:\n\n• GP consultations\n• Dentist\n• Dermatologist\n• Women's Health\n• Physiotherapy\n• Vaccinations\n\nJust tell me what you need help with.`,
        af: `Ek help graag om 'n afspraak te bespreek! Kan jy my asseblief vertel watter tipe diens jy benodig? Ons bied:\n\n• Huisarts konsultasies\n• Tandarts\n• Dermatoloog\n• Vrouegesondheid\n• Fisioterapie\n• Inentings\n\nSê net vir my waarmee jy hulp nodig het.`,
        zu: `Ngingakujabulela ukukusiza ubhukhe i-aphoyintimenti! Ngicela ungitshele ukuthi yiluphi usizo oludingayo? Sihlinzeka ngalezi:\n\n• Ukubonisana noDokotela\n• Udokotela wamazinyo\n• Udokotela wesikhumba\n• Izempilo Zabesifazane\n• Izempilo Zomzimba\n• Imijovo\n\nNgitshele nje ukuthi udingani.`,
      }[language],
    };
  }

  // 5. Store context for follow-ups
  conversationContext.lastIntent = intent;

  // 6. FAQ responses (with template-based formatting)
  const faqResponses = {
    hours: {
      match: /\b(hours|opening|open|close|saturday|sunday|time|times|weekend|morning|afternoon)\b/,
      template: translations[language].opening_hours
        .replace('{{name}}', clinicData.name)
        .replace('{{weekdays}}', clinicData.operatingHours.weekdays)
        .replace('{{saturday}}', clinicData.operatingHours.saturday)
        .replace('{{sunday}}', clinicData.operatingHours.sunday),
    },
    medical_aid: {
      match: /\b(medical aid|discovery|bonitas|momentum|fedhealth|medicalaid|insurance|cover|cash|card|eft|claim|fund)\b/,
      template: (lang) => {
        const list = clinicData.medicalAids.map(ma => `• **${ma.name}**: ${ma.status}`).join('\n');
        return translations[lang].medical_aid
          .replace('{{list}}', list);
      },
    },
    pricing: {
      match: /\b(price|cost|consultation|fees|fee|charge|how much|payment|co-pay|rates|afford)\b/,
      template: (lang) => {
        const prices = clinicData.services.map(s => `• **${s.name}:** ${s.price} (~${s.duration})`).join('\n');
        return translations[lang].pricing
          .replace('{{prices}}', prices);
      },
    },
    location: {
      match: /\b(located|location|where|address|map|directions|parking|pretoria|brooklyn|find|get to|near|close)\b/,
      template: translations[language].location
        .replace('{{address}}', clinicData.address)
        .replace('{{parking}}', clinicData.logistics.parking)
        .replace('{{accessibility}}', clinicData.logistics.accessibility),
    },
    cancellation: {
      match: /\b(cancel|reschedule|change|postpone|move|date|delay|push back)\b/,
      template: translations[language].cancellation
        .replace('{{phone}}', clinicData.phone)
        .replace('{{email}}', clinicData.email),
    },
    services: {
      match: /\b(services|treatments|do you offer|treat|what do you do|what service|specialt|offer)\b/,
      template: (lang) => {
        const svcs = clinicData.services.map(s => `• **${s.name}** (${s.duration})`).join('\n');
        return translations[language].services
          .replace('{{services}}', svcs);
      },
    },
  };

  // Check each FAQ type
  for (const [key, faq] of Object.entries(faqResponses)) {
    if (faq.match.test(lowercase)) {
      const responseText = typeof faq.template === 'function' 
        ? faq.template(language) 
        : faq.template;
      
      return {
        type: "faq",
        text: responseText,
      };
    }
  }

  // 7. LLM Fallback (if enabled)
  if (CONFIG.USE_LLM_FALLBACK) {
    // You would call your OpenAI/Gemini API here
    // return await callLLM(text, language, conversationContext);
  }

  // 8. Unknown with better user experience
  return {
    type: "unknown",
    text: {
      en: `I don't have an answer for that specific question, but I'm here to help! 🤗\n\nYou can ask me about:\n• **Appointments** - Book, cancel, or reschedule\n• **Services** - What we offer\n• **Hours** - When we're open\n• **Pricing** - Consultation fees\n• **Location** - Where to find us\n• **Medical Aid** - Coverage options\n\nIf none of these help, I'll connect you with a human receptionist right away!`,
      af: `Ek het nie 'n antwoord vir daardie spesifieke vraag nie, maar ek is hier om te help! 🤗\n\nJy kan my vra oor:\n• **Afsprake** - Bespreek, kanselleer of herskeduleer\n• **Dienste** - Wat ons bied\n• **Ure** - Wanneer ons oop is\n• **Pryse** - Konsultasie fooie\n• **Ligging** - Waar om ons te vind\n• **Mediese fonds** - Dekkingsopsies\n\nAs niks hiervan help nie, sal ek jou onmiddellik met 'n menslike ontvangsdame verbind!`,
      zu: `Anginayo impendulo yalowo mbuzo othile, kodwa ngilapha ukusiza! 🤗\n\nUngangibuza nge:\n• **Aphoyintimenti** - Bhukha, khansela, noma hlehlisa\n• **Izinsizakalo** - Esizinikazayo\n• **Amahora** - Sivula nini\n• **Izintengo** - Izindleko zokubonisana\n• **Indawo** - Lapho sisitholakala khona\n• **Umhlinzeki Wezempilo** - Izinketho zokukhokha\n\nUma lokhu kungasizi, ngizokuxhumanisa nomamukeli wethu wezivakashi ngokushesha!`,
    }[language],
  };
};

// ============ HELPER: Get conversation history ============
export const getContext = () => conversationContext;