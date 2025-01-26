// tailwind.config.ts

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        darkGreen: '#152a25',
        gold: '#D4AF37',
      },
      backdropBlur: {
        '12px': '12px',
      },
      boxShadow: {
        'custom': '-5px 10px 50px rgba(0,0,0,0.5)'
      },
      borderRadius: {
        '16px': '16px',
      },
      borderWidth: {
        '1px': '1px',
      },
    },
  },
  plugins: [],
}
