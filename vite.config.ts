import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const cleanUrlPlugin = (): Plugin => ({
  name: 'multi-page-clean-urls',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const parsedUrl = req.url ? new URL(req.url, 'http://localhost') : null;
      if (parsedUrl) {
        const pathname = parsedUrl.pathname.replace(/^\/|\/$/g, '');
        const pages = ['admin', 'about', 'skills', 'projects', 'papers', 'certificates', 'resume', 'contact'];
        if (pages.includes(pathname)) {
          req.url = `/${pathname}.html${parsedUrl.search}`;
        }
      }
      next();
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), cleanUrlPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          skills: path.resolve(__dirname, 'skills.html'),
          projects: path.resolve(__dirname, 'projects.html'),
          papers: path.resolve(__dirname, 'papers.html'),
          certificates: path.resolve(__dirname, 'certificates.html'),
          resume: path.resolve(__dirname, 'resume.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          admin: path.resolve(__dirname, 'admin.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
