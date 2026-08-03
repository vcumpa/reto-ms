import { Link } from 'react-router-dom';
import type { CargaArchivo } from '@/types';
import { StatusBadge } from '@/components/status';
import { buildHistoryDetailPath } from '@/routes/paths';

export interface RecentUploadsTableProps {
  cargas: CargaArchivo[];
}

export function RecentUploadsTable({ cargas }: RecentUploadsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs tracking-wide text-slate-400 uppercase dark:border-slate-800">
            <th className="py-2 pr-4 font-medium">IdCarga</th>
            <th className="py-2 pr-4 font-medium">Periodo</th>
            <th className="py-2 pr-4 font-medium">Usuario</th>
            <th className="py-2 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody>
          {cargas.map((carga) => (
            <tr
              key={carga.idCarga}
              className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
            >
              <td className="py-2.5 pr-4">
                <Link
                  to={buildHistoryDetailPath(carga.idCarga)}
                  className="hover:text-brand-600 dark:hover:text-brand-400 font-medium text-slate-900 dark:text-slate-100"
                >
                  #{carga.idCarga}
                </Link>
              </td>
              <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                {carga.periodo}
              </td>
              <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                {carga.usuario}
              </td>
              <td className="py-2.5">
                <StatusBadge estado={carga.estado} />
              </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
