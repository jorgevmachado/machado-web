import React, { useMemo } from 'react';

import { clampPercentage, joinClass } from '@/app/utils';
import { Text } from '@/app/ds';

import {
  type BarChartProps,
  type BarChartThreshold,
  type BarChartTone,
} from './types';

const TONE_CLASS_MAP: Record<Exclude<BarChartTone, 'auto'>, string> = {
  primary: 'bg-blue-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-400',
  danger: 'bg-rose-500',
  info: 'bg-sky-500',
  neutral: 'bg-slate-500',
};

const SIZE_CLASS_MAP = {
  sm: {
    wrapper: 'gap-2',
    label: 'w-16 text-[11px]',
    value: 'w-7 text-[11px]',
    track: 'h-2',
  },
  md: {
    wrapper: 'gap-3',
    label: 'w-20 text-xs',
    value: 'w-8 text-xs',
    track: 'h-2.5',
  },
  lg: {
    wrapper: 'gap-3.5',
    label: 'w-24 text-sm',
    value: 'w-10 text-sm',
    track: 'h-3',
  },
} as const;

const DEFAULT_THRESHOLDS: BarChartThreshold[] = [
  { min: 130, tone: 'primary' },
  { min: 90, tone: 'success' },
  { min: 50, tone: 'warning' },
  { min: 0, tone: 'danger' },
];

const getToneFromThresholds = (value: number, thresholds: BarChartThreshold[]): Exclude<BarChartTone, 'auto'> => {
  const sortedThresholds = [...thresholds].sort((left, right) => right.min - left.min);

  for (const threshold of sortedThresholds) {
    if (value >= threshold.min) {
      return threshold.tone;
    }
  }

  return 'danger';
};

const BarChart = ({
  label,
  value,
  maxValue = 255,
  compareValue,
  size = 'md',
  tone = 'auto',
  thresholds = DEFAULT_THRESHOLDS,
  showValue = true,
  withAnimation = true,
  formatValue,
  className,
  labelClassName,
  valueClassName,
  trackClassName,
  barClassName,
  ...wrapperProps
}: BarChartProps) => {
  const normalizedValue = useMemo(() => {
    if (typeof compareValue === 'number') {
      return clampPercentage(value, compareValue);
    }

    return value;
  }, [compareValue, value]);

  const percentage = clampPercentage(normalizedValue, maxValue);

  const resolvedTone = useMemo<Exclude<BarChartTone, 'auto'>>(() => {
    if (tone !== 'auto') {
      return tone;
    }

    return getToneFromThresholds(normalizedValue, thresholds);
  }, [normalizedValue, thresholds, tone]);

  const displayValue = formatValue ? formatValue(value) : value;
  const sizeClass = SIZE_CLASS_MAP[size];

  return (
    <div
      {...wrapperProps}
      className={joinClass(['flex items-center', sizeClass.wrapper, className])}
    >
      {label && (
        <Text
          as="span"
          weight='semibold'
          color="text-slate-400"
          className={joinClass([
            'shrink-0 text-right',
            sizeClass.label,
            labelClassName,
          ])}
        >
          {label}
        </Text>
      )}


      {showValue ? (
        <Text
          as="span"
          color="text-slate-700"
          weight='bold'
          className={joinClass([
            'shrink-0 text-center',
            sizeClass.value,
            valueClassName,
          ])}
        >
          {displayValue}
        </Text>
      ) : null}

      <div
        className={joinClass([
          'flex-1 overflow-hidden rounded-full bg-slate-200',
          sizeClass.track,
          trackClassName,
        ])}
      >
        <div
          className={joinClass([
            'h-full rounded-full',
            withAnimation && 'transition-all duration-700',
            TONE_CLASS_MAP[resolvedTone],
            barClassName,
          ])}
          style={{ width: `${percentage}%` }}
          role='progressbar'
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={maxValue}
          aria-label={typeof label === 'string' ? label : 'Bar chart value'}
        />
      </div>
    </div>
  );
};

export default React.memo(BarChart);

