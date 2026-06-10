import { TEntity } from '@/app/ui/types';
import { TTrainerEncounter ,TTrainerParty, TPokedex } from '@/app/ui';

export type TTrainer = TEntity & {
  pokedex: TPokedex;
  pokeballs: number;
  party_slots: Array<TTrainerParty>;
  capture_rate: number;
  known_encounters: Array<TTrainerEncounter>;
}

export type TTrainerFilters = {
  name?: string;
}