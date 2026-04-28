import React from 'react';

import { render, screen } from '@testing-library/react';
import { MdStar } from 'react-icons/md';

import Badge from './index';

describe('<Badge />', () => {
  it('renders children content', () => {
    render(<Badge>Trainer</Badge>);

    expect(screen.getByText('Trainer')).toBeInTheDocument();
  });

  it('renders left and right icons', () => {
    render(
      <Badge
        iconLeft={<MdStar data-testid='icon-left' />}
        iconRight={<MdStar data-testid='icon-right' />}
      >
        Level 5
      </Badge>,
    );

    expect(screen.getByTestId('icon-left')).toBeInTheDocument();
    expect(screen.getByTestId('icon-right')).toBeInTheDocument();
    expect(screen.getByText('Level 5')).toBeInTheDocument();
  });

  it('applies soft variant classes by default', () => {
    render(<Badge tone='primary'>Pokémon</Badge>);

    const badge = screen.getByText('Pokémon').closest('span');

    expect(badge).toHaveClass('bg-blue-50');
    expect(badge).toHaveClass('text-blue-700');
  });

  it('applies solid variant classes', () => {
    render(
      <Badge variant='solid' tone='danger'>
        Fainted
      </Badge>,
    );

    const badge = screen.getByText('Fainted').closest('span');

    expect(badge).toHaveClass('bg-red-500');
    expect(badge).toHaveClass('text-white');
  });

  it('applies outline variant classes', () => {
    render(
      <Badge variant='outline' tone='success'>
        Caught
      </Badge>,
    );

    const badge = screen.getByText('Caught').closest('span');

    expect(badge).toHaveClass('border');
    expect(badge).toHaveClass('text-emerald-700');
  });

  it('applies pill shape by default', () => {
    render(<Badge>Active</Badge>);

    const badge = screen.getByText('Active').closest('span');

    expect(badge).toHaveClass('rounded-full');
  });

  it('applies rounded shape when specified', () => {
    render(<Badge shape='rounded'>Tag</Badge>);

    const badge = screen.getByText('Tag').closest('span');

    expect(badge).toHaveClass('rounded-md');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Badge size='sm'>Small</Badge>);

    expect(screen.getByText('Small').closest('span')).toHaveClass('h-5');

    rerender(<Badge size='lg'>Large</Badge>);

    expect(screen.getByText('Large').closest('span')).toHaveClass('h-7');
  });

  it('forwards additional span props', () => {
    render(<Badge data-testid='ds-badge'>Spread</Badge>);

    expect(screen.getByTestId('ds-badge')).toBeInTheDocument();
  });

  it('keeps provided tone when random is false', () => {
    render(<Badge tone='warning'>Warning</Badge>);

    const badge = screen.getByText('Warning').closest('span');

    expect(badge).toHaveClass('bg-amber-50');
    expect(badge).toHaveClass('text-amber-700');
  });

  it('uses random tone when random flag is true', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);

    render(
      <Badge random tone='danger'>
        Random Tone
      </Badge>,
    );

    const badge = screen.getByText('Random Tone').closest('span');

    expect(badge).toHaveClass('bg-blue-50');
    expect(badge).toHaveClass('text-blue-700');

    randomSpy.mockRestore();
  });
});

