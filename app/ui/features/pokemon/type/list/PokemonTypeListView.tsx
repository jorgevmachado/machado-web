'use client';

import { useEffect } from 'react';

import { Badge, Card, Filters, Pagination, Text, useAlert } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { AssociationCard } from '../../components/association-card';

import PokemonTypeVisual from '../components/pokemon-type-visual';
import { translatePokemonTypeName } from '../translatePokemonTypeName';
import type { PokemonTypeFilters } from '../types';
import { usePokemonTypeList } from './usePokemonTypeList';

const formatOrder = (order: number): string => `#${String(order).padStart(3, '0')}`;

export function PokemonTypeListView() {
  const {
    items,
    meta,
    isLoading,
    errorMessage,
    inputFilters,
    goToPage,
    applyInputFilters,
    clearInputFilters,
  } = usePokemonTypeList();
  const { showAlert } = useAlert();
  const { t } = useAppTranslation();

  useEffect(() => {
    if (errorMessage) {
      showAlert({ type: 'error', message: errorMessage });
    }
  }, [errorMessage, showAlert]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Text as="h1" className="text-3xl font-bold text-slate-950 sm:text-4xl">
              {t('pokemon.type.list.title')}
            </Text>
            <Text className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">
              {t('pokemon.type.list.description')}
            </Text>
          </div>
          <Badge tone="info" variant="soft" size="lg">
            {t('common.recordCount', { count: meta.total })}
          </Badge>
        </header>

        <Filters
          filters={inputFilters}
          ariaLabel={t('pokemon.type.list.filtersAria')}
          onApply={(filters) => applyInputFilters(filters as PokemonTypeFilters)}
          onClear={clearInputFilters}
        />

        {!isLoading && items.length === 0 ? (
          <Card variant="outlined" rounded="lg" className="text-center">
            <Text className="text-slate-600">{t('pokemon.type.list.empty')}</Text>
          </Card>
        ) : null}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((type) => {
            const translatedTypeName = translatePokemonTypeName(t, type.name);

            return (
              <AssociationCard
                key={type.id}
                href={`/pokemon/type/${type.name}`}
                eyebrow={formatOrder(type.order)}
                visual={<PokemonTypeVisual type={type}/>}
                title={translatedTypeName}
                ariaLabel={t('pokemon.type.list.open', { name: translatedTypeName })}
                footer={(
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="success" variant="soft">{t('pokemon.type.list.strengthCount', { count: type.strengths.length })}</Badge>
                    <Badge tone="warning" variant="soft">{t('pokemon.type.list.weaknessCount', { count: type.weaknesses.length })}</Badge>
                  </div>
                )}
              >
                <Text className="line-clamp-2 text-sm text-slate-600">
                  {type.description ?? t('pokemon.type.list.fallbackDescription')}
                </Text>
              </AssociationCard>
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
    </div>
  );
}
