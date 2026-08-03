import { Bell, CheckCircle2, Clock, Layers, RefreshCw, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, EmptyState, ErrorState, Skeleton } from '@/components/common';
import {
  KpiCard,
  RecentUploadsTable,
  StatusDistributionChart,
} from '@/components/dashboard';
import { useCargas } from '@/hooks';
import { computeCargaStats, getApiErrorMessage } from '@/utils';
import { ROUTES } from '@/routes/paths';

const DASHBOARD_REFETCH_MS = 15_000;

export function DashboardPage() {
  const {
    data: cargas,
    isLoading,
    isError,
    error,
    refetch,
  } = useCargas(undefined, DASHBOARD_REFETCH_MS);

  if (isLoading) {
    return (
      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
        <Skeleton className="h-64 sm:col-span-2 lg:col-span-2" />
        <Skeleton className="h-64 sm:col-span-2 lg:col-span-3" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorState
          description={getApiErrorMessage(
            error,
            'No se pudieron cargar las estadísticas del dashboard.',
          )}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const stats = computeCargaStats(cargas ?? []);
  const recent = [...(cargas ?? [])]
    .sort(
      (a, b) =>
        new Date(b.fechaRegistro ?? 0).getTime() -
        new Date(a.fechaRegistro ?? 0).getTime(),
    )
    .slice(0, 5);

  if (stats.total === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={UploadCloud}
          title="Todavía no hay cargas registradas"
          description="Sube tu primer archivo Excel para empezar a ver estadísticas aquí."
          action={
            <Link to={ROUTES.upload}>
              <Button size="sm">Subir Excel</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Resumen general de las cargas masivas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Total de cargas" value={stats.total} icon={Layers} />
        <KpiCard
          label="Pendientes"
          value={stats.porEstado.PENDIENTE}
          icon={Clock}
          accentClassName="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
        />
        <KpiCard
          label="En proceso"
          value={stats.porEstado.EN_PROCESO}
          icon={RefreshCw}
          accentClassName="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
        />
        <KpiCard
          label="Finalizadas"
          value={stats.porEstado.FINALIZADO}
          icon={CheckCircle2}
          accentClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
        />
        <KpiCard
          label="Notificadas"
          value={stats.porEstado.NOTIFICADO}
          icon={Bell}
          accentClassName="bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Distribución por estado
          </h2>
          <StatusDistributionChart data={stats.porEstado} total={stats.total} />
        </Card>

        <Card className="p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Últimas cargas
            </h2>
            <Link
              to={ROUTES.history}
              className="text-brand-600 dark:text-brand-400 text-xs font-medium hover:underline"
            >
              Ver todas
            </Link>
          </div>
          <RecentUploadsTable cargas={recent} />
        </Card>
      </div>
    </div>
  );
}
