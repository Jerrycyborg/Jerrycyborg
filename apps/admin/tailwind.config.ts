import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        saffron: '#F2994A',
        teal: '#118473',
        ivory: '#FAFAF7',
        charcoal: '#141826'
      }
    }
  },
  plugins: []
};

export default config;
