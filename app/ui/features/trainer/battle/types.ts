import { TEntity ,TProgressionAttributes ,TTrainerBattleLog } from '@/app/ui';

export type TBattleSessionStatus =
  'ACTIVE'
  | 'ESCAPED'
  | 'CAPTURED'
  | 'TRAINER_DEFEATED'
  | 'WILD_POKEMON_DEFEATED'


export type TTrainerBattlePokemonMoveSnapshot = {
  id: string;
  pp: number;
  name: string;
  type: string;
  power: number;
  max_pp: number;
  accuracy: number;
  pokemon_move_id: string;
}

export type TTrainerBattlePokemonSnapshot = TProgressionAttributes & {
  id: string;
  slot: number;
  name: string;
  moves: Array<TTrainerBattlePokemonMoveSnapshot>;
  nickname?: string;
  is_active: boolean;
  pokemon_id: string;
  capture_rate: number;
  owned_pokemon_id?: string;
}

export type TTrainerBattle = TEntity & {
  logs: Array<TTrainerBattleLog>
  status: TBattleSessionStatus;
  trainer_id: string;
  turn_number: number;
  wild_pokemon_name: string;
  wild_pokemon_level: number;
  trainer_party_snapshot: Array<TTrainerBattlePokemonSnapshot>;
  wild_pokemon_snapshot: TTrainerBattlePokemonSnapshot;
}

export type TTrainerBattleFilters = {
  name?: string;
}