import type { Place } from '../types';

/** "Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina" */
export function formatPlaceLabel(place: Place): string {
  return [place.name, place.admin1, place.country].filter(Boolean).join(', ');
}

/** Clave estable para usar como `key` en listas. */
export function placeKey(place: Place): string {
  return `${place.latitude},${place.longitude},${place.name}`;
}

/** Valida que un objeto leído del storage tenga la forma de un Place. */
export function isPlace(value: unknown): value is Place {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<Place>;
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.latitude === 'number' &&
    typeof candidate.longitude === 'number' &&
    Number.isFinite(candidate.latitude) &&
    Number.isFinite(candidate.longitude)
  );
}
