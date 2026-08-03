/** Valor por defecto real del backend (UploadSettings:MaxFileSizeBytes en appsettings) si no se sobreescribe. */
const MAX_FILE_SIZE_BYTES_DEFAULT = 10 * 1024 * 1024;
const ALLOWED_EXTENSION = '.xlsx';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Replica las validaciones de CargaController.Cargar (extensión exacta y
 * tamaño máximo) para dar feedback inmediato, sin esperar el round-trip al
 * backend. El backend sigue siendo la autoridad final: si su límite
 * configurado difiere de este valor por defecto, su propio mensaje de
 * error (que si se muestra) lo indica con el número real.
 */
export function validateExcelFile(file: File): FileValidationResult {
  const dotIndex = file.name.lastIndexOf('.');
  const extension = dotIndex === -1 ? '' : file.name.slice(dotIndex).toLowerCase();
  if (extension !== ALLOWED_EXTENSION) {
    return { valid: false, error: 'Solo se permiten archivos con extensión .xlsx.' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES_DEFAULT) {
    const maxMb = MAX_FILE_SIZE_BYTES_DEFAULT / (1024 * 1024);
    return {
      valid: false,
      error: `El archivo excede el tamaño máximo permitido (${maxMb} MB).`,
    };
  }
  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
