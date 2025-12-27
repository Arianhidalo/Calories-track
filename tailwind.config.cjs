/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        "primary-dark": '#059669',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(16, 185, 129, 0.15)',
      },
    },
  },
  plugins: [],
};
