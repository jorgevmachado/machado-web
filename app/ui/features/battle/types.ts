import type {
  TBattleLog,
  TBattleMove,
  TBattleSide,
  TWildPokemonBattleSession,
} from '@/app/ui/features/trainer/types';

export type BattleSessionStatus = 'ACTIVE' | 'WON' | 'LOST' | 'FLED';

export type BattleMove = TBattleMove;
export type BattleSide = TBattleSide;
export type BattleLog = TBattleLog;
export type BattleSession = TWildPokemonBattleSession;

export type UseMovePayload = {
  move_id: string;
};

export type SwitchPokemonPayload = {
  my_pokemon_id: string;
};

