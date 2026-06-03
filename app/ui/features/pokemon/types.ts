import {
  TPokemonEncounter ,
  TPokemonHabitat ,
  TPokemonMove ,
  TPokemonShape,
  TPokemonAbility,
  TPokemonGrowthRate,
  TPokemonImage,
  TPokemonType
} from '@/app/ui';

export type PokemonStatus = 'COMPLETE' | 'INCOMPLETE';

export type TPokemonEvolution = {
  id: string;
  hp: number;
  name: string;
  order: number;
  speed: number;
  height: number;
  weight: number;
  status: PokemonStatus;
  attack: number;
  defense: number;
  is_baby: boolean;
  gender_rate: number;
  is_mythical: boolean;
  description?: string | null;
  is_legendary: boolean;
  capture_rate: number;
  hatch_counter: number;
  base_happiness: number;
  external_image: string;
  special_attack: number;
  special_defense: number;
  base_experience: number;
  evolution_chain?: string | null;
  evolves_from_species?: string | null;
  has_gender_differences: boolean;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export type TPokemon = TPokemonEvolution & {
  types: Array<TPokemonType>;
  moves: Array<TPokemonMove>;
  shape?: TPokemonShape;
  images?: TPokemonImage;
  habitat?: TPokemonHabitat;
  abilities: Array<TPokemonAbility>;
  evolutions: Array<TPokemonEvolution>;
  encounters: Array<TPokemonEncounter>;
  growth_rate?: TPokemonGrowthRate;
};

export type TPokemonFilters = {
  type?: string;
  name?: string;
  order?: string;
  status?: string;
}