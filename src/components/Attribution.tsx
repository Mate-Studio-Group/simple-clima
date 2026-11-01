import React from 'react';
import { Linking, Pressable, StyleSheet, Text } from 'react-native';

import { ATTRIBUTION_TEXT, ATTRIBUTION_URL } from '../constants';
import { colors, fontSize, spacing } from '../theme';

/**
 * Atribución a Open-Meteo. Su licencia CC BY 4.0 la exige,
 * así que este componente no es opcional.
 */
export function Attribution() {
  const openSource = () => {
    void Linking.openURL(ATTRIBUTION_URL).catch(() => {
      // Si no hay navegador disponible el texto de atribución ya quedó visible.
    });
  };

  return (
    <Pressable onPress={openSource} accessibilityRole="link">
      <Text style={styles.text}>{ATTRIBUTION_TEXT}</Text>
      <Text style={styles.hint}>Tirá hacia abajo para actualizar</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.link,
    fontSize: fontSize.caption,
    textAlign: 'center',
    marginTop: spacing.lg,
    textDecorationLine: 'underline',
  },
  hint: {
    color: colors.textSubtle,
    fontSize: fontSize.caption,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
