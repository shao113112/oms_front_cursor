/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'CameraPlainVariable',
          '"CameraPlainVariable Fallback"',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5',
          muted: '#E0E7FF',
        },
        header: {
          DEFAULT: '#0F172A',
          dark: '#020617',
        },
        content: {
          dark: '#1E293B',
          darker: '#0F172A',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          elevated: '#FFFFFF',
        },
      },
      borderRadius: {
        card: '16px',
        button: '10px',
        input: '10px',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgb(0 0 0 / 0.08), 0 4px 16px -4px rgb(0 0 0 / 0.06)',
        'soft-lg': '0 4px 20px -4px rgb(0 0 0 / 0.08), 0 8px 32px -8px rgb(0 0 0 / 0.08)',
        glow: '0 0 0 1px rgb(99 102 241 / 0.1), 0 4px 14px -2px rgb(99 102 241 / 0.2)',
        card: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
}
