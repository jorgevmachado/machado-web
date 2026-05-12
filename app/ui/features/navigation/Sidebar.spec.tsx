import { fireEvent, render, screen } from '@testing-library/react';
import { MdCatchingPokemon, MdHome } from 'react-icons/md';

import { I18nProvider } from '@/app/i18n';

import Sidebar from './Sidebar';
import type { MenuItem } from './types';

const items: MenuItem[] = [
  { label: 'Home', href: '/home', icon: MdHome },
  {
    label: 'Pokemon',
    href: '/pokemon',
    icon: MdCatchingPokemon,
    children: [
      { label: 'Types', href: '/pokemon/type', icon: MdCatchingPokemon },
      { label: 'Abilities', href: '/pokemon/ability', icon: MdCatchingPokemon },
      { label: 'Moves', href: '/pokemon/move', icon: MdCatchingPokemon },
    ],
  },
];

describe('Sidebar', () => {
  const renderSidebar = (pathname: string, isCollapsed = false, onLogout = jest.fn()) => {
    return render(
      <I18nProvider>
        <Sidebar items={items} isCollapsed={isCollapsed} pathname={pathname} onLogout={onLogout} />
      </I18nProvider>,
    );
  };

  it('keeps Pokemon parent link navigable and expands children with arrow', () => {
    renderSidebar('/home');

    expect(screen.getByRole('link', { name: /pokemon/i })).toHaveAttribute('href', '/pokemon');
    expect(screen.queryByRole('link', { name: /types/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Expand Pokemon' }));

    expect(screen.getByRole('link', { name: /types/i })).toHaveAttribute('href', '/pokemon/type');
    expect(screen.getByRole('link', { name: /abilities/i })).toHaveAttribute('href', '/pokemon/ability');
    expect(screen.getByRole('link', { name: /moves/i })).toHaveAttribute('href', '/pokemon/move');
  });

  it('auto-expands Pokemon children for child routes', () => {
    renderSidebar('/pokemon/move/tackle');

    expect(screen.getByRole('button', { name: 'Collapse Pokemon' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /moves/i })).toHaveAttribute('aria-current', 'page');
  });

  it('continues rendering existing top-level links', () => {
    renderSidebar('/home');

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/home');
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('uses titles and hides labels when collapsed', () => {
    const onLogout = jest.fn();

    renderSidebar('/home', true, onLogout);

    expect(screen.getByTitle('Home')).toHaveAttribute('href', '/home');
    expect(screen.getByTitle('Pokemon')).toHaveAttribute('href', '/pokemon');
    expect(screen.queryByRole('button', { name: 'Expand Pokemon' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
