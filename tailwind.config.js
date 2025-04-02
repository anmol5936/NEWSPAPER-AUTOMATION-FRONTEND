/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-blue-gray': '#6A89A7',
        'custom-light-blue': '#BDDDFC',
        'custom-medium-blue': '#88BDF2',
        'custom-dark-blue': '#384959',
      },
    },
  },
  plugins: [],
};
