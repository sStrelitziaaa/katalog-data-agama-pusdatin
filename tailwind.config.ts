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
        // Pantone Color of the Year 2025: PANTONE 17-1230 Mocha Mousse palette
        brand: {
          50: '#FAF7F5',  // Warm Cream
          100: '#F4ECE7', // Warm Latte Tint
          200: '#E5D5CD', // Soft Mocha Border
          300: '#D2B8AB', // Muted Warm Taupe
          400: '#BC9887', // Mocha Accent
          500: '#A47864', // Signature PANTONE 17-1230 Mocha Mousse (Primary)
          600: '#8E614E', // Rich Mocha (Hover)
          700: '#744D3D', // Deep Roasted Mocha (Active)
          800: '#5C3C2F', // Dark Cocoa
          900: '#3D261E', // Dark Espresso
          950: '#241611', // Deep Charcoal Espresso
        },
        gov: {
          masthead: '#f0f0f0',
          canvas: '#ffffff',
          canvasAlt: '#FAF7F5',
          content: '#474747',
          strong: '#2E231F',
          medium: '#68605A',
          subtle: '#8C8077',
          divider: '#EBE5E0',
          dividerStrong: '#CFC5BD',
        },
      },
      boxShadow: {
        'sg-card': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'sg-glow': '0 0 25px -4px rgba(164, 120, 100, 0.25)',
        'sg-pill': '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
export default config;
