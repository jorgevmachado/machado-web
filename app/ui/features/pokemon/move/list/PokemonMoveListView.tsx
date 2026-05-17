'use client';

import { useEffect, useMemo } from 'react';
import { GiPunchBlast } from 'react-icons/gi';

import { type FiltersProps, Badge, Card, Filters, Pagination, Text, useAlert } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import usePaginatedList from '@/app/ui/hooks/list/usePaginatedList';
import { AssociationCard } from '../../components/association-card';

import { pokemonMoveBffService } from '../services';
import type { PokemonMoveFilters, TPokemonMove } from '../types';

const formatOrder = (order: number): string => `#${String(order).padStart(3, '0')}`;
const formatValue = (value: number | null | undefined): string => value === null || value === undefined ? '-' : String(value);

const INITIAL_FILTERS: PokemonMoveFilters = {
  name: undefined,
  order: undefined,
};

const normalizeFilters = (filters: PokemonMoveFilters): PokemonMoveFilters => ({
  name: filters.name?.trim() || undefined,
  order: filters.order?.trim() || undefined,
});

export function PokemonMoveListView() {
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
  } = usePaginatedList<TPokemonMove, PokemonMoveFilters>({
    fetchList: pokemonMoveBffService.fetchAll,
    initialFilters: INITIAL_FILTERS,
    initialInputFilters,
    fetchErrorMessage: t('pokemon.move.list.loadError'),
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
              {t('pokemon.move.list.title')}
            </Text>
            <Text className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">
              {t('pokemon.move.list.description')}
            </Text>
          </div>
          <Badge tone="info" variant="soft" size="lg">
            {t('common.recordCount', { count: meta.total })}
          </Badge>
        </header>

        <Filters
          filters={inputFilters}
          ariaLabel={t('pokemon.move.list.filtersAria')}
          onApply={(filters) => applyInputFilters(filters as PokemonMoveFilters)}
          onClear={clearInputFilters}
        />

        {!isLoading && items.length === 0 ? (
          <Card variant="outlined" rounded="lg" className="text-center">
            <Text className="text-slate-600">{t('pokemon.move.list.empty')}</Text>
          </Card>
        ) : null}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((move) => (
            <AssociationCard
              key={move.id}
              href={`/pokemon/move/${move.name}`}
              title={move.name}
              eyebrow={formatOrder(move.order)}
              ariaLabel={t('pokemon.move.list.open', { name: move.name })}
              visual={(
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-700">
                  <GiPunchBlast size={30} />
                </div>
              )}
              footer={(
                <div className="flex flex-wrap gap-2">
                  <Badge tone="neutral" variant="soft">{t('pokemon.move.list.power', { value: formatValue(move.power) })}</Badge>
                  <Badge tone="neutral" variant="soft">{t('pokemon.move.list.accuracy', { value: formatValue(move.accuracy) })}</Badge>
                  <Badge tone="neutral" variant="soft">{t('pokemon.move.list.pp', { value: formatValue(move.pp) })}</Badge>
                  <span className="text-sm font-semibold text-blue-700">{t('common.viewMore')}</span>
                </div>
              )}
            >
              <Text className="line-clamp-3 text-sm text-slate-700">
                {move.short_effect || move.effect || t('pokemon.move.list.effectPending')}
              </Text>
              <div className="flex flex-wrap gap-2">
                <Badge tone="info" variant="soft">{move.type}</Badge>
                <Badge tone="warning" variant="soft">{move.damage_class}</Badge>
              </div>
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
