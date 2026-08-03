import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { History as HistoryIcon, UploadCloud } from 'lucide-react';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Pagination,
  Skeleton,
  type SelectOption,
} from '@/components/common';
import {
  HistoryFilters,
  HistoryTable,
  type HistorySortKey,
  type SortConfig,
} from '@/components/history';
import { useCargas } from '@/hooks';
import { getApiErrorMessage, normalizeEstadoValue } from '@/utils';
import { ROUTES } from '@/routes/paths';
import type { CargaArchivo } from '@/types';

const PAGE_SIZE = 10;
const HISTORY_REFETCH_MS = 15_000;

export function HistoryPage() {
  const {
    data: cargas,
    isLoading,
    isError,
    error,
    refetch,
  } = useCargas(undefined, HISTORY_REFETCH_MS);

  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'idCarga',
    direction: 'desc',
  });
  const [page, setPage] = useState(1);

  const list = useMemo(() => cargas ?? [], [cargas]);

  const normalizePeriodoValue = (value: string | undefined | null) =>
    String(value ?? '').trim().replace(/[-\s]/g, '');

  const periodOptions: SelectOption[] = useMemo(() => {
    const unique = Array.from(
      new Set(list.map((c) => String(c.periodo ?? '').trim())),
    );
    return unique
      .sort()
      .reverse()
      .map((p) => ({ value: p, label: p }));
  }, [list]);

  const filtered = useMemo(() => {
    let result = list;
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((c) => {
        const idMatch = String(c.idCarga).includes(query);
        const observacionMatch = (c.observacion ?? '').toLowerCase().includes(query);
        const usuarioMatch = c.usuario.toLowerCase().includes(query);
        const archivoMatch = c.nombreArchivo.toLowerCase().includes(query);

        return idMatch || observacionMatch || usuarioMatch || archivoMatch;
      });
    }
    if (estado) {
      const normalizedEstado = normalizeEstadoValue(estado);
      if (normalizedEstado) {
        result = result.filter((c) => normalizeEstadoValue(c.estado) === normalizedEstado);
      }
    }
    if (periodo.trim()) {
      const normalizedPeriodo = normalizePeriodoValue(periodo);
      result = result.filter(
        (c) => normalizePeriodoValue(c.periodo) === normalizedPeriodo,
      );
    }
    return result;
  }, [list, search, estado, periodo]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const cmp = compareByKey(a, b, sortConfig.key);
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasActiveFilters = Boolean(search || estado || periodo);

  const handleSort = (key: HistorySortKey) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleClearFilters = () => {
    setSearch('');
    setEstado('');
    setPeriodo('');
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorState
          description={getApiErrorMessage(
            error,
            'No se pudo cargar el historial de cargas.',
          )}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={UploadCloud}
          title="Todavía no hay cargas registradas"
          description="Sube tu primer archivo Excel para verlo aquí."
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
          Historial de cargas
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {sorted.length} de {list.length} carga{list.length === 1 ? '' : 's'}
        </p>
      </div>

      <Card className="p-5">
        <HistoryFilters
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          estado={estado}
          onEstadoChange={(value) => {
            setEstado(value);
            setPage(1);
          }}
          periodo={periodo}
          onPeriodoChange={(value) => {
            setPeriodo(value);
            setPage(1);
          }}
          periodOptions={periodOptions}
          onClear={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="mt-5">
          {paged.length === 0 ? (
            <EmptyState
              icon={HistoryIcon}
              title="Sin resultados"
              description="Ningún registro coincide con los filtros aplicados."
              action={
                <Button variant="secondary" size="sm" onClick={handleClearFilters}>
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <HistoryTable cargas={paged} sortConfig={sortConfig} onSort={handleSort} />
          )}
        </div>

        {paged.length > 0 && (
          <div className="mt-5">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

function compareByKey(a: CargaArchivo, b: CargaArchivo, key: HistorySortKey): number {
  if (key === 'idCarga') return a.idCarga - b.idCarga;
  if (key === 'observacion') {
    return String(a.observacion ?? '').localeCompare(String(b.observacion ?? ''));
  }
  if (key === 'periodo') {
    return String(a.periodo).localeCompare(String(b.periodo));
  }
  return String(a.usuario).localeCompare(String(b.usuario));
}
