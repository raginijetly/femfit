declare module "*.css";

// Vite environment variable typings
interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_GOOGLE_LOGIN_URI?: string;
  // add other env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
