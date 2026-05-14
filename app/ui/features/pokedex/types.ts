import type { TPaginatedListResponse } from '@/app/ds';
import type { PokemonType } from '@/app/ui/features/pokemon';

export type TPokedexBasePokemon = {
  id: string;
  name: string;
  order: number;
  external_image: string;
  types: PokemonType[];
};

export type TPokedexTrainerSummary = {
  id: string;
  user_id: string;
  pokeballs: number;
  capture_rate: number;
};

export type TPokedex = {
  id: string;
  nickname?: string | null;
  level: number;
  experience: number;
  hp: number;
  max_hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  discovered: boolean;
  discovered_at?: string | null;
  created_at: string;
  updated_at?: string | null;
  pokemon: TPokedexBasePokemon;
  trainer: TPokedexTrainerSummary;
};

export type PokedexListFilters = {
  nickname?: string;
  pokemon_name?: string;
  discovered?: string;
};

export type TPokedexListResponse = TPaginatedListResponse<TPokedex>;
