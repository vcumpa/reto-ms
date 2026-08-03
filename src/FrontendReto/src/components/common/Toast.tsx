import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

export type ToastTone = 'success' | 'danger' | 'info';

export interface ToastItemProps {
  id: string;
  tone: ToastTone;
  message: string;
  onDismiss: (id: string) => void;
}

const TONE_CONFIG: Record<ToastTone, { icon: typeof Info; className: string }> = {
  success: {
    icon: CheckCircle2,
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
  },
  danger: {
    icon: AlertCircle,
    className:
      'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
  },
  info: {
    icon: Info,
    className:
      'border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-900 dark:bg-brand-950 dark:text-brand-200',
  },
};

export function ToastItem({ id, tone, message, onDismiss }: ToastItemProps) {
  const { icon: Icon, className } = TONE_CONFIG[tone];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-lg border px-4 py-3 shadow-[var(--shadow-card-hover)]',
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={() => onDismiss(id)}
        aria-label="Cerrar notificación"
        className="shrink-0 opacity-60 hover:opacity-100"
      >
        <X className="size-3.5" />
      </button>
    </motion.div>
  );
}
