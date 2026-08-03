import type { CargaDetalleRegistro } from '@/types';
import { formatDateTime } from '@/utils';

export interface ProcessedRecordsTableProps {
  registros: CargaDetalleRegistro[];
}

/**
 * Requisito literal del PDF ("Consultar el contenido del archivo excel
 * subido") — no basta con mostrar el conteo, hay que poder ver el
 * contenido real que quedó insertado.
 */
export function ProcessedRecordsTable({ registros }: ProcessedRecordsTableProps) {
  if (registros.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-400">
        Todavía no hay registros insertados para esta carga.
      </p>
    );
  }

  return (
    <div className="max-h-80 overflow-auto">
      <table className="w-full text-left text-sm">
        <thead className="dark:bg-surface-900 sticky top-0 bg-white">
          <tr className="border-b border-slate-100 text-xs tracking-wide text-slate-400 uppercase dark:border-slate-800">
            <th className="py-2 pr-4 font-medium">Código</th>
            <th className="py-2 pr-4 font-medium">Descripción</th>
            <th className="py-2 pr-4 font-medium">Periodo</th>
            <th className="py-2 pr-4 font-medium">Monto</th>
            <th className="py-2 font-medium">Fecha de proceso</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) => (
            <tr
              key={registro.id}
              className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
            >
              <td className="py-2.5 pr-4 font-medium text-slate-900 dark:text-slate-100">
                {registro.codigoProducto}
              </td>
              <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                {registro.descripcion ?? '—'}
              </td>
              <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                {registro.periodo}
              </td>
              <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                {registro.monto != null ? registro.monto.toLocaleString('es-PE') : '—'}
              </td>
              <td className="py-2.5 text-slate-500 dark:text-slate-400">
                {formatDateTime(registro.fechaProceso)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
