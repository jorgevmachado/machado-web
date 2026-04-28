import { render, screen } from '@testing-library/react';

import Text from './Text';

describe('<Text />', () => {
  it('renders a paragraph element by default', () => {
    render(<Text>Trainer profile</Text>);

    const paragraph = screen.getByText('Trainer profile');

    expect(paragraph.tagName).toBe('P');
    expect(paragraph).toHaveClass('text-base');
    expect(paragraph).toHaveClass('leading-7');
  });

  it('renders semantic heading tags', () => {
    render(<Text as='h2'>Pokédex</Text>);

    const heading = screen.getByRole('heading', { level: 2, name: 'Pokédex' });

    expect(heading).toHaveClass('text-3xl');
    expect(heading).toHaveClass('font-bold');
  });

  it('supports native props for the chosen tag', () => {
    render(
      <>
        <Text as='label' htmlFor='trainer-name'>Trainer name</Text>
        <input id='trainer-name' />
      </>,
    );

    expect(screen.getByText('Trainer name')).toHaveAttribute('for', 'trainer-name');
  });

  it('applies typography customization props and custom Tailwind classes', () => {
    render(
      <Text
        as='span'
        size='4xl'
        weight='black'
        tone='success'
        align='center'
        transform='uppercase'
        tracking='widest'
        decoration='underline'
        italic
        truncate
        className='md:text-5xl'
      >
        Victory road
      </Text>,
    );

    const text = screen.getByText('Victory road');

    expect(text.tagName).toBe('SPAN');
    expect(text).toHaveClass('text-4xl');
    expect(text).toHaveClass('font-black');
    expect(text).toHaveClass('text-emerald-600');
    expect(text).toHaveClass('text-center');
    expect(text).toHaveClass('uppercase');
    expect(text).toHaveClass('tracking-widest');
    expect(text).toHaveClass('underline');
    expect(text).toHaveClass('italic');
    expect(text).toHaveClass('truncate');
    expect(text).toHaveClass('md:text-5xl');
  });

  it('supports layout-oriented text utilities', () => {
    render(
      <Text
        as='blockquote'
        display='block'
        wrap='pretty'
        whitespace='preWrap'
        breakStrategy='words'
        lineClamp={3}
      >
        Long trainer quote
      </Text>,
    );

    const quote = screen.getByText('Long trainer quote');

    expect(quote.tagName).toBe('BLOCKQUOTE');
    expect(quote).toHaveClass('block');
    expect(quote).toHaveClass('text-pretty');
    expect(quote).toHaveClass('whitespace-pre-wrap');
    expect(quote).toHaveClass('break-words');
    expect(quote).toHaveClass('line-clamp-3');
  });
});

