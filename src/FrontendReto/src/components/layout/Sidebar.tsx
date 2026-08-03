import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  History,
  LayoutDashboard,
  LogOut,
  Upload,
  UploadCloud,
  UserCircle,
  X,
} from 'lucide-react';
import { ROUTES } from '@/routes/paths';
import { useAuth } from '@/hooks';
import { Button, Modal } from '@/components/common';
import { cn } from '@/utils';

const NAV_ITEMS = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.upload, label: 'Subir Excel', icon: Upload },
  { to: ROUTES.history, label: 'Historial', icon: History },
  { to: ROUTES.profile, label: 'Perfil', icon: UserCircle },
];

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    setConfirmOpen(false);
    navigate(ROUTES.login);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200',
          'dark:bg-surface-900 dark:border-slate-800',
          'md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5 dark:border-slate-800">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <UploadCloud className="text-brand-600 size-5" aria-hidden />
            <span>Carga Masiva</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="dark:hover:bg-surface-800 rounded-md p-1 text-slate-400 hover:bg-slate-100 md:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                    : 'dark:hover:bg-surface-800 text-slate-600 hover:bg-slate-100 dark:text-slate-300',
                )
              }
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-3 dark:border-slate-800">
          <button
            onClick={() => setConfirmOpen(true)}
            className="dark:hover:bg-surface-800 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300"
          >
            <LogOut className="size-4" aria-hidden />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Cerrar sesión"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmLogout}>
              Cerrar sesión
            </Button>
          </>
        }
      >
        ¿Seguro que deseas cerrar la sesión actual?
      </Modal>
    </>
  );
}
