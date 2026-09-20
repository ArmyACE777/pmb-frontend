/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
      },
      colors: {
        primary: '#1E3A8A',
        'primary-hover': '#172554',
        latar: '#F8FAFC',
        secound: '#2563EB',
        'bth-navy': '#1E3A8A',
        'bth-dark': '#0F172A',
        'bth-blue': '#2563EB',
        'bth-gold': '#D97706',
        'bth-gold-light': '#FEF3C7',
      },
      boxShadow: {
        'bth': '0 10px 30px -5px rgba(30, 58, 138, 0.08)',
        'bth-card': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
