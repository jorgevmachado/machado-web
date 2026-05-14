'use client';

import { useEffect } from 'react';

import { Badge, Button, Card, Text, useAlert } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { useTrainerHome } from '@/app/ui/features/trainer/home/useTrainerHome';
import { displayDate, formatLabel } from '@/app/utils';

export default function TrainerDashboard() {
  const {
    data,
    encounters,
    roster,
    partySelection,
    lastEvent,
    isLoading,
    isSavingParty,
    isWalking,
    isUpdatingEncounter,
    errorMessage,
    activeEncounter,
    selectEncounter,
    walk,
    togglePartySelection,
    saveParty,
  } = useTrainerHome();
  const { t } = useAppTranslation();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (errorMessage) {
      showAlert({ type: 'error', message: errorMessage });
    }
  }, [errorMessage, showAlert]);

  if (isLoading || !data) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <Text>{t('home.dashboard.loading')}</Text>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <section className='grid gap-4 md:grid-cols-3'>
        <Card rounded='lg' variant='elevated'>
          <Text as='h2' className='text-lg font-semibold'>{t('home.dashboard.trainerTitle')}</Text>
          <Text>{t('home.dashboard.pokeballs', { value: data.trainer.pokeballs })}</Text>
          <Text>{t('home.dashboard.captureRate', { value: data.trainer.capture_rate })}</Text>
        </Card>
        <Card rounded='lg' variant='elevated'>
          <Text as='h2' className='text-lg font-semibold'>{t('home.dashboard.activeEncounter')}</Text>
          <Text>{activeEncounter ? formatLabel(activeEncounter.pokemon_encounter.name) : t('home.dashboard.noActiveEncounter')}</Text>
          <Text className='text-sm text-slate-500'>
            {activeEncounter ? activeEncounter.pokemon_encounter.method : t('home.dashboard.chooseEncounter')}
          </Text>
        </Card>
        <Card rounded='lg' variant='elevated'>
          <Text as='h2' className='text-lg font-semibold'>{t('home.dashboard.walkTitle')}</Text>
          <Button onClick={() => void walk()} disabled={isWalking || !activeEncounter}>
            {isWalking ? t('home.dashboard.walking') : t('home.dashboard.walkButton')}
          </Button>
        </Card>
      </section>

      {lastEvent ? (
        <Card rounded='lg' variant='outlined'>
          <Text as='h2' className='text-lg font-semibold'>{t('home.dashboard.lastEvent')}</Text>
          <Badge tone={lastEvent.event_type === 'WILD_POKEMON' ? 'success' : 'info'} variant='soft'>
            {t(`home.dashboard.eventType.${lastEvent.event_type}`)}
          </Badge>
          {lastEvent.pokemon ? (
            <Text>{t('home.dashboard.foundPokemon', { name: formatLabel(lastEvent.pokemon.name) })}</Text>
          ) : null}
          {lastEvent.pokeballs_found ? (
            <Text>{t('home.dashboard.foundPokeballs', { value: lastEvent.pokeballs_found })}</Text>
          ) : null}
        </Card>
      ) : null}

      <section className='grid gap-6 xl:grid-cols-[1.2fr_1fr]'>
        <Card rounded='lg' variant='elevated'>
          <div className='mb-4 flex items-center justify-between'>
            <Text as='h2' className='text-lg font-semibold'>{t('home.dashboard.encountersTitle')}</Text>
            <Badge tone='info' variant='soft'>{encounters.length}</Badge>
          </div>
          <div className='grid gap-3'>
            {encounters.map((encounter) => (
              <button
                key={encounter.id}
                type='button'
                onClick={() => void selectEncounter(encounter.id)}
                disabled={isUpdatingEncounter}
                className={`rounded-2xl border px-4 py-3 text-left transition ${encounter.is_active ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white'}`}
              >
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <Text as='h3' className='font-semibold'>{formatLabel(encounter.pokemon_encounter.name)}</Text>
                    <Text className='text-sm text-slate-500'>{encounter.pokemon_encounter.method}</Text>
                  </div>
                  {encounter.is_active ? <Badge tone='success' variant='soft'>{t('home.dashboard.active')}</Badge> : null}
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card rounded='lg' variant='elevated'>
          <Text as='h2' className='mb-4 text-lg font-semibold'>{t('home.dashboard.latestDiscoveries')}</Text>
          <div className='grid gap-3'>
            {data.latest_discoveries.length ? data.latest_discoveries.map((entry) => (
              <div key={entry.id} className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3'>
                <Text as='h3' className='font-semibold'>{formatLabel(entry.pokemon.name)}</Text>
                <Text className='text-sm text-slate-500'>
                  {entry.discovered_at ? displayDate(entry.discovered_at) : t('home.dashboard.noDiscoveryDate')}
                </Text>
              </div>
            )) : (
              <Text className='text-sm text-slate-500'>
                {t('home.dashboard.noDiscoveries')}
              </Text>
            )}
          </div>
        </Card>
      </section>

      <Card rounded='lg' variant='elevated'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <Text as='h2' className='text-lg font-semibold'>{t('home.dashboard.partyTitle')}</Text>
            <Text className='text-sm text-slate-500'>{t('home.dashboard.partyHint')}</Text>
          </div>
          <Button onClick={() => void saveParty()} disabled={isSavingParty}>
            {isSavingParty ? t('home.dashboard.savingParty') : t('home.dashboard.saveParty')}
          </Button>
        </div>
        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
          {roster.map((item) => {
            const isSelected = partySelection.includes(item.id);

            return (
              <button
                key={item.id}
                type='button'
                onClick={() => togglePartySelection(item.id)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'}`}
              >
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <Text as='h3' className='font-semibold'>
                      {item.nickname || formatLabel(item.pokemon.name)}
                    </Text>
                    <Text className='text-sm text-slate-500'>{formatLabel(item.pokemon.name)}</Text>
                  </div>
                  {isSelected ? <Badge tone='success' variant='soft'>{t('home.dashboard.inParty')}</Badge> : null}
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
