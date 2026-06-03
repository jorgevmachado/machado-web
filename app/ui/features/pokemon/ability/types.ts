import { TEntity } from '@/app/ui/types';

export type TPokemonAbility = TEntity & {
  url: string;
  name: string;
  slot: number;
  order: number;
  effect: string;
  is_hidden: boolean;
  flavor_text: string;
  short_effect: string;
}

export type TPokemonAbilityFilters = {
  name?: string;
  order?: string;
}