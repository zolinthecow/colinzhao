/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "foreground": "#cccccc",
        'background': '#1f1f1f',
        "input.background": "#313131",
        "input.border": "#3c3c3c",
        "input.foreground": "#cccccc",
        "input.placeholderForeground": "#818181",
      },
    },
  },
  plugins: [],
}

