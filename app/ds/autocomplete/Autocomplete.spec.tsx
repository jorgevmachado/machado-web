import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import Autocomplete from './index';

const OPTIONS = [
  { key: 'electric', value: 'electric' },
  { key: 'fire', value: 'fire' },
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
    expect(screen.getByText('fire')).toBeInTheDocument();
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
});

