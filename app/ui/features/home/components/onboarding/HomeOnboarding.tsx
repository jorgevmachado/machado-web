'use client';

import { useEffect, useMemo, useState } from 'react';

import { Autocomplete, Badge, Button, Card, Input, Text, useAlert } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { useUser } from '@/app/ui/features/auth';
import { translatePokemonTypeName } from '@/app/ui/features/pokemon/type';
import { formatLabel } from '@/app/utils';
import usePokemon from '@/app/ui/features/pokemon/usePokemon';
import { TPokemon } from '@/app/ui/features/pokemon/types';
import useTrainer from '@/app/ui/features/trainer/useTrainer';

const STARTERS = ['bulbasaur', 'charmander', 'squirtle'] as const;

type HomeOnboardingProps = Readonly<{
  onCreated?: () => void;
}>;

export default function HomeOnboarding({ onCreated }: HomeOnboardingProps) {
  const { user, refreshUser } = useUser();
  const { showAlert } = useAlert();
  const { t } = useAppTranslation();

  const { fetchOne, fetchList, isContentLoading } = usePokemon();
  const { onboarding } = useTrainer();

  const [pokemonOptions, setPokemonOptions] = useState<TPokemon[]>([]);
  const [selectedPokemonName, setSelectedPokemonName] = useState('');
  const [nickname, setNickname] = useState('');
  const [pokeballs, setPokeballs] = useState('1');
  const [captureRate, setCaptureRate] = useState('75');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const selectedPokemon = pokemonOptions.find((item) => item.name === selectedPokemonName);
  const starterOptions = useMemo(() => pokemonOptions.filter((item) => STARTERS.includes(item.name as typeof STARTERS[number])), [pokemonOptions]);

  useEffect(() => {
    const loadPokemon = async () => {
      const response = await fetchList({}, 151, 'myPokemon.onboarding.loadOptionsError');
      setPokemonOptions(response);
    };

    void loadPokemon();
  }, [fetchList]);

  const autocompleteOptions = useMemo(() => pokemonOptions.map((item) => ({
    key: item.id,
    value: item.name,
    label: formatLabel(item.name),
    description: `#${String(item.order).padStart(4, '0')}`,
  })), [pokemonOptions]);

  const selectPokemon = async (pokemon: TPokemon) => {
    if (pokemon.status === 'INCOMPLETE') {
      const completedPokemon = await fetchOne(pokemon.name);
      if (completedPokemon) {
        const currentPokemonOptions = [...pokemonOptions];
        const completedPokemonIndex = currentPokemonOptions.findIndex((p) => p.name === completedPokemon.name);
        currentPokemonOptions[completedPokemonIndex] = completedPokemon;
        setPokemonOptions(currentPokemonOptions);
        setSelectedPokemonName(completedPokemon.name);
      }
      return;
    }
    setSelectedPokemonName(pokemon.name);
  };

  const handleSubmit = async () => {
    if (!selectedPokemonName) {
      showAlert({ type: 'error', message: t('myPokemon.onboarding.validation.selectPokemon') });
      return;
    }

    setIsSubmitting(true);
    const params = {
      nickname,
      is_admin: isAdmin,
      pokeballs: Number(pokeballs),
      capture_rate: Number(captureRate),
      pokemon_name: selectedPokemonName,
    };
    const response = await onboarding(params);
    if (response) {
      await refreshUser();
      onCreated?.();
    }
  };

  return (
    <section className='mx-auto flex max-w-5xl flex-col gap-6'>
      <Card variant='elevated' rounded='2xl'
        className='border border-amber-200 bg-[linear-gradient(135deg,#fff8e1_0%,#ffffff_48%,#e0f2fe_100%)] shadow-xl shadow-amber-100/60'>
        <div className='flex flex-col gap-4'>
          <div>
            <Text as='h2' className='text-2xl font-bold text-slate-950'>
              {t('myPokemon.onboarding.title')}
            </Text>
            <Text className='mt-2 max-w-2xl text-slate-600'>
              {t(isAdmin ? 'myPokemon.onboarding.adminDescription' : 'myPokemon.onboarding.userDescription')}
            </Text>
          </div>

          <div className='space-y-2'>
            <label htmlFor='nickname' className='text-sm font-semibold text-slate-700'>
              {t('myPokemon.onboarding.nicknameLabel')}
            </label>
            <Input
              id='nickname'
              name='nickname'
              placeholder={t('myPokemon.onboarding.nicknamePlaceholder')}
              value={nickname}
              onValueChange={setNickname}
            />
          </div>

          {isAdmin ? (
            <>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label htmlFor='pokeballs' className='text-sm font-semibold text-slate-700'>
                    {t('myPokemon.onboarding.pokeballsLabel')}
                  </label>
                  <Input
                    id='pokeballs'
                    name='pokeballs'
                    type='number'
                    min={1}
                    value={pokeballs}
                    onValueChange={setPokeballs}
                  />
                </div>
                <div className='space-y-2'>
                  <label htmlFor='capture_rate' className='text-sm font-semibold text-slate-700'>
                    {t('myPokemon.onboarding.captureRateLabel')}
                  </label>
                  <Input
                    id='capture_rate'
                    name='capture_rate'
                    type='number'
                    min={1}
                    max={255}
                    value={captureRate}
                    onValueChange={setCaptureRate}
                  />
                </div>
              </div>
              <div className='relative space-y-2'>
                <label htmlFor='starter-admin' className='text-sm font-semibold text-slate-700'>
                  {t('myPokemon.onboarding.selectPokemonLabel')}
                </label>
                <Autocomplete
                  id='starter-admin'
                  name='starter-admin'
                  value={selectedPokemonName}
                  options={autocompleteOptions}
                  isLoading={isContentLoading}
                  placeholder={t('myPokemon.onboarding.selectPokemonPlaceholder')}
                  noResultsText={t('filters.noOptions')}
                  onValueChange={setSelectedPokemonName}
                  onSelectOption={(option) => setSelectedPokemonName(option.value)}
                />
              </div>
            </>
          ) : (
            <div className='grid gap-4 md:grid-cols-3'>
              {starterOptions.map((pokemon) => {
                const isActive = selectedPokemonName === pokemon.name;
                return (
                  <button
                    key={pokemon.id}
                    type='button'
                    className={`rounded-2xl border p-4 text-left transition ${isActive ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    onClick={() => selectPokemon(pokemon)}
                  >
                    <div
                      className='flex min-h-40 items-center justify-center rounded-xl bg-slate-100'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pokemon.external_image} alt={pokemon.name}
                        className='max-h-36 object-contain p-3'/>
                    </div>
                    <Text as='h3' className='mt-4 text-lg font-semibold capitalize text-slate-950'>
                      {pokemon.name}
                    </Text>
                    <div className='mt-3 flex flex-wrap gap-2'>
                      {pokemon.types.map((type) => (
                        <Badge key={type.id} style={{
                          backgroundColor: type.background_color || undefined,
                          color: type.text_color || undefined
                        }}>
                          {translatePokemonTypeName(t, type.name)}
                        </Badge>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selectedPokemon ? (
            <Card variant='outlined' rounded='xl' className='border-slate-200 bg-white/80'>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                <div className='flex h-28 w-28 items-center justify-center rounded-xl bg-slate-100'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedPokemon.external_image} alt={selectedPokemon.name}
                    className='max-h-24 object-contain p-2'/>
                </div>
                <div className='flex-1'>
                  <Text as='h3' className='text-xl font-semibold capitalize text-slate-950'>
                    {formatLabel(selectedPokemon.name)}
                  </Text>
                  <Text className='text-sm text-slate-500'>
                                        #{String(selectedPokemon.order).padStart(4, '0')}
                  </Text>
                  <div className='mt-3 flex flex-wrap gap-2'>
                    {selectedPokemon.types.map((type) => (
                      <Badge key={type.id} style={{
                        backgroundColor: type.background_color || undefined,
                        color: type.text_color || undefined
                      }}>
                        {translatePokemonTypeName(t, type.name)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ) : null}

          <div className='flex justify-end'>
            <Button onClick={handleSubmit} isLoading={isSubmitting}
              loadingText={t('myPokemon.onboarding.submitting')}>
              {t('myPokemon.onboarding.submit')}
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
