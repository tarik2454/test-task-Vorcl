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
        customBlack: {
          100: '#27272A',
        },
        customBlue: {
          100: '#0070F3',
          200: '#006FEE',
        },
        customPink: {
          100: '#FF6AFD',
        },
        customGrey: {
          100: '#ECEDEE',
          200: '#D4D4D8',
        },
        mainPrimaryText: '#FFFFFF',
        mainBackground: '#121212',
        secondaryBackground: '#171717',
        white: '#FFFFFF',
        current: 'currentColor',
        transparent: 'transparent',
        success: '#17C964',
        warning: '#F5A524',
        danger: '#F31260',
      },
      fontFamily: {
        'inter-400': ['Inter-400', 'sans-serif'],
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
      // outlineWidth: {
      //   0: '0px',
      // },
      // input: {
      //   base: {
      //     background: 'transparent',
      //     color: 'red',
      //     placeholder: 'blue',
      //   },
      //   wrapper: {
      //     shadow: 'shadow-xl',
      //     background: '!bg-red-500',
      //     hover: 'hover:bg-default-200/70 dark:hover:bg-default/70',
      //     focus:
      //       'focus-within:!bg-default-200/50 dark:focus-within:!bg-default/60',
      //     cursor: '!cursor-text',
      //   },
      //   label: '!text-red',
      // },
    },
  },

  plugins: [
    nextui({
      // themes: {
      //   // extend: {},
      // },

      layout: {},
    }),
  ],
} satisfies Config;
