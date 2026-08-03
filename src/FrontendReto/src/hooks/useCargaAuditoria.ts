import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getCargaAuditoria } from '@/services';
import type { CargaAuditoriaRegistro } from '@/types';

type RefetchInterval = UseQueryOptions<CargaAuditoriaRegistro[]>['refetchInterval'];

/** GET /api/cargas/{id}/auditoria — errores y duplicados. */
export function useCargaAuditoria(idCarga: number, refetchInterval?: RefetchInterval) {
  return useQuery<CargaAuditoriaRegistro[]>({
    queryKey: ['carga-auditoria', idCarga],
    queryFn: () => getCargaAuditoria(idCarga),
    enabled: Number.isFinite(idCarga),
    refetchInterval,
  });
}
