import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadCarga, type UploadCargaParams } from '@/services';
import { CARGAS_QUERY_KEY } from './useCargas';

/** POST /api/control/cargar. Al terminar, invalida la lista de cargas para que Dashboard/Historial se refresquen solos. */
export function useUploadCarga() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UploadCargaParams) => uploadCarga(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CARGAS_QUERY_KEY] });
    },
  });
}
