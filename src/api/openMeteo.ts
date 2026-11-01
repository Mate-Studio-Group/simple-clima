import {
  FORECAST_DAYS,
  SEARCH_RESULT_LIMIT,
} from '../constants';
import type {
  Forecast,
  ForecastDay,
  ForecastResponse,
  GeocodingResponse,
  Place,
} from '../types';
import { getJson } from './client';
import { ApiError, ERROR_MESSAGES } from './errors';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/** Clima actual y pronóstico de los próximos días para una ubicación. */
export async function fetchForecast(place: Place): Promise<Forecast> {
  const url =
    `${FORECAST_URL}?latitude=${place.latitude}&longitude=${place.longitude}` +
    '&current=temperature_2m,weather_code' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
    `&timezone=auto&forecast_days=${FORECAST_DAYS}`;

  const data = await getJson<ForecastResponse>(url, ERROR_MESSAGES.forecast);

  if (!data?.current || !Array.isArray(data?.daily?.time)) {
    throw new ApiError(ERROR_MESSAGES.forecast);
  }

  const days: ForecastDay[] = data.daily.time.map((date, index) => ({
    date,
    code: data.daily.weather_code[index],
    max: data.daily.temperature_2m_max[index],
    min: data.daily.temperature_2m_min[index],
    rain: data.daily.precipitation_probability_max?.[index] ?? null,
  }));

  return {
    currentTemp: data.current.temperature_2m,
    currentCode: data.current.weather_code,
    days,
  };
}

/** Busca ubicaciones por nombre usando la geocodificación de Open-Meteo. */
export async function searchPlaces(query: string): Promise<Place[]> {
  const url =
    `${GEOCODING_URL}?name=${encodeURIComponent(query)}` +
    `&count=${SEARCH_RESULT_LIMIT}&language=es&format=json`;

  const data = await getJson<GeocodingResponse>(url, ERROR_MESSAGES.search);

  return (data.results ?? []).map((result) => ({
    name: result.name,
    admin1: result.admin1,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}
