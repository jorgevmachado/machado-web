import { BffBaseServiceAbstract } from '@/app/shared/services/bff-service';
import { TTrainer } from '@/app/ui';
import {
  TrainerPartyBffService ,
} from '@/app/ui/features/trainer/party/services/bff-service/bffService';
import {
  TrainerPokedexBffService ,
} from '@/app/ui/features/trainer/pokedex/services/bff-service/bffService';
import {
  TrainerEncounterBffService ,
} from '@/app/ui/features/trainer/encounter/services/bff-service/bffService';
import {
  TrainerOwnedPokemonBffService ,
} from '@/app/ui/features/trainer/owned-pokemon/services/bff-service/bffService';

export class TrainerBffService extends BffBaseServiceAbstract<TTrainer> {
  private readonly partyModule: TrainerPartyBffService;
  private readonly pokedexModule: TrainerPokedexBffService;
  private readonly encounterModule: TrainerEncounterBffService;
  private readonly ownedPokemonModule: TrainerOwnedPokemonBffService;

  constructor(baseUrl: string) {
    super('trainer' ,baseUrl);
    this.partyModule = new TrainerPartyBffService(baseUrl);
    this.pokedexModule = new TrainerPokedexBffService(baseUrl);
    this.encounterModule = new TrainerEncounterBffService(baseUrl);
    this.ownedPokemonModule = new TrainerOwnedPokemonBffService(`${baseUrl}/owned-pokemon`);
  }

  get party(): TrainerPartyBffService {
    return this.partyModule;
  }

  get pokedex(): TrainerPokedexBffService {
    return this.pokedexModule;
  }

  get encounter(): TrainerEncounterBffService {
    return this.encounterModule;
  }

  get ownedPokemon(): TrainerOwnedPokemonBffService {
    return this.ownedPokemonModule;
  }
}