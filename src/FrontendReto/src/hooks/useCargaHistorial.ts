import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getCargaHistorial } from '@/services';
import type { CargaHistorialEntrada } from '@/types';

type RefetchInterval = UseQueryOptions<CargaHistorialEntrada[]>['refetchInterval'];

/** GET /api/cargas/{id}/historial. */
export function useCargaHistorial(idCarga: number, refetchInterval?: RefetchInterval) {
  return useQuery<CargaHistorialEntrada[]>({
    queryKey: ['carga-historial', idCarga],
    queryFn: () => getCargaHistorial(idCarga),
    enabled: Number.isFinite(idCarga),
    refetchInterval,
  });
}
