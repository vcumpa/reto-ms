import { useCallback } from 'react';
import { ArrowLeft, FileSearch } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, EmptyState, ErrorState, Skeleton } from '@/components/common';
import { ProcessTimeline } from '@/components/detail';
import { StatusBadge } from '@/components/status';
import {
  useCargaAuditoria,
  useCargaDetalle,
  useCargaHistorial,
  useCargas,
} from '@/hooks';
import { formatDateTime, getApiErrorMessage, isEstadoTerminal } from '@/utils';
import { ROUTES } from '@/routes/paths';
import type { CargaArchivo } from '@/types';

const POLL_MS = 5000;

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const idCarga = Number(id);

  // Estable entre renders (useCallback): evita que TanStack Query
  // reconstruya el temporizador de polling en cada actualización de datos.
  const headerRefetchInterval = useCallback(
    (query: { state: { data?: CargaArchivo[] } }) => {
      const current = query.state.data?.find((c) => c.idCarga === idCarga);
      if (!current) return POLL_MS;
      return isEstadoTerminal(current.estado) ? false : POLL_MS;
    },
    [idCarga],
  );

  const cargasQuery = useCargas(undefined, headerRefetchInterval);

  const header = cargasQuery.data?.find((c) => c.idCarga === idCarga);
  const isTerminal = header ? isEstadoTerminal(header.estado) : false;
  const pollInterval = isTerminal ? false : POLL_MS;

  const historialQuery = useCargaHistorial(idCarga, pollInterval);
  const detalleQuery = useCargaDetalle(idCarga, pollInterval);
  const auditoriaQuery = useCargaAuditoria(idCarga, pollInterval);

  if (!id || Number.isNaN(idCarga)) {
    return (
      <div className="p-6">
        <ErrorState
          title="Carga inválida"
          description="El identificador de la carga no es válido."
        />
      </div>
    );
  }

  if (cargasQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (cargasQuery.isError) {
    return (
      <div className="p-6">
        <ErrorState
          description={getApiErrorMessage(
            cargasQuery.error,
            'No se pudo cargar la carga.',
          )}
          onRetry={() => cargasQuery.refetch()}
        />
      </div>
    );
  }

  if (!header) {
    return (
      <div className="p-6">
        <EmptyState
          icon={FileSearch}
          title="Carga no encontrada"
          description={`No existe ninguna carga con el id ${idCarga}.`}
          action={
            <Link to={ROUTES.history}>
              <Button size="sm">Volver al historial</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const historial = historialQuery.data ?? [];
  const detalle = detalleQuery.data ?? [];
  const auditoria = auditoriaQuery.data ?? [];
  const rejectionEntry = historial.find(
    (h) => h.estado === 'RECHAZADO' || h.estado === 'BLOQUEADO',
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <Link
          to={ROUTES.history}
          className="inline-flex w-fit items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <ArrowLeft className="size-3.5" />
          Volver al historial
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {header.nombreArchivo}
          </h1>
          <StatusBadge estado={header.estado} />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Carga #{header.idCarga}
        </p>
      </div>

      {rejectionEntry && (
        <Card className="border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {rejectionEntry.estado === 'RECHAZADO'
              ? 'Esta carga fue rechazada.'
              : 'Esta carga fue bloqueada.'}
          </p>
          {rejectionEntry.observacion && (
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {rejectionEntry.observacion}
            </p>
          )}
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Información general
          </h2>
          <dl className="flex flex-col gap-3 text-sm">
            <InfoRow label="Periodo" value={header.periodo} />
            <InfoRow label="Usuario" value={header.usuario} />
            <InfoRow
              label="Fecha de registro"
              value={formatDateTime(header.fechaRegistro)}
            />
            <InfoRow
              label="Fecha de finalización"
              value={header.fechaFin ? formatDateTime(header.fechaFin) : '—'}
            />
          </dl>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {detalle.length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Registros insertados
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {auditoria.length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Errores / duplicados
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Línea de tiempo
          </h2>
          {historialQuery.isLoading ? (
            <Skeleton className="h-40" />
          ) : (
            <ProcessTimeline historial={historial} currentEstado={header.estado} />
          )}
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Listado formateado de la carga
        </h2>
        {detalleQuery.isLoading ? (
          <Skeleton className="h-24" />
        ) : (
          <div className="overflow-x-auto">
            {detalle.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No hay registros procesados para esta carga.
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                    <th className="py-2 pr-4 font-medium">Fila</th>
                    <th className="py-2 pr-4 font-medium">Periodo</th>
                    <th className="py-2 pr-4 font-medium">Código</th>
                    <th className="py-2 pr-4 font-medium">Descripción</th>
                    <th className="py-2 pr-4 font-medium">Estado</th>
                    <th className="py-2 pr-4 font-medium">Observación</th>
                    <th className="py-2 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {detalle.map((registro) => (
                    <tr
                      key={registro.id}
                      className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
                    >
                      <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                        {registro.numeroFila ?? registro.id}
                      </td>
                      <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-300">
                        {registro.periodo}
                      </td>
                      <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-300">
                        {registro.codigoProducto}
                      </td>
                      <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-300">
                        {registro.descripcion ?? '—'}
                      </td>
                      <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-300">
                        {registro.estado ?? 'Procesado'}
                      </td>
                      <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-300">
                        {registro.observacion ?? 'Registro procesado correctamente'}
                      </td>
                      <td className="py-2.5 text-slate-500 dark:text-slate-400">
                        {registro.fechaRegistro
                          ? formatDateTime(registro.fechaRegistro)
                          : registro.fechaProceso
                            ? formatDateTime(registro.fechaProceso)
                            : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-900 dark:text-slate-100">{value}</dd>
    </div>
  );
}
