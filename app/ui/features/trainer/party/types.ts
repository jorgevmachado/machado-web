import { TEntity } from '@/app/ui/types';
import { TOwnedPokemon } from '@/app/ui/features/trainer/owned-pokemon';

export type TTrainerParty = TEntity & {
  slot: number;
  is_active: boolean;
  owned_pokemon: TOwnedPokemon;
}

export type TTrainerPartyFilters = {
  slot?: string;
  is_active?: boolean;
}