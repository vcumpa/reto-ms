import { apiClient, ENDPOINTS } from '@/api';
import type {
  CargaArchivo,
  CargaAuditoriaRegistro,
  CargaDetalleRegistro,
  CargaHistorialEntrada,
  CargaUploadResponse,
} from '@/types';

interface CargaArchivoApiResponse {
  idCarga?: number;
  IdCarga?: number;
  nombreArchivo?: string | null;
  NombreArchivo?: string | null;
  usuario?: string | null;
  Usuario?: string | null;
  periodo?: string | number | null;
  Periodo?: string | number | null;
  estado?: string | null;
  Estado?: string | null;
  rutaStorage?: string | null;
  RutaStorage?: string | null;
  fechaRegistro?: string | null;
  FechaRegistro?: string | null;
  fechaFin?: string | null;
  FechaFin?: string | null;
  observacion?: string | null;
  Observacion?: string | null;
  mensaje?: string | null;
  Mensaje?: string | null;
}

export interface GetCargasParams {
  periodo?: string;
}

/** GET /api/cargas — lista completa (opcionalmente filtrada por periodo). */
export async function getCargas(params?: GetCargasParams): Promise<CargaArchivo[]> {
  const { data } = await apiClient.get<CargaArchivoApiResponse[]>(ENDPOINTS.control.cargas, {
    params,
  });

  return data.map((carga) => ({
    idCarga: carga.idCarga ?? carga.IdCarga ?? 0,
    nombreArchivo: carga.nombreArchivo ?? carga.NombreArchivo ?? '',
    usuario: carga.usuario ?? carga.Usuario ?? '',
    periodo: String(carga.periodo ?? carga.Periodo ?? ''),
    estado: (carga.estado ?? carga.Estado ?? 'PENDIENTE') as CargaArchivo['estado'],
    rutaStorage: carga.rutaStorage ?? carga.RutaStorage ?? null,
    fechaRegistro: carga.fechaRegistro ?? carga.FechaRegistro ?? null,
    fechaFin: carga.fechaFin ?? carga.FechaFin ?? null,
    observacion: carga.observacion ?? carga.Observacion ?? carga.mensaje ?? carga.Mensaje ?? null,
  }));
}

/** GET /api/cargas/{id}/historial — timeline de cambios de estado. */
export async function getCargaHistorial(
  idCarga: number,
): Promise<CargaHistorialEntrada[]> {
  const { data } = await apiClient.get<CargaHistorialEntrada[]>(
    ENDPOINTS.control.historial(idCarga),
  );
  return data;
}

/** GET /api/cargas/{id}/detalle — registros ya insertados (DataProcesada). */
export async function getCargaDetalle(idCarga: number): Promise<CargaDetalleRegistro[]> {
  const { data } = await apiClient.get<CargaDetalleRegistro[]>(
    ENDPOINTS.control.detalle(idCarga),
  );
  return data;
}

/** GET /api/cargas/{id}/auditoria — errores y duplicados detectados. */
export async function getCargaAuditoria(
  idCarga: number,
): Promise<CargaAuditoriaRegistro[]> {
  const { data } = await apiClient.get<CargaAuditoriaRegistro[]>(
    ENDPOINTS.control.auditoria(idCarga),
  );
  return data;
}

export interface UploadCargaParams {
  archivo: File;
  periodo: string;
  usuario: string;
  onUploadProgress?: (percent: number) => void;
}

/**
 * POST /api/cargas — multipart/form-data real (no JSON).
 *
 * apiClient trae por defecto Content-Type: application/json; hay que
 * quitarlo explícitamente en esta llamada para que el navegador calcule
 * el boundary del multipart automáticamente. Si se deja el header fijo
 * en "multipart/form-data" sin boundary, el backend no puede parsear el
 * body y el archivo llega vacío.
 */
export async function uploadCarga({
  archivo,
  periodo,
  usuario,
  onUploadProgress,
}: UploadCargaParams): Promise<CargaUploadResponse> {
  const formData = new FormData();
  formData.append('archivo', archivo);
  formData.append('periodo', periodo);
  formData.append('usuario', usuario);

  const { data } = await apiClient.post<CargaUploadResponse>(
    ENDPOINTS.control.cargas,
    formData,
    {
      headers: {
        'Content-Type': undefined,
      },
      onUploadProgress: (event) => {
        if (onUploadProgress && event.total) {
          onUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    },
  );
  return data;
}
