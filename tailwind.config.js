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
          DEFAULT: '#0B0B1A',
          mid: '#13132B',
          light: '#1C1C3D',
        },
        amber: {
          DEFAULT: '#F5A623',
          dim: '#c47e10',
          glow: '#F8E71C',
        },
        green: '#1A7A3C',
        red: '#C0392B',
        white: '#ffffff',
        muted: 'rgba(255,255,255,0.5)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '20px',
        '3xl': '28px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
