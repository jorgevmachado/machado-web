import type {
  TBattleLog,
  TBattleMove,
  TBattleSide,
  TBattleSession,
} from '@/app/ui/features/trainer/types';

export type BattleSessionStatus = 'ACTIVE' | 'ESCAPED' | 'WILD_POKEMON_DEFEATED' | 'TRAINER_DEFEATED';

export type BattleMove = TBattleMove;
export type BattleSide = TBattleSide;
export type BattleLog = TBattleLog;
export type BattleSession = TBattleSession;

export type UseMovePayload = {
  move_id: string;
};

export type SwitchPokemonPayload = {
  my_pokemon_id: string;
};
