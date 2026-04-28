import React from 'react';

import { render, screen } from '@testing-library/react';

import BarChart from './BarChart';

describe('<BarChart />', () => {
  it('renders label and value by default', () => {
    render(<BarChart label='HP' value={75} />);

    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('applies width based on current value and maxValue', () => {
    render(<BarChart label='Attack' value={50} maxValue={100} />);

    const progressBar = screen.getByRole('progressbar', { name: 'Attack' });

    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  it('uses compareValue when provided', () => {
    render(<BarChart label='HP' value={50} compareValue={200} maxValue={100} />);

    const progressBar = screen.getByRole('progressbar', { name: 'HP' });

    expect(progressBar).toHaveStyle({ width: '25%' });
  });

  it('supports explicit tone', () => {
    render(<BarChart label='Speed' value={30} tone='info' />);

    const progressBar = screen.getByRole('progressbar', { name: 'Speed' });

    expect(progressBar).toHaveClass('bg-sky-500');
  });

  it('supports custom value formatter', () => {
    render(
      <BarChart
        label='XP'
        value={1200}
        formatValue={(currentValue) => `${currentValue} pts`}
      />,
    );

    expect(screen.getByText('1200 pts')).toBeInTheDocument();
  });

  it('hides value when showValue is false', () => {
    render(<BarChart label='Defense' value={48} showValue={false} />);

    expect(screen.queryByText('48')).not.toBeInTheDocument();
  });

  it('falls through to danger when no threshold matches', () => {
    render(
      <BarChart
        label='Stat'
        value={5}
        tone='auto'
        thresholds={[{ min: 50, tone: 'success' }, { min: 80, tone: 'primary' }]}
      />,
    );

    const progressBar = screen.getByRole('progressbar', { name: 'Stat' });
    expect(progressBar).toHaveClass('bg-rose-500');
  });

  it('renders sm and lg sizes', () => {
    const { rerender } = render(<BarChart label='A' value={50} size='sm' />);
    expect(screen.getByRole('progressbar', { name: 'A' })).toBeInTheDocument();

    rerender(<BarChart label='A' value={50} size='lg' />);
    expect(screen.getByRole('progressbar', { name: 'A' })).toBeInTheDocument();
  });

  it('renders without animation when withAnimation is false', () => {
    render(<BarChart label='B' value={50} withAnimation={false} />);
    expect(screen.getByRole('progressbar', { name: 'B' })).toBeInTheDocument();
  });

  it('uses fallback aria-label when label is a ReactNode (not a string)', () => {
    render(<BarChart label={<span>HP</span>} value={75} />);
    // typeof label !== 'string' → aria-label defaults to 'Bar chart value'
    expect(screen.getByRole('progressbar', { name: 'Bar chart value' })).toBeInTheDocument();
  });
});

