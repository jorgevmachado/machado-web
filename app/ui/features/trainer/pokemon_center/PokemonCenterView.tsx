'use client';

import { useEffect } from 'react';

import { Badge, Button, Card, Text, useAlert } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { usePokemonCenter } from '@/app/ui/features/trainer/pokemon_center/usePokemonCenter';
import { displayDate, formatLabel } from '@/app/utils';

const buildPokemonPpSummary = (
  moves: Array<{ pp: number; max_pp: number }>,
): string => {
  let current = 0;
  let max = 0;

  for (const move of moves) {
    current += move.pp;
    max += move.max_pp;
  }

  return `${current}/${max}`;
};

export default function PokemonCenterView() {
  const { t } = useAppTranslation();
  const { showAlert } = useAlert();
  const { home, history, isLoading, isHealing, errorMessage, lastResult, heal } = usePokemonCenter();

  useEffect(() => {
    if (errorMessage) {
      showAlert({ type: 'error', message: errorMessage });
    }
  }, [errorMessage, showAlert]);

  if (isLoading || !home) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <Text>{t('pokemonCenter.loading')}</Text>
      </div>
    );
  }

  return (
    <main className='min-h-screen rounded-3xl bg-white/90 px-6 py-10 shadow-sm'>
      <div className='mx-auto flex max-w-7xl flex-col gap-6'>
        <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
          <div className='flex flex-col gap-2'>
            <Text as='h1' className='text-3xl font-bold text-slate-950 sm:text-4xl'>
              {t('pokemonCenter.title')}
            </Text>
            <Text className='max-w-3xl text-slate-600'>
              {t('pokemonCenter.description')}
            </Text>
          </div>
          <Button onClick={() => void heal()} disabled={isHealing || !home.party.length}>
            {isHealing ? t('pokemonCenter.healing') : t('pokemonCenter.healButton')}
          </Button>
        </div>

        {home.last_healing ? (
          <Card rounded='lg' variant='outlined'>
            <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
              <div>
                <Text as='h2' className='text-lg font-semibold'>
                  {t('pokemonCenter.latestHealingTitle')}
                </Text>
                <Text className='text-sm text-slate-500'>
                  {displayDate(home.last_healing.created_at)}
                </Text>
              </div>
              <div className='flex flex-wrap gap-3 text-sm text-slate-700'>
                <span>{t('pokemonCenter.healedPokemonCount', { value: home.last_healing.healed_pokemon_quantity })}</span>
                <span>{t('pokemonCenter.restoredHp', { value: home.last_healing.restored_hp })}</span>
                <span>{t('pokemonCenter.restoredPp', { value: home.last_healing.restored_pp })}</span>
              </div>
            </div>
          </Card>
        ) : null}

        {lastResult?.restored_pokemon?.length ? (
          <Card rounded='lg' variant='elevated'>
            <Text as='h2' className='mb-3 text-lg font-semibold'>
              {t('pokemonCenter.lastHealingResult')}
            </Text>
            <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
              {lastResult.restored_pokemon.map((entry) => (
                <div key={entry.id} className='rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3'>
                  <div className='flex items-center justify-between gap-3'>
                    <div>
                      <Text as='h3' className='font-semibold'>
                        {entry.my_pokemon.nickname || formatLabel(entry.my_pokemon.name)}
                      </Text>
                      <Text className='text-sm text-slate-500'>
                        {formatLabel(entry.my_pokemon.name)}
                      </Text>
                    </div>
                    {entry.was_revived ? (
                      <Badge tone='success' variant='soft'>
                        {t('pokemonCenter.revived')}
                      </Badge>
                    ) : null}
                  </div>
                  <Text className='mt-2 text-sm text-slate-700'>
                    {t('pokemonCenter.restoredHp', { value: entry.restored_hp })}
                  </Text>
                  <Text className='text-sm text-slate-700'>
                    {t('pokemonCenter.restoredPp', { value: entry.restored_pp })}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        <section className='grid gap-6 xl:grid-cols-[1.1fr_1fr]'>
          <Card rounded='lg' variant='elevated'>
            <div className='mb-4 flex items-center justify-between'>
              <div>
                <Text as='h2' className='text-lg font-semibold'>
                  {t('pokemonCenter.partyTitle')}
                </Text>
                <Text className='text-sm text-slate-500'>
                  {t('pokemonCenter.partyHint')}
                </Text>
              </div>
              <Badge tone='info' variant='soft'>
                {home.party.length}
              </Badge>
            </div>
            <div className='grid gap-3'>
              {home.party.length ? home.party.map((member) => (
                <div key={member.id} className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3'>
                  <div className='flex items-center justify-between gap-3'>
                    <div>
                      <Text as='h3' className='font-semibold'>
                        {member.my_pokemon.nickname || formatLabel(member.my_pokemon.pokemon.name)}
                      </Text>
                      <Text className='text-sm text-slate-500'>
                        {formatLabel(member.my_pokemon.pokemon.name)}
                      </Text>
                    </div>
                    <Badge tone='info' variant='soft'>
                      {t('pokemonCenter.partySlot', { value: member.slot })}
                    </Badge>
                  </div>
                  <div className='mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2'>
                    <Text>{t('pokemonCenter.hpSummary', { current: member.my_pokemon.hp, max: member.my_pokemon.max_hp })}</Text>
                    <Text>{t('pokemonCenter.ppSummary', { value: buildPokemonPpSummary(member.my_pokemon.moves) })}</Text>
                  </div>
                </div>
              )) : (
                <Text className='text-sm text-slate-500'>
                  {t('pokemonCenter.noParty')}
                </Text>
              )}
            </div>
          </Card>

          <Card rounded='lg' variant='elevated'>
            <div className='mb-4 flex items-center justify-between'>
              <Text as='h2' className='text-lg font-semibold'>
                {t('pokemonCenter.historyTitle')}
              </Text>
              <Badge tone='info' variant='soft'>
                {history.length}
              </Badge>
            </div>
            <div className='grid gap-3'>
              {history.length ? history.map((entry) => (
                <div key={entry.id} className='rounded-2xl border border-slate-200 bg-white px-4 py-3'>
                  <div className='flex items-center justify-between gap-3'>
                    <div>
                      <Text as='h3' className='font-semibold'>
                        {entry.my_pokemon.nickname || formatLabel(entry.my_pokemon.name)}
                      </Text>
                      <Text className='text-sm text-slate-500'>
                        {displayDate(entry.created_at)}
                      </Text>
                    </div>
                    {entry.was_revived ? (
                      <Badge tone='success' variant='soft'>
                        {t('pokemonCenter.revived')}
                      </Badge>
                    ) : (
                      <Badge tone='info' variant='soft'>
                        {entry.action_type}
                      </Badge>
                    )}
                  </div>
                  <div className='mt-3 grid gap-2 text-sm text-slate-700'>
                    <Text>{t('pokemonCenter.restoredHp', { value: entry.restored_hp })}</Text>
                    <Text>{t('pokemonCenter.restoredPp', { value: entry.restored_pp })}</Text>
                  </div>
                </div>
              )) : (
                <Text className='text-sm text-slate-500'>
                  {t('pokemonCenter.noHistory')}
                </Text>
              )}
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
