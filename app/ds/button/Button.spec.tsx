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

  it('renders icon appearance (rounded)', () => {
    render(
      <Button
        aria-label='Icon button'
        appearance='icon'
        iconLeft={<MdCatchingPokemon data-testid='icon' />}
      />,
    );

    const button = screen.getByRole('button', { name: 'Icon button' });
    expect(button).toHaveClass('rounded-full');
  });

  it('applies cursor-not-allowed when disabled', () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('cursor-not-allowed');
  });

  it('renders loading state with no text for icon-only button', () => {
    render(
      <Button
        aria-label='Loading icon'
        isLoading
        iconLeft={<MdCatchingPokemon />}
      />,
    );

    const button = screen.getByRole('button', { name: 'Loading icon' });
    expect(button).toBeDisabled();
    // Loading spinner present but no loading text
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('applies fullWidth class', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button', { name: 'Full Width' })).toHaveClass('w-full');
  });

  it('applies size sm classes', () => {
    render(<Button size='sm'>Small</Button>);
    expect(screen.getByRole('button', { name: 'Small' })).toHaveClass('h-9');
  });

  it('applies outlineBorderless appearance', () => {
    render(<Button appearance='outlineBorderless'>Borderless</Button>);
    expect(screen.getByRole('button', { name: 'Borderless' })).toHaveClass('border-0');
  });

  it('renders icon-only button with iconNoBorder appearance', () => {
    render(
      <Button appearance='iconNoBorder' aria-label='No border icon'>
        <MdCatchingPokemon />
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'No border icon' })).toBeInTheDocument();
  });

  it('renders single icon button using iconRight (hasSingleIcon via iconRight branch)', () => {
    render(
      <Button iconRight={<MdCatchingPokemon data-testid='right-icon' />} aria-label='Right icon only' />,
    );
    const button = screen.getByRole('button', { name: 'Right icon only' });
    expect(button).toBeInTheDocument();
  });
});

