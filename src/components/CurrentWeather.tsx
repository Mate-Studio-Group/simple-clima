import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, spacing } from '../theme';
import { describeWeather, formatTemperature } from '../utils';

type Props = {
  temperature: number;
  code: number;
};

export function CurrentWeather({ temperature, code }: Props) {
  const weather = describeWeather(code);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{weather.icon}</Text>
      <Text style={styles.temperature}>{formatTemperature(temperature)}</Text>
      <Text style={styles.description}>{weather.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.xl },
  icon: { fontSize: fontSize.hero },
  temperature: {
    color: colors.text,
    fontSize: fontSize.temp,
    fontWeight: '200',
  },
  description: { color: colors.textMuted, fontSize: fontSize.lg },
});
