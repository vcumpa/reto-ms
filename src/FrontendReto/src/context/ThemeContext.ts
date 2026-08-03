import { createContext } from 'react';
import type { ThemePreference } from '@/utils/themeStorage';

export interface ThemeContextValue {
  theme: ThemePreference;
  toggleTheme: () => void;
  setTheme: (theme: ThemePreference) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
