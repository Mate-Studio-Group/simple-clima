/** Redondea y agrega el símbolo de grados. */
export function formatTemperature(value: number): string {
  return `${Math.round(value)}°`;
}
