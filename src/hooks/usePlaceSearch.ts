import { useCallback, useState } from 'react';

import { searchPlaces, toUserMessage } from '../api';
import { MIN_QUERY_LENGTH } from '../constants';
import type { Place } from '../types';

type UsePlaceSearch = {
  query: string;
  setQuery: (value: string) => void;
  results: Place[];
  loading: boolean;
  error: string | null;
  /** true cuando la búsqueda terminó sin resultados. */
  empty: boolean;
  search: () => void;
  reset: () => void;
};

/** Búsqueda de ciudades por nombre. */
export function usePlaceSearch(): UsePlaceSearch {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [empty, setEmpty] = useState(false);

  const search = useCallback(() => {
    const term = query.trim();
    if (term.length < MIN_QUERY_LENGTH) {
      setError(`Escribí al menos ${MIN_QUERY_LENGTH} caracteres.`);
      return;
    }

    setLoading(true);
    setError(null);
    setEmpty(false);

    searchPlaces(term)
      .then((found) => {
        setResults(found);
        setEmpty(found.length === 0);
      })
      .catch((cause) => {
        setResults([]);
        setError(toUserMessage(cause));
      })
      .finally(() => setLoading(false));
  }, [query]);

  const reset = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setEmpty(false);
    setLoading(false);
  }, []);

  return { query, setQuery, results, loading, error, empty, search, reset };
}
