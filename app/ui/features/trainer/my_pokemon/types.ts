import type { TPaginatedListResponse } from '@/app/ds';
import type { PokemonType } from '@/app/ui/features/pokemon';

export type TMyPokemonBasePokemon = {
  id: string;
  name: string;
  order: number;
  external_image: string;
  types: PokemonType[];
};

export type TMyPokemonMove = {
  id: string;
  pp: number;
  max_pp: number;
  pokemon_move_id: string;
  pokemon_move_name: string;
  pokemon_move_type: string;
  pokemon_move_power: number;
  pokemon_move_accuracy: number;
};

export type TMyPokemonTrainerSummary = {
  id: string;
  user_id: string;
  pokeballs: number;
  capture_rate: number;
};

export type TMyPokemon = {
  id: string;
  name: string;
  nickname: string;
  level: number;
  experience: number;
  hp: number;
  max_hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  captured_at: string;
  created_at: string;
  updated_at?: string | null;
  pokemon: TMyPokemonBasePokemon;
  trainer: TMyPokemonTrainerSummary;
  moves: TMyPokemonMove[];
};

export type MyPokemonListFilters = {
  name?: string;
  pokemon_name?: string;
};

export type CreateMyPokemonPayload = {
  pokemon_name: string;
  nickname?: string;
};

export type MyPokemonListResponse = TPaginatedListResponse<TMyPokemon>;
