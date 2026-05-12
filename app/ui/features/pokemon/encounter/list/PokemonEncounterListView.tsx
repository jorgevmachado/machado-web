'use client';

import { useEffect } from 'react';
import { GiPositionMarker } from 'react-icons/gi';

import { Badge, Card, Filters, Pagination, Text, useAlert } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { normalizedName } from '@/app/utils';
import { AssociationCard } from '../../components/association-card';

import type { PokemonEncounterFilters } from '../types';
import { usePokemonEncounterList } from './usePokemonEncounterList';

const formatOrder = (order: number): string => `#${String(order).padStart(3, '0')}`;

export function PokemonEncounterListView() {
  const {
    items,
    meta,
    isLoading,
    errorMessage,
    inputFilters,
    goToPage,
    applyInputFilters,
    clearInputFilters,
  } = usePokemonEncounterList();
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
              {t('pokemon.encounter.list.title')}
            </Text>
          </div>
          <Badge tone="info" variant="soft" size="lg">
            {t('common.recordCount', { count: meta.total })}
          </Badge>
        </header>

        <Filters
          filters={inputFilters}
          ariaLabel={t('pokemon.encounter.list.filtersAria')}
          onApply={(filters) => applyInputFilters(filters as PokemonEncounterFilters)}
          onClear={clearInputFilters}
        />

        {!isLoading && items.length === 0 ? (
          <Card variant="outlined" rounded="lg" className="text-center">
            <Text className="text-slate-600">{t('pokemon.encounter.list.empty')}</Text>
          </Card>
        ) : null}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((encounter) => (
            <AssociationCard
              key={encounter.id}
              href={`/pokemon/encounter/${encounter.name}`}
              title={normalizedName(encounter.name)}
              eyebrow={formatOrder(encounter.order)}
              ariaLabel={t('pokemon.encounter.list.open', { name: encounter.name })}
              visual={(
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <GiPositionMarker size={30} />
                </div>
              )}
            >
              <Text className="line-clamp-3 text-sm text-slate-700" data-testid="pokemon-encounter-list-method">
                {t('pokemon.encounter.list.method', {
                  value: encounter.method ? normalizedName(encounter.method) : t('pokemon.encounter.list.pending'),
                })}
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
