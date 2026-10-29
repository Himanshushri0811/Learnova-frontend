/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BRAND_PHONE_DISPLAY?: string;
  readonly VITE_BRAND_PHONE_RAW?: string;
  readonly VITE_BRAND_WHATSAPP?: string;
  readonly VITE_BRAND_EMAIL?: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

