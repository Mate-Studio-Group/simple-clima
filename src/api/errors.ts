/** Error con un mensaje ya listo para mostrarle al usuario. */
export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const ERROR_MESSAGES = {
  offline: 'Sin conexión. Revisá tu internet e intentá de nuevo.',
  timeout: 'El servicio tardó demasiado en responder. Probá de nuevo.',
  forecast: 'No pudimos obtener el clima en este momento.',
  search: 'No pudimos buscar la ciudad en este momento.',
  unexpected: 'Ocurrió un error inesperado.',
} as const;

/** Convierte cualquier error en un mensaje mostrable. */
export function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return ERROR_MESSAGES.unexpected;
}
