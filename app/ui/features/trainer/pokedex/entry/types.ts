import { TEntity } from '@/app/ui/types';
import { TProgressionAttributes } from '@/app/ui/features/trainer/types';

export type TPokedexEntry = TEntity & TProgressionAttributes & {
  name: string;
  discovered: boolean;
  discovered_at?: Date;
}