/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base del API Gateway. En desarrollo se usa el proxy de Vite y esta
   *  variable no es necesaria (rutas relativas); en build de producción sí
   *  debe apuntar al Gateway real (p. ej. https://gateway.miapp.com). */
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_APP_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
