import React from 'react';

import { render, screen } from '@testing-library/react';

import Card from './Card';

describe('<Card />', () => {
  it('renders children content', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>,
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders as article element by default', () => {
    render(<Card>Content</Card>);

    const card = screen.getByText('Content');
    expect(card.tagName).toBe('ARTICLE');
  });

  it('can render as a different semantic element', () => {
    render(<Card as='section'>Section content</Card>);

    const card = screen.getByText('Section content');
    expect(card.tagName).toBe('SECTION');
  });

  it('applies default variant classes', () => {
    render(<Card>Elevated card</Card>);

    const card = screen.getByText('Elevated card');
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('shadow-md');
  });

  it('applies custom variant styles', () => {
    render(<Card variant='outlined'>Outlined card</Card>);

    const card = screen.getByText('Outlined card');
    expect(card).toHaveClass('border-2');
    expect(card).toHaveClass('border-slate-200');
  });

  it('applies padding customization', () => {
    render(<Card padding='lg'>Padded card</Card>);

    const card = screen.getByText('Padded card');
    expect(card).toHaveClass('p-6');
  });

  it('applies border radius customization', () => {
    render(<Card rounded='md'>Rounded card</Card>);

    const card = screen.getByText('Rounded card');
    expect(card).toHaveClass('rounded-md');
  });

  it('applies shadow customization', () => {
    render(<Card shadow='lg'>Shadow card</Card>);

    const card = screen.getByText('Shadow card');
    expect(card).toHaveClass('shadow-lg');
  });

  it('overrides background color from variant', () => {
    render(<Card variant='elevated' backgroundColor='slate-50'>Custom bg</Card>);

    const card = screen.getByText('Custom bg');
    expect(card).toHaveClass('bg-slate-50');
  });

  it('applies border color and width', () => {
    render(
      <Card borderColor='blue-200' borderWidth={2}>
        Bordered card
      </Card>,
    );

    const card = screen.getByText('Bordered card');
    expect(card).toHaveClass('border-blue-200');
    expect(card).toHaveClass('border-2');
  });

  it('applies hover lift effect', () => {
    render(<Card hoverEffect='lift'>Liftable card</Card>);

    const card = screen.getByText('Liftable card');
    expect(card).toHaveClass('hover:shadow-lg');
    expect(card).toHaveClass('hover:-translate-y-1');
  });

  it('applies interactive cursor when enabled', () => {
    render(<Card interactive>Clickable card</Card>);

    const card = screen.getByText('Clickable card');
    expect(card).toHaveClass('cursor-pointer');
  });

  it('merges custom className', () => {
    render(<Card className='custom-class'>Custom card</Card>);

    const card = screen.getByText('Custom card');
    expect(card).toHaveClass('custom-class');
  });

  it('supports native HTML attributes', () => {
    render(
      <Card data-testid='test-card' id='card-1'>
        Attribute card
      </Card>,
    );

    expect(screen.getByTestId('test-card')).toHaveAttribute('id', 'card-1');
  });

  it('accepts ref for direct DOM access', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref card</Card>);

    expect(ref.current).toBeInTheDocument();
    expect(ref.current?.tagName).toBe('ARTICLE');
  });

  it('renders all variants without errors', () => {
    const variants: Array<'elevated' | 'filled' | 'outlined' | 'tonal'> = [
      'elevated',
      'filled',
      'outlined',
      'tonal',
    ];

    variants.forEach(variant => {
      const { unmount } = render(
        <Card variant={variant}>
          {variant} variant
        </Card>,
      );
      expect(screen.getByText(`${variant} variant`)).toBeInTheDocument();
      unmount();
    });
  });
});

