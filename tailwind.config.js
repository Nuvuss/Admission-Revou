/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'Menlo', 'monospace'],
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
        '2xs': '0 1px 2px 0 rgba(20, 20, 18, 0.04)',
        xs: '0 1px 3px 0 rgba(20, 20, 18, 0.06), 0 1px 2px -1px rgba(20, 20, 18, 0.04)',
        card: '0 1px 3px rgba(20,20,18,0.05), 0 4px 16px rgba(20,20,18,0.04)',
        hover: '0 2px 6px rgba(20,20,18,0.07), 0 8px 24px rgba(20,20,18,0.06)',
      },
      backdropBlur: {
        xs: '2px',
      },
      scale: {
        97: '0.97',
        98: '0.98',
      },
      spacing: {
        '0.2': '0.05rem',
      },
      borderWidth: {
        3: '3px',
      },
      borderRadius: {
        r: '14px',
      }
    },
  },
  plugins: [],
};
