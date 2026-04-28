import React from 'react';

import { render, screen } from '@testing-library/react';
import { MdCatchingPokemon, MdOutlineCatchingPokemon } from 'react-icons/md';

import Button from '.';

describe('<Button />', () => {
  it('renders button content with left and right icons', () => {
    render(
      <Button
        iconLeft={<MdCatchingPokemon data-testid='left-icon' />}
        iconRight={<MdOutlineCatchingPokemon data-testid='right-icon' />}
      >
        Catch
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Catch' })).toBeInTheDocument();
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('applies outline appearance classes', () => {
    render(<Button appearance='outline'>Outline</Button>);

    const button = screen.getByRole('button', { name: 'Outline' });

    expect(button).toHaveClass('border');
    expect(button).toHaveClass('bg-white');
  });

  it('renders icon no border appearance for icon-only actions', () => {
    render(
      <Button
        aria-label='Open filters'
        appearance='iconNoBorder'
        iconLeft={<MdCatchingPokemon data-testid='icon-only' />}
      />,
    );

    const button = screen.getByRole('button', { name: 'Open filters' });

    expect(button).toHaveClass('rounded-full');
    expect(button).toHaveClass('border-0');
    expect(screen.getByTestId('icon-only')).toBeInTheDocument();
  });

  it('renders loading state and disables interaction', () => {
    render(
      <Button isLoading loadingText='Saving trainer'>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Saving trainer' });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });
});

