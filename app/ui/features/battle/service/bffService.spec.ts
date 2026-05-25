import { battleBffService, BattleBffService } from './bffService';

describe('BattleBffService', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('uses the expected default path configuration', () => {
    const service = new BattleBffService();

    expect(service).toBeInstanceOf(BattleBffService);
    expect(battleBffService).toBeInstanceOf(BattleBffService);
  });

  it('delegates active and logs reads to the battle namespace', async () => {
    const service = new BattleBffService('/custom-api');
    const getSpy = jest.spyOn(service, 'get')
      .mockResolvedValueOnce({ id: 'battle-1' } as never)
      .mockResolvedValueOnce([{ id: 'log-1' }] as never);

    await expect(service.active()).resolves.toEqual({ id: 'battle-1' });
    await expect(service.logs()).resolves.toEqual([{ id: 'log-1' }]);

    expect(getSpy).toHaveBeenNthCalledWith(1, 'trainer/battle/active');
    expect(getSpy).toHaveBeenNthCalledWith(2, 'trainer/battle/logs');
  });

  it('delegates move, switch, flee and capture writes to the battle namespace', async () => {
    const service = new BattleBffService('/custom-api');
    const postSpy = jest.spyOn(service, 'post')
      .mockResolvedValueOnce({ id: 'battle-1', status: 'ACTIVE' } as never)
      .mockResolvedValueOnce({ id: 'battle-1', status: 'ACTIVE' } as never)
      .mockResolvedValueOnce({ id: 'battle-1', status: 'ESCAPED' } as never)
      .mockResolvedValueOnce({ success: true, outcome: 'CAPTURED' } as never)
      .mockResolvedValueOnce({ success: false, outcome: 'FAILED' } as never);

    await service.useMove({ move_id: 'move-1' });
    await service.switchPokemon({ my_pokemon_id: 'my-pokemon-2' });
    await service.flee();
    await service.capture({ nickname: 'Sparky' });
    await service.capture();

    expect(postSpy).toHaveBeenNthCalledWith(1, 'trainer/battle/move', {
      body: { move_id: 'move-1' },
    });
    expect(postSpy).toHaveBeenNthCalledWith(2, 'trainer/battle/switch', {
      body: { my_pokemon_id: 'my-pokemon-2' },
    });
    expect(postSpy).toHaveBeenNthCalledWith(3, 'trainer/battle/flee');
    expect(postSpy).toHaveBeenNthCalledWith(4, 'trainer/battle/capture', {
      body: { nickname: 'Sparky' },
    });
    expect(postSpy).toHaveBeenNthCalledWith(5, 'trainer/battle/capture', {
      body: {},
    });
  });
});
