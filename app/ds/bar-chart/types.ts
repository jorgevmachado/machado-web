import { type HTMLAttributes, type ReactNode } from 'react';

export type BarChartSize = 'sm' | 'md' | 'lg';

export type BarChartTone =
  | 'auto'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export type BarChartThreshold = {
  min: number;
  tone: Exclude<BarChartTone, 'auto'>;
};

export type BarChartProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  label?: ReactNode;
  value: number;
  maxValue?: number;
  compareValue?: number;
  size?: BarChartSize;
  tone?: BarChartTone;
  thresholds?: BarChartThreshold[];
  showValue?: boolean;
  withAnimation?: boolean;
  formatValue?: (value: number) => ReactNode;
  labelClassName?: string;
  valueClassName?: string;
  trackClassName?: string;
  barClassName?: string;
};

