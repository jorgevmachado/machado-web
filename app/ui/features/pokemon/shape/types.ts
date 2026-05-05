export type TPokemonShape = {
  id: string;
  url: string;
  name: string;
  order: number;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};
