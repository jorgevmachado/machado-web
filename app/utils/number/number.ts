export const toPositiveInteger = (value: string | null, fallback: number): number => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
};


type FormatNumberPrefixProps = {
  value?: number;
  prefix?: string;
  maxLength?: number;
  fillString?: string;
}

export const formatNumberPrefix = ({
  value,
  prefix = 'Nº',
  maxLength = 4,
  fillString = '0',
}: FormatNumberPrefixProps) => {
  const safeNumber = typeof value === 'number' && Number.isFinite(value) 
    ? Math.max(0, value) 
    : 0;
  
  return `${prefix} ${safeNumber.toString().padStart(maxLength, fillString)}`;
};

export const clampPercentage = (value: number, max: number): number => {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
};