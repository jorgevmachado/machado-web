import {
  BffBaseServiceAbstract ,
  BffDetailResponse,
} from '@/app/shared/services/bff-service';
import {
  TrainerBffBattleService ,
  TTrainer ,
  TTrainerExploration,
} from '@/app/ui';
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
  private readonly battleModule: TrainerBffBattleService;

  constructor(baseUrl: string) {
    super('trainer' ,baseUrl);
    this.partyModule = new TrainerPartyBffService(`${baseUrl}/party`);
    this.pokedexModule = new TrainerPokedexBffService(`${baseUrl}/pokedex`);
    this.encounterModule = new TrainerEncounterBffService(`${baseUrl}/encounter`);
    this.ownedPokemonModule = new TrainerOwnedPokemonBffService(`${baseUrl}/owned-pokemon`);
    this.battleModule = new TrainerBffBattleService(`${baseUrl}/battle`);
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

  get battle(): TrainerBffBattleService {
    return this.battleModule;
  }

  public async explore(): Promise<BffDetailResponse<TTrainerExploration>> {
    return await this.bff_post<unknown, TTrainerExploration>({ param: 'explore' }) as BffDetailResponse<TTrainerExploration>;
  }
}