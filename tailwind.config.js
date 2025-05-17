/** @type {import('tailwindcss').Config} */
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
      // montserrat: ['Montserrat', 'sans-serif'],
    },
    extend: {
      fontSize: {
        huge: ["80rem", { lineHeight: "1" }],
      },
      height: {
        screen: "100dvh",
      },
      colors: {
        customBlue: "#000B44",
        customDarkBlue: "#00035c",
        customSky: "#009BE2",
      },
    },
  },
  plugins: [],
};
