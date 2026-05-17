import type { TPaginatedListResponse } from '@/app/ds';

export type TPokemonMove = {
  id: string;
  pp: number;
  url: string;
  name: string;
  type: string;
  power: number;
  order: number;
  priority?: number;
  target: string;
  effect: string;
  accuracy: number;
  short_effect: string;
  damage_class: string;
  effect_chance?: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

export type PokemonMoveFilters = {
  name?: string;
  order?: string;
};

export type PokemonMoveListResponse = TPaginatedListResponse<TPokemonMove>;
