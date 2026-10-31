import { REQUEST_TIMEOUT_MS } from '../constants';
import { ApiError, ERROR_MESSAGES } from './errors';

/**
 * GET con timeout que devuelve JSON tipado.
 * Cualquier fallo sale como ApiError con un mensaje mostrable:
 * no distinguimos a nivel de UI entre un 500 y un DNS caído.
 */
export async function getJson<T>(url: string, failureMessage: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new ApiError(failureMessage);
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAbortError(error)) throw new ApiError(ERROR_MESSAGES.timeout);
    // fetch solo rechaza por red; un JSON inválido cae acá también.
    throw new ApiError(ERROR_MESSAGES.offline);
  } finally {
    clearTimeout(timeout);
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}
