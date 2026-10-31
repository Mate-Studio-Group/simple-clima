/** Una ubicación geográfica elegible por el usuario. */
export type Place = {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
};

/** Pronóstico de un día. */
export type ForecastDay = {
  date: string;
  code: number;
  max: number;
  min: number;
  /** Probabilidad de precipitación (%), o null si la API no la informa. */
  rain: number | null;
};

/** Clima actual + pronóstico de los próximos días. */
export type Forecast = {
  currentTemp: number;
  currentCode: number;
  days: ForecastDay[];
};

/** Traducción de un código WMO a algo mostrable. */
export type WeatherDescription = {
  icon: string;
  text: string;
};
