import type { WeatherDescription } from '../types';

/**
 * Traduce un código WMO de Open-Meteo a un emoji y una descripción en español.
 * Tabla de referencia: https://open-meteo.com/en/docs
 */
export function describeWeather(code: number): WeatherDescription {
  if (code === 0) return { icon: '☀️', text: 'Despejado' };
  if (code <= 2) return { icon: '🌤️', text: 'Parcialmente nublado' };
  if (code === 3) return { icon: '☁️', text: 'Nublado' };
  if (code <= 48) return { icon: '🌫️', text: 'Niebla' };
  if (code <= 57) return { icon: '🌦️', text: 'Llovizna' };
  if (code <= 67) return { icon: '🌧️', text: 'Lluvia' };
  if (code <= 77) return { icon: '❄️', text: 'Nieve' };
  if (code <= 82) return { icon: '🌧️', text: 'Chubascos' };
  if (code <= 86) return { icon: '🌨️', text: 'Chubascos de nieve' };
  return { icon: '⛈️', text: 'Tormenta' };
}
