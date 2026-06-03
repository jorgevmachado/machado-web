import { TEntity } from '@/app/ui/types';
import { TPokemonMove } from '@/app/ui';

export type TOwnedPokemonMove = TEntity & {
  pp: number;
  max_pp: number;
  pokemon_move: TPokemonMove;
}