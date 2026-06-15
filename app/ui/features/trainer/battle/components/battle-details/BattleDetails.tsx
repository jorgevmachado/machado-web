'use client';
import { useDetail } from '@/app/ui/hooks/detail';
import { DetailsPage ,trainerBffService ,TTrainerBattle } from '@/app/ui';
import { Badge ,Button ,Card ,Text } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { useUser } from '@/app/ui/features/auth';
import { useCallback ,useMemo } from 'react';
import { formatLabel } from '@/app/utils';
import BattlePokemonSnapshot from '../battle-pokemo-snapshot';

type BattleDetailsProps = {
  identifier: string;
}
export default function BattleDetails({ identifier }: BattleDetailsProps) {
  const { t } = useAppTranslation();
  const { user } = useUser();
  
  const trainer = useMemo(() => {
    if (!user?.trainer) {
      return;
    }
    return user.trainer;
  }, [user?.trainer]);
  
  const { data ,isLoading ,errorMessage } = useDetail<TTrainerBattle>({ identifier ,fetchDetail: trainerBffService.battle.fetchOne });

  const trainerPokemon = useMemo(() => {
    if (!data) {
      return;
    }

    const trainerPartySnapshots =  data.trainer_party_snapshot.filter((snap) => snap?.is_active);
    return trainerPartySnapshots?.[0];
  }, [data]);

  const availableSwitches = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.trainer_party_snapshot.filter((partyMember) => {
      return Boolean(
        partyMember.owned_pokemon_id
        && partyMember.owned_pokemon_id !== trainerPokemon?.owned_pokemon_id
        && partyMember.hp > 0,
      );
    });
  }, [data, trainerPokemon?.owned_pokemon_id]);
  
  const wildPokemon = useMemo(() => {
    if (!data) {
      return;
    }
    return data.wild_pokemon_snapshot;
  }, [data]);

  const switchPokemon = useCallback(async (ownedPokemonId: string) => {
    console.log('# => switchPokemon => ownedPokemonId => ', ownedPokemonId);
  }, []);

  const capturePokemon = useCallback(async () => {
    console.log('# => capturePokemon');
  }, []);

  const flee = useCallback(async () => {
    console.log('# => flee');
  }, []);
  
  return (
    <DetailsPage
      domain="battle"
      hasData={ !!data }
      isLoading={ isLoading }
      originDomain="trainer"
      errorMessage={ errorMessage }
      domainTranslationKey="trainer.battle">
      { data && trainer && (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <header className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <Text as='h1' className='text-3xl font-bold text-slate-950 sm:text-4xl'>
                  {t('trainer.battle.title')}
                </Text>
                <Text className='text-sm text-slate-600'>
                  {t('trainer.battle.turn', { value: data.turn_number })}
                </Text>
                <Text className='text-sm text-slate-600'>
                  {t('trainer.battle.inventory', {
                    pokeballs: trainer.pokeballs,
                    captureRate: trainer.capture_rate,
                  })}
                </Text>
              </div>
              <Badge tone={data.status === 'ACTIVE' ? 'success' : 'warning'} variant='soft'>
                {t(`trainer.battle.status.${data.status}`)}
              </Badge>
            </header>
            <section className='grid gap-4 lg:grid-cols-2'>
              { trainerPokemon && (
                <BattlePokemonSnapshot
                  type="TRAINER_POKEMON"
                  status={data.status}
                  snapshot={trainerPokemon}
                />
              )}
              {wildPokemon && (
                <BattlePokemonSnapshot
                  type="WILD_POKEMON"
                  status={data.status}
                  snapshot={wildPokemon}
                />
              )}
            </section>
            <section className='flex flex-col gap-4'>
              <Card rounded='lg' variant='elevated'>
                <div className='mt-6'>
                  <Text as='h3' className='mb-3 text-lg font-semibold'>
                    {t('trainer.battle.switchTitle')}
                  </Text>
                  {availableSwitches.length ? (
                    <div className='grid gap-3 sm:grid-cols-2'>
                      {availableSwitches.map((partyMember) => (
                        <button
                          key={partyMember.owned_pokemon_id}
                          type='button'
                          disabled={Boolean(data && data.status !== 'ACTIVE') || !partyMember.owned_pokemon_id}
                          onClick={() => {
                            if (partyMember.owned_pokemon_id) {
                              void switchPokemon(partyMember.owned_pokemon_id);
                            }
                          }}
                          className='rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                          <Text as='h4' className='font-semibold'>{partyMember.nickname || formatLabel(partyMember.name)}</Text>
                          <Text className='text-sm text-slate-600'>HP {partyMember.hp}/{partyMember.max_hp}</Text>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <Text className='text-sm text-slate-600'>{t('trainer.battle.noSwitchTargets')}</Text>
                  )}
                </div>

              </Card>
            </section>
            <section className='flex flex-col gap-4'>
              <Card rounded='lg' variant='elevated'>
                <div className='mb-4 flex flex-wrap items-center gap-3'>
                  <Button
                    tone='primary'
                    appearance='solid'
                    disabled={Boolean(data && data.status !== 'ACTIVE') || trainer.pokeballs <= 0}
                    onClick={() => void capturePokemon()}
                  >
                    {t('trainer.battle.capture')}
                  </Button>
                  <Text className='text-sm text-slate-600'>
                    {t('trainer.battle.captureHint')}
                  </Text>
                </div>
                <Button
                  tone='danger'
                  appearance='outline'
                  disabled={Boolean(data && data.status !== 'ACTIVE')}
                  onClick={() => void flee()}
                >
                  {t('trainer.battle.flee')}
                </Button>
              </Card>
            </section>
          </div>
        </div>
      )}
    </DetailsPage>
  );
}