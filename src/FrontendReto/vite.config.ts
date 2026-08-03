import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const gatewayTarget = env.VITE_API_BASE_URL || 'http://localhost:5000';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      port: 5173,
      // Proxy de desarrollo hacia el API Gateway.
      // El ApiGateway (YARP) no expone cabeceras CORS, así que en vez de
      // llamar a http://localhost:5000 directamente desde el navegador
      // (lo que el navegador bloquearía por CORS), el cliente Axios usa
      // rutas relativas ("/auth", "/api/control") y Vite las reenvía aquí.
      // Esto evita tocar el backend solo para poder desarrollar el frontend.
      proxy: {
        '/auth': {
          target: gatewayTarget,
          changeOrigin: true,
        },
        '/api': {
          target: gatewayTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      // Los mapas pesan varios MB y no son necesarios para la imagen de
      // producción. Pueden activarse explícitamente para un diagnóstico.
      sourcemap: env.VITE_SOURCEMAP === 'true',
    },
  };
});
