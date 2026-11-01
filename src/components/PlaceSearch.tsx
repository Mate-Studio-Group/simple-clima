import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { colors, fontSize, radius, spacing } from '../theme';
import type { Place } from '../types';
import { formatPlaceLabel, placeKey } from '../utils';

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  results: Place[];
  loading: boolean;
  error: string | null;
  empty: boolean;
  onSubmit: () => void;
  onSelect: (place: Place) => void;
  onResetToDefault: () => void;
};

export function PlaceSearch({
  query,
  onQueryChange,
  results,
  loading,
  error,
  empty,
  onSubmit,
  onSelect,
  onResetToDefault,
}: Props) {
  const submit = () => {
    Keyboard.dismiss();
    onSubmit();
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Buscar ciudad…"
          placeholderTextColor={colors.textFaint}
          value={query}
          onChangeText={onQueryChange}
          onSubmitEditing={submit}
          returnKeyType="search"
          autoFocus
          autoCorrect={false}
        />
        <Pressable style={styles.button} onPress={submit} accessibilityRole="button">
          <Text style={styles.buttonText}>Buscar</Text>
        </Pressable>
      </View>

      {loading && <ActivityIndicator style={styles.spinner} />}
      {error && <Text style={styles.error}>{error}</Text>}
      {empty && !error && (
        <Text style={styles.empty}>
          No encontramos esa ciudad. Probá con otro nombre.
        </Text>
      )}

      <FlatList
        data={results}
        keyExtractor={placeKey}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable
            style={styles.result}
            onPress={() => onSelect(item)}
            accessibilityRole="button"
          >
            <Text style={styles.resultText}>{formatPlaceLabel(item)}</Text>
          </Pressable>
        )}
      />

      <Pressable onPress={onResetToDefault} accessibilityRole="button">
        <Text style={styles.link}>Volver a Buenos Aires</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  buttonText: { color: colors.text, fontWeight: '700' },
  spinner: { marginTop: spacing.md },
  error: { color: colors.danger, marginTop: spacing.md },
  empty: { color: colors.textMuted, marginTop: spacing.md },
  result: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  resultText: { color: colors.text, fontSize: fontSize.base },
  link: { color: colors.link, marginTop: spacing.lg, fontSize: fontSize.body },
});
