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