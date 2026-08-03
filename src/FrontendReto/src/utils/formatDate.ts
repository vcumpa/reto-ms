/** Formatea fecha + hora en es-PE, ej. "01 ago 2026, 10:35". Tolera valores nulos/inválidos. */
export function formatDateTime(value: string | Date | null | undefined): string {
  const date = toValidDate(value);
  if (!date) return '—';
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** Formatea solo la fecha, ej. "01 ago 2026". */
export function formatDate(value: string | Date | null | undefined): string {
  const date = toValidDate(value);
  if (!date) return '—';
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function toValidDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const date = typeof value === 'string' ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? null : date;
}
