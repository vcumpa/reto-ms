// Smoke test temporal (no forma parte del proyecto entregado).
// Renderiza cada ruta con react-dom/server dentro de un MemoryRouter,
// reutilizando los mismos providers que App.tsx (QueryClientProvider,
// ToastProvider, AuthProvider), para detectar errores de runtime que
// tsc/eslint no detectan (imports circulares, hooks fuera de su
// provider, etc). No hay sesión real en este contexto: las rutas
// protegidas van a "renderizar" 0 caracteres porque <Navigate to="/login">
// no pinta DOM en un solo paso de SSR — eso es esperado, no un fallo.
import { createServer } from 'vite';

const routesToTest = [
  '/login',
  '/dashboard',
  '/subir-excel',
  '/historial',
  '/historial/123',
  '/notificaciones',
  '/perfil',
  '/ruta-que-no-existe',
];

async function main() {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  // Módulo puente: monta <AppRoutes/> dentro de los mismos providers que
  // App.tsx, pero con MemoryRouter (no hay window/history en Node SSR).
  const bridgeSource = `
    import React from 'react';
    import { renderToString } from 'react-dom/server';
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
    import { MemoryRouter } from 'react-router-dom';
    import { AuthProvider, ToastProvider } from '@/context';
    import { AppRoutes } from '@/routes';

    export function renderRoute(path) {
      const queryClient = new QueryClient();
      return renderToString(
        React.createElement(
          QueryClientProvider,
          { client: queryClient },
          React.createElement(
            ToastProvider,
            null,
            React.createElement(
              AuthProvider,
              null,
              React.createElement(
                MemoryRouter,
                { initialEntries: [path] },
                React.createElement(AppRoutes),
              ),
            ),
          ),
        ),
      );
    }
  `;

  const fs = await import('node:fs/promises');
  await fs.writeFile('./ssr-bridge.tsx', bridgeSource);

  let failures = 0;
  try {
    const mod = await server.ssrLoadModule('/ssr-bridge.tsx');
    for (const path of routesToTest) {
      try {
        const html = mod.renderRoute(path);
        const len = html.length;
        console.log(`OK   ${path.padEnd(24)} (${len} chars renderizados)`);
      } catch (err) {
        failures++;
        console.error(
          `FAIL ${path.padEnd(24)} ->`,
          err instanceof Error ? err.message : err,
        );
      }
    }
  } finally {
    await fs.unlink('./ssr-bridge.tsx').catch(() => {});
    await server.close();
  }

  if (failures > 0) {
    console.error(`\n${failures} ruta(s) fallaron.`);
    process.exit(1);
  }
  console.log('\nTodas las rutas renderizaron sin errores de runtime.');
}

main().catch((err) => {
  console.error('Error inesperado en el smoke test:', err);
  process.exit(1);
});
