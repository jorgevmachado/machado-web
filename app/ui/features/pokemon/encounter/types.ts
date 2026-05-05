export type TPokemonEncounter = {
  id: string;
  url: string;
  name: string;
  order: number;
  chance: number;
  method: string;
  version: string;
  min_level: number;
  max_level: number;
  condition: string;
  max_chance: number;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};
