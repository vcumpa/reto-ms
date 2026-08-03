import { useCallback, useState, type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ToastItem, type ToastTone } from '@/components/common';
import { ToastContext, type ShowToastInput } from './ToastContext';

interface ToastEntry {
  id: string;
  tone: ToastTone;
  message: string;
}

const AUTO_DISMISS_MS = 5000;

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ tone = 'info', message }: ShowToastInput) => {
      const id = generateId();
      setToasts((current) => [...current, { id, tone, message }]);
      window.setTimeout(() => dismissToast(id), AUTO_DISMISS_MS);
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto w-full max-w-sm">
              <ToastItem {...toast} onDismiss={dismissToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
