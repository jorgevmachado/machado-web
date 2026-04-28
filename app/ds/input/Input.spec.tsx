import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { MdSearch } from 'react-icons/md';

import Input from './index';

describe('<Input />', () => {
  it('renders with value and placeholder', () => {
    render(
      <Input
        value='pikachu'
        onChange={() => undefined}
        placeholder='Search pokemon'
      />,
    );

    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search pokemon')).toBeInTheDocument();
  });

  it('calls onValueChange with typed value', () => {
    const onValueChange = jest.fn();

    render(
      <Input
        value=''
        onChange={() => undefined}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'charizard' },
    });

    expect(onValueChange).toHaveBeenCalledWith('charizard', expect.any(Object));
  });

  it('shows clear button and triggers onClear', () => {
    const onClear = jest.fn();

    render(
      <Input
        value='bulbasaur'
        onChange={() => undefined}
        showClearButton
        onClear={onClear}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('renders loading state with aria-busy', () => {
    render(
      <Input
        value=''
        onChange={() => undefined}
        isLoading
        loadingText='Loading types...'
      />,
    );

    const textbox = screen.getByRole('textbox');

    expect(textbox).toHaveAttribute('aria-busy', 'true');
    expect(textbox).toHaveAttribute('placeholder', 'Loading types...');
  });

  it('renders leading and trailing icons', () => {
    render(
      <Input
        value=''
        onChange={() => undefined}
        leadingIcon={<MdSearch data-testid='leading-icon' />}
        trailingIcon={<MdSearch data-testid='trailing-icon' />}
      />,
    );

    expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
    expect(screen.getByTestId('trailing-icon')).toBeInTheDocument();
  });

  it('renders error message with invalid state', () => {
    render(
      <Input
        value=''
        onChange={() => undefined}
        isInvalid
        errorMessage='This field is required.'
      />,
    );

    const textbox = screen.getByRole('textbox');

    expect(textbox).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required.');
  });
});

