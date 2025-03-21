import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  base: '/anerdguynow/',
  plugins: [react()],
});
