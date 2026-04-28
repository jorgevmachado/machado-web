import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import Image from './Image';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onError, className, loader }: {
    src: string;
    alt: string;
    onError?: React.ReactEventHandler<HTMLImageElement>;
    className?: string;
    loader?: (args: { src: string }) => string;
  }) => {
    const resolvedSrc = loader ? loader({ src }) : src;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={resolvedSrc} alt={alt} onError={onError} className={className} data-testid='next-image' />
    );
  },
}));

describe('<Image />', () => {
  it('renders an img element when src is provided', () => {
    render(<Image src='/pokemon.png' alt='Pikachu' />);

    expect(screen.getByTestId('next-image')).toBeInTheDocument();
    expect(screen.getByAltText('Pikachu')).toBeInTheDocument();
  });

  it('renders NextImage (not fallback) when src is empty string', () => {
    render(<Image src='' alt='Missing' />);

    // Empty string without fallbackSrcList: no camera fallback, NextImage renders
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

  it('renders NextImage (not fallback) when src is undefined and no fallbackSrcList', () => {
    render(<Image alt='No src' />);

    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

  it('shows camera fallback when src is whitespace-only and fallbackSrcList is provided', () => {
    render(<Image src='   ' alt='Whitespace' fallbackSrcList={['/fb.png']} />);

    // Whitespace src + fallbackSrcList → validateSrc returns truthy → fallback div shown
    expect(screen.queryByTestId('next-image')).not.toBeInTheDocument();
    expect(screen.getByTitle('Whitespace')).toBeInTheDocument();
  });

  it('shows custom fallback element when src is whitespace-only with fallbackSrcList', () => {
    render(
      <Image
        src='   '
        alt='Custom fallback'
        fallbackSrcList={['/fb.png']}
        fallback={<span>No image available</span>}
      />,
    );

    expect(screen.getByText('No image available')).toBeInTheDocument();
    expect(screen.queryByTestId('next-image')).not.toBeInTheDocument();
  });

  it('uses "Image failed to load" aria-label when alt is null', () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Image src='   ' alt={null as any} fallbackSrcList={['/fb.png']} />,
    );

    // null alt → null ?? 'Image failed to load' = 'Image failed to load'
    const fallbackDiv = document.querySelector('[aria-label="Image failed to load"]');
    expect(fallbackDiv).toBeInTheDocument();
  });

  it('consumes fallbackSrcList when src is undefined (shows NextImage with first fallback)', () => {
    render(
      <Image
        alt='No src with fallback list'
        fallbackSrcList={['/fallback.png']}
      />,
    );

    // src=undefined + fallbackSrcList: first if in validateSrc consumes fallback → NextImage with fallback src
    expect(screen.getByTestId('next-image')).toHaveAttribute('src', '/fallback.png');
  });

  it('consumes fallbackSrcList when src is empty string (shows NextImage with first fallback)', () => {
    render(
      <Image
        src=''
        alt='Empty src with fallback list'
        fallbackSrcList={['/fallback.png']}
      />,
    );

    expect(screen.getByTestId('next-image')).toHaveAttribute('src', '/fallback.png');
  });

  it('tries fallbackSrcList after image error', () => {
    render(
      <Image
        src='/bad.png'
        alt='Fallback list'
        fallbackSrcList={['/fallback1.png', '/fallback2.png']}
      />,
    );

    const img = screen.getByTestId('next-image');
    fireEvent.error(img);

    expect(screen.getByTestId('next-image')).toHaveAttribute('src', '/fallback1.png');
  });

  it('cycles through all fallbacks on repeated errors', () => {
    render(
      <Image
        src='/bad.png'
        alt='Multiple fallbacks'
        fallbackSrcList={['/fb1.png', '/fb2.png']}
      />,
    );

    fireEvent.error(screen.getByTestId('next-image')); // → /fb1.png
    fireEvent.error(screen.getByTestId('next-image')); // → /fb2.png
    expect(screen.getByTestId('next-image')).toHaveAttribute('src', '/fb2.png');
  });

  it('keeps showing NextImage after all fallbacks are exhausted', () => {
    render(
      <Image
        src='/bad.png'
        alt='Exhausted fallback'
        fallbackSrcList={['/fallback1.png']}
      />,
    );

    fireEvent.error(screen.getByTestId('next-image')); // → /fallback1.png
    fireEvent.error(screen.getByTestId('next-image')); // exhausts list, isInvalid=true

    // isInvalid=true but fallbackSrcState=undefined → validateSrc returns falsy → NextImage still shown
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

  it('calls onError callback on image error', () => {
    const onError = jest.fn();
    render(<Image src='/bad.png' alt='Error cb' onError={onError} />);

    fireEvent.error(screen.getByTestId('next-image'));

    expect(onError).toHaveBeenCalled();
  });

  it('renders with sm size', () => {
    render(<Image src='/pokemon.png' alt='Small' size='sm' />);
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

  it('renders with lg size', () => {
    render(<Image src='/pokemon.png' alt='Large' size='lg' />);
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

  it('renders with xl size', () => {
    render(<Image src='/pokemon.png' alt='XL' size='xl' />);
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

  it('applies fit class when fit is provided', () => {
    render(<Image src='/pokemon.png' alt='Fit' fit='cover' />);
    expect(screen.getByTestId('next-image')).toHaveClass('object-cover');
  });

  it('renders with custom width and height', () => {
    render(<Image src='/pokemon.png' alt='Custom size' width={100} height={80} />);
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

  it('renders with lazyLoad false (eager loading)', () => {
    render(<Image src='/pokemon.png' alt='Eager' lazyLoad={false} />);
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

  it('renders with explicit loading prop', () => {
    render(<Image src='/pokemon.png' alt='Loading prop' loading='eager' />);
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

  it('uses default alt when no alt prop provided', () => {
    render(<Image src='/pokemon.png' />);
    // Default alt = 'Image' branch is covered
    expect(screen.getByAltText('Image')).toBeInTheDocument();
  });
});
