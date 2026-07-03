/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1A1A2E',
          mid: '#16213E',
          light: '#0F3460',
        },
        amber: {
          DEFAULT: '#F5A623',
          dim: '#c47e10',
        },
        green: '#1A7A3C',
        red: '#C0392B',
        white: '#ffffff',
        muted: 'rgba(255,255,255,0.5)',
      },
      borderRadius: {
        'xl': '14px',
      }
    },
  },
  plugins: [],
}
