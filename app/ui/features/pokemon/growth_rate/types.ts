import { TEntity } from '@/app/ui/types';

export type TPokemonGrowthRate = TEntity & {
  url: string;
  name: string;
  order: number;
  formula: string;
  description: string;
};

export type TPokemonGrowthRateFilters = {
  name?: string;
}