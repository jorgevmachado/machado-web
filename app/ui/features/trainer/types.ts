import { TEntity } from '@/app/ui/types';
import { TTrainerEncounter ,TTrainerParty, TPokedex } from '@/app/ui';

export type TTrainer = TEntity & {
  pokedex: TPokedex;
  pokeballs: number;
  party_slots: Array<TTrainerParty>;
  capture_rate: number;
  known_encounters: Array<TTrainerEncounter>;
}

export type TProgressionAttributes = {
  hp: number;
  name: string;
  level: number;
  speed: number;
  max_hp: number;
  attack: number;
  defense: number;
  experience: number;
  special_attack: number;
  special_defense: number;
}