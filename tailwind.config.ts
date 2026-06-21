/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'

export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          'bounce-pop': {
            '0%':   { transform: 'scale(1)' },
            '35%':  { transform: 'scale(0.72)' },
            '65%':  { transform: 'scale(1.22)' },
            '82%':  { transform: 'scale(0.94)' },
            '100%': { transform: 'scale(1)' },
          },
        },
        animation: {
          'bounce-pop': 'bounce-pop 0.38s cubic-bezier(0.36,0.07,0.19,0.97)',
        },
        colors: {
          primary: '#3B82F6',
          secondary: '#60A5FA',
          tertiary: '#93C5FD',
          quaternary: '#BFDBFE',
          quinary: '#DBEAFE',
          senary: '#EFF6FF',
          septenary: '#F3F4F6',
          octonary: '#F9FAFB',
          nonary: '#F3F4F6',
        },
        typography: {
          DEFAULT: {
            css: {
              maxWidth: 'none',
              color: 'inherit',
              a: {
                color: 'inherit',
                textDecoration: 'underline',
                fontWeight: '500',
              },
              strong: {
                color: 'inherit',
              },
              p: {
                marginTop: '0.5em',
                marginBottom: '0.5em',
              },
            },
          },
        },
      },
    },
    plugins: [require("tailwindcss-animate"), typography],
  }