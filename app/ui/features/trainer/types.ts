export type TTrainer = {
  id: string;
  user_id: string;
  pokeballs: number;
  capture_rate: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

export type InitializeTrainerParams = {
  pokeballs: number;
  capture_rate: number;
};
