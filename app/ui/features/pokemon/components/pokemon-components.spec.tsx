import { fireEvent, render, screen } from '@testing-library/react';

import EvolutionTimeline from './evolution-timeline';
import GalleryImage from './gallery-image';
import MovesExpand from './moves-expand';
import PokemonTypeVisual from '../type/components/pokemon-type-visual';
import { AssociationCard } from './association-card';

jest.mock('@/app/ds', () => {
  const React = jest.requireActual('react');
  const Text = ({ as = 'p', children, lineClamp, ...props }: {
    as?: string;
    children: React.ReactNode;
    lineClamp?: number;
  }) => {
    void lineClamp;

    return React.createElement(as, props, children);
  };

  return {
    Badge: ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => <span style={style}>{children}</span>,
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Image: ({ alt, src }: { alt: string; src: string }) => <span aria-label={alt} data-src={src} />,
    Text,
  };
});

describe('pokemon reusable components', () => {
  it('renders current pokemon and evolutions in the timeline', () => {
    render(<EvolutionTimeline pokemon={{
      id: 'pokemon-1',
      name: 'bulbasaur',
      order: 1,
      status: 'COMPLETE',
      external_image: '',
      images: {
        id: 'image-1',
        order: 1,
        images: [],
        front_image: 'front.png',
        back_image: '',
        front_source: 'front_default',
        back_source: 'back_default',
        created_at: '2026-01-01',
      },
      evolutions: [{
        id: 'pokemon-2',
        name: 'ivysaur',
        order: 2,
        status: 'COMPLETE',
        external_image: 'ivysaur.png',
      }],
    } as never} />);

    expect(screen.getByRole('heading', { name: 'Evolution Timeline' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ivysaur' })).toBeInTheDocument();
    expect(screen.getByLabelText('bulbasaur')).toHaveAttribute('data-src', 'front.png');
    expect(screen.getByLabelText('ivysaur')).toHaveAttribute('data-src', 'ivysaur.png');
  });

  it('renders gallery thumbnails and type links with unique images', () => {
    render(<GalleryImage
      pokemon_name="pikachu"
      external_image=""
      images={{
        id: 'image-1',
        order: 1,
        front_image: 'front.png',
        back_image: 'back.png',
        images: ['front.png', 'extra.png', ''],
        front_source: 'front_default',
        back_source: 'back_default',
        created_at: '2026-01-01',
      }}
      types={[{
        id: 'type-1',
        name: 'electric',
        order: 1,
        url: 'url',
        text_color: '#111',
        background_color: '#eee',
        weaknesses: [],
        strengths: [],
        created_at: '2026-01-01',
      }]}
    />);

    expect(screen.getAllByLabelText('pikachu')).toHaveLength(4);
    expect(screen.getByRole('link', { name: 'Electric' })).toHaveAttribute('href', '/pokemon/type/electric');
  });

  it('falls back to an empty primary image when there are no images', () => {
    render(<GalleryImage pokemon_name="missingno" />);

    expect(screen.getByLabelText('missingno')).toHaveAttribute('data-src', '');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders gallery badges without custom colors when type colors are missing', () => {
    render(<GalleryImage
      pokemon_name="eevee"
      images={null}
      types={[{
        id: 'type-1',
        name: 'normal',
        order: 1,
        url: 'url',
        text_color: '',
        background_color: '',
        weaknesses: [],
        strengths: [],
        created_at: '2026-01-01',
      }]}
    />);

    expect(screen.getByRole('link', { name: 'Normal' })).toHaveAttribute('href', '/pokemon/type/normal');
    expect(screen.getByText('Normal')).not.toHaveStyle({ color: '' });
  });

  it('renders type visual fallback badge when no badge image exists', () => {
    render(<PokemonTypeVisual type={{
      name: 'shadow',
      badge_url: '',
      background_color: null,
      text_color: null,
    }} />);

    expect(screen.getByText('Shadow')).toHaveStyle({
      backgroundColor: '#E5E7EB',
      color: '#111827',
    });
  });

  it('renders minimal association cards without optional header, visual, footer, or explicit label', () => {
    render(<AssociationCard href="/pokemon/ditto">
      <span>Ditto body</span>
    </AssociationCard>);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/pokemon/ditto');
    expect(screen.getByText('Ditto body')).toBeInTheDocument();
  });

  it('renders association card title without eyebrow', () => {
    render(<AssociationCard href="/pokemon/mew" title="mew">
      <span>Mythical body</span>
    </AssociationCard>);

    expect(screen.getByRole('link', { name: 'mew' })).toHaveAttribute('href', '/pokemon/mew');
    expect(screen.getByRole('heading', { name: 'mew' })).toBeInTheDocument();
    expect(screen.getByText('Mythical body')).toBeInTheDocument();
  });

  it('renders association card eyebrow without title', () => {
    render(
      <AssociationCard href="/pokemon/snorlax" eyebrow="#143">
        <span>Sleeping body</span>
      </AssociationCard>,
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/pokemon/snorlax');
    expect(screen.getByText('#143')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('Sleeping body')).toBeInTheDocument();
  });

  it('expands moves in batches and prefers short effects', () => {
    render(<MovesExpand
      page_size={1}
      moves={[
        {
          id: 'move-1',
          name: 'quick-attack',
          type: 'normal',
          damage_class: 'physical',
          priority: 1,
          power: 40,
          accuracy: 100,
          pp: 30,
          short_effect: 'Hits first.',
          effect: 'Inflicts damage.',
          order: 1,
          target: 'selected-pokemon',
          url: 'url',
          created_at: '2026-01-01',
        },
        {
          id: 'move-2',
          name: 'tail-whip',
          type: 'normal',
          damage_class: 'status',
          priority: 0,
          power: 0,
          accuracy: 100,
          pp: 30,
          short_effect: '',
          effect: 'Lowers defense.',
          order: 2,
          target: 'selected-pokemon',
          url: 'url',
          created_at: '2026-01-01',
        },
      ]}
    />);

    expect(screen.getByRole('heading', { name: 'Quick Attack' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Tail Whip' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'View 1 more moves' }));

    expect(screen.getByRole('heading', { name: 'Tail Whip' })).toBeInTheDocument();
    expect(screen.getByText('Lowers defense.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'View 1 more moves' })).not.toBeInTheDocument();
  });
});
