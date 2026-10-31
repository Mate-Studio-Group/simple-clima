import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, spacing } from '../theme';
import type { Place } from '../types';
import { formatPlaceLabel } from '../utils';

type Props = {
  place: Place;
  searching: boolean;
  onToggleSearch: () => void;
};

export function AppHeader({ place, searching, onToggleSearch }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.titleWrapper}>
        <Text style={styles.place} numberOfLines={2}>
          {formatPlaceLabel(place)}
        </Text>
      </View>
      <Pressable
        style={styles.button}
        onPress={onToggleSearch}
        accessibilityRole="button"
        accessibilityLabel={searching ? 'Cerrar búsqueda' : 'Cambiar ciudad'}
      >
        <Text style={styles.buttonText}>{searching ? 'Cerrar' : 'Cambiar'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  titleWrapper: { flex: 1 },
  place: { color: colors.text, fontSize: fontSize.xl, fontWeight: '600' },
  button: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 14,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  buttonText: { color: colors.text, fontWeight: '600' },
});
