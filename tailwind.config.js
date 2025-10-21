/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function({ addVariant }) {
      addVariant('mobile-version', '.mobile-version &')
    }
  ],
}

