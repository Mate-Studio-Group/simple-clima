import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../constants';
import type { Place } from '../types';
import { isPlace } from '../utils';

/**
 * Persistencia de la ciudad elegida.
 * Nunca lanza: si el storage falla la app sigue con la ciudad por defecto.
 */
export async function loadStoredPlace(): Promise<Place | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.place);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isPlace(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function saveStoredPlace(place: Place): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.place, JSON.stringify(place));
  } catch {
    // Guardar la preferencia es opcional; no vale interrumpir al usuario.
  }
}
