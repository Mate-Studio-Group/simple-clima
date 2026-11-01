import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {
  AppHeader,
  Attribution,
  CurrentWeather,
  ErrorState,
  ForecastList,
  PlaceSearch,
} from '../components';
import { useForecast, usePlaceSearch, useStoredPlace } from '../hooks';
import { colors, spacing } from '../theme';
import type { Place } from '../types';

export function WeatherScreen() {
  const { place, ready, selectPlace, resetToDefault } = useStoredPlace();
  const { forecast, loading, error, reload } = useForecast(place, ready);
  const search = usePlaceSearch();
  const [searching, setSearching] = useState(false);

  const closeSearch = useCallback(() => {
    setSearching(false);
    search.reset();
  }, [search]);

  const toggleSearch = useCallback(() => {
    if (searching) closeSearch();
    else setSearching(true);
  }, [closeSearch, searching]);

  const choosePlace = useCallback(
    (next: Place) => {
      selectPlace(next);
      closeSearch();
    },
    [closeSearch, selectPlace],
  );

  const chooseDefault = useCallback(() => {
    resetToDefault();
    closeSearch();
  }, [closeSearch, resetToDefault]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <AppHeader
        place={place}
        searching={searching}
        onToggleSearch={toggleSearch}
      />

      {searching ? (
        <PlaceSearch
          query={search.query}
          onQueryChange={search.setQuery}
          results={search.results}
          loading={search.loading}
          error={search.error}
          empty={search.empty}
          onSubmit={search.search}
          onSelect={choosePlace}
          onResetToDefault={chooseDefault}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={reload}
              tintColor={colors.text}
            />
          }
        >
          {error && <ErrorState message={error} onRetry={reload} />}

          {!forecast && loading && (
            <ActivityIndicator size="large" style={styles.spinner} />
          )}

          {forecast && (
            <>
              <CurrentWeather
                temperature={forecast.currentTemp}
                code={forecast.currentCode}
              />
              <ForecastList days={forecast.days} />
              <Attribution />
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  spinner: { marginTop: 48 },
});
