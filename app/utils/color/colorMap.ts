import { ColorType, ColorValue } from '@/app/utils';

export const colorMap: Record<ColorType, ColorValue> = {
  primary: {
    main: '#3b82f6', // blue-500
    light: '#60a5fa', // blue-400
    dark: '#1d4ed8', // blue-700
  },
  secondary: {
    main: '#a855f7', // purple-500
    light: '#c084fc', // purple-400
    dark: '#7e22ce', // purple-700
  },
  info: {
    main: '#06b6d4', // cyan-500
    light: '#22d3ee', // cyan-400
    dark: '#0891b2', // cyan-700
  },
  warning: {
    main: '#f59e0b', // amber-500
    light: '#fbbf24', // amber-400
    dark: '#d97706', // amber-600
  },
  error: {
    main: '#ef4444', // red-500
    light: '#f87171', // red-400
    dark: '#dc2626', // red-600
  },
  neutral: {
    main: '#6b7280', // gray-500
    light: '#9ca3af', // gray-400
    dark: '#4b5563', // gray-600
  },
};

