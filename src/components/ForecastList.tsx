import React from 'react';

import type { ForecastDay } from '../types';
import { Card } from './Card';
import { ForecastRow } from './ForecastRow';

type Props = {
  days: ForecastDay[];
};

export function ForecastList({ days }: Props) {
  return (
    <Card>
      {days.map((day, index) => (
        <ForecastRow key={day.date} day={day} index={index} />
      ))}
    </Card>
  );
}
