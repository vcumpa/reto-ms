export type ThemePreference = 'light' | 'dark';

const THEME_KEY = 'carga_masiva_theme';

export function getStoredTheme(): ThemePreference | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

export function setStoredTheme(theme: ThemePreference): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* noop */
  }
}

/** Preferencia de color del sistema operativo. 'light' si no se puede detectar. */
export function getSystemTheme(): ThemePreference {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}
