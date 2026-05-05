export type TPokemonTypeDamage = {
  id: string;
  name: string;
  order?: number | null;
  url?: string | null;
  text_color?: string | null;
  background_color?: string | null;
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
  weaknesses: TPokemonTypeDamage[];
  strengths: TPokemonTypeDamage[];
  background_color: string;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};
