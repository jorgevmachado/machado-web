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

type ListFilterValueMap = Record<string, string | undefined>;

export const buildQueryString = <TFilters,>(filters: TFilters,page?: number, limit?: number): string => {
  const params = new URLSearchParams( page ? {
    page: String(page),
    limit: String(limit),
  } : {});

  Object.entries(filters as ListFilterValueMap).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    params.set(key, value);
  });

  return params.toString();
};

export const formatOrder = (order?: number | null): string => {
  if (!order) {
    return '#---';
  }
  return `#${String(order).padStart(3, '0')}`;
};

export const formatValue = (value?: number | null): string => {
  if (value === undefined || value === null) {
    return '-';
  }
  return String(value);
};

export const replaceFractions = (expression: string): string => {
  const nextExpression = expression.replaceAll(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))');
  return nextExpression === expression ? expression : replaceFractions(nextExpression);
};
