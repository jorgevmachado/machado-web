import { TPokedex, TMyPokemon } from '@/app/ui';

export type TTrainerEncounterPokemon = {
  id: string;
  url: string;
  name: string;
  order: number;
  chance: number;
  method: string;
  version: string;
  min_level: number;
  max_level: number;
  condition: string;
  max_chance: number;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type TTrainerEncounter = {
  id: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  pokemon_encounter: TTrainerEncounterPokemon;
};

export type TTrainerPartyMember = {
  id: string;
  slot: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  my_pokemon: TMyPokemon;
};

export type TExplorationEvent = {
  id: string;
  event_type: 'WILD_POKEMON' | 'POKEBALLS';
  created_at: string;
  pokemon?: TPokedex['pokemon'];
  encounter?: TTrainerEncounterPokemon;
  pokeballs_found?: number;
  trainer_pokeballs?: number;
};

export type TTrainerHome = {
  trainer: TTrainer;
  active_encounter?: TTrainerEncounter | null;
  party: Array<TTrainerPartyMember>;
  latest_discoveries: Array<TPokedex>;
};

export type TTrainer = {
  id: string;
  user_id: string;
  pokeballs: number;
  capture_rate: number;
  my_pokemons?: Array<TMyPokemon>;
  pokedex?: Array<TPokedex>;
  known_encounters?: Array<TTrainerEncounter>;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

export type InitializeTrainerParams = {
  pokeballs: number;
  capture_rate: number;
};

export type OnboardingTrainerParams = {
  nickname?: string;
  pokeballs?: number;
  pokemon_name: string;
  capture_rate?: number;
};

export type SelectTrainerEncounterParams = {
  encounter_id: string;
};

export type UpdateTrainerPartyParams = {
  my_pokemon_ids: Array<string>;
};
