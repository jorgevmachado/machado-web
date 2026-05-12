'use client';

import { useEffect } from 'react';
import { MdAutoAwesome } from 'react-icons/md';

import { Badge, Card, Filters, Pagination, Text, useAlert } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { AssociationCard } from '../../components/association-card';

import type { PokemonAbilityFilters } from '../types';
import { usePokemonAbilityList } from './usePokemonAbilityList';

const formatOrder = (order: number): string => `#${String(order).padStart(3, '0')}`;

export function PokemonAbilityListView() {
  const {
    items,
    meta,
    isLoading,
    errorMessage,
    inputFilters,
    goToPage,
    applyInputFilters,
    clearInputFilters,
  } = usePokemonAbilityList();
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
              {t('pokemon.ability.list.title')}
            </Text>
            <Text className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">
              {t('pokemon.ability.list.description')}
            </Text>
          </div>
          <Badge tone="info" variant="soft" size="lg">
            {t('common.recordCount', { count: meta.total })}
          </Badge>
        </header>

        <Filters
          filters={inputFilters}
          ariaLabel={t('pokemon.ability.list.filtersAria')}
          onApply={(filters) => applyInputFilters(filters as PokemonAbilityFilters)}
          onClear={clearInputFilters}
        />

        {!isLoading && items.length === 0 ? (
          <Card variant="outlined" rounded="lg" className="text-center">
            <Text className="text-slate-600">{t('pokemon.ability.list.empty')}</Text>
          </Card>
        ) : null}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((ability) => (
            <AssociationCard
              key={ability.id}
              href={`/pokemon/ability/${ability.name}`}
              title={ability.name}
              eyebrow={formatOrder(ability.order)}
              ariaLabel={t('pokemon.ability.list.open', { name: ability.name })}
              visual={(
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <MdAutoAwesome size={30} />
                </div>
              )}
              footer={(
                <div className="flex flex-wrap gap-2">
                  <Badge tone={ability.is_hidden ? 'warning' : 'info'} variant="soft">
                    {ability.is_hidden ? t('pokemon.ability.list.hidden') : t('pokemon.ability.list.standard')}
                  </Badge>
                  <Badge tone="neutral" variant="soft">{t('pokemon.ability.list.slot', { value: ability.slot })}</Badge>
                  <span className="text-sm font-semibold text-blue-700">{t('common.viewMore')}</span>
                </div>
              )}
            >
              <Text className="line-clamp-3 text-sm text-slate-700">
                {ability.short_effect || ability.effect || ability.flavor_text || t('pokemon.ability.list.effectPending')}
              </Text>
              {ability.flavor_text ? (
                <Text className="line-clamp-2 text-xs italic text-slate-500">
                  {ability.flavor_text}
                </Text>
              ) : null}
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
