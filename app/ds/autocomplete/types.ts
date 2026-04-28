import { type KeyboardEvent, type ReactNode } from 'react';

import { type InputProps } from '@/app/ds/input';

export type AutocompleteOption = {
  key: string;
  value: string;
  label?: string;
  description?: string;
  icon?: ReactNode;
};

export type AutocompleteProps = Omit<
  InputProps,
  'role' | 'value' | 'onChange' | 'onValueChange' | 'children'
> & {
  name: string;
  value: string;
  options: Array<AutocompleteOption>;
  onValueChange?: (value: string) => void;
  onSelectOption?: (option: AutocompleteOption) => void;
  loadingPlaceholder?: string;
  noResultsText?: string;
  maxOptions?: number;
  filterOptions?: (option: AutocompleteOption, normalizedQuery: string) => boolean;
  onInputKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  listboxClassName?: string;
  optionClassName?: string;
};

