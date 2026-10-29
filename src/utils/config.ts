export const BRAND_CONFIG = {
  name: 'Learnova',
  tagline: 'A New Way to Learn.',
  founder: {
    name: 'Himanshu Shrivastava',
    experienceYears: 2,
    scope: 'Classes 1–10 (All Subjects)',
    mode: 'Offline Tuition',
    linkedin: 'https://www.linkedin.com/in/himanshu-shrivastava-dev/',
  },
  contact: {
    // Configurable via VITE_BRAND_PHONE_DISPLAY / VITE_BRAND_PHONE_RAW in .env
    phoneDisplay: import.meta.env.VITE_BRAND_PHONE_DISPLAY || 'Contact via Enquiry / WhatsApp',
    phoneRaw: import.meta.env.VITE_BRAND_PHONE_RAW || '',
    whatsappRaw: import.meta.env.VITE_BRAND_WHATSAPP || '',
    email: import.meta.env.VITE_BRAND_EMAIL || 'contact@learnova.local',
  },
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
};

