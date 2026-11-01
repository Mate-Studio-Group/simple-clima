/**
 * Etiqueta legible para un día del pronóstico.
 * El índice 0 es hoy y el 1 mañana; el resto muestra el día de la semana.
 */
export function formatDayLabel(iso: string, index: number): string {
  if (index === 0) return 'Hoy';
  if (index === 1) return 'Mañana';

  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = date.toLocaleDateString('es-AR', { weekday: 'long' });

  return `${capitalize(weekday)} ${day}/${month}`;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
