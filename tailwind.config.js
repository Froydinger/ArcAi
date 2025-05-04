/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // --- MODIFIED: Changed default sans font to Noto Sans ---
        sans: ['"Noto Sans"', 'sans-serif'], // Set Noto Sans as the default sans-serif font
      },
      colors: {
        // Define theme colors using CSS variables
        'theme': 'rgb(var(--theme-accent-rgb) / <alpha-value>)',
        'theme-primary': 'rgb(var(--theme-primary-rgb) / <alpha-value>)',
        'theme-secondary': 'rgb(var(--theme-secondary-rgb) / <alpha-value>)',
        'theme-accent': 'rgb(var(--theme-accent-rgb) / <alpha-value>)',
        'theme-background': 'rgb(var(--background-rgb) / <alpha-value>)',
        'theme-foreground': 'rgb(var(--foreground-rgb) / <alpha-value>)',
        'theme-muted': 'rgb(var(--muted-rgb) / <alpha-value>)',
        'theme-hover': 'rgba(var(--theme-accent-rgb), 0.1)', // Example hover color
      },
      backgroundImage: {
        'theme-gradient': 'linear-gradient(to right, rgb(var(--theme-primary-rgb)), rgb(var(--theme-secondary-rgb)))',
      },
      ringColor: {
        'theme': 'rgb(var(--theme-accent-rgb) / 0.5)',
      },
      boxShadowColor: {
         'theme': 'rgb(var(--theme-accent-rgb) / 0.3)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-scrollbar'), // Add the scrollbar plugin
  ],
}
