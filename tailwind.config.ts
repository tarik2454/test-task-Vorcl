import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        customBlue: {
          100: '#0070F3',
        },
        customPink: {
          100: '#FF6AFD',
        },
        mainPrimaryText: '#FFFFFF',
        mainBackground: '#121212',
        secondaryBackground: '#171717',
        white: '#FFFFFF',
        current: 'currentColor',
        transparent: 'transparent',
      },
      fontFamily: {
        sans: ['Inter-400', 'sans-serif'],
        'inter-500': ['Inter-500', 'sans-serif'],
        'inter-600': ['Inter-600', 'sans-serif'],
        'inter-700': ['Inter-700', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', '1.25'],
        sm: ['14px', '1.4'],
        // base: ['16px', '1.5'],
        // lg: ['18px', '1.5'],
        xl: ['20px', '1.4'],
        // '2xl': ['24px', '1.3'],
        // '4xl': ['36px', '0.9'],
      },
      screens: {
        sm: '375px',
        md: '768px',
        lg: '-1px',
        xl: '1440px',
        '2xl': '-1px',
      },

      borderRadius: {
        sm: '10px',
        md: '11px',
        lg: '12px',
        xl: '24px',
      },
      boxShadow: {
        custom: '0 2px 25px rgba(0, 112, 243, 0.59)',
      },
      transitionDuration: {
        '250': '250ms',
      },
    },
  },

  plugins: [
    nextui({
      layout: {
        dividerWeight: '1px',
        disabledOpacity: 0.5,

        fontSize: {
          tiny: '0.75rem',
          small: '0.875rem',
          medium: '1rem',
          large: '1.125rem',
        },
        lineHeight: {
          tiny: '1rem',
          small: '1.25rem',
          medium: '1.5rem',
          large: '1.75rem',
        },
        radius: {
          small: '8px',
          medium: '12px',
          large: '14px',
        },
        borderWidth: {
          small: '1px',
          medium: '2px',
          large: '3px',
        },
      },
      themes: {
        light: {
          layout: {},
        },
        dark: {
          layout: {},
        },
      },
    }),
  ],
} satisfies Config;
