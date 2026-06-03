import { TEntity } from '@/app/ui/types';

export type TPokemonHabitat = TEntity & {
  url: string;
  name: string;
  order: number;
};
