import {
  GiCrossedSwords ,
  GiPositionMarker ,
  GiPunchBlast ,
  GiStumpRegrowth,
} from 'react-icons/gi';
import { MdAutoAwesome, MdCatchingPokemon, MdCategory, MdHome, MdInventory2 } from 'react-icons/md';

import type { MenuItem } from './types';

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
    children: [
      {
        label: 'Types',
        href: '/pokemon/type',
        icon: MdCategory,
      },
      {
        label: 'Abilities',
        href: '/pokemon/ability',
        icon: MdAutoAwesome,
      },
      {
        label: 'Moves',
        href: '/pokemon/move',
        icon: GiPunchBlast,
      },
      {
        label: 'Growth Rate',
        href: '/pokemon/growth-rate',
        icon: GiStumpRegrowth,
      },
      {
        label: 'Encounter',
        href: '/pokemon/encounter',
        icon: GiPositionMarker,
      }
    ],
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
