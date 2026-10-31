import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Place = {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
};

type Day = {
  date: string;
  code: number;
  max: number;
  min: number;
  rain: number | null;
};

type Forecast = {
  currentTemp: number;
  currentCode: number;
  days: Day[];
};

const STORAGE_KEY = 'clima:place';

const DEFAULT_PLACE: Place = {
  name: 'Buenos Aires',
  admin1: 'Ciudad Autónoma de Buenos Aires',
  country: 'Argentina',
  latitude: -34.6131,
  longitude: -58.3772,
};

// Códigos WMO -> emoji + descripción
function describe(code: number): { icon: string; text: string } {
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

function dayLabel(iso: string, index: number): string {
  if (index === 0) return 'Hoy';
  if (index === 1) return 'Mañana';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const name = date.toLocaleDateString('es-AR', { weekday: 'long' });
  return name.charAt(0).toUpperCase() + name.slice(1) + ` ${d}/${m}`;
}

function placeLabel(p: Place): string {
  return [p.name, p.admin1, p.country].filter(Boolean).join(', ');
}

async function fetchForecast(p: Place): Promise<Forecast> {
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${p.latitude}&longitude=${p.longitude}` +
    '&current=temperature_2m,weather_code' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
    '&timezone=auto&forecast_days=7';
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo obtener el clima');
  const j = await res.json();
  const days: Day[] = j.daily.time.map((date: string, i: number) => ({
    date,
    code: j.daily.weather_code[i],
    max: j.daily.temperature_2m_max[i],
    min: j.daily.temperature_2m_min[i],
    rain: j.daily.precipitation_probability_max?.[i] ?? null,
  }));
  return {
    currentTemp: j.current.temperature_2m,
    currentCode: j.current.weather_code,
    days,
  };
}

async function searchPlaces(q: string): Promise<Place[]> {
  const url =
    'https://geocoding-api.open-meteo.com/v1/search' +
    `?name=${encodeURIComponent(q)}&count=6&language=es&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Falló la búsqueda');
  const j = await res.json();
  return (j.results ?? []).map((r: any) => ({
    name: r.name,
    admin1: r.admin1,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

export default function App() {
  const [place, setPlace] = useState<Place>(DEFAULT_PLACE);
  const [ready, setReady] = useState(false);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [searchBusy, setSearchBusy] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Cargar ciudad guardada
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setPlace(JSON.parse(saved));
      } catch {}
      setReady(true);
    })();
  }, []);

  const load = useCallback(async (p: Place) => {
    setLoading(true);
    setError(null);
    try {
      setForecast(await fetchForecast(p));
    } catch (e: any) {
      setError(e?.message ?? 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) load(place);
  }, [ready, place, load]);

  const doSearch = async () => {
    const q = query.trim();
    if (q.length < 2) return;
    Keyboard.dismiss();
    setSearchBusy(true);
    setSearchError(null);
    try {
      const r = await searchPlaces(q);
      setResults(r);
      if (r.length === 0) setSearchError('No se encontraron resultados');
    } catch (e: any) {
      setSearchError(e?.message ?? 'Error');
    } finally {
      setSearchBusy(false);
    }
  };

  const choose = async (p: Place) => {
    setPlace(p);
    setSearching(false);
    setQuery('');
    setResults([]);
    setSearchError(null);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {}
  };

  const resetDefault = () => choose(DEFAULT_PLACE);

  const now = forecast ? describe(forecast.currentCode) : null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.place} numberOfLines={2}>
            {placeLabel(place)}
          </Text>
        </View>
        <Pressable
          style={styles.changeBtn}
          onPress={() => setSearching((s) => !s)}
        >
          <Text style={styles.changeBtnText}>
            {searching ? 'Cerrar' : 'Cambiar'}
          </Text>
        </Pressable>
      </View>

      {searching && (
        <View style={styles.searchBox}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              placeholder="Buscar ciudad…"
              placeholderTextColor="#8a93a6"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={doSearch}
              returnKeyType="search"
              autoFocus
            />
            <Pressable style={styles.goBtn} onPress={doSearch}>
              <Text style={styles.goBtnText}>Buscar</Text>
            </Pressable>
          </View>
          {searchBusy && <ActivityIndicator style={{ marginTop: 12 }} />}
          {searchError && <Text style={styles.errorText}>{searchError}</Text>}
          <FlatList
            data={results}
            keyExtractor={(item, i) => `${item.latitude}-${item.longitude}-${i}`}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable style={styles.result} onPress={() => choose(item)}>
                <Text style={styles.resultText}>{placeLabel(item)}</Text>
              </Pressable>
            )}
          />
          <Pressable onPress={resetDefault}>
            <Text style={styles.link}>Volver a Buenos Aires</Text>
          </Pressable>
        </View>
      )}

      {!searching && (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => load(place)}
              tintColor="#fff"
            />
          }
        >
          {error && (
            <View style={styles.card}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={() => load(place)}>
                <Text style={styles.link}>Reintentar</Text>
              </Pressable>
            </View>
          )}

          {!forecast && loading && (
            <ActivityIndicator size="large" style={{ marginTop: 48 }} />
          )}

          {forecast && now && (
            <>
              <View style={styles.current}>
                <Text style={styles.currentIcon}>{now.icon}</Text>
                <Text style={styles.currentTemp}>
                  {Math.round(forecast.currentTemp)}°
                </Text>
                <Text style={styles.currentText}>{now.text}</Text>
              </View>

              <View style={styles.card}>
                {forecast.days.map((d, i) => {
                  const w = describe(d.code);
                  return (
                    <View
                      key={d.date}
                      style={[styles.row, i > 0 && styles.rowBorder]}
                    >
                      <Text style={styles.day}>{dayLabel(d.date, i)}</Text>
                      <Text style={styles.icon}>{w.icon}</Text>
                      <Text style={styles.rain}>
                        {d.rain != null ? `💧${d.rain}%` : ''}
                      </Text>
                      <Text style={styles.temps}>
                        <Text style={styles.max}>{Math.round(d.max)}°</Text>
                        {'  '}
                        <Text style={styles.min}>{Math.round(d.min)}°</Text>
                      </Text>
                    </View>
                  );
                })}
              </View>
              <Text style={styles.footer}>
                Datos: Open-Meteo · Tirá hacia abajo para actualizar
              </Text>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#12182b' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    gap: 12,
  },
  place: { color: '#fff', fontSize: 20, fontWeight: '600' },
  changeBtn: {
    backgroundColor: '#25304d',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  changeBtnText: { color: '#fff', fontWeight: '600' },
  searchBox: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  searchRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: '#1d2742',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  goBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  goBtnText: { color: '#fff', fontWeight: '700' },
  result: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2d3a5c',
  },
  resultText: { color: '#fff', fontSize: 16 },
  link: { color: '#7db1ff', marginTop: 16, fontSize: 15 },
  errorText: { color: '#ff8a8a', marginTop: 12 },
  current: { alignItems: 'center', paddingVertical: 24 },
  currentIcon: { fontSize: 64 },
  currentTemp: { color: '#fff', fontSize: 72, fontWeight: '200' },
  currentText: { color: '#c7d0e5', fontSize: 18 },
  card: {
    backgroundColor: '#1d2742',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2d3a5c',
  },
  day: { color: '#fff', fontSize: 16, flex: 1.6 },
  icon: { fontSize: 24, width: 40, textAlign: 'center' },
  rain: { color: '#8fb8ff', fontSize: 13, width: 56, textAlign: 'center' },
  temps: { width: 78, textAlign: 'right', fontSize: 16 },
  max: { color: '#fff', fontWeight: '600' },
  min: { color: '#8a93a6' },
  footer: {
    color: '#6f7a93',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});
