// src/utils/aiEngine.js
import { clinicData } from '../data/clinicData';

// ============ CONFIGURATION ============
const CONFIG = {
  USE_LLM_FALLBACK: false,
  SIMILARITY_THRESHOLD: 0.3,
};

// ============ LANGUAGE UTILITIES ============
const translations = {
  en: {
    emergency: `🚨 **EMERGENCY DETECTED** 🚨\n\nThis appears to be a medical emergency. Please do NOT wait. Contact our Emergency Line immediately at **{{emergencyPhone}}** or Netcare 911 / ER24 (082 911 / 084 124).\n\nOur address is: **{{address}}**.`,
    booking_prompt: `Certainly 😊\n\nI can help you book an appointment for **{{specialist}}**{{doctor}}.\n\nStandard duration is **{{duration}}** and the consultation fee is **{{price}}**.\n\nWould you like me to request this appointment for you?`,
    opening_hours: `Certainly! Our operating hours at **{{name}}** are:\n\n• **Weekdays:** {{weekdays}}\n• **Saturdays:** {{saturday}}\n• **Sundays & Holidays:** {{sunday}}\n\nWould you like to book an appointment during these times?`,
    location: `Certainly! We are located in Brooklyn, Pretoria at:\n📍 **{{address}}**.\n\n🚗 **Parking:** {{parking}}\n♿ **Accessibility:** {{accessibility}}\n\nCan I assist you with scheduling a visit?`,
    medical_aid: `Certainly! We accept a wide range of South African medical aids. Here is our coverage status:\n\n{{list}}\n\nWould you like me to help you book a consultation?`,
    pricing: `Certainly! Here are the consultation fees for our services:\n\n{{prices}}\n\nWe claim directly from supported medical aids. Would you like to schedule an appointment?`,
    cancellation: `If you need to change or cancel your appointment, please contact us directly:\n\n📞 Phone: **{{phone}}**\n✉️ Email: **{{email}}**\n\nOur receptionists will happily assist you. Let me know if you would like to start a new booking request instead!`,
    services: `Sunrise Medical Centre offers the following specialized consultations:\n\n{{services}}\n\nLet me know which medical care you require and I'll recommend the right specialist!`
  },
  af: {
    emergency: `🚨 **NOODSITUASIE WAARGENEEM** 🚨\n\nDit lyk na 'n mediese noodgeval. Moet asseblief NIE wag nie. Kontak ons Noodlyn onmiddellik by **{{emergencyPhone}}** of Netcare 911 / ER24 (082 911 / 084 124).\n\nOns adres is: **{{address}}**.`,
    booking_prompt: `Beslis 😊\n\nEk kan u help om 'n afspraak te bespreek vir **{{specialist}}**{{doctor}}.\n\nStandaard duur is **{{duration}}** en die konsultasiefooi is **{{price}}**.\n\nWil u hê ek moet hierdie afspraak vir u aanvra?`,
    opening_hours: `Ons bedryfsure by **{{name}}** is:\n\n• **Weeksdae:** {{weekdays}}\n• **Saterdae:** {{saturday}}\n• **Sondae & Vakansiedae:** {{sunday}}\n\nWil u 'n afspraak gedurende hierdie tye bespreek?`,
    location: `Ons is geleë in Brooklyn, Pretoria by:\n📍 **{{address}}**.\n\n🚗 **Parkering:** {{parking}}\n♿ **Toeganklikheid:** {{accessibility}}\n\nKan ek u help met die skedulering van 'n besoek?`,
    medical_aid: `Ons aanvaar 'n wye reeks Suid-Afrikaanse mediese fondse:\n\n{{list}}\n\nWil u hê ek moet u help om 'n konsultasie te bespreek?`,
    pricing: `Hier is die konsultasiefooie vir ons dienste:\n\n{{prices}}\n\nOns eis direk vanaf ondersteunde mediese fondse. Wil u 'n afspraak skeduleer?`,
    cancellation: `As u u afspraak moet verander of kanselleer, kontak ons asseblief direk:\n\n📞 Telefoon: **{{phone}}**\n✉️ E-pos: **{{email}}**\n\nOns ontvangsdames sal u graag help. Laat weet my as u eerder 'n nuwe bespreking wil begin!`,
    services: `Sunrise Mediese Sentrum bied die volgende gespesialiseerde konsultasies aan:\n\n{{services}}\n\nLaat weet my watter mediese sorg u benodig en ek sal die regte spesialis aanbeveel!`
  },
  zu: {
    emergency: `🚨 **KUBONAKALE INKINGA ENKULU** 🚨\n\nLokhu kubukeka kuyinkinga yezempilo ephuthumayo. Sicela ungalindi. Thintana neNombolo yethu yeNhlekelele ngokushesha ku-**{{emergencyPhone}}** noma i-Netcare 911 / ER24 (082 911 / 084 124).\n\nIkheli lethu lithi: **{{address}}**.`,
    booking_prompt: `Impela 😊\n\nNgingakusiza ukubhukha i-aphoyintimenti ye-**{{specialist}}**{{doctor}}.\n\nIsikhathi esijwayelekile yimizuzu **{{duration}}** kanti imali yokubonisana ingu-**{{price}}**.\n\nUngathanda ukuthi ngikucelele le-aphoyintimenti?`,
    opening_hours: `Amahora ethu okusebenza e-**{{name}}** yilezi:\n\n• **Ezinsukwini zeviki:** {{weekdays}}\n• **Ngemigqibelo:** {{saturday}}\n• **NgeSonto namaholide:** {{sunday}}\n\nUngathanda ukubhukha i-aphoyintimenti ngalezi zikhathi?`,
    location: `Sitholakala eBrooklyn, ePitoli ku:\n📍 **{{address}}**.\n\n🚗 **Ukupaka:** {{parking}}\n♿ **Ukufaneleka kwesitulo esinamasondo:** {{accessibility}}\n\nNgingakusiza yini ukuhlela ukuvakasha?`,
    medical_aid: `Samukela izinhlobo eziningi zezinhlelo zezempilo zaseNingizimu Afrika:\n\n{{list}}\n\nUngathanda ukuthi ngikusize ubhukhe ukubonisana?`,
    pricing: `Nazi izindleko zokubonisana zezinsizakalo zethu:\n\n{{prices}}\n\nSifuna ngqo kubaxhasi bezempilo abasekelwayo. Ungathanda ukuhlela i-aphoyintimenti?`,
    cancellation: `Uma udinga ukushintsha noma ukukhansela i-aphoyintimenti yakho, sicela usithinte ngqo:\n\n📞 Ucingo: **{{phone}}**\n✉️ I-imeyili: **{{email}}**\n\nAbamukeli bethu bezivakashi bazokusiza ngentokozo. Ngazise uma ungathanda ukuqala isicelo esisha sokubhukha esikhundleni salokho!`,
    services: `I-Sunrise Medical Centre ihlinzeka ngalokhu kubonisana okukhethekile:\n\n{{services}}\n\nNgazise ukuthi yiluphi usizo lwezempilo oludingayo futhi ngizoncoma uchwepheshe ofanele!`
  }
};

// Emergency detection patterns
export const detectEmergency = (text) => {
  const lowercase = text.toLowerCase();
  const emergencyPatterns = [
    'chest pain', 'breathing difficulty', 'severe bleeding', 'difficulty breathing',
    'stroke', 'numbness', 'heart attack', 'unconscious', 'unresponsive',
    'choking', 'seizure', 'convuls', 'broken bone', 'fracture', 'head injury',
    'chest tightness', 'cannot breathe', 'shortness of breath', 'bleeding heavily'
  ];
  
  for (const pattern of emergencyPatterns) {
    if (lowercase.includes(pattern)) return true;
  }
  
  // Severe + symptoms combos
  const severeModifiers = ['severe', 'extreme', 'intense', 'unbearable', 'heavy', 'critical'];
  const symptomKeywords = ['pain', 'bleed', 'fever', 'headache', 'cough', 'vomit', 'shortness'];
  
  for (const modifier of severeModifiers) {
    for (const symptom of symptomKeywords) {
      if (lowercase.includes(`${modifier} ${symptom}`)) return true;
    }
  }
  
  return false;
};

// Intent Classification using score matching
export const classifyIntent = (text) => {
  const lowercase = text.toLowerCase();
  const intents = {
    booking: {
      keywords: ['book', 'appointment', 'schedule', 'see', 'consult', 'visit', 'need', 'want', 'make', 'request', 'reserve'],
      score: 0,
    },
    hours: {
      keywords: ['hours', 'open', 'close', 'saturday', 'sunday', 'time', 'weekend', 'morning', 'afternoon', 'evening', 'operating'],
      score: 0,
    },
    pricing: {
      keywords: ['price', 'cost', 'fee', 'charge', 'payment', 'rates', 'how much', 'expensive', 'afford', 'cash', 'card', 'eft'],
      score: 0,
    },
    location: {
      keywords: ['where', 'address', 'located', 'map', 'directions', 'parking', 'find', 'get to', 'pretoria', 'brooklyn', 'access'],
      score: 0,
    },
    medical_aid: {
      keywords: ['medical aid', 'discovery', 'bonitas', 'momentum', 'fedhealth', 'insurance', 'cover', 'claim', 'medicalaid', 'fund'],
      score: 0,
    },
    services: {
      keywords: ['services', 'treatments', 'offer', 'specialist', 'doctor', 'gp', 'dentist', 'dermatologist', 'physio', 'vaccination', 'immunization', 'flu shot'],
      score: 0,
    },
    cancellation: {
      keywords: ['cancel', 'reschedule', 'change', 'postpone', 'move', 'delay', 'push back'],
      score: 0,
    },
  };

  for (const [intent, data] of Object.entries(intents)) {
    let score = 0;
    for (const keyword of data.keywords) {
      if (lowercase.includes(keyword)) {
        score += keyword.length / 10;
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(lowercase)) score += 1.2;
      }
    }
    data.score = score;
  }

  const sorted = Object.entries(intents).sort((a, b) => b[1].score - a[1].score);
  return sorted[0][1].score > 0.4 ? sorted[0][0] : 'unknown';
};

// Specialist Triage Logic
export const matchSpecialist = (text) => {
  const lowercase = text.toLowerCase();
  
  const specialistMap = [
    {
      id: 'dentist',
      patterns: ['tooth', 'teeth', 'dentist', 'dental', 'mouth', 'gum', 'filling', 'crown', 'cavity', 'orthodont', 'braces', 'wisdom tooth', 'toothache'],
      weight: 1,
    },
    {
      id: 'dermatologist',
      patterns: ['skin', 'dermatologist', 'acne', 'rash', 'mole', 'eczema', 'psoriasis', 'skin cancer', 'hair loss', 'breakout', 'breaking out', 'spots'],
      weight: 1,
    },
    {
      id: 'womens-health',
      patterns: ['women', 'pregnancy', 'pregnant', 'gynae', 'contracep', 'birth control', 'pap smear', 'prenatal', 'period', 'menstrual', 'gynecologist'],
      weight: 1,
    },
    {
      id: 'physiotherapy',
      patterns: ['back pain', 'physio', 'rehab', 'joint', 'muscle', 'sprain', 'injury', 'physiotherapy', 'massage', 'neck pain', 'sports injury', 'shoulder pain', 'strain'],
      weight: 1,
    },
    {
      id: 'vaccinations',
      patterns: ['vaccine', 'vaccination', 'baby check', 'flu shot', 'immuniz', 'booster', 'covid shot', 'childhood vaccine', 'hep', 'travel shot'],
      weight: 1,
    },
    {
      id: 'gp',
      patterns: ['gp', 'doctor', 'general practitioner', 'flu', 'fever', 'cough', 'sick', 'checkup', 'prescrip', 'consult', 'cold', 'infection', 'stomach', 'headache', 'ill'],
      weight: 0.8,
    },
  ];

  let bestMatch = null;
  let bestScore = 0;

  for (const specialist of specialistMap) {
    let score = 0;
    for (const pattern of specialist.patterns) {
      if (lowercase.includes(pattern)) {
        score += specialist.weight;
        const regex = new RegExp(`\\b${pattern}\\b`, 'i');
        if (regex.test(lowercase)) score += 0.6;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = specialist.id;
    }
  }

  if (bestMatch && bestScore > 0.3) {
    return clinicData.services.find(s => s.id === bestMatch);
  }
  return null;
};

let conversationContext = {
  lastIntent: null,
  lastSpecialist: null,
  awaitingConfirmation: false,
};

export const resetContext = () => {
  conversationContext = {
    lastIntent: null,
    lastSpecialist: null,
    awaitingConfirmation: false,
  };
};

export const getResponse = (text, language = 'en') => {
  const lowercase = text.toLowerCase().trim();
  const lang = translations[language] ? language : 'en';
  
  // 1. Emergency Detection
  if (detectEmergency(lowercase)) {
    return {
      type: "emergency",
      text: translations[lang].emergency
        .replace('{{emergencyPhone}}', clinicData.emergencyPhone)
        .replace('{{address}}', clinicData.address),
    };
  }

  // 2. Classify intent and specialists
  const intent = classifyIntent(lowercase);
  const specialist = matchSpecialist(lowercase);

  // 3. Handle booking intent & triage
  if (intent === 'booking' || (specialist && intent !== 'unknown')) {
    const matchedSpecialist = specialist || conversationContext.lastSpecialist;
    
    if (matchedSpecialist) {
      const doctor = clinicData.doctors.find(d => d.id === matchedSpecialist.id);
      const docText = doctor ? ` with ${doctor.name}` : "";
      
      conversationContext.lastSpecialist = matchedSpecialist;
      
      return {
        type: "triage",
        specialist: matchedSpecialist,
        text: translations[lang].booking_prompt
          .replace('{{specialist}}', matchedSpecialist.name)
          .replace('{{doctor}}', docText)
          .replace('{{duration}}', matchedSpecialist.duration)
          .replace('{{price}}', matchedSpecialist.price),
      };
    }
    
    return {
      type: "clarification",
      text: {
        en: `I'd be glad to help you book an appointment! 😊\n\nCould you please let me know what concern you'd like to consult for? We offer:\n\n• **General Practitioner**\n• **Dentist & Oral Health**\n• **Dermatologist & Skin Care**\n• **Women's Health**\n• **Physiotherapy & Rehab**\n• **Vaccinations**\n\nWhich of these would you like to request?`,
        af: `Ek help u graag om 'n afspraak te bespreek! 😊\n\nKan u my laat weet waarvoor u wil konsulteer? Ons bied:\n\n• **Huisarts (GP)**\n• **Tandarts**\n• **Dermatoloog**\n• **Vrouegesondheid**\n• **Fisioterapie**\n• **Inentings**\n\nWatter een hiervan wil u aanvra?`,
        zu: `Ngingakujabulela ukukusiza ubhukhe i-aphoyintimenti! 😊\n\nNgabe ungathanda ukubonana nobani? Sihlinzeka ngalezi:\n\n• **Udokotela Jikelele (GP)**\n• **Udokotela Wamazinyo**\n• **Udokotela Wesikhumba**\n• **Izempilo Zabesifazane**\n• **Izempilo Zomzimba**\n• **Imijovo**\n\nYikuphi kwalokhu ongathanda ukukubhukha?`,
      }[lang],
    };
  }

  conversationContext.lastIntent = intent;

  // 4. FAQ matches
  const faqMatches = {
    hours: {
      regex: /\b(hours|opening|open|close|saturday|sunday|time|times|weekend|operating)\b/,
      template: translations[lang].opening_hours
        .replace('{{name}}', clinicData.name)
        .replace('{{weekdays}}', clinicData.operatingHours.weekdays)
        .replace('{{saturday}}', clinicData.operatingHours.saturday)
        .replace('{{sunday}}', clinicData.operatingHours.sunday),
    },
    medical_aid: {
      regex: /\b(medical aid|discovery|bonitas|momentum|fedhealth|medicalaid|insurance|cover|fund)\b/,
      template: () => {
        const listStr = clinicData.medicalAids.map(ma => `• **${ma.name}**: ${ma.status}`).join('\n');
        return translations[lang].medical_aid.replace('{{list}}', listStr);
      }
    },
    pricing: {
      regex: /\b(price|cost|consultation|fees|fee|charge|rates|how much|payment|co-pay)\b/,
      template: () => {
        const pricesStr = clinicData.services.map(s => `• **${s.name}:** ${s.price} (~${s.duration})`).join('\n');
        return translations[lang].pricing.replace('{{prices}}', pricesStr);
      }
    },
    location: {
      regex: /\b(located|location|where|address|map|directions|parking|pretoria|brooklyn|find|get to|access)\b/,
      template: translations[lang].location
        .replace('{{address}}', clinicData.address)
        .replace('{{parking}}', clinicData.logistics.parking)
        .replace('{{accessibility}}', clinicData.logistics.accessibility),
    },
    cancellation: {
      regex: /\b(cancel|reschedule|change|postpone|move|delay)\b/,
      template: translations[lang].cancellation
        .replace('{{phone}}', clinicData.phone)
        .replace('{{email}}', clinicData.email),
    },
    services: {
      regex: /\b(services|treatments|do you offer|treat|what service|specialt)\b/,
      template: () => {
        const svcsStr = clinicData.services.map(s => `• **${s.name}** - *${s.price} (${s.duration})*`).join('\n');
        return translations[lang].services.replace('{{services}}', svcsStr);
      }
    }
  };

  for (const [key, faq] of Object.entries(faqMatches)) {
    if (faq.regex.test(lowercase)) {
      const responseText = typeof faq.template === 'function' ? faq.template() : faq.template;
      return {
        type: "faq",
        text: responseText,
      };
    }
  }

  // 5. Unknown query friendly response
  return {
    type: "unknown",
    text: {
      en: `I want to make sure I assist you perfectly! 😊\n\nI can help you with:\n• 📅 **Appointments** - Book, cancel, or reschedule\n• 🏥 **Services & Fees** - List of consultation pricing\n• 💳 **Medical Aid** - Coverage information\n• 📍 **Location & Directions** - Where to find us in Brooklyn\n• ⏰ **Operating Hours** - Open times\n\nFeel free to type what you need help with, or click one of the quick action buttons. If you'd like, I can transfer this chat to our human reception team.`,
      af: `Ek wil seker maak ek help u perfek! 😊\n\nEk kan u help met:\n• 📅 **Afsprake** - Bespreek, kanselleer of herskeduleer\n• 🏥 **Dienste & Pryse** - Lys van konsultasietariewe\n• 💳 **Mediese Fondse** - Inligting oor dekking\n• 📍 **Ligging & Aanwysings** - Waar om ons te vind in Brooklyn\n• ⏰ **Bedryfsure** - Oop tye\n\nTik gerus waarmee u hulp benodig, of klik op een van die vinnige aksieknoppies.`,
      zu: `Ngifuna ukwenza isiqiniseko sokuthi ngikusiza ngokuphelele! 😊\n\nNgingakusiza nge:\n• 📅 **Ama-Aphoyintimenti** - Bhukha, khansela, noma hlehlisa\n• 🏥 **Izinsiza Nezimali** - Uhlu lwamanani wokubonisana\n• 💳 **Medical Aid** - Imininingwane mayelana nokukhokhela\n• 📍 **Indawo Nezikhombisi-ndlela** - Lapho sitholakala khona eBrooklyn\n• ⏰ **Amahora Wokusebenza** - Izikhathi zokuvula\n\nZizwe ukhululekile ukubhala lokho okudinga usizo ngakho, noma uchofoze inkinobho esheshayo.`,
    }[lang],
  };
};

export const getContext = () => conversationContext;