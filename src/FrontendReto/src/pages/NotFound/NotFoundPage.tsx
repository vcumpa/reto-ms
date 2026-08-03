import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button, Card } from '@/components/common';
import { ROUTES } from '@/routes/paths';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="max-w-sm p-8 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300">
          <AlertTriangle className="size-6" aria-hidden />
        </div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Página no encontrada
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          La ruta que buscas no existe o fue movida.
        </p>
        <Link to={ROUTES.dashboard}>
          <Button className="mt-6 w-full">Volver al Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
