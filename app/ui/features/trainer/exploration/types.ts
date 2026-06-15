import { TEntity ,TTrainerBattle } from '@/app/ui';

export type TExplorationEvent = 'POKEBALLS' | 'WILD_POKEMON';

export type TTrainerExploration  = TEntity & {
  payload: Record<string, unknown>;
  event_type: TExplorationEvent;
  battle_sessions: Array<TTrainerBattle>;
}