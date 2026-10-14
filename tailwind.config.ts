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
        // PANTONE Trio Theme:
        // 1. Layout Dasar: PANTONE 11-4201 Cloud Dancer (#F0EEE9)
        cloudDancer: {
          50: '#FDFDFC',
          100: '#F7F6F3',
          200: '#F0EEE9', // Layout Dasar (Base Canvas)
          300: '#E5E1D8',
          400: '#D5CFC3',
          500: '#B8AF9F',
          600: '#948B7A',
        },
        // 2. Highlight: PANTONE 11-0515 Lemon Icing (#F6EBC8)
        lemonIcing: {
          50: '#FEFCF5',
          100: '#FAF4DE',
          200: '#F6EBC8', // Highlight Signature
          300: '#EEDFA7',
          400: '#E3CF7E',
          500: '#CDB34C',
          600: '#A99030',
          700: '#7E6B1D',
          800: '#4D410E',
          900: '#2A2306',
        },
        // 3. Ornamen: PANTONE 13-4306 Ice Melt (#D3E4F1)
        iceMelt: {
          50: '#F5F9FD',
          100: '#E7F1F8',
          200: '#D3E4F1', // Ornamen Biru Ice Melt
          300: '#B5D3E8',
          400: '#8EBEDE',
          500: '#5F9ECB',
          600: '#3D7FA9',
          700: '#286084', // High-contrast interactive Deep Ice Melt
          800: '#1D4661',
          900: '#132E40',
        },
        // Functional Brand Palette Mappings
        brand: {
          50: '#FAF4DE',
          100: '#F6EBC8', // Lemon Icing
          200: '#D3E4F1', // Ice Melt
          300: '#B5D3E8',
          400: '#5F9ECB',
          500: '#286084', // Deep Ice Melt for accessible primary CTA
          600: '#1D4661',
          700: '#132E40',
          800: '#4D410E',
          900: '#2A2306',
          950: '#151E28',
        },
        gov: {
          canvas: '#F0EEE9',
          canvasAlt: '#FFFFFF',
          content: '#2B323B',
          strong: '#181E24',
          medium: '#55606D',
          subtle: '#7E8B99',
          divider: '#D3E4F1',
          dividerStrong: '#B5D3E8',
        },
      },
      boxShadow: {
        'sg-card': '0 4px 20px -2px rgba(40, 96, 132, 0.06)',
        'sg-glow': '0 0 25px -4px rgba(246, 235, 200, 0.4)',
        'sg-pill': '0 2px 10px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
};
export default config;
