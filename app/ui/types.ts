export type TEntity = {
  id: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export type TProgressionAttributes = {
  hp: number;
  level: number;
  speed: number;
  max_hp: number;
  attack: number;
  defense: number;
  experience: number;
  special_attack: number;
  special_defense: number;
}