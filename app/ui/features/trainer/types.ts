import { TEntity } from '@/app/ui/types';
import {
  TTrainerEncounter ,
  TTrainerParty ,
  TPokedex ,
  TOwnedPokemon ,TTrainerBattle ,TTrainerExploration ,
} from '@/app/ui';

export type TTrainer = TEntity & {
  pokedex: TPokedex;
  pokeballs: number;
  party_slots: Array<TTrainerParty>;
  capture_rate: number;
  owned_pokemons: Array<TOwnedPokemon>;
  battle_sessions: Array<TTrainerBattle>;
  known_encounters: Array<TTrainerEncounter>;
  base_capture_rate: number;
  exploration_events: Array<TTrainerExploration>;
  capture_progress_points: number;
}

export type TTrainerFilters = {
  name?: string;
}