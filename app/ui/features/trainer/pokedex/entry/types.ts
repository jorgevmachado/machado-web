import { type TEntity ,type TPokemon ,type TProgressionAttributes } from '@/app/ui';

export type TPokedexEntry = TEntity & TProgressionAttributes & {
  name: string;
  pokemon: TPokemon;
  discovered: boolean;
  discovered_at?: Date;
}

export type TPokedexEntryFilters = {
  nickname?: string;
  discovered?: string;
  pokemon_name?: string;
}