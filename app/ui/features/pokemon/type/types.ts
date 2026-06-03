import { TEntity } from '@/app/ui/types';

export type TPokemonTypeDamage = TEntity & {
  name: string;
  order?: number;
  url?: string;
  status?: string;
  text_color?: string;
  badge_url?: string;
  description?: string;
  badge_icon_url?: string;
  background_color?: string;
  badge_shield_url?: string;
  badge_legends_url?: string;
  badge_legend_icon_url?: string;
  badge_shield_icon_url?: string;
};

export type TPokemonType = TEntity & {
  url: string;
  name: string;
  order: number;
  text_color: string;
  badge_url?: string;
  weaknesses: Array<TPokemonTypeDamage>;
  strengths: Array<TPokemonTypeDamage>;
  description?: string;
  badge_icon_url?: string;
  background_color: string;
  badge_shield_url?: string;
  badge_legends_url?: string;
  badge_legend_icon_url?: string;
  badge_shield_icon_url?: string;
};

export type TPokemonTypeFilters =  {
  name?: string;
  order?: string;
}