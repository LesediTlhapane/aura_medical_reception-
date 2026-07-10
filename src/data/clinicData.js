export const clinicData = {
  name: "Sunrise Medical Centre",
  practiceNumber: "PR-1029485",
  phone: "012-345-6789",
  email: "info@sunrisemedical.co.za",
  address: "182 Florence Ribeiro Ave, Brooklyn, Pretoria, 0181",
  coordinates: { lat: -25.7712, lng: 28.2361 },
  emergencyPhone: "012-345-6911",
  operatingHours: {
    weekdays: "Monday - Friday: 08:00 - 17:00",
    saturday: "Saturday: 08:00 - 13:00",
    sunday: "Closed on Sundays & Public Holidays"
  },
  services: [
    { id: "gp", name: "General Practitioner Consultation", duration: "20 mins", price: "R650", desc: "Comprehensive check-up, prescription renewals, and general medical advice." },
    { id: "dentist", name: "Dentist & Oral Health Consultation", duration: "45 mins", price: "R850", desc: "Dental cleaning, fillings, check-up, and oral health diagnostics." },
    { id: "dermatologist", name: "Dermatologist & Skin Consultation", duration: "30 mins", price: "R900", desc: "Acne, eczema, mole mapping, rash evaluation, and skincare consultation." },
    { id: "womens-health", name: "Women's Health Specialist Consultation", duration: "30 mins", price: "R750", desc: "Pap smears, family planning, prenatal wellness checks, and consultations." },
    { id: "physiotherapy", name: "Physiotherapy & Rehab Session", duration: "45 mins", price: "R700", desc: "Musculoskeletal rehabilitation, dry needling, back and neck pain treatment." },
    { id: "vaccinations", name: "Vaccinations & Immunizations", duration: "15 mins", price: "R300", desc: "Flu vaccines, travel immunizations, and standard pediatric booster shots." }
  ],
  doctors: [
    {
      id: "gp",
      name: "Dr. Lerato Khumalo",
      specialty: "General Practitioner",
      gender: "female",
      experience: 12,
      rating: 4.9,
      availability: "Available Today",
      color: "from-sky-400 to-blue-500",
      avatarInitials: "LK"
    },
    {
      id: "dentist",
      name: "Dr. Amit Patel",
      specialty: "Dentist",
      gender: "male",
      experience: 8,
      rating: 4.8,
      availability: "Available Tomorrow",
      color: "from-emerald-400 to-teal-500",
      avatarInitials: "AP"
    },
    {
      id: "dermatologist",
      name: "Dr. Sarah Williams",
      specialty: "Dermatologist",
      gender: "female",
      experience: 15,
      rating: 4.9,
      availability: "Available Monday",
      color: "from-indigo-400 to-purple-500",
      avatarInitials: "SW"
    },
    {
      id: "womens-health",
      name: "Dr. Fatima Naidoo",
      specialty: "Women's Health Specialist",
      gender: "female",
      experience: 10,
      rating: 4.7,
      availability: "Available Today",
      color: "from-pink-400 to-rose-500",
      avatarInitials: "FN"
    },
    {
      id: "physiotherapy",
      name: "Dr. John Mchunu",
      specialty: "Physiotherapist",
      gender: "male",
      experience: 6,
      rating: 4.9,
      availability: "Available Tomorrow",
      color: "from-amber-400 to-orange-500",
      avatarInitials: "JM"
    },
    {
      id: "vaccinations",
      name: "Sr. Elizabeth Meyer",
      specialty: "Primary Care Nurse",
      gender: "female",
      experience: 20,
      rating: 5.0,
      availability: "Available Today",
      color: "from-teal-400 to-cyan-500",
      avatarInitials: "EM"
    }
  ],
  medicalAids: [
    { name: "Discovery Health", status: "Full Cover (Direct Claim)" },
    { name: "Bonitas", status: "Full Cover (Direct Claim)" },
    { name: "Momentum Health", status: "Co-pay may apply" },
    { name: "Fedhealth", status: "Full Cover (Direct Claim)" },
    { name: "Cash / Private Patients", status: "Card & EFT accepted with instant invoice" }
  ],
  logistics: {
    parking: "Free secure underground and open patient parking available",
    accessibility: "Full wheelchair ramps, elevators, and dedicated disabled parking bays",
    security: "24/7 guarded security, access control, and CCTV monitoring"
  }
};
