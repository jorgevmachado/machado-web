import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import Filters from './Filters';
import type { FiltersProps } from './types';

const TEXT_FILTERS: FiltersProps['filters'] = [
  { name: 'name', label: 'Name', type: 'text', value: '', placeholder: 'Search by name' },
  { name: 'type', label: 'Type', type: 'text', value: 'fire', placeholder: 'Filter by type' },
];

const AUTOCOMPLETE_FILTERS: FiltersProps['filters'] = [
  {
    name: 'region',
    label: 'Region',
    type: 'autocomplete',
    value: '',
    placeholder: 'Select region',
    options: [
      { key: 'kanto', value: 'kanto' },
      { key: 'johto', value: 'johto' },
    ],
  },
];

describe('<Filters />', () => {
  it('renders text input filters', () => {
    render(
      <Filters
        filters={TEXT_FILTERS}
        onApply={jest.fn()}
        onClear={jest.fn()}
      />,
    );

    expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Filter by type')).toBeInTheDocument();
  });

  it('renders filter labels', () => {
    render(
      <Filters
        filters={TEXT_FILTERS}
        onApply={jest.fn()}
        onClear={jest.fn()}
      />,
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('renders autocomplete filter', () => {
    render(
      <Filters
        filters={AUTOCOMPLETE_FILTERS}
        onApply={jest.fn()}
        onClear={jest.fn()}
      />,
    );

    expect(screen.getByPlaceholderText('Select region')).toBeInTheDocument();
  });

  it('calls onApply with trimmed filter values', () => {
    const onApply = jest.fn();

    render(
      <Filters
        filters={TEXT_FILTERS}
        onApply={onApply}
        onClear={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));

    expect(onApply).toHaveBeenCalledWith({ name: '', type: 'fire' });
  });

  it('calls onClear and resets filter values', () => {
    const onClear = jest.fn();

    render(
      <Filters
        filters={TEXT_FILTERS}
        onApply={jest.fn()}
        onClear={onClear}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(onClear).toHaveBeenCalled();
  });

  it('disables clear button when no active filters', () => {
    const emptyFilters: FiltersProps['filters'] = [
      { name: 'name', label: 'Name', type: 'text', value: '', placeholder: 'Search' },
    ];

    render(
      <Filters
        filters={emptyFilters}
        onApply={jest.fn()}
        onClear={jest.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeDisabled();
  });

  it('enables clear button when there are active filters', () => {
    render(
      <Filters
        filters={TEXT_FILTERS}
        onApply={jest.fn()}
        onClear={jest.fn()}
      />,
    );

    // TEXT_FILTERS has 'type' with value 'fire'
    expect(screen.getByRole('button', { name: 'Clear filters' })).not.toBeDisabled();
  });

  it('updates draft value on input change', () => {
    const onApply = jest.fn();

    render(
      <Filters
        filters={TEXT_FILTERS}
        onApply={onApply}
        onClear={jest.fn()}
      />,
    );

    const nameInput = screen.getByPlaceholderText('Search by name');
    fireEvent.change(nameInput, { target: { value: 'pikachu' } });

    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));

    expect(onApply).toHaveBeenCalledWith({ name: 'pikachu', type: 'fire' });
  });

  it('resets to empty values after clear', () => {
    const onApply = jest.fn();

    render(
      <Filters
        filters={TEXT_FILTERS}
        onApply={onApply}
        onClear={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));

    expect(onApply).toHaveBeenCalledWith({ name: '', type: '' });
  });

  it('renders custom label props', () => {
    render(
      <Filters
        filters={TEXT_FILTERS}
        onApply={jest.fn()}
        onClear={jest.fn()}
        filterApplyLabel='Search'
        filterCleanLabel='Reset'
      />,
    );

    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('renders with custom ariaLabel', () => {
    render(
      <Filters
        filters={TEXT_FILTERS}
        onApply={jest.fn()}
        onClear={jest.fn()}
        ariaLabel='Pokemon search filters'
      />,
    );

    expect(screen.getByRole('region', { name: 'Pokemon search filters' })).toBeInTheDocument();
  });

  it('renders autocomplete filter with isLoading state', () => {
    const LOADING_AUTOCOMPLETE_FILTERS: FiltersProps['filters'] = [
      {
        name: 'region',
        label: 'Region',
        type: 'autocomplete',
        value: '',
        placeholder: 'Select region',
        isLoading: true,
        options: [],
      },
    ];

    render(
      <Filters
        filters={LOADING_AUTOCOMPLETE_FILTERS}
        onApply={jest.fn()}
        onClear={jest.fn()}
      />,
    );

    // isLoading autocomplete shows a loading placeholder
    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Loading region...');
  });

  it('updates autocomplete draft value on value change', () => {
    render(
      <Filters
        filters={AUTOCOMPLETE_FILTERS}
        onApply={jest.fn()}
        onClear={jest.fn()}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'kanto' } });
    expect(input).toHaveValue('kanto');
  });
});
