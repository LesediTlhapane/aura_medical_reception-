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
    { id: "gp", name: "General Practitioner", duration: "20 mins", price: "R650" },
    { id: "dentist", name: "Dentist & Oral Health", duration: "45 mins", price: "R850" },
    { id: "dermatologist", name: "Dermatologist & Skin Care", duration: "30 mins", price: "R900" },
    { id: "womens-health", name: "Women's Health Specialist", duration: "30 mins", price: "R750" },
    { id: "physiotherapy", name: "Physiotherapy & Rehab", duration: "45 mins", price: "R700" },
    { id: "vaccinations", name: "Vaccinations & Immunizations", duration: "15 mins", price: "R300" }
  ],
  doctors: [
    { name: "Dr. Smith", specialty: "General Practitioner", id: "gp", gender: "male" },
    { name: "Dr. Patel", specialty: "Dentist", id: "dentist", gender: "female" },
    { name: "Dr. Williams", specialty: "Dermatologist", id: "dermatologist", gender: "male" },
    { name: "Dr. Naidoo", specialty: "Women's Health", id: "womens-health", gender: "female" }
  ],
  medicalAids: [
    { name: "Discovery Health", status: "Full Cover" },
    { name: "Bonitas", status: "Full Cover" },
    { name: "Momentum Health", status: "Co-pay applies" },
    { name: "Fedhealth", status: "Full Cover" },
    { name: "Cash / Private Patients", status: "Card & EFT accepted" }
  ],
  logistics: {
    parking: "Free secure underground and open patient parking available",
    accessibility: "Full wheelchair ramps, elevators, and dedicated disabled parking bays",
    security: "24/7 guarded security, access control, and CCTV monitoring"
  }
};
