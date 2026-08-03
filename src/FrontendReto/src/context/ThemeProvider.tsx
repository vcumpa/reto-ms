import { useEffect, useState, type ReactNode } from 'react';
import {
  getStoredTheme,
  getSystemTheme,
  setStoredTheme,
  type ThemePreference,
} from '@/utils/themeStorage';
import { ThemeContext } from './ThemeContext';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(
    () => getStoredTheme() ?? getSystemTheme(),
  );

  // Aplica la clase "dark" al <html> cada vez que cambia el tema.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Si el usuario no eligió un tema explícito, sigue el del sistema
  // mientras la app está abierta (cambios de modo claro/oscuro en vivo).
  useEffect(() => {
    if (getStoredTheme()) return;
    let mediaQuery: MediaQueryList;
    try {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    } catch {
      return;
    }
    const handleChange = (event: MediaQueryListEvent) => {
      setThemeState(event.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (next: ThemePreference) => {
    setThemeState(next);
    setStoredTheme(next);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
