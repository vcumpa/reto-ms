import type { CargaAuditoriaRegistro } from '@/types';
import { Badge } from '@/components/common';

export interface AuditoriaTableProps {
  registros: CargaAuditoriaRegistro[];
}

export function AuditoriaTable({ registros }: AuditoriaTableProps) {
  if (registros.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-400">
        Sin errores ni duplicados registrados.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs tracking-wide text-slate-400 uppercase dark:border-slate-800">
            <th className="py-2 pr-4 font-medium">Fila</th>
            <th className="py-2 pr-4 font-medium">Código</th>
            <th className="py-2 pr-4 font-medium">Motivo</th>
            <th className="py-2 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) => (
            <tr
              key={registro.id}
              className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
            >
              <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                {registro.filaNumero ?? '—'}
              </td>
              <td className="py-2.5 pr-4 text-slate-900 dark:text-slate-100">
                {registro.codigoProducto ?? '—'}
              </td>
              <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                {registro.motivoError}
              </td>
              <td className="py-2.5">
                <Badge tone="warning">{registro.estadoRegistro}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
