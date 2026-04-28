type TFilters = {
  label: string;
  type: 'text' | 'autocomplete' | 'select' | 'date';
  name: string;
  value: string;
  options?: Array<FilterOption>;
  isLoading?: boolean;
  placeholder: string;
};
export type FiltersProps = {
  filters: Array<TFilters>;
  onApply: (nextFilters: Record<string, string>) => void;
  onClear: () => void;
  ariaLabel?: string;
  filterCleanLabel?: string;
  filterApplyLabel?: string;
};

export type FilterOption = {
  key: string;
  value: string;
}