import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import {
  TTrainer ,TTrainerExploration ,
  TTrainerFilters ,
} from '@/app/ui';
import { TPaginatedListResponse } from '@/app/ds';
import {
  TrainerOwnedPokemonService
} from '@/app/ui/features/trainer/owned-pokemon/services/service/service';
import {
  TrainerPokedexService
} from '@/app/ui/features/trainer/pokedex/services/service/service';
import {
  TrainerPartyService
} from '@/app/ui/features/trainer/party/services/service/service';
import {
  TrainerEncounterService
} from '@/app/ui/features/trainer/encounter/services/service/service';
import {
  TrainerBattleService
} from '@/app/ui/features/trainer/battle/services/service/service';


export class TrainerService extends BaseServiceAbstract {
  private readonly partyModule: TrainerPartyService;
  private readonly pokedexModule: TrainerPokedexService;
  private readonly encounterModule: TrainerEncounterService;
  private readonly ownedPokemonModule: TrainerOwnedPokemonService;
  private readonly battleModule: TrainerBattleService;

  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'trainer', token);
    this.partyModule = new TrainerPartyService(baseUrl, token);
    this.pokedexModule = new TrainerPokedexService(baseUrl, token);
    this.encounterModule = new TrainerEncounterService(baseUrl, token);
    this.ownedPokemonModule = new TrainerOwnedPokemonService(baseUrl, token);
    this.battleModule = new TrainerBattleService(baseUrl, token);
  }

  get party(): TrainerPartyService {
    return this.partyModule;
  }

  get pokedex(): TrainerPokedexService {
    return this.pokedexModule;
  }

  get encounter(): TrainerEncounterService {
    return this.encounterModule;
  }

  get ownedPokemon(): TrainerOwnedPokemonService {
    return this.ownedPokemonModule;
  }

  get battle(): TrainerBattleService {
    return this.battleModule;
  }

  public async list(params: TTrainerFilters & { page?: string; limit?: string }): Promise<TPaginatedListResponse<TTrainer>> {
    return await this.get<TPaginatedListResponse<TTrainer>>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TTrainer> {
    return await this.get<TTrainer>(`${this.pathUrl}/${identifier}`);
  }

  public async explore(): Promise<TTrainerExploration> {
    return await this.post<unknown, TTrainerExploration>(`${this.pathUrl}/explore`);
  }
}