import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/common';
import { cn } from '@/utils';

export interface KpiCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accentClassName?: string;
}

export function KpiCard({ label, value, icon: Icon, accentClassName }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <div
            className={cn(
              'flex size-8 items-center justify-center rounded-lg',
              accentClassName ??
                'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300',
            )}
          >
            <Icon className="size-4" aria-hidden />
          </div>
        </div>
        <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {value}
        </p>
      </Card>
    </motion.div>
  );
}
