import { defineConfig } from 'windicss/helpers';

// const COLORS = ['red', 'green', 'purple', 'indigo', 'cyan', 'amber', 'lime'];
// function generateSafeList(dat: string[]) {
//   return [
//     ...dat.map((val) => [500, 400, 300, 50, 200, 100].map((r) => `bg-${val}-${r}`)),
//     ...dat.map((val) => [300, 400].map((r) => `hover:bg-${val}-${r}`)),
//   ];
// }

export default defineConfig({
  theme: {
    colors: {
      bbg: {
        light: '#d5e6e7',
        DEFAULT: '#e2f3f5',
      },
    },
  },
});
