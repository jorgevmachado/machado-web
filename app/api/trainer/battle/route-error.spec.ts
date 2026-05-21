import { resolveTrainerBattleRouteError } from './route-error';

describe('resolveTrainerBattleRouteError', () => {
  it('maps native Error instances to status 500', () => {
    expect(resolveTrainerBattleRouteError(new Error('boom'), 'fallback')).toEqual({
      status: 500,
      message: 'boom',
    });

    const emptyMessageError = new Error('');
    expect(resolveTrainerBattleRouteError(emptyMessageError, 'fallback')).toEqual({
      status: 500,
      message: 'fallback',
    });
  });

  it('maps structured service errors and falls back when fields are missing', () => {
    expect(resolveTrainerBattleRouteError({ statusCode: 404, message: 'missing' }, 'fallback')).toEqual({
      status: 404,
      message: 'missing',
    });

    expect(resolveTrainerBattleRouteError({}, 'fallback')).toEqual({
      status: 500,
      message: 'fallback',
    });
  });

  it('maps primitive failures to the fallback message', () => {
    expect(resolveTrainerBattleRouteError('broken', 'fallback')).toEqual({
      status: 500,
      message: 'fallback',
    });
  });
});
