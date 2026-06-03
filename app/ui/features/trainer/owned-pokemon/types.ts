import { TEntity } from '@/app/ui/types';
import { TProgressionAttributes } from '@/app/ui/features/trainer/types';
import { TPokemon } from '@/app/ui/features/pokemon/types';
import {
  TOwnedPokemonMove
} from '@/app/ui/features/trainer/owned-pokemon/move';

export type TOwnedPokemon =  TEntity & TProgressionAttributes & {
  name: string;
  moves: Array<TOwnedPokemonMove>;
  pokemon: TPokemon;
  nickname?: string;
  capture_at: Date;
}

export type TOwnedPokemonFilters = {
  type?: string;
  name?: string;
  order?: string;
  status?: string;
  pokemon_name?: string;
}