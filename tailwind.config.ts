import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kemenag: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // data.gov.sg Singapore Open Data Portal palette
        brand: {
          50: '#f9f9fc',
          100: '#e4e1fb',
          200: '#c7c1f7',
          300: '#a89ff2',
          400: '#877cee',
          500: '#6253e8', // Signature electric violet / primary brand
          600: '#4e49a8', // hover
          700: '#44418b', // active
          800: '#2e2f55',
          900: '#151523', // deep canvas inverse / dark headline
          950: '#0c0d18',
        },
        gov: {
          masthead: '#f0f0f0',
          canvas: '#ffffff',
          canvasAlt: '#f9f9fc',
          content: '#474747',
          strong: '#2e2e2e',
          medium: '#686868',
          subtle: '#848484',
          divider: '#e9eaee',
          dividerStrong: '#bfbfbf',
        },
      },
      boxShadow: {
        'sg-card': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'sg-glow': '0 0 25px -4px rgba(98, 83, 232, 0.2)',
        'sg-pill': '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
export default config;
