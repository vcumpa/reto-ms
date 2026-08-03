/**
 * Valor real que persiste el backend para el estado de una carga
 * (CargaEstadoExtensions.ToStorageValue en ControlModels.cs).
 */
export type CargaEstadoStorage =
  | 'PENDIENTE'
  | 'EN_PROCESO'
  | 'CARGADO'
  | 'FINALIZADO'
  | 'NOTIFICADO'
  | 'RECHAZADO'
  | 'BLOQUEADO';

/** GET /api/cargas → CargaArchivoResponseDto[] */
export interface CargaArchivo {
  idCarga: number;
  nombreArchivo: string;
  usuario: string;
  periodo: string;
  estado: CargaEstadoStorage;
  rutaStorage?: string | null;
  fechaRegistro?: string | null;
  fechaFin?: string | null;
  observacion?: string | null;
}

/** GET /api/cargas/{id}/detalle → DataProcesadaEntity[] (registros ya insertados) */
export interface CargaDetalleRegistro {
  id: number;
  idCarga: number;
  numeroFila?: number | null;
  codigoProducto: string;
  periodo: string;
  descripcion?: string | null;
  monto?: number | null;
  estado?: string | null;
  observacion?: string | null;
  fechaRegistro?: string | null;
  fechaProceso?: string | null;
}

/** GET /api/cargas/{id}/auditoria → AuditoriaCargaEntity[] (errores/duplicados) */
export interface CargaAuditoriaRegistro {
  id: number;
  idCarga: number;
  filaNumero?: number | null;
  codigoProducto?: string | null;
  motivoError: string;
  estadoRegistro: string;
  fechaRegistro?: string | null;
}

/** GET /api/cargas/{id}/historial → CargaHistorialEntity[] (timeline de estados) */
export interface CargaHistorialEntrada {
  id: number;
  idCarga: number;
  estado: CargaEstadoStorage;
  fechaRegistro: string;
  usuario: string;
  observacion?: string | null;
}

/** Respuesta 202 Accepted de POST /api/control/cargar */
export interface CargaUploadResponse {
  mensaje: string;
  idCarga: number;
  archivo: string;
  rutaStorage: string;
  estado: CargaEstadoStorage;
}

/** Respuesta 409 Conflict de POST /api/control/cargar (periodo duplicado/bloqueado) */
export interface CargaUploadConflict {
  idCarga: number;
  estado: CargaEstadoStorage;
  mensaje: string;
}
