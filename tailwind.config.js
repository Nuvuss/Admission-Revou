/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Red Hat Display"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Red Hat Text"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Red Hat Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#141412',
          2: '#4B4B46',
          3: '#8A8A84',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          2: '#F5F5F2',
          3: '#EBEBE6',
        },
        borderLine: {
          DEFAULT: '#E8E8E4',
          2: '#D9D9D4',
        },
        revouYellow: {
          DEFAULT: '#FFD84D',
          hover: '#FFCC1A',
          soft: '#FFF6D1',
          on: '#141412',
        },
        statusOk: '#1F7A4D',
        statusWarn: '#A15C00',
        statusErr: '#B42318',
      },
      boxShadow: {
        card: '0 1px 3px rgba(20,20,18,0.05), 0 4px 16px rgba(20,20,18,0.04)',
        hover: '0 2px 6px rgba(20,20,18,0.07), 0 8px 24px rgba(20,20,18,0.06)',
      },
      borderRadius: {
        r: '14px',
      }
    },
  },
  plugins: [],
};
