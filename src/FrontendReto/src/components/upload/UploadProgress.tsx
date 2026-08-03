import { motion } from 'framer-motion';

export interface UploadProgressProps {
  percent: number;
}

export function UploadProgress({ percent }: UploadProgressProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Subiendo archivo…</span>
        <span>{percent}%</span>
      </div>
      <div className="dark:bg-surface-800 h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className="bg-brand-600 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </div>
  );
}
