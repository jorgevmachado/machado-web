export type TPokemonImage = {
  id: string;
  order: number;
  images: string[];
  back_image: string;
  front_image: string;
  back_source: string;
  front_source: string;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};
