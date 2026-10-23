/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0B0914",
          surface: "#131024",
          surfaceCard: "#181432",
          surfaceHover: "#211C44",
          border: "rgba(255, 255, 255, 0.08)",
          borderGlow: "rgba(0, 240, 255, 0.25)",
          yellow: "#E5FE40",
          yellowGlow: "rgba(229, 254, 64, 0.4)",
          cyan: "#00F0FF",
          cyanGlow: "rgba(0, 240, 255, 0.4)",
          muted: "#9490B8",
          purple: "#7C3AED",
          rose: "#FF3366",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Syne', 'sans-serif'],
        display: ['"Bebas Neue"', 'sans-serif'],
      },
      boxShadow: {
        'neon-yellow': '0 0 20px -3px rgba(229, 254, 64, 0.35)',
        'neon-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.35)',
        'cyber-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
