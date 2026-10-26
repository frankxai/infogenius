import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
    // A key in `define` is inlined into the public JS bundle, so only the local
    // dev server may receive one. Production builds are BYOK: visitors paste
    // their own key, which stays in their browser's localStorage.
    const devKey = command === 'serve'
      ? loadEnv(mode, '.', '').GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''
      : '';
    return {
      server: {
        port: 3000,
        // The dev server may hold a key (see above), so it stays on this machine
        // unless someone opts in with `vite --host`.
        host: 'localhost',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(devKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(devKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
