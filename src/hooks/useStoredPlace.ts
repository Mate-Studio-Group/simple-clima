import { useCallback, useEffect, useState } from 'react';

import { DEFAULT_PLACE } from '../constants';
import { loadStoredPlace, saveStoredPlace } from '../services/placeStorage';
import type { Place } from '../types';

type UseStoredPlace = {
  place: Place;
  /** false mientras se lee el storage, para no pedir el clima dos veces. */
  ready: boolean;
  selectPlace: (place: Place) => void;
  resetToDefault: () => void;
};

/** Ciudad activa, hidratada desde el storage y persistida al cambiarla. */
export function useStoredPlace(): UseStoredPlace {
  const [place, setPlace] = useState<Place>(DEFAULT_PLACE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    loadStoredPlace().then((stored) => {
      if (!active) return;
      if (stored) setPlace(stored);
      setReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  const selectPlace = useCallback((next: Place) => {
    setPlace(next);
    void saveStoredPlace(next);
  }, []);

  const resetToDefault = useCallback(() => {
    selectPlace(DEFAULT_PLACE);
  }, [selectPlace]);

  return { place, ready, selectPlace, resetToDefault };
}
