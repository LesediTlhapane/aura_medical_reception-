import { clinicData } from '../data/clinicData';

export const detectEmergency = (text) => {
  const lowercase = text.toLowerCase();
  const emergencyKeywords = [
    "chest pain", "breathing difficulty", "severe bleeding", "difficulty breathing",
    "stroke", "numbness", "heart attack", "unconscious", "unresponsive", "high fever baby",
    "poison", "suicid", "choking", "seizure", "convuls", "broken bone", "fracture"
  ];
  
  return emergencyKeywords.some(keyword => lowercase.includes(keyword));
};

export const matchSpecialist = (text) => {
  const lowercase = text.toLowerCase();
  
  if (lowercase.match(/\b(tooth|teeth|dentist|dental|mouth|gum|filling|crown|cavity|orthodont)\b/)) {
    return clinicData.services.find(s => s.id === "dentist");
  }
  if (lowercase.match(/\b(skin|dermatologist|acne|rash|mole|eczema|psoriasis|skin cancer)\b/)) {
    return clinicData.services.find(s => s.id === "dermatologist");
  }
  if (lowercase.match(/\b(women|pregnancy|pregnant|gynae|contracep|birth control|pap smear|prenatal)\b/)) {
    return clinicData.services.find(s => s.id === "womens-health");
  }
  if (lowercase.match(/\b(back pain|physio|rehab|joint|muscle|sprain|injury|physiotherapy|massage)\b/)) {
    return clinicData.services.find(s => s.id === "physiotherapy");
  }
  if (lowercase.match(/\b(vaccine|vaccination|baby check|flu shot|immuniz|booster|covid shot)\b/)) {
    return clinicData.services.find(s => s.id === "vaccinations");
  }
  if (lowercase.match(/\b(gp|doctor|general practitioner|flu|fever|cough|sick|checkup|prescrip|consult)\b/)) {
    return clinicData.services.find(s => s.id === "gp");
  }
  
  return null;
};

export const getResponse = (text, language = 'en') => {
  const lowercase = text.toLowerCase().trim();
  
  // Emergency check first
  if (detectEmergency(lowercase)) {
    return {
      type: "emergency",
      text: {
        en: `🚨 **EMERGENCY DETECTED** 🚨\n\nThis appears to be a medical emergency. Please do NOT wait. Contact our Emergency Line immediately at **${clinicData.emergencyPhone}** or Netcare 911 / ER24 (082 911 / 084 124).\n\nOur address is: **${clinicData.address}**.`,
        af: `🚨 **NOODGEVAL BESPEUR** 🚨\n\nDit blyk 'n mediese noodgeval te wees. Moet asseblief NIE wag nie. Kontak ons Noodlyn onmiddellik by **${clinicData.emergencyPhone}** of Netcare 911 / ER24 (082 911 / 084 124).\n\nOns adres is: **${clinicData.address}**.`,
        zu: `🚨 **KUTHOLAKALE INTSHIKAMISELO** 🚨\n\nLokhu kubonakala kuwushaka oluphuthumayo. Sicela UNGALINDI. Xhumana Nocingo lwethu Olusebenzayo ngokushesha kwa **${clinicData.emergencyPhone}** noma uNetcare 911 / ER24 (082 911 / 084 124).\n\nIkheli lethu lithi: **${clinicData.address}**.`
      }[language]
    };
  }

  // Triage check
  const recommendedSpecialist = matchSpecialist(lowercase);
  // Ensure we only trigger triage when a specialist was matched and any of the trigger words are present
  if (recommendedSpecialist && (
    lowercase.includes('need') ||
    lowercase.includes('book') ||
    lowercase.includes('have') ||
    lowercase.includes('pain') ||
    lowercase.includes('hurt') ||
    lowercase.includes('dentist') ||
    lowercase.includes('skin') ||
    lowercase.includes('physio') ||
    lowercase.includes('doctor')
  )) {
    const doctor = clinicData.doctors.find(d => d.id === recommendedSpecialist.id);
    const docText = doctor ? ` with ${doctor.name}` : "";
    return {
      type: "triage",
      specialist: recommendedSpecialist,
      text: {
        en: `I can certainly help you book an appointment for **${recommendedSpecialist.name}**${docText}.\n\nStandard duration is **${recommendedSpecialist.duration}** and the consultation fee is **${recommendedSpecialist.price}**.\n\nWould you like me to request this appointment for you?`,
        af: `Ek kan jou beslis help om 'n afspraak te bespreek vir **${recommendedSpecialist.name}**${docText}.\n\nStandaard duur is **${recommendedSpecialist.duration}** en die konsultasiefooi is **${recommendedSpecialist.price}**.\n\nWil jy hê ek moet hierdie afspraak vir jou aanvra?`,
        zu: `Ngingakusiza ngempela ukubhukha i-aphoyintimenti ye **${recommendedSpecialist.name}**${docText}.\n\nIsikhathi esijwayelekile **${recommendedSpecialist.duration}** kanti imali yokubonisana **${recommendedSpecialist.price}**.\n\nUngathanda ngikucelele le aphoyintimenti?`
      }[language]
    };
  }

  // 1. Opening hours FAQ
  if (lowercase.match(/\b(hours|opening|open|close|saturday|sunday|time|times|weekend)\b/)) {
    return {
      type: "faq",
      text: {
        en: `Our operating hours at **${clinicData.name}** are:\n\n• **Weekdays:** ${clinicData.operatingHours.weekdays}\n• **Saturdays:** ${clinicData.operatingHours.saturday}\n• **Sundays & Holidays:** ${clinicData.operatingHours.sunday}`,
        af: `Ons bedryfsure by **${clinicData.name}** is:\n\n• **Weekdae:** ${clinicData.operatingHours.weekdays}\n• **Saterdae:** ${clinicData.operatingHours.saturday}\n• **Sondae & Vakansiedae:** ${clinicData.operatingHours.sunday}`,
        zu: `Izikhathi zethu zokusebenza kwa **${clinicData.name}** ziyi:\n\n• **Izinsuku zeviki:** ${clinicData.operatingHours.weekdays}\n• **Izimpelasonto (Mgqibelo):** ${clinicData.operatingHours.saturday}\n• **Sonto namaholide:** ${clinicData.operatingHours.sunday}`
      }[language]
    };
  }

  // 2. Medical Aid FAQ
  if (lowercase.match(/\b(medical aid|discovery|bonitas|momentum|fedhealth|medicalaid|insurance|cover|cash|card|eft)\b/)) {
    const list = clinicData.medicalAids.map(ma => `• **${ma.name}**: ${ma.status}`).join('\n');
    return {
      type: "faq",
      text: {
        en: `Yes, we accept major South African medical aids. Here is our status:\n\n${list}\n\nWe submit directly to medical aid. Cash/Private patients can pay via Card or EFT on the day of consultation.`,
        af: `Ja, ons aanvaar die meeste Suid-Afrikaanse mediese fondse. Hier is ons status:\n\n${list}\n\nOns eis direk vanaf mediese fondse. Kontant/Privaat pasiënte kan op die dag van die konsultasie per kaart of EFT betaal.`,
        zu: `Yebo, siyazamukela izikhwama zezempilo ezinkulu zaseNingizimu Afrika. Nansi isimo sethu:\n\n${list}\n\nSithumela ngqo esikhwameni sezempilo. Iziguli ezikhokha ukheshi zingakhokha ngeKhadi noma nge-EFT ngosuku lokubonana.`
      }[language]
    };
  }

  // 3. Pricing FAQ
  if (lowercase.match(/\b(price|cost|consultation|fees|fee|charge|how much|payment|co-pay|rates)\b/)) {
    const prices = clinicData.services.map(s => `• **${s.name}:** ${s.price} (~${s.duration})`).join('\n');
    return {
      type: "faq",
      text: {
        en: `Here is our consultation pricing structure:\n\n${prices}\n\n*Note: Rates may vary depending on medical aid scheme coverage and extra procedures.*`,
        af: `Hier is ons konsultasie-prysstruktuur:\n\n${prices}\n\n*Let wel: Tariewe kan verskil afhangende van mediese fonds dekking en ekstra prosedures.*`,
        zu: `Nansi imali yethu yokubonisana:\n\n${prices}\n\n*Qaphela: Izintengo zingahluka kuye ngokuthi isikhwama sakho sezempilo sikhokha kanjani nezinye izinto ezenziwayo.*`
      }[language]
    };
  }

  // 4. Location FAQ
  if (lowercase.match(/\b(located|location|where|address|map|directions|parking|pretoria|brooklyn|find|get to)\b/)) {
    return {
      type: "faq",
      text: {
        en: `We are located in Pretoria at:\n📍 **${clinicData.address}**\n\n• **Parking:** ${clinicData.logistics.parking}.\n• **Access:** ${clinicData.logistics.accessibility}.`,
        af: `Ons is geleë in Pretoria by:\n📍 **${clinicData.address}**\n\n• **Parkering:** ${clinicData.logistics.parking}.\n• **Toegang:** ${clinicData.logistics.accessibility}.`,
        zu: `Sitholakala ePitoli ekhelini elithi:\n📍 **${clinicData.address}**\n\n• **Ukupaka:** ${clinicData.logistics.parking}.\n• **Ukufikeleleka:** ${clinicData.logistics.accessibility}.`
      }[language]
    };
  }

  // 5. Cancel / Reschedule FAQ
  if (lowercase.match(/\b(cancel|reschedule|change|postpone|move|date)\b/)) {
    return {
      type: "faq",
      text: {
        en: `No problem at all. If you need to cancel or reschedule, please let us know at least **2 hours in advance** by calling us on **${clinicData.phone}** or emailing **${clinicData.email}** so we can release the slot.`,
        af: `Geen probleem nie. As jy moet kanselleer of herskeduleer, laat weet ons asseblief ten minste **2 uur voor die tyd** deur ons te bel by **${clinicData.phone}** of e-pos **${clinicData.email}** sodat ons die tydgleuf kan vrylaag.`,
        zu: `Akukho nkinga nakancane. Uma udinga ukukhansela noma ukuhlehlisa i-aphoyintimenti yakho, sicela usazise okungenani **amahora angu-2 ngaphambi kwesikhathi** ngokusifonele ku **${clinicData.phone}** noma nge-imeyili ku **${clinicData.email}**.`
      }[language]
    };
  }

  // 6. Services list FAQ
  if (lowercase.match(/\b(services|treatments|do you offer|treat|what do you do|what service|specialt)\b/)) {
    const svcs = clinicData.services.map(s => `• **${s.name}** (${s.duration})`).join('\n');
    return {
      type: "faq",
      text: {
        en: `We offer a comprehensive range of medical services at our practice:\n\n${svcs}\n\nWould you like me to help you request an appointment for any of these?`,
        af: `Ons bied 'n omvattende reeks mediese dienste by ons praktyk:\n\n${svcs}\n\nWil jy hê ek moet jou help om 'n afspraak vir enige van hierdie aan te vra?`,
        zu: `Sihlinzeka ngemisebenzi yezempilo ehlukahlukene kakhulu emtholampilo wethu:\n\n${svcs}\n\nUngathanda ngikusize ubhukhe i-aphoyintimenti kunoma yimiphi yalezi?`
      }[language]
    };
  }

  // Unknown questions handler
  return {
    type: "unknown",
    text: {
      en: `I'm sorry, I don't have the exact answer to that question in my database. 

However, I've recorded your enquiry and one of our human receptionists will contact you shortly to assist. 

Would you like to leave your contact details so we can get back to you?`,
      af: `Ek is jammer, ek het nie die presiese antwoord op daardie vraag in my databasis nie.

Ek het egter jou navraag aangeteken en een van ons menslike ontvangsdames sal jou binnekort kontak om te help.

Wil jy jou kontakbesonderhede nalaat sodat ons na jou kan terugkom?`,
      zu: `Ngiyaxolisa, anginayo impendulo eqondile yalo mbuzo kusizindalwazi sami.

Noma kunjalo, ngiyibhale phansi imibuzo yakho futhi omunye wabamukeli bethu bezivakashi uzoxhumana nawe maduze ukuze akusize.

Ungathanda ukushiya imininingwane yakho yokuxhumana ukuze sikwazi ukubuyela kuwe?`
    }[language]
  };
};
