import React from 'react';

import { render, screen } from '@testing-library/react';

import Alert from './Alert';

describe('<Alert />', () => {
  it('renders message content', () => {
    render(<Alert type='info'>Info message</Alert>);

    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('uses assertive aria-live for error and warning', () => {
    const { rerender } = render(<Alert type='warning'>Warning message</Alert>);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive');

    rerender(<Alert type='error'>Error message</Alert>);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive');
  });

  it('uses polite aria-live for info and success', () => {
    const { rerender } = render(<Alert type='info'>Info message</Alert>);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');

    rerender(<Alert type='success'>Success message</Alert>);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });
});
