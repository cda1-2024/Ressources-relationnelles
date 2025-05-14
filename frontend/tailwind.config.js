/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FDECEF",
          100: "#FAD1DA",
          200: "#F4A6B9",
          300: "#EE7B99",
          400: "#E85078",
          500: "#DD7596", // Couleur principale
          600: "#C66585",
          700: "#A6536F",
          800: "#85425A",
          900: "#6A3448",
        },
        secondary: {
          50: "#EEF2FF",
          100: "#DCE4FF",
          200: "#BCC7FF",
          300: "#9BAAFF",
          400: "#7A8DFF",
          500: "#8EA2FF", // Couleur secondaire
          600: "#6B7DFF",
          700: "#5565E6",
          800: "#404DBF",
          900: "#313C99",
        },
      },
    },
  },
  plugins: [],
}

