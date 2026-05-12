import {
  GiCrossedSwords ,
  GiPositionMarker ,
  GiPunchBlast ,
  GiStumpRegrowth,
} from 'react-icons/gi';
import { MdAutoAwesome, MdCatchingPokemon, MdCategory, MdHome, MdInventory2, MdOutlineCatchingPokemon } from 'react-icons/md';

import type { MenuItem } from './types';

export const getAuthenticatedMenuItems = (translate: (key: string) => string): MenuItem[] => [
  {
    label: translate('navigation.home'),
    href: '/home',
    icon: MdHome,
  },
  {
    label: translate('navigation.pokemon'),
    href: '/pokemon',
    icon: MdCatchingPokemon,
    children: [
      {
        label: translate('navigation.types'),
        href: '/pokemon/type',
        icon: MdCategory,
      },
      {
        label: translate('navigation.abilities'),
        href: '/pokemon/ability',
        icon: MdAutoAwesome,
      },
      {
        label: translate('navigation.moves'),
        href: '/pokemon/move',
        icon: GiPunchBlast,
      },
      {
        label: translate('navigation.growthRate'),
        href: '/pokemon/growth-rate',
        icon: GiStumpRegrowth,
      },
      {
        label: translate('navigation.encounters'),
        href: '/pokemon/encounter',
        icon: GiPositionMarker,
      }
    ],
  },
  {
    label: translate('navigation.pokedex'),
    href: '/pokedex',
    icon: MdOutlineCatchingPokemon,
  },
  {
    label: translate('navigation.myPokemons'),
    href: '/my-pokemon',
    icon: MdInventory2,
  },
  {
    label: translate('navigation.battle'),
    href: '/battle',
    icon: GiCrossedSwords,
  },
];
