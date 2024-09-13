/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_URL: string; // Define your custom environment variable here
  // Add other environment variables if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
