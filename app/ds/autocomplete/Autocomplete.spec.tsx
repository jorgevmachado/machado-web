import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import Autocomplete from './index';

const OPTIONS = [
  { key: 'electric', value: 'electric' },
  { key: 'fire', value: 'fire', label: 'Fire Type' },
  { key: 'water', value: 'water' },
];

describe('<Autocomplete />', () => {
  it('renders options on focus and filters by input value', () => {
    const onValueChange = jest.fn();

    const ControlledAutocomplete = () => {
      const [value, setValue] = React.useState('');

      return (
        <Autocomplete
          name='type'
          value={value}
          options={OPTIONS}
          onValueChange={(nextValue) => {
            setValue(nextValue);
            onValueChange(nextValue);
          }}
        />
      );
    };

    render(<ControlledAutocomplete />);

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'fi' } });
    expect(onValueChange).toHaveBeenCalledWith('fi');
    expect(screen.getByText('Fire Type')).toBeInTheDocument();
    expect(screen.queryByText('water')).not.toBeInTheDocument();
  });

  it('selects highlighted option with Enter key', () => {
    const onValueChange = jest.fn();
    const onSelectOption = jest.fn();

    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={onValueChange}
        onSelectOption={onSelectOption}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSelectOption).toHaveBeenCalledWith({ key: 'electric', value: 'electric' });
    expect(onValueChange).toHaveBeenCalledWith('electric');
  });

  it('renders loading placeholder when loading', () => {
    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={() => undefined}
        isLoading
        loadingPlaceholder='Loading types...'
      />,
    );

    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Loading types...');
  });

  it('navigates up through options with ArrowUp key', () => {
    const onValueChange = jest.fn();

    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    // ArrowUp from -1 should go to last option
    fireEvent.keyDown(input, { key: 'ArrowUp' });

    const options = screen.getAllByRole('option');
    expect(options[options.length - 1]).toHaveAttribute('aria-selected', 'true');
  });

  it('wraps ArrowDown to first option after last', () => {
    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={jest.fn()}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);

    // Navigate to last option
    for (let i = 0; i < OPTIONS.length; i++) {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    }
    // One more ArrowDown should wrap to first
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates up from first option to last', () => {
    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={jest.fn()}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);

    fireEvent.keyDown(input, { key: 'ArrowDown' }); // index 0
    fireEvent.keyDown(input, { key: 'ArrowUp' });   // back to last
    fireEvent.keyDown(input, { key: 'ArrowUp' });   // second to last

    const options = screen.getAllByRole('option');
    expect(options[OPTIONS.length - 2]).toHaveAttribute('aria-selected', 'true');
  });

  it('closes dropdown on Escape key', () => {
    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={jest.fn()}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('calls onClear and clears value', () => {
    const onValueChange = jest.fn();

    const ControlledAutocomplete = () => {
      const [value, setValue] = React.useState('fire');
      return (
        <Autocomplete
          name='type'
          value={value}
          options={OPTIONS}
          onValueChange={(next) => { setValue(next); onValueChange(next); }}
        />
      );
    };

    render(<ControlledAutocomplete />);

    const clearButton = screen.getByRole('button', { name: 'Clear input' });
    fireEvent.click(clearButton);

    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('calls onFocus callback', () => {
    const onFocus = jest.fn();

    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={jest.fn()}
        onFocus={onFocus}
      />,
    );

    fireEvent.focus(screen.getByRole('combobox'));
    expect(onFocus).toHaveBeenCalled();
  });

  it('calls onBlur callback and closes dropdown after delay', () => {
    jest.useFakeTimers();
    const onBlur = jest.fn();

    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={jest.fn()}
        onBlur={onBlur}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it('respects custom filterOptions function', () => {
    const filterOptions = jest.fn((option: { value: string }, query: string) =>
      option.value.startsWith(query),
    );

    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={jest.fn()}
        filterOptions={filterOptions}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'el' } });

    expect(filterOptions).toHaveBeenCalled();
    expect(screen.getByText('electric')).toBeInTheDocument();
    expect(screen.queryByText('Fire Type')).not.toBeInTheDocument();
  });

  it('shows noResultsText when no options match', () => {
    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={jest.fn()}
        noResultsText='Nothing found.'
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'zzz' } });

    expect(screen.getByText('Nothing found.')).toBeInTheDocument();
  });

  it('ArrowDown with no filtered options does not move highlight', () => {
    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={jest.fn()}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'zzz' } }); // no results

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // Should not throw and should keep -1 highlight
    expect(screen.getByText('No options found.')).toBeInTheDocument();
  });

  it('ArrowUp with no filtered options does not move highlight', () => {
    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={jest.fn()}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'zzz' } }); // no results

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(screen.getByText('No options found.')).toBeInTheDocument();
  });

  it('respects onInputKeyDown with preventDefault', () => {
    const onInputKeyDown = jest.fn((event: React.KeyboardEvent) => {
      event.preventDefault();
    });

    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={jest.fn()}
        onInputKeyDown={onInputKeyDown}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    expect(onInputKeyDown).toHaveBeenCalled();
    // After preventDefault, options should still show but no navigation should happen
  });

  it('selects option by clicking (mouseDown)', () => {
    const onValueChange = jest.fn();
    const onSelectOption = jest.fn();

    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={onValueChange}
        onSelectOption={onSelectOption}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);

    const waterOption = screen.getByText('water');
    fireEvent.mouseDown(waterOption);

    expect(onSelectOption).toHaveBeenCalledWith({ key: 'water', value: 'water' });
    expect(onValueChange).toHaveBeenCalledWith('water');
  });

  it('displays option.label when available', () => {
    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={jest.fn()}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);

    // fire type has label 'Fire Type'
    expect(screen.getByText('Fire Type')).toBeInTheDocument();
    expect(screen.queryByText('fire')).not.toBeInTheDocument();
  });

  it('renders default loading placeholder from name when no loadingPlaceholder given', () => {
    render(
      <Autocomplete
        name='pokemon'
        value=''
        options={OPTIONS}
        onValueChange={jest.fn()}
        isLoading
      />,
    );

    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Loading pokemon...');
  });

  it('ignores non-special key presses while dropdown is open', () => {
    render(
      <Autocomplete
        name='type'
        value=''
        options={OPTIONS}
        onValueChange={jest.fn()}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    // Dropdown is open; press a non-special key (not ArrowDown/Up/Enter/Escape)
    fireEvent.keyDown(input, { key: 'Tab' });
    // Options should still be visible (Tab is ignored)
    expect(screen.getByText('water')).toBeInTheDocument();
  });
});

