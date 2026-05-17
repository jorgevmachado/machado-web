'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';

import { type FiltersProps, Badge, Card, Filters, Image, Pagination, Text, useAlert } from '@/app/ds';
import Pokeball from '@/app/ds/loading/spinner/pokeball';
import { useAppTranslation } from '@/app/i18n';
import usePaginatedList from '@/app/ui/hooks/list/usePaginatedList';
import { translatePokemonTypeName } from '@/app/ui/features/pokemon/type';
import { displayDate, formatLabel } from '@/app/utils';

import type { PokedexListFilters, TPokedex } from '../types';

const INITIAL_FILTERS: PokedexListFilters = {
  nickname: undefined,
  pokemon_name: undefined,
  discovered: undefined,
};

const normalizeFilters = (filters: PokedexListFilters): PokedexListFilters => ({
  nickname: filters.nickname?.trim() || undefined,
  pokemon_name: filters.pokemon_name?.trim() || undefined,
  discovered: filters.discovered?.trim().toLowerCase() || undefined,
});

export function PokedexListView() {
  const { t } = useAppTranslation();
  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    { name: 'nickname', label: t('pokedex.filters.nickname'), type: 'text', value: '', placeholder: 'Leaf' },
    { name: 'pokemon_name', label: t('pokedex.filters.basePokemon'), type: 'text', value: '', placeholder: 'bulbasaur' },
    { name: 'discovered', label: t('pokedex.filters.discovered'), type: 'text', value: '', placeholder: 'true / false' },
  ], [t]);
  const {
    items,
    meta,
    isLoading,
    errorMessage,
    inputFilters,
    goToPage,
    applyInputFilters,
    clearInputFilters,
  } = usePaginatedList<TPokedex, PokedexListFilters>({
    endpoint: '/api/trainer/pokedex',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters,
    fetchErrorMessage: t('pokedex.list.loadError'),
    normalizeFilters,
  });
  const { showAlert } = useAlert();

  useEffect(() => {
    if (errorMessage) {
      showAlert({ type: 'error', message: errorMessage });
    }
  }, [errorMessage, showAlert]);

  return (
    <main className='min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-6'>
        <header className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <Text as='h1' className='text-3xl font-bold text-slate-950 sm:text-4xl'>
              {t('pokedex.list.title')}
            </Text>
            <Text className='mt-1 max-w-2xl text-sm text-slate-600 sm:text-base'>
              {t('pokedex.list.description')}
            </Text>
          </div>
          <Badge tone='info' variant='soft' size='lg'>
            {t('common.recordCount', { count: meta.total })}
          </Badge>
        </header>

        <Filters
          filters={inputFilters}
          ariaLabel={t('pokedex.list.filtersAria')}
          onApply={(filters) => applyInputFilters(filters as { nickname?: string; pokemon_name?: string; discovered?: string })}
          onClear={clearInputFilters}
        />

        {!isLoading && items.length === 0 ? (
          <Card variant='outlined' rounded='lg' className='text-center'>
            <Text className='text-slate-600'>{t('pokedex.list.empty')}</Text>
          </Card>
        ) : null}

        <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {items.map((item) => {
            const cardContent = (
              <Card
                variant='elevated'
                rounded='lg'
                hoverEffect={item.discovered ? 'lift' : 'none'}
                interactive={item.discovered}
                className={`flex h-full flex-col gap-4 border-slate-200 bg-white ${item.discovered ? '' : 'overflow-hidden'}`}
              >
                <div className={`flex items-center justify-center rounded-lg ${item.discovered ? 'min-h-44 bg-slate-100' : 'relative min-h-64 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.22),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_100%)]'}`}>
                  {item.discovered ? (
                    <Image
                      src={item.pokemon.external_image}
                      alt={item.nickname || item.pokemon.name}
                      size='md'
                      fit='contain'
                      className='p-4'
                    />
                  ) : (
                    <>
                      <div aria-hidden='true' className='absolute -left-8 top-6 h-24 w-24 rounded-full bg-white/60 blur-2xl' />
                      <div aria-hidden='true' className='absolute right-0 top-0 h-28 w-28 rounded-full bg-amber-200/40 blur-3xl' />
                      <div aria-hidden='true' className='absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,_transparent_0%,_rgba(15,23,42,0.07)_100%)]' />
                      <div
                        aria-label='undiscovered-pokemon-placeholder'
                        className='relative z-10 h-28 w-28 text-slate-800 drop-shadow-[0_12px_24px_rgba(15,23,42,0.12)]'
                      >
                        <Pokeball />
                      </div>
                    </>
                  )}
                </div>
                <div className={`flex flex-1 flex-col gap-3 ${item.discovered ? '' : 'justify-between'}`}>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <Text as='h2' className='truncate text-xl font-semibold capitalize text-slate-950'>
                        {item.nickname || formatLabel(item.pokemon.name)}
                      </Text>
                      {item.discovered ? (
                        <Text className='text-sm text-slate-500'>
                          {t('pokedex.list.basePokemonLabel', { name: item.pokemon.name })}
                        </Text>
                      ) : null}
                    </div>
                    <Badge tone={item.discovered ? 'success' : 'warning'} variant='soft'>
                      {t(item.discovered ? 'pokedex.list.discovered' : 'pokedex.list.undiscovered')}
                    </Badge>
                  </div>
                  {item.discovered ? (
                    <>
                      <div className='grid grid-cols-2 gap-2 text-sm text-slate-600'>
                        <Text>{t('pokedex.list.level', { value: item.level })}</Text>
                        <Text>{t('pokedex.list.experience', { value: item.experience })}</Text>
                        <Text>{t('pokedex.list.hp', { current: item.hp, max: item.max_hp })}</Text>
                        <Text>{item.discovered_at ? t('pokedex.list.discoveredAt', { value: displayDate(item.discovered_at) }) : t('pokedex.list.notDiscoveredAt')}</Text>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {item.pokemon.types.map((type) => (
                          <span
                            key={type.id}
                            className='inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold'
                            style={{
                              backgroundColor: type.background_color || '#E5E7EB',
                              color: type.text_color || '#111827',
                            }}
                          >
                            {translatePokemonTypeName(t, type.name)}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div aria-hidden='true' className='grid grid-cols-3 gap-2 pt-2'>
                      <div className='h-2 rounded-full bg-slate-200' />
                      <div className='h-2 rounded-full bg-slate-200/80' />
                      <div className='h-2 rounded-full bg-slate-200/60' />
                      <div className='h-2 rounded-full bg-slate-200/70' />
                      <div className='h-2 rounded-full bg-slate-200/50' />
                      <div className='h-2 rounded-full bg-slate-200/80' />
                    </div>
                  )}
                </div>
              </Card>
            );

            if (!item.discovered) {
              return <div key={item.id}>{cardContent}</div>;
            }

            return (
              <Link key={item.id} href={`/pokedex/${item.id}`} className='block focus:outline-none focus:ring-2 focus:ring-amber-500'>
                {cardContent}
              </Link>
            );
          })}
        </section>

        <Pagination
          currentPage={meta.current_page}
          totalPages={meta.total_pages}
          onPageChange={goToPage}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
