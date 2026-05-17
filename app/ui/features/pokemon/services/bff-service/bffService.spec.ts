import { PokemonBffService } from './bffService';

describe('PokemonBffService', () => {
  it('exposes feature modules through getters', () => {
    const service = new PokemonBffService('https://api.example.com');

    expect(service.ability).toBeDefined();
    expect(service.encounter).toBeDefined();
    expect(service.growthRate).toBeDefined();
    expect(service.move).toBeDefined();
    expect(service.type).toBeDefined();
  });
});
