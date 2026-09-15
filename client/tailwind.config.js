/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          navy: '#0F172A',
          purple: '#7C3AED',
          bg: '#F8FAFC',
          border: '#E2E8F0',
          muted: '#64748B',
          success: '#16A34A',
          warning: '#F59E0B',
          danger: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'hero-desktop': ['56px', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
        'hero-tablet': ['40px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'hero-mobile': ['34px', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'section-desktop': ['36px', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        'section-mobile': ['28px', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
      },
      maxWidth: {
        'site': '1200px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 12px 28px -6px rgba(15, 23, 42, 0.09), 0 8px 12px -6px rgba(15, 23, 42, 0.04)',
        'card-hover-xl': '0 20px 35px -8px rgba(15, 23, 42, 0.12), 0 10px 14px -6px rgba(15, 23, 42, 0.05)',
        'glow': '0 0 50px -10px rgba(37, 99, 235, 0.15), 0 0 40px -15px rgba(124, 58, 237, 0.12)',
        'glow-blue': '0 0 30px -5px rgba(37, 99, 235, 0.25)',
        'glow-purple': '0 0 30px -5px rgba(124, 58, 237, 0.25)',
        'glow-emerald': '0 0 30px -5px rgba(16, 185, 129, 0.25)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'fade-slide-up': 'fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
