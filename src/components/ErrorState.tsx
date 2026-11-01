import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontSize, spacing } from '../theme';
import { Card } from './Card';

type Props = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({ message, onRetry, retryLabel = 'Reintentar' }: Props) {
  return (
    <Card>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Pressable onPress={onRetry} accessibilityRole="button">
          <Text style={styles.retry}>{retryLabel}</Text>
        </Pressable>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  message: { color: colors.danger, marginTop: spacing.md },
  retry: { color: colors.link, marginTop: spacing.lg, fontSize: fontSize.body },
});
