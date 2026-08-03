import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getCargaDetalle } from '@/services';
import type { CargaDetalleRegistro } from '@/types';

type RefetchInterval = UseQueryOptions<CargaDetalleRegistro[]>['refetchInterval'];

/** GET /api/cargas/{id}/detalle — registros ya insertados. */
export function useCargaDetalle(idCarga: number, refetchInterval?: RefetchInterval) {
  return useQuery<CargaDetalleRegistro[]>({
    queryKey: ['carga-detalle', idCarga],
    queryFn: () => getCargaDetalle(idCarga),
    enabled: Number.isFinite(idCarga),
    refetchInterval,
  });
}
