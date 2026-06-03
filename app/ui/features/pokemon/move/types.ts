import { TEntity } from '@/app/ui/types';

export type TPokemonMove = TEntity & {
  pp: number;
  url: string;
  name: string;
  type: string;
  power: number;
  order: number;
  target: string;
  effect: string;
  accuracy: number;
  short_effect: string;
  damage_class: string;
  effect_chance?: number;
}

export type TPokemonMoveFilters = {
  name?: string;
  order?: string;
}