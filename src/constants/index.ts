import type { Place } from '../types';

export const STORAGE_KEYS = {
  place: 'clima:place',
} as const;

export const DEFAULT_PLACE: Place = {
  name: 'Buenos Aires',
  admin1: 'Ciudad Autónoma de Buenos Aires',
  country: 'Argentina',
  latitude: -34.6131,
  longitude: -58.3772,
};

/** Días de pronóstico a pedir a la API. */
export const FORECAST_DAYS = 7;

/** Mínimo de caracteres antes de disparar una búsqueda de ciudad. */
export const MIN_QUERY_LENGTH = 2;

/** Cantidad de resultados de geocodificación a mostrar. */
export const SEARCH_RESULT_LIMIT = 6;

/** Timeout de las llamadas HTTP, en milisegundos. */
export const REQUEST_TIMEOUT_MS = 10_000;

/** Atribución exigida por la licencia CC BY 4.0 de Open-Meteo. */
export const ATTRIBUTION_TEXT = 'Datos del clima: Open-Meteo.com';
export const ATTRIBUTION_URL = 'https://open-meteo.com/';
