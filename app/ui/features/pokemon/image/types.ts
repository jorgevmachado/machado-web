import { TEntity } from '@/app/ui/types';

export type TPokemonImage =  TEntity &{
  order: number;
  images: Array<string>;
  back_image: string;
  front_image: string;
  back_source: string;
  front_source: string;
};
