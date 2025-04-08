// tailwind.config.js
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/typography'), // For `.prose` classes
    ],
  };
  
module.exports = {
    darkMode: 'class', // or 'media'
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }

