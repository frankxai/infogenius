/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  // Built at compile time so no third-party script runs on the page next to the stored API key.
  content: ['./index.html', './*.tsx', './components/**/*.tsx', './services/**/*.ts'],
  theme: {
    extend: {},
  },
  plugins: [],
};
