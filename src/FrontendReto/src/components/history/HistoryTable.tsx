import { ChevronDown, ChevronUp, ChevronsUpDown, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CargaArchivo } from '@/types';
import { StatusBadge } from '@/components/status';
import { buildHistoryDetailPath } from '@/routes/paths';

export type HistorySortKey = 'idCarga' | 'observacion' | 'periodo' | 'usuario';

export interface SortConfig {
  key: HistorySortKey;
  direction: 'asc' | 'desc';
}

export interface HistoryTableProps {
  cargas: CargaArchivo[];
  sortConfig: SortConfig;
  onSort: (key: HistorySortKey) => void;
}

const COLUMNS: { key: HistorySortKey; label: string }[] = [
  { key: 'idCarga', label: 'IdCarga' },
  { key: 'periodo', label: 'Periodo' },
  { key: 'usuario', label: 'Usuario' },
  { key: 'observacion', label: 'Observación' },
];

export function HistoryTable({ cargas, sortConfig, onSort }: HistoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs tracking-wide text-slate-400 uppercase dark:border-slate-800">
            {COLUMNS.map((column) => (
              <th key={column.key} className="py-2 pr-4 font-medium">
                <button
                  type="button"
                  onClick={() => onSort(column.key)}
                  className="inline-flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {column.label}
                  <SortIcon
                    active={sortConfig.key === column.key}
                    direction={sortConfig.direction}
                  />
                </button>
              </th>
            ))}
            <th className="py-2 pr-4 font-medium">Estado</th>
            <th className="py-2 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cargas.map((carga) => (
            <tr
              key={carga.idCarga}
              className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
            >
              <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                #{carga.idCarga}
              </td>
              <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                {carga.periodo}
              </td>
              <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                {carga.usuario}
              </td>
              <td className="py-2.5 pr-4 font-medium text-slate-900 dark:text-slate-100">
                {carga.observacion?.trim() ? carga.observacion : '—'}
              </td>
              <td className="py-2.5 pr-4">
                <StatusBadge estado={carga.estado} />
              </td>
              <td className="py-2.5">
                <Link
                  to={buildHistoryDetailPath(carga.idCarga)}
                  className="hover:text-brand-600 dark:hover:text-brand-400 inline-flex items-center gap-1 text-slate-500 dark:text-slate-400"
                  aria-label={`Ver detalle de la carga #${carga.idCarga}`}
                >
                  <Eye className="size-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SortIcon({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) {
  if (!active) return <ChevronsUpDown className="size-3 text-slate-300" aria-hidden />;
  return direction === 'asc' ? (
    <ChevronUp className="size-3" aria-hidden />
  ) : (
    <ChevronDown className="size-3" aria-hidden />
  );
}
