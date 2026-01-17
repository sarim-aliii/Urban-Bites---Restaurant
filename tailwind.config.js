/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  corePlugins: {
    preflight: false, 
  },
  theme: {
    extend: {
      colors: {
        gold: {
          500: '#d4af37',
          600: '#b38b2d',
        },
        beige: {
          500: '#f5f5dc',
          600: '#dcdcdc',
          800: '#8b8b83',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Roboto"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}