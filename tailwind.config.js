/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        acada: ['Afacad Flux', 'sans-serif'],
      },
      backgroundImage: {
        primary:
          'linear-gradient(355deg, rgba(23,28,74,1) 21%, rgba(55,65,129,1) 69%)',
        nav: 'linear-gradient(274deg, rgba(43,50,101,1) 21%, rgba(36,44,108,1) 69%)',
        'nav-hover':
          'linear-gradient(274deg, rgba(59,66,120,1) 21%, rgba(55,63,122,1) 69%)',
      },
      colors: {
        'primary-text': '#fff',
        'secondary-text': '#000',
        accent: '#ce4a5d',
        highlight: '#FF474C',
      },
    },
  },
  plugins: [],
};
