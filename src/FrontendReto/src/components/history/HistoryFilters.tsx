import { Search, X } from 'lucide-react';
import { Button, Select, type SelectOption } from '@/components/common';
import { ESTADO_ORDER, getEstadoVisual } from '@/utils';

export interface HistoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  estado: string;
  onEstadoChange: (value: string) => void;
  periodo: string;
  onPeriodoChange: (value: string) => void;
  periodOptions: SelectOption[];
  onClear: () => void;
  hasActiveFilters: boolean;
}

const ESTADO_OPTIONS: SelectOption[] = ESTADO_ORDER.map((estado) => ({
  value: estado,
  label: getEstadoVisual(estado).label,
}));

export function HistoryFilters({
  search,
  onSearchChange,
  estado,
  onEstadoChange,
  periodo,
  onPeriodoChange,
  periodOptions,
  onClear,
  hasActiveFilters,
}: HistoryFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
      <div className="flex-1">
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Buscar
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Id, observación o usuario…"
            className="dark:bg-surface-900 focus:border-brand-500 focus:ring-brand-500/20 h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:outline-none dark:border-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="w-full sm:w-44">
        <Select
          label="Estado"
          placeholder="Todos"
          value={estado}
          onChange={(event) => onEstadoChange(event.target.value)}
          options={ESTADO_OPTIONS}
        />
      </div>

      <div className="w-full sm:w-40">
        <Select
          label="Periodo"
          placeholder="Todos"
          value={periodo}
          onChange={(event) => onPeriodoChange(event.target.value)}
          options={periodOptions}
        />
      </div>

      {hasActiveFilters && (
        <Button type="button" variant="ghost" size="md" onClick={onClear}>
          <X className="size-4" aria-hidden />
          Limpiar
        </Button>
      )}
    </div>
  );
}
