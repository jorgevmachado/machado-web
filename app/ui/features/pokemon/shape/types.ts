import { TEntity } from '@/app/ui/types';

export type TPokemonShape = TEntity & {
  url: string;
  name: string;
  order: number;
};
