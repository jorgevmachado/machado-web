'use client';

import { useEffect, useMemo } from 'react';
import { GiStumpRegrowth } from 'react-icons/gi';

import { type FiltersProps, Badge, Card, Filters, Pagination, Text, useAlert } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import usePaginatedList from '@/app/ui/hooks/list/usePaginatedList';
import { AssociationCard } from '../../components/association-card';

import { pokemonGrowthRateBffService } from '../services';
import type { PokemonGrowthRateFilters, TPokemonGrowthRate } from '../types';

const formatOrder = (order: number): string => `#${String(order).padStart(3, '0')}`;

const INITIAL_FILTERS: PokemonGrowthRateFilters = {
  name: undefined,
  order: undefined,
};

const normalizeFilters = (filters: PokemonGrowthRateFilters): PokemonGrowthRateFilters => ({
  name: filters.name?.trim() || undefined,
  order: filters.order?.trim() || undefined,
});

export function PokemonGrowthRateListView() {
  const { t } = useAppTranslation();
  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    { name: 'name', label: t('filters.name'), type: 'text', value: '', placeholder: 'tackle' },
    { name: 'order', label: t('filters.order'), type: 'text', value: '', placeholder: '33' },
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
  } = usePaginatedList<TPokemonGrowthRate, PokemonGrowthRateFilters>({
    fetchList: pokemonGrowthRateBffService.fetchAll,
    initialFilters: INITIAL_FILTERS,
    initialInputFilters,
    fetchErrorMessage: t('pokemon.growthRate.list.loadError'),
    normalizeFilters,
  });
  const { showAlert } = useAlert();

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
              {t('pokemon.growthRate.list.title')}
            </Text>
          </div>
          <Badge tone="info" variant="soft" size="lg">
            {t('common.recordCount', { count: meta.total })}
          </Badge>
        </header>

        <Filters
          filters={inputFilters}
          ariaLabel={t('pokemon.growthRate.list.filtersAria')}
          onApply={(filters) => applyInputFilters(filters as PokemonGrowthRateFilters)}
          onClear={clearInputFilters}
        />

        {!isLoading && items.length === 0 ? (
          <Card variant="outlined" rounded="lg" className="text-center">
            <Text className="text-slate-600">{t('pokemon.growthRate.list.empty')}</Text>
          </Card>
        ) : null}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((growthRate) => (
            <AssociationCard
              key={growthRate.id}
              href={`/pokemon/growth-rate/${growthRate.name}`}
              title={growthRate.name}
              eyebrow={formatOrder(growthRate.order)}
              ariaLabel={t('pokemon.growthRate.list.open', { name: growthRate.name })}
              visual={(
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <GiStumpRegrowth size={30} />
                </div>
              )}
            >
              <Text className="line-clamp-3 text-sm text-slate-700">
                {growthRate.formula || t('pokemon.growthRate.list.formulaPending')}
              </Text>
            </AssociationCard>
          ))}
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
