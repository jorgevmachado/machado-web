import {TMyPokemon} from "@/app/ui";

export type TTrainer = {
  id: string;
  user_id: string;
  pokeballs: number;
  capture_rate: number;
  my_pokemons: Array<TMyPokemon>;
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
}