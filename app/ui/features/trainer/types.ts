import { TMyPokemon } from '@/app/ui/features/trainer/my_pokemon/types';
import { TPokedex } from '@/app/ui/features/trainer/pokedex/types';

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
  battle_session_id?: string | null;
  battle_status?: 'ACTIVE' | 'ESCAPED' | 'WILD_POKEMON_DEFEATED' | 'TRAINER_DEFEATED' | null;
  has_active_battle?: boolean;
};

export type TBattleMove = {
  id: string;
  pokemon_move_id?: string | null;
  name: string;
  type: string;
  power: number;
  accuracy: number;
  pp: number;
  max_pp: number;
};

export type TBattleSide = {
  my_pokemon_id?: string | null;
  pokemon_id?: string | null;
  name: string;
  nickname?: string | null;
  level: number;
  current_hp: number;
  max_hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  moves: Array<TBattleMove>;
};

export type TBattleLog = {
  id: string;
  turn_number?: number | null;
  actor?: 'TRAINER' | 'WILD' | null;
  log_type:
    | 'SESSION_STARTED'
    | 'MOVE_USED'
    | 'DAMAGE_DEALT'
    | 'SWITCHED'
    | 'ESCAPED'
    | 'CAPTURE_ATTEMPT'
    | 'CAPTURE_SUCCESS'
    | 'CAPTURE_FAILED'
    | 'SESSION_FINISHED';
  message: string;
  reference?: string | null;
  payload: Record<string, unknown>;
  created_at: string;
};

export type TBattleSession = {
  id: string;
  trainer_id: string;
  exploration_event_id: string;
  trainer_active_my_pokemon_id?: string | null;
  wild_pokemon_id: string;
  wild_pokemon_name: string;
  wild_pokemon_level: number;
  turn_number: number;
  status: 'ACTIVE' | 'ESCAPED' | 'CAPTURED' | 'WILD_POKEMON_DEFEATED' | 'TRAINER_DEFEATED';
  trainer_pokeballs: number;
  trainer_capture_rate: number;
  trainer_side: TBattleSide;
  wild_side: TBattleSide;
  party: Array<TBattleSide>;
  created_at: string;
  updated_at?: string | null;
};

export type TBattleCaptureOutcome = 'CAPTURED' | 'FAILED_CHANCE' | 'INELIGIBLE_CAPTURE_RATE';

export type TBattleCaptureResult = {
  success: boolean;
  outcome: TBattleCaptureOutcome;
  message: string;
  battle_session: TBattleSession;
  my_pokemon?: TMyPokemon | null;
  pokedex_updated: boolean;
  trainer_pokeballs: number;
  trainer_capture_rate: number;
  trainer_capture_progress_points: number;
  progress_points_awarded: number;
  capture_chance?: number | null;
};

export type TActiveBattleSummary = {
  battle_session_id: string;
  status: TBattleSession['status'];
  turn_number: number;
  wild_pokemon_name: string;
  wild_pokemon_level: number;
  trainer_active_my_pokemon_id?: string | null;
  has_active_battle: boolean;
};

export type TTrainerHome = {
  trainer: TTrainer;
  active_encounter?: TTrainerEncounter | null;
  party: Array<TTrainerPartyMember>;
  latest_discoveries: Array<TPokedex>;
  active_battle?: TActiveBattleSummary | null;
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

export type UseBattleMoveParams = {
  move_id: string;
};

export type SwitchBattlePokemonParams = {
  my_pokemon_id: string;
};

export type CaptureBattlePokemonParams = {
  nickname?: string | null;
};
