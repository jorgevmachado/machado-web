import { MdCatchingPokemon ,MdHome ,MdInventory2 } from 'react-icons/md';

import type { MenuItem } from './types';
import { GiCrossedSwords } from 'react-icons/gi';

export const AUTHENTICATED_MENU_ITEMS: MenuItem[] = [
  {
    label: 'Home',
    href: '/home',
    icon: MdHome,
  },
  {
    label: 'Pokemon',
    href: '/pokemon',
    icon: MdCatchingPokemon,
  },
  {
    label: 'Pokedex',
    href: '/pokedex',
    icon: MdCatchingPokemon,
  },
  {
    label: 'My Pokémons',
    href: '/my-pokemon',
    icon: MdInventory2,
  },
  {
    label: 'Battle',
    href: '/battle',
    icon: GiCrossedSwords,
  },
];
