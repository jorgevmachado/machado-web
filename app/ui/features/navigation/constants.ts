import {
  GiCrossedSwords ,
  GiHealing ,
  GiPositionMarker ,
  GiPunchBlast ,
  GiStumpRegrowth,
} from 'react-icons/gi';
import { MdAutoAwesome, MdCatchingPokemon, MdCategory, MdHome, MdInventory2, MdOutlineCatchingPokemon } from 'react-icons/md';

import type { MenuItem } from './types';

export const getAuthenticatedMenuItems = (translate: (key: string) => string): MenuItem[] => [
  {
    label: translate('navigation.home'),
    roles: ['USER'],
    href: '/home',
    icon: MdHome,
  },
  {
    label: translate('navigation.pokemon'),
    roles: ['USER'],
    href: '/pokemon',
    icon: MdCatchingPokemon
  },
  {
    label: translate('navigation.pokedex'),
    roles: ['USER'],
    href: '/pokedex',
    icon: MdOutlineCatchingPokemon,
  },
  {
    label: translate('navigation.pokemonCenter'),
    roles: ['USER'],
    href: '/pokemon-center',
    icon: GiHealing,
  },
  {
    label: translate('navigation.battle'),
    roles: ['USER'],
    href: '/battle',
    icon: GiCrossedSwords,
  },
  {
    label: translate('navigation.catalog'),
    href: '/catalog',
    icon: MdInventory2,
    roles: ['ADMIN'],
    children: [
      {
        label: translate('navigation.types'),
        href: '/catalog/type',
        icon: MdCategory,
        roles: ['ADMIN'],
      },
      {
        label: translate('navigation.abilities'),
        href: '/catalog/ability',
        icon: MdAutoAwesome,
        roles: ['ADMIN'],
      },
      {
        label: translate('navigation.moves'),
        href: '/catalog/move',
        icon: GiPunchBlast,
        roles: ['ADMIN'],
      },
      {
        label: translate('navigation.growthRate'),
        href: '/catalog/growth-rate',
        icon: GiStumpRegrowth,
        roles: ['ADMIN'],
      },
      {
        label: translate('navigation.encounters'),
        href: '/catalog/encounter',
        icon: GiPositionMarker,
        roles: ['ADMIN'],
      }
    ],
  },
];
