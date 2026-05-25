import type {
  TBattleCaptureResult,
  TBattleLog,
  TBattleMove,
  TBattleSide,
  TBattleSession,
} from '@/app/ui/features/trainer/types';

export type BattleSessionStatus = 'ACTIVE' | 'ESCAPED' | 'CAPTURED' | 'WILD_POKEMON_DEFEATED' | 'TRAINER_DEFEATED';

export type BattleMove = TBattleMove;
export type BattleSide = TBattleSide;
export type BattleLog = TBattleLog;
export type BattleSession = TBattleSession;
export type BattleCaptureResult = TBattleCaptureResult;

export type UseMovePayload = {
  move_id: string;
};

export type SwitchPokemonPayload = {
  my_pokemon_id: string;
};

export type CapturePokemonPayload = {
  nickname?: string | null;
};
