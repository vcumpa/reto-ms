import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getCargas, type GetCargasParams } from '@/services';
import type { CargaArchivo } from '@/types';

/** Prefijo de query key compartido — se reutiliza para invalidar tras una subida (Fase 6). */
export const CARGAS_QUERY_KEY = 'cargas';

type RefetchInterval = UseQueryOptions<CargaArchivo[]>['refetchInterval'];

/**
 * Lista real de cargas (GET /api/cargas). `refetchInterval` acepta
 * un número fijo (Dashboard: cada 15s) o una función que decide en cada
 * tick si seguir sondeando según el propio dato más reciente — así el
 * Detalle de carga (Fase 8) puede detener el polling en cuanto detecta
 * que su carga llegó a un estado terminal, sin coordinarlo desde afuera.
 */
export function useCargas(params?: GetCargasParams, refetchInterval?: RefetchInterval) {
  return useQuery<CargaArchivo[]>({
    queryKey: [CARGAS_QUERY_KEY, params?.periodo ?? null],
    queryFn: () => getCargas(params),
    refetchInterval,
  });
}
