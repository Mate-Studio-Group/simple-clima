import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, spacing } from '../theme';
import type { ForecastDay } from '../types';
import { describeWeather, formatDayLabel, formatTemperature } from '../utils';

type Props = {
  day: ForecastDay;
  index: number;
};

export function ForecastRow({ day, index }: Props) {
  const weather = describeWeather(day.code);

  return (
    <View style={[styles.row, index > 0 && styles.divider]}>
      <Text style={styles.label}>{formatDayLabel(day.date, index)}</Text>
      <Text style={styles.icon}>{weather.icon}</Text>
      <Text style={styles.rain}>{day.rain != null ? `💧${day.rain}%` : ''}</Text>
      <Text style={styles.temperatures}>
        <Text style={styles.max}>{formatTemperature(day.max)}</Text>
        {'  '}
        <Text style={styles.min}>{formatTemperature(day.min)}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  label: { color: colors.text, fontSize: fontSize.base, flex: 1.6 },
  icon: { fontSize: fontSize.icon, width: 40, textAlign: 'center' },
  rain: {
    color: colors.rain,
    fontSize: fontSize.small,
    width: 56,
    textAlign: 'center',
  },
  temperatures: { width: 78, textAlign: 'right', fontSize: fontSize.base },
  max: { color: colors.text, fontWeight: '600' },
  min: { color: colors.textFaint },
});
