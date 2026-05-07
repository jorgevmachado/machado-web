import type { TPaginatedListResponse } from '@/app/ds';
import type { TPokemonAbility } from '@/app/ui/features/pokemon/ability';
import type { TPokemonEncounter } from '@/app/ui/features/pokemon/encounter';
import type { TPokemonGrowthRate } from '@/app/ui/features/pokemon/growth_rate';
import type { TPokemonHabitat } from '@/app/ui/features/pokemon/habitat';
import type { TPokemonImage } from '@/app/ui/features/pokemon/image';
import type { TPokemonMove } from '@/app/ui/features/pokemon/move';
import type { TPokemonShape } from '@/app/ui/features/pokemon/shape';
import type { TPokemonType } from '@/app/ui/features/pokemon/type';

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
  shape?: TPokemonShape | null;
  images?: TPokemonImage | null;
  habitat?: TPokemonHabitat | null;
  abilities: Array<TPokemonAbility>;
  evolutions: Array<TPokemonEvolution>;
  encounters: Array<TPokemonEncounter>;
  growth_rate?: TPokemonGrowthRate | null;
};

export type NamedResource = {
  id: string;
  name: string;
};

export type PokemonType = NamedResource & {
  text_color?: string;
  background_color?: string;
  weaknesses?: TPokemonType['weaknesses'];
  strengths?: TPokemonType['strengths'];
};

export type PokemonListItem = {
  id: string;
  order: number;
  name: string;
  external_image: string;
  status: PokemonStatus;
  types: PokemonType[];
};

export type PokemonDetail = PokemonListItem & {
  height?: number;
  weight?: number;
  base_experience?: number;
  hp?: number;
  attack?: number;
  defense?: number;
  special_attack?: number;
  special_defense?: number;
  speed?: number;
  description?: string;
  capture_rate?: number;
  is_baby?: boolean;
  is_mythical?: boolean;
  is_legendary?: boolean;
  images?: TPokemonImage | null;
  moves: TPokemonMove[];
  abilities: TPokemonAbility[];
  encounters: TPokemonEncounter[];
  growth_rate?: TPokemonGrowthRate | null;
  habitat?: TPokemonHabitat | null;
  shape?: TPokemonShape | null;
};

export type PokemonListFilters = {
  name?: string;
  order?: string;
  status?: string;
  type?: string;
};

export type PokemonListResponse = TPaginatedListResponse<TPokemon>;
