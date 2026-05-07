import type { TPaginatedListResponse } from '@/app/ds';

export type TPokemonAbility = {
  id: string;
  url: string;
  name: string;
  slot: number;
  order: number;
  effect: string;
  is_hidden: boolean;
  flavor_text: string;
  short_effect: string;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type PokemonAbilityFilters = {
  name?: string;
  order?: string;
};

export type PokemonAbilityListItem = TPokemonAbility;

export type PokemonAbilityDetail = TPokemonAbility;

export type PokemonAbilityListResponse = TPaginatedListResponse<PokemonAbilityListItem>;
