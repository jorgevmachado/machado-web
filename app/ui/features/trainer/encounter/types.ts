import { TPokemonEncounter } from '@/app/ui/features/pokemon';

export type TTrainerEncounter = {
  id: string;
  is_active: boolean;
  pokemon_encounter: TPokemonEncounter;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export type TTrainerEncounterFilters = {
  name?: string;
  pokemon_encounter_id?: string;
}

export type TActiveTrainerEncounterParams = {
  encounter_id: string;
}