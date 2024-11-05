// frontEnd/vite.config.ts

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,
    port: 5173, // or the port you're using
    watch: {
      usePolling: true,
    },
  },
  plugins: [react()],
});
