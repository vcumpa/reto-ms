import { ChevronDown, Menu, Moon, Sun } from 'lucide-react';
import { useAuth, useTheme } from '@/hooks';
import { formatDate } from '@/utils';

export interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const displayName = user?.email ?? 'Invitado';
  const displayRole = user?.role ?? 'Sin sesión';

  return (
    <header className="dark:bg-surface-900/80 sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6 dark:border-slate-800">
      <button
        onClick={onMenuClick}
        aria-label="Abrir menú"
        className="dark:hover:bg-surface-800 rounded-md p-2 text-slate-500 hover:bg-slate-100 md:hidden"
      >
        <Menu className="size-5" />
      </button>

      <span className="hidden text-sm text-slate-400 md:block">
        {formatDate(new Date())}
      </span>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="dark:hover:bg-surface-800 rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400"
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {displayName}
          </p>
          <p className="text-xs text-slate-400">{displayRole}</p>
        </div>
        <div className="bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 flex size-9 items-center justify-center rounded-full text-sm font-semibold">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <ChevronDown className="hidden size-4 text-slate-400 sm:block" aria-hidden />
      </div>
    </header>
  );
}
