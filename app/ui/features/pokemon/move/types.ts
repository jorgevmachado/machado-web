export type TPokemonMove = {
  id: string;
  pp: number;
  url: string;
  name: string;
  type: string;
  power: number;
  order: number;
  target: string;
  effect: string;
  accuracy: number;
  short_effect: string;
  damage_class: string;
  effect_chance?: number | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};
