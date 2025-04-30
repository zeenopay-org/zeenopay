import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import { VitePWA } from 'vite-plugin-pwa' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico'],
    manifest: {
      name: 'ZeenoPay',
      short_name: 'ZeenoPay',
      start_url: '/',
      display: 'standalone',
       "theme_color": "#000B44",
    "background_color": "#00035c",
      description: 'ZeenoPay is a platform that allows users to make payments for events and services using QR codes.',
      icons: [
        { src: '/assets/favicon.png', sizes: '192x192', type: 'image/png' },
        { src: '/assets/favicon.png', sizes: '512x512', type: 'image/png' }
      ]
    }
  })],
});
