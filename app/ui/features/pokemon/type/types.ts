import type { TPaginatedListResponse } from '@/app/ds';

export type TPokemonTypeDamage = {
  id: string;
  name: string;
  order?: number | null;
  url?: string | null;
  status?: string | null;
  text_color?: string | null;
  badge_url?: string | null;
  description?: string | null;
  badge_icon_url?: string | null;
  background_color?: string | null;
  badge_shield_url?: string | null;
  badge_legends_url?: string | null;
  badge_legend_icon_url?: string | null;
  badge_shield_icon_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type TPokemonType = {
  id: string;
  url: string;
  name: string;
  order: number;
  text_color: string;
  badge_url?: string | null;
  weaknesses: TPokemonTypeDamage[];
  strengths: TPokemonTypeDamage[];
  description?: string | null;
  badge_icon_url?: string | null;
  background_color: string;
  badge_shield_url?: string | null;
  badge_legends_url?: string | null;
  badge_legend_icon_url?: string | null;
  badge_shield_icon_url?: string | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type PokemonTypeFilters = {
  name?: string;
  order?: string;
};

export type PokemonTypeListResponse = TPaginatedListResponse<TPokemonType>;
