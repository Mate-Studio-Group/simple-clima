import React, { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing } from '../theme';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Contenedor con el fondo y los márgenes compartidos por las secciones. */
export function Card({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
});
