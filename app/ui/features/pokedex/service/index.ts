import { getBaseUrl } from '@/app/utils/url/url';

import { PokedexService } from './service';

export const pokedexService = (token?: string): PokedexService => {
  return new PokedexService(getBaseUrl(), token);
};

export { PokedexService } from './service';
