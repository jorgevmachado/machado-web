import { TEntity } from '@/app/ui/types';
import { TPokedexEntry } from '@/app/ui/features/trainer/pokedex/entry';

export type TPokedex = TEntity & {
  entries: Array<TPokedexEntry>;
}

export type TPokedexFilters = {
  nickname?: string;
  discovered?: string;
  pokemon_name?: string;
}