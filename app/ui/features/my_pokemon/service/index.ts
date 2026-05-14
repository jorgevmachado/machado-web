import { getBaseUrl } from '@/app/utils';

import { MyPokemonService } from './service';

export const myPokemonService = (token?: string): MyPokemonService => {
  return new MyPokemonService(getBaseUrl(), token);
};

export { MyPokemonService } from './service';
