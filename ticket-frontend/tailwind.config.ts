// import type { Config } from 'tailwindcss';

// const config: Config = {
//   content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
//   theme: {
//     extend: {
//       colors: {
//         paper: '#d3d5da',
//         surface: '#d8d2d2',
//         ink: '#171A21',
//         muted: '#515253',
//         hairline: '#57585c',
//         accent: {
//           DEFAULT: '#3348B3',
//           soft: '#a7aab5',
//         },
//         status: {
//           open: '#B5590A',
//           openSoft: '#a09a95',
//           progress: '#2941b8',
//           progressSoft: '#b7b9c2',
//           closed: '#1E7A4C',
//           closedSoft: '#a9b0ad',
//         },
//         danger: '#B3272C',
//       },
//       fontFamily: {
//         sans: ['var(--font-plex-sans)', 'system-ui', 'sans-serif'],
//         mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
//       },
//     },
//   },
//   plugins: [],
// };

// export default config; 

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F4F5F8',
        surface: '#FFFFFF',
        ink: '#12141C',
        muted: '#5B6072',
        hairline: '#E3E5EC',
        accent: {
          DEFAULT: '#2F3FA8',
          soft: '#ECEEFA',
        },
        status: {
          open: '#B5590A',
          openSoft: '#FBEEE0',
          progress: '#2F3FA8',
          progressSoft: '#ECEEFA',
          closed: '#187A4C',
          closedSoft: '#E3F5EA',
        },
        danger: '#C0272C',
      },
      fontFamily: {
        sans: ['var(--font-plex-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(18, 20, 28, 0.04), 0 1px 8px rgba(18, 20, 28, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;