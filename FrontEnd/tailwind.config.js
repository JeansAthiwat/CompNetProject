/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        handwritten: ['Dancing Script', 'cursive'],
      },
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          stroke: '#4338ca',
        },
        muted: {
          foreground: '#6b7280',
        },
        background: '#f3f4f6',
      },
      boxShadow: {
        'paper': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
} 