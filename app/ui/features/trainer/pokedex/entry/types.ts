import { type TEntity, type TProgressionAttributes } from '@/app/ui';

export type TPokedexEntry = TEntity & TProgressionAttributes & {
  name: string;
  discovered: boolean;
  discovered_at?: Date;
}