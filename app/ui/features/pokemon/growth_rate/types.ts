import type { TPaginatedListResponse } from '@/app/ds';

export type TPokemonGrowthRate = {
  id: string;
  url: string;
  name: string;
  order: number;
  formula: string;
  description: string;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type PokemonGrowthRateFilters = {
  name?: string;
  order?: string;
};

export type PokemonGrowthRateListResponse = TPaginatedListResponse<TPokemonGrowthRate>;