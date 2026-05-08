export const normalizedName = (name?: string, fallback: string = 'Unknown Pokémon') => {
  
  if (!name) return fallback;

  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const displayDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
};

export const formatLabel = (value: string): string => {
  return value
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
};

export const formatNumber = (value?: number | null): string => {
  if (typeof value !== 'number') {
    return 'Unknown';
  }

  return value.toString();
};