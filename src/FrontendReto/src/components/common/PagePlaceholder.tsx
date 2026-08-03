import { Construction, type LucideIcon } from 'lucide-react';
import { Card } from './Card';

export interface PagePlaceholderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function PagePlaceholder({
  title,
  description,
  icon: Icon = Construction,
}: PagePlaceholderProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="max-w-md p-8 text-center">
        <div className="bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
          <Icon className="size-6" aria-hidden />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </Card>
    </div>
  );
}
