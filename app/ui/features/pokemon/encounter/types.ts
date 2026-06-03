import { TEntity } from '@/app/ui/types';

export type TPokemonEncounter = TEntity & {
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
}

export type TPokemonEncounterFilters = {
  name?: string;
}