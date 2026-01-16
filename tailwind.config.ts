/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
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
      },
    },
    plugins: [],
  }