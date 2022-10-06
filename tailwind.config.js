/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/blog/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [require('@tailwindcss/typography')],
  theme: {
    extend: {},
  },
    theme: {
    extend: {
      typography: {
        // Remove backticks from code blocks
        DEFAULT: {
          css: {
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
      },
    },
    }

}
