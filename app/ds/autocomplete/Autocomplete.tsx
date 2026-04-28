'use client';

import React, { useLayoutEffect, useMemo, useState } from 'react';

import Input from '@/app/ds/input';
import { joinClass } from '@/app/utils';

import { type AutocompleteOption, type AutocompleteProps } from './types';

const DEFAULT_MAX_OPTIONS = 8;

const Autocomplete = ({
  name,
  value,
  options,
  onValueChange,
  onSelectOption,
  loadingPlaceholder,
  noResultsText = 'No options found.',
  maxOptions = DEFAULT_MAX_OPTIONS,
  filterOptions,
  onInputKeyDown,
  listboxClassName,
  optionClassName,
  isLoading = false,
  placeholder,
  onBlur,
  onFocus,
  ...inputProps
}: AutocompleteProps): React.JSX.Element => {
  const [inputValue, setInputValue] = useState<string>(value);
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  useLayoutEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setInputValue(value);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value]);

  const normalizedQuery = useMemo(() => {
    return inputValue.trim().toLowerCase();
  }, [inputValue]);

  const filteredOptions = useMemo(() => {
    if (!normalizedQuery) {
      return options.slice(0, maxOptions);
    }

    const predicate = filterOptions
      ? (option: AutocompleteOption) => filterOptions(option, normalizedQuery)
      : (option: AutocompleteOption) => {
        const searchValue = `${option.label ?? option.value} ${option.description ?? ''}`.toLowerCase();

        return searchValue.includes(normalizedQuery);
      };

    return options.filter(predicate).slice(0, maxOptions);
  }, [filterOptions, maxOptions, normalizedQuery, options]);

  const activeOptionId = highlightedIndex >= 0
    ? `${name}-option-${highlightedIndex}`
    : undefined;

  const resolvedPlaceholder = useMemo(() => {
    if (!isLoading) {
      return placeholder;
    }

    return loadingPlaceholder ?? `Loading ${name}...`;
  }, [isLoading, loadingPlaceholder, name, placeholder]);

  const selectOption = (option: AutocompleteOption): void => {
    setInputValue(option.value);
    onValueChange?.(option.value);
    onSelectOption?.(option);
    setIsOptionsOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <>
      <Input
        {...inputProps}
        type='text'
        role='combobox'
        name={name}
        value={inputValue}
        isLoading={isLoading}
        placeholder={resolvedPlaceholder}
        aria-controls={`${name}-autocomplete-listbox`}
        aria-expanded={isOptionsOpen}
        aria-autocomplete='list'
        aria-activedescendant={activeOptionId}
        showClearButton
        onClear={() => {
          setInputValue('');
          onValueChange?.('');
          setIsOptionsOpen(false);
          setHighlightedIndex(-1);
        }}
        onFocus={(event) => {
          setIsOptionsOpen(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          window.setTimeout(() => {
            setIsOptionsOpen(false);
            setHighlightedIndex(-1);
          }, 120);

          onBlur?.(event);
        }}
        onKeyDown={(event) => {
          onInputKeyDown?.(event);

          if (event.defaultPrevented) {
            return;
          }

          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setIsOptionsOpen(true);
            setHighlightedIndex((previousIndex) => {
              if (filteredOptions.length === 0) {
                return -1;
              }

              return previousIndex < filteredOptions.length - 1 ? previousIndex + 1 : 0;
            });
            return;
          }

          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setIsOptionsOpen(true);
            setHighlightedIndex((previousIndex) => {
              if (filteredOptions.length === 0) {
                return -1;
              }

              return previousIndex > 0 ? previousIndex - 1 : filteredOptions.length - 1;
            });
            return;
          }

          if (event.key === 'Enter' && isOptionsOpen && highlightedIndex >= 0) {
            event.preventDefault();
            selectOption(filteredOptions[highlightedIndex]);
            return;
          }

          if (event.key === 'Escape') {
            setIsOptionsOpen(false);
            setHighlightedIndex(-1);
          }
        }}
        onValueChange={(nextValue) => {
          setInputValue(nextValue);
          onValueChange?.(nextValue);
          setIsOptionsOpen(true);
        }}
      />

      {isOptionsOpen ? (
        <ul
          id={`${name}-autocomplete-listbox`}
          role='listbox'
          className={joinClass([
            'absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg',
            listboxClassName,
          ])}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const isHighlighted = highlightedIndex === index;

              return (
                <li
                  key={option.key}
                  id={`${name}-option-${index}`}
                  role='option'
                  aria-selected={isHighlighted}
                  onMouseDown={() => selectOption(option)}
                  className={joinClass([
                    'cursor-pointer rounded-lg px-3 py-2 text-sm transition',
                    isHighlighted ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50',
                    optionClassName,
                  ])}
                >
                  {option.label ?? option.value}
                </li>
              );
            })
          ) : (
            <li className='px-3 py-2 text-sm text-slate-400'>
              {noResultsText}
            </li>
          )}
        </ul>
      ) : null}
    </>
  );
};

export default React.memo(Autocomplete);

