const DEFAULT_API_BASE_URL = import.meta.env.PROD
  ? 'https://learnova-backend-mt3t.onrender.com/api/v1'
  : 'http://localhost:5000/api/v1';

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
    phoneDisplay: import.meta.env.VITE_BRAND_PHONE_DISPLAY || '6389687238',
    phoneRaw: import.meta.env.VITE_BRAND_PHONE_RAW || '6389687238',
    whatsappRaw: import.meta.env.VITE_BRAND_WHATSAPP || '916389687238',
    email: import.meta.env.VITE_BRAND_EMAIL || 'contact@learnova.local',
  },
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
};
