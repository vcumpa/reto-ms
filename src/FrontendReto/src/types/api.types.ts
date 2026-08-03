/** Forma real de los errores que devuelve ControlService (BadRequest/Conflict/Problem). */
export interface ApiErrorResponse {
  mensaje: string;
  statusCode?: number;
}
