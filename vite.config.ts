import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          atelier: path.resolve(__dirname, 'atelier/index.html'),
          glow: path.resolve(__dirname, 'glow/index.html'),
          spice: path.resolve(__dirname, 'spice/index.html'),
          covenant: path.resolve(__dirname, 'covenant/index.html'),
          estate: path.resolve(__dirname, 'estate/index.html'),
          launch: path.resolve(__dirname, 'launch/index.html'),
          folio: path.resolve(__dirname, 'folio/index.html'),
          pulse: path.resolve(__dirname, 'pulse/index.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
