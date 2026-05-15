'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { Badge, Card, Filters, Image, Pagination, Text, useAlert } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { translatePokemonTypeName } from '@/app/ui/features/pokemon/type';
import { displayDate } from '@/app/utils';

import { useMyPokemonList } from './useMyPokemonList';

export function MyPokemonListView() {
  const {
    items,
    meta,
    isLoading,
    errorMessage,
    inputFilters,
    goToPage,
    applyInputFilters,
    clearInputFilters,
  } = useMyPokemonList();
  const { showAlert } = useAlert();
  const { t } = useAppTranslation();

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
              {t('myPokemon.list.title')}
            </Text>
            <Text className='mt-1 max-w-2xl text-sm text-slate-600 sm:text-base'>
              {t('myPokemon.list.description')}
            </Text>
          </div>
          <Badge tone='info' variant='soft' size='lg'>
            {t('common.recordCount', { count: meta.total })}
          </Badge>
        </header>

        <Filters
          filters={inputFilters}
          ariaLabel={t('myPokemon.list.filtersAria')}
          onApply={(filters) => applyInputFilters(filters as { name?: string; pokemon_name?: string })}
          onClear={clearInputFilters}
        />

        {!isLoading && items.length === 0 ? (
          <Card variant='outlined' rounded='lg' className='text-center'>
            <Text className='text-slate-600'>{t('myPokemon.list.empty')}</Text>
          </Card>
        ) : null}

        <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {items.map((item) => (
            <Link key={item.id} href={`/my-pokemon/${item.name}`} className='block focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <Card variant='elevated' rounded='lg' hoverEffect='lift' interactive className='flex h-full flex-col gap-4 border-slate-200 bg-white'>
                <div className='flex min-h-44 items-center justify-center rounded-lg bg-slate-100'>
                  <Image
                    src={item.pokemon.external_image}
                    alt={item.nickname}
                    size='md'
                    fit='contain'
                    className='p-4'
                  />
                </div>
                <div className='flex flex-1 flex-col gap-3'>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <Text as='h2' className='truncate text-xl font-semibold capitalize text-slate-950'>
                        {item.nickname}
                      </Text>
                      <Text className='text-sm text-slate-500'>
                        {t('myPokemon.list.basePokemonLabel', { name: item.pokemon.name })}
                      </Text>
                    </div>
                    <Badge tone='success' variant='soft'>
                      {t('myPokemon.list.level', { value: item.level })}
                    </Badge>
                  </div>
                  <div className='grid grid-cols-2 gap-2 text-sm text-slate-600'>
                    <Text>{t('myPokemon.list.hp', { current: item.hp, max: item.max_hp })}</Text>
                    <Text>{t('myPokemon.list.experience', { value: item.experience })}</Text>
                    <Text>{t('myPokemon.list.moves', { count: item.moves.length })}</Text>
                    <Text>{t('myPokemon.list.capturedAt', { value: displayDate(item.captured_at) })}</Text>
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
                </div>
              </Card>
            </Link>
          ))}
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
