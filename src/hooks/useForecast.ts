import { useCallback, useEffect, useState } from 'react';

import { fetchForecast, toUserMessage } from '../api';
import type { Forecast, Place } from '../types';

type UseForecast = {
  forecast: Forecast | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

/**
 * Pronóstico de una ubicación, recargable con pull-to-refresh.
 * `enabled` evita pedir datos antes de saber qué ciudad tiene guardada.
 */
export function useForecast(place: Place, enabled: boolean): UseForecast {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (target: Place) => {
    setLoading(true);
    setError(null);
    try {
      setForecast(await fetchForecast(target));
    } catch (cause) {
      setError(toUserMessage(cause));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) void load(place);
  }, [enabled, place, load]);

  const reload = useCallback(() => {
    void load(place);
  }, [load, place]);

  return { forecast, loading, error, reload };
}
