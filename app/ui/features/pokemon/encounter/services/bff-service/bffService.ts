import { BffBaseServiceAbstract } from '@/app/shared/services/bff-service';
import { TPokemonEncounter } from '@/app/ui/features/pokemon/encounter';

export class PokemonEncounterBffService extends BffBaseServiceAbstract<TPokemonEncounter> {
  constructor(baseUrl: string) {
    super('pokemon.encounter', baseUrl);
  }
}